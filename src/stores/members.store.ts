import type { ClassFilter, ClassRole, GuildProfile, Member, Team } from '../types';
import { useFetch, useSessionStorage } from '@vueuse/core';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, watch, reactive } from 'vue';
import { useConfigStore } from './config.store';
import { shuffle } from '../utils/array';
import { classSpecLust, classSpecRole, classSpecs } from '../data/specs';
import { useAlertStore } from './alert.store';
import { v4 as uuidv4 } from 'uuid';
import { useTeamsStore } from './teams.store';

export const useMembersStore = defineStore('members', () => {
  const configStore = useConfigStore();
  const { region, realm, guild, autoPug, spreadLust } = storeToRefs(configStore);

  const alertStore = useAlertStore();
  const { error, fatal, warning, success } = storeToRefs(alertStore);

  const teamsStore = useTeamsStore();
  const { teams } = storeToRefs(teamsStore);

  const filter = ref('');
  // const rank = ref(6);
  const role = ref<ClassFilter>('ALL');

  // https://raider.io/api#/guild/getApiV1GuildsProfile
  const { isFetching, data, statusCode } = useFetch(
    () =>
      `https://raider.io/api/v1/guilds/profile?region=${region.value.toLowerCase()}&realm=${
        realm.value
      }&name=${encodeURIComponent(guild.value)}&fields=members`,
    {
      refetch: true,
      async beforeFetch({ cancel }) {
        if (!region.value || !realm.value || !guild.value) {
          cancel();
        }
      }
    }
  ).json<GuildProfile>();

  watch(
    () => statusCode.value,
    (code) => {
      if (code === 400) {
        fatal.value =
          'Could not find requested guild, please double check the guild name, realm and try again.';
      } else if (String(code).startsWith('2')) {
        fatal.value = undefined;
      }
    },
    { immediate: true }
  );

  const selectedNames = reactive(new Set<string>());
  const members = computed(
    () =>
      data.value?.members
        .filter((m) => m.character.active_spec_name)
        .map((m) => ({
          ...m,
          search: m.character.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        })) ?? []
  );

  const pickedMembers = ref<Member[]>([]);
  const selectedMembers = useSessionStorage<Member[]>('selected', []);
  const uniquePlayers = computed(() => {
    const unique = new Set<string>();
    for (const member of selectedMembers.value) {
      unique.add(`${member.character.name}-${member.character.realm}`);
    }
    return unique;
  });

  watch(
    () => selectedMembers.value.length,
    () => {
      selectedNames.clear();
      for (const member of selectedMembers.value) {
        selectedNames.add(member.character.name);
      }
    },
    { immediate: true }
  );

  watch(
    () => teams,
    () => {
      // mark all players which were picked
      for (const member of selectedMembers.value) {
        member.picked = teams.value.some((team) =>
          team.members.find(
            (m) =>
              m.character.name === member.character.name &&
              m.character.realm === member.character.realm
          )
        );
      }
    },
    { immediate: true, deep: true }
  );

  const pugs = useSessionStorage<Member[]>('pugs', []);

  const tanks = computed(() =>
    selectedMembers.value.filter((member) => {
      return member.character.active_spec_role === 'TANK';
    })
  );

  const damageDealers = computed(() =>
    selectedMembers.value.filter((member) => {
      return member.character.active_spec_role === 'DPS';
    })
  );

  const healers = computed(() =>
    selectedMembers.value.filter((member) => {
      return member.character.active_spec_role === 'HEALING';
    })
  );

  const rolesText = computed(() => {
    let text = '';
    const players = [...tanks.value, ...damageDealers.value, ...healers.value];
    if (!players.length) return '';

    const roleMap = new Map<string, ClassRole[]>();
    for (const member of players) {
      const roles = roleMap.get(`${member.character.name}-${member.character.realm}`) ?? [];
      roles.push(member.character.active_spec_role);
      roleMap.set(`${member.character.name}-${member.character.realm}`, roles);
    }
    // console.log(roleMap);

    const dps = { min: 0, max: 0 };
    const healer = { min: 0, max: 0 };
    const tank = { min: 0, max: 0 };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_name, roles] of roleMap) {
      const [role] = roles;
      if (roles.length === 1) {
        if (role === 'DPS') {
          dps.min++;
          dps.max++;
        } else if (role === 'HEALING') {
          healer.min++;
          healer.max++;
        } else {
          tank.min++;
          tank.max++;
        }
      } else {
        // player can be multiple roles
        if (roles.find((r) => r === 'DPS')) {
          dps.max++;
        }
        if (roles.find((r) => r === 'HEALING')) {
          healer.max++;
        }
        if (roles.find((r) => r === 'TANK')) {
          tank.max++;
        }
      }
    }
    // console.log({ dps, healer, tank });

    if (tank.max) {
      text += `${tank.min === tank.max ? tank.min : `${tank.min}-${tank.max}`} tank${tank.min > 1 ? 's' : ''}`;
      if (dps.max || healer.max) {
        text += ', ';
      }
    }
    if (dps.max) {
      text += `${dps.min === dps.max ? dps.min : `${dps.min}-${dps.max}`} dps`;
      if (healer.max) {
        text += ', ';
      }
    }
    if (healer.max) {
      text += `${healer.min === healer.max ? healer.min : `${healer.min}-${healer.max}`} healer${healer.min > 1 ? 's' : ''}`;
    }

    return text;
  });

  const filteredMembers = computed<Member[]>(() => {
    return members.value
      ? members.value
          .filter((member) => {
            // apply text filter
            const textFilter =
              filter.value === '' ||
              [
                member.character.name,
                member.character.class,
                member.character.active_spec_name,
                member.search
              ]
                .join(' ')
                .toLowerCase()
                .includes(filter.value.toLowerCase());
            // next.. apply rank filter
            // const rankFilter = member.rank <= rank.value || member.rank === 99;
            // next.. apply role filter
            const roleFilter =
              role.value === 'ALL' || member.character.active_spec_role === role.value;
            // next.. hide deleted characters
            const deletedFilter = member.character.name.search(/-\d+$/) === -1;
            // then.. exclude already selected members
            return (
              textFilter &&
              // rankFilter &&
              roleFilter &&
              deletedFilter
            );
          })
          .sort((a, b) => {
            return a.character.name.localeCompare(b.character.name);
          })
      : [];
  });

  function remove(removeMember: Member) {
    selectedMembers.value = selectedMembers.value.filter((member) => {
      return member !== removeMember;
    });

    pugs.value = pugs.value.filter((member) => {
      return member !== removeMember;
    });
  }

  function toggleCaptain(member: Member) {
    member.captain = !member.captain;
  }

  function toggleRole(member: Member, role: ClassRole) {
    const specs = classSpecs[member.character.class];
    const newSpec = specs.find((spec) => classSpecRole[member.character.class][spec] === role);
    if (newSpec) {
      member.character.active_spec_name = newSpec;
      member.character.active_spec_role = role;
    }
  }

  function toggleSpec(member: Member) {
    const specs = classSpecs[member.character.class];
    const currentIndex = specs.indexOf(member.character.active_spec_name);
    member.character.active_spec_name =
      specs[(currentIndex + 1) % classSpecs[member.character.class].length];
    member.character.active_spec_role =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      classSpecRole[member.character.class][member.character.active_spec_name]!;
  }

  function add(member: Member) {
    selectedMembers.value.push(structuredClone(member));
  }

  function addPug(role: ClassRole = 'DPS') {
    const member: Member = {
      rank: 7,
      character: {
        name: uuidv4(),
        class: 'Monk',
        active_spec_name:
          role === 'TANK' ? 'Brewmaster' : role === 'HEALING' ? 'Mistweaver' : 'Windwalker',
        active_spec_role: role,
        realm: realm.value
      },
      pug: true
    };
    pugs.value.push(member);
    add(member);
  }

  function reset() {
    teamsStore.reset();
    pickedMembers.value.length = 0;
    error.value = undefined;
    // reset selected members
    selectedMembers.value.length = 0;
  }

  function addPugs() {
    // console.log(`auto pug logic`);
    // remove existing pugs
    const currentPugs = selectedMembers.value.filter((member) => member.pug);
    currentPugs.forEach((member) => remove(member));

    let amount = tanks.value.length;
    if (Math.ceil(damageDealers.value.length / 3) > amount)
      amount = Math.ceil(damageDealers.value.length / 3);
    if (healers.value.length > amount) amount = healers.value.length;

    // add tank pugs
    let current = tanks.value.length;
    for (let index = 0; index < amount - current; index++) {
      addPug('TANK');
    }

    // add healers
    current = healers.value.length;
    for (let index = 0; index < amount - current; index++) {
      addPug('HEALING');
    }

    // add dps pugs
    current = damageDealers.value.length;
    for (let index = 0; index < amount * 3 - current; index++) {
      addPug('DPS');
    }
  }

  async function randomise() {
    teamsStore.reset();
    pickedMembers.value.length = 0;
    error.value = undefined;

    // auto pug logic
    if (autoPug.value) {
      addPugs();
    }

    let workingMembers = [...selectedMembers.value];
    shuffle(workingMembers);

    // target number of teams
    const amount = Math.ceil(uniquePlayers.value.size / 5);
    console.log(`\n> attempting to randomise ${amount} team(s)`);

    const workingTeams: Team[] = Array.from({ length: amount }, () => ({
      id: uuidv4(),
      members: []
    }));

    // captain allocation logic
    const captains = workingMembers.filter((member) => member.captain);

    // Sort captains to prioritize hard-to-fill roles (Healer/Tank) first for Lust allocation
    const rolePriority: Record<string, number> = { HEALING: 0, TANK: 1, DPS: 2 };
    captains.sort((a, b) => {
      const pA = rolePriority[a.character.active_spec_role] ?? 2;
      const pB = rolePriority[b.character.active_spec_role] ?? 2;
      return pA - pB;
    });

    if (captains.length > amount) {
      error.value = 'Too many team captains';
      return;
    }
    if (captains.length) {
      console.log(`captains: ${captains.map((m) => m?.character.name).join(', ')}`);
    }

    /* prune picked characters */
    function pruneWorkingMembers(member: Member) {
      workingMembers = workingMembers.filter(
        (m) =>
          member.character.name !== m.character.name || member.character.realm !== m.character.realm
      );
    }

    const isTank = (member: Member) => member.character.active_spec_role === 'TANK';
    const isHealer = (member: Member) => member.character.active_spec_role === 'HEALING';
    const isDamageDealer = (member: Member) => member.character.active_spec_role === 'DPS';

    const hasLust = (team: Team) => team.members.some((m) => classSpecLust[m.character.class]);

    // assign captains - one per team
    for (const team of workingTeams) {
      const captain = captains.shift();
      if (captain) {
        pruneWorkingMembers(captain);
        team.members.push(captain);
      }
    }

    // Roles are assigned one whole pass at a time (every team gets a tank before
    // any team gets a healer, etc.). This reserves the scarce tank/healer roles
    // across all teams before damage dealers are handed out, which matters when
    // players can fill multiple roles - otherwise a flex player could be spent as
    // a dps on an early team and leave a later team with no tank/healer.
    //
    // Lust used to be a separate pass that ran *before* roles were assigned. When
    // there were more team slots than completable teams (e.g. 2 tanks / 2 healers
    // but ceil(players / 5) === 3 slots), that pre-pass let a doomed trailing slot
    // grab a scarce lust-capable healer, starving an otherwise-completable team so
    // it was silently dropped. Lust is now folded into the role passes as a
    // preference - only ever picked to fill a slot the team needs anyway (its
    // healer or a dps) - so spreading lust can no longer consume a scarce role a
    // sibling team requires.

    // assign tanks
    for (const team of workingTeams) {
      if (team.members.find(isTank)) continue;
      const tank = workingMembers.find(isTank);
      if (tank) {
        pruneWorkingMembers(tank);
        team.members.push(tank);
      }
    }

    // assign healers, preferring a lust-capable healer when the team has no lust
    // yet (a lust healer satisfies both needs without taking a dps slot)
    for (const team of workingTeams) {
      if (team.members.find(isHealer)) continue;
      let healer: Member | undefined;
      if (spreadLust.value && !hasLust(team)) {
        healer = workingMembers.find((m) => isHealer(m) && classSpecLust[m.character.class]);
      }
      if (!healer) healer = workingMembers.find(isHealer);
      if (healer) {
        pruneWorkingMembers(healer);
        team.members.push(healer);
      }
    }

    // assign damage dealers, filling each team to three before moving on and
    // preferring a lust-capable dps while the team still has no lust provider
    for (const team of workingTeams) {
      while (team.members.filter(isDamageDealer).length < 3) {
        let dps: Member | undefined;
        if (spreadLust.value && !hasLust(team)) {
          dps = workingMembers.find((m) => isDamageDealer(m) && classSpecLust[m.character.class]);
        }
        if (!dps) dps = workingMembers.find(isDamageDealer);
        if (!dps) break;
        pruneWorkingMembers(dps);
        team.members.push(dps);
      }
    }

    const roleOrder = { TANK: 1, DPS: 2, HEALING: 3 };

    for (const team of workingTeams) {
      console.log(team.members.map((m) => m.character.name));
      team.members = team.members.sort((a, b) => {
        return roleOrder[a.character.active_spec_role] - roleOrder[b.character.active_spec_role];
      });
      if (team.members.length === 5) {
        await teamsStore.add(team);
      }
    }

    // see why we have no teams
    if (teams.value.length === 0 && workingTeams.length) {
      const team = workingTeams.shift();
      if (!team?.members.find(isTank)) {
        error.value = 'Not enough tanks';
      } else if (!team?.members.find(isHealer)) {
        error.value = 'Not enough healers';
      } else if (team.members.filter(isDamageDealer).length !== 3) {
        error.value = 'Not enough damage dealers';
      }
    }

    if (!error.value) {
      if (teams.value.length !== amount) {
        const playersLeft = uniquePlayers.value.size - teams.value.length * 5;
        warning.value = `Too few eligible players to assign all roles ${teams.value.length} teams created, ${playersLeft} players left`;
      } else {
        success.value = 'Teams successfully randomised';
      }
    }
  }

  function removeTeam(index: number) {
    const team = teamsStore.remove(index);
    // them.. remove picked members
    for (let x = 0; x < team.members.length; x++) {
      const member = team.members[x];
      const index = pickedMembers.value.findIndex((pickedMember) => member === pickedMember);
      pickedMembers.value.splice(index, 1);
    }
  }

  return {
    filter,
    role,
    // rank,
    rolesText,
    members,
    selectedMembers,
    uniquePlayers,
    filteredMembers,
    isFetching,
    statusCode,
    toggleCaptain,
    toggleSpec,
    toggleRole,
    remove,
    randomise,
    addPug,
    reset,
    removeTeam,
    add
  };
});
