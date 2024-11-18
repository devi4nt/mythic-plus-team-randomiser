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
      } else if (/^2/.test(String(code))) {
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

  async function randomise() {
    teamsStore.reset();
    pickedMembers.value.length = 0;
    error.value = undefined;

    // auto pug logic
    if (autoPug.value) {
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

      // add dps pugs
      current = damageDealers.value.length;
      for (let index = 0; index < amount * 3 - current; index++) {
        addPug('DPS');
      }

      // add healers
      current = healers.value.length;
      for (let index = 0; index < amount - current; index++) {
        addPug('HEALING');
      }
    }

    // target number of teams
    const amount = Math.ceil(uniquePlayers.value.size / 5);
    // console.log(`\n> attempting to randomising ${amount} teams`);

    // lust allocation logic
    let lusts: (Member | undefined)[] = [];
    if (spreadLust.value) {
      // console.log(`spreading lust`);
      // when the captain overlaps with a lust, fill in a blank
      selectedMembers.value
        .filter((member) => member.captain && classSpecLust[member.character.class])
        .forEach(() => {
          lusts.push(undefined);
        });
      const nonCaptainsWithLust = selectedMembers.value.filter(
        (member) => !member.captain && classSpecLust[member.character.class]
      );
      shuffle(nonCaptainsWithLust);
      for (const member of nonCaptainsWithLust) {
        if (lusts.length < amount) {
          lusts.push(member);
        }
      }
      // console.log(`lusts: ${lusts.map((m) => m?.character.name).join(', ')}`);
    }

    // captain allocation logic
    let captains = selectedMembers.value.filter((member) => member.captain);
    if (captains.length > amount) {
      error.value = 'Too many team captains';
      return;
    }
    // if (captains.length) {
    //   console.log(`captains: ${captains.map((m) => m?.character.name).join(', ')}`);
    // }

    let workingMembers = [...selectedMembers.value];

    /* remove already picked members, lusts and captains */
    function pruneWorkingMembers(name: string, realm: string) {
      workingMembers = workingMembers.filter(
        (m) => name !== m.character.name || realm !== m.character.realm
      );
      lusts = lusts.filter((m) => name !== m?.character.name || realm !== m?.character.realm);
      captains = captains.filter((m) => name !== m.character.name || realm !== m.character.realm);
    }

    for (let index = 0; index < amount; index++) {
      // console.log(`randomising team ${index + 1}`);
      const members: Member[] = [];
      shuffle(workingMembers); // shuffle eligible members

      const captain = captains.shift();
      // if (captain) {
      //   console.log(
      //     `captain: ${captain.character.name} role: ${captain.character.active_spec_role}`
      //   );
      // }

      const lust = lusts.shift();
      if (lust) {
        // console.log(`lust: ${lust.character.name} role: ${lust.character.active_spec_role}`);
        pruneWorkingMembers(lust.character.name, lust.character.realm);
      }
      // if (lust) {
      //   workingMembers.unshift(lust);
      // }

      const tank =
        captain?.character.active_spec_role === 'TANK'
          ? captain
          : workingMembers.find((member) => member.character.active_spec_role === 'TANK');
      if (!tank) {
        if (!teams.value.length) {
          // console.error(`not enough tanks`);
          error.value = 'Not enough tanks';
        }
        break;
      }
      members.push(tank);
      pruneWorkingMembers(tank.character.name, tank.character.realm);

      const dps: Member[] = [];
      if (captain?.character.active_spec_role === 'DPS') {
        dps.push(captain);
      } else if (lust?.character.active_spec_role === 'DPS') {
        dps.push(lust);
      }
      if (dps.length) {
        pruneWorkingMembers(dps[0].character.name, dps[0].character.realm);
      }

      for (const member of workingMembers
        .sort((a, b) => {
          if (classSpecLust[a.character.class] === classSpecLust[b.character.class]) return 0;
          return classSpecLust[a.character.class] ? 1 : -1;
        })
        .filter((m) => m.character.active_spec_role === 'DPS')) {
        if (
          dps.find(
            (d) =>
              d.character.name === member.character.name &&
              d.character.realm === member.character.realm
          )
        )
          continue;
        dps.push(member);
        pruneWorkingMembers(member.character.name, member.character.realm);
        if (dps.length === 3) {
          break;
        }
      }
      if (dps.length < 3) {
        if (!teams.value.length) {
          // console.error(`not enough dps`);
          error.value = 'Not enough dps';
        }
        break;
      }
      members.push(...dps);

      const healer =
        captain?.character.active_spec_role === 'HEALING'
          ? captain
          : lust?.character.active_spec_role === 'HEALING'
            ? lust
            : workingMembers
                .sort((a, b) => {
                  if (classSpecLust[a.character.class] === classSpecLust[b.character.class])
                    return 0;
                  return classSpecLust[a.character.class] ? 1 : -1;
                })
                .find((member) => member.character.active_spec_role === 'HEALING');
      if (!healer) {
        if (!teams.value.length) {
          // console.error(`not enough healers`);
          error.value = 'Not enough healers';
        }
        break;
      }
      members.push(healer);
      pruneWorkingMembers(healer.character.name, healer.character.realm);

      pickedMembers.value.push(...members);
      // console.log(
      //   `team members: ${members
      //     .map((member) => `${member.character.name} [${member.character.active_spec_role}]`)
      //     .join(', ')}`
      // );
      const team: Team = {
        id: uuidv4(),
        members
      };
      await teamsStore.add(team);
    }

    if (!error.value) {
      const roundedAmount = Math.floor(amount);
      const playersLeft = uniquePlayers.value.size - teams.value.length * 5;
      if (amount !== roundedAmount || teams.value.length !== roundedAmount) {
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
