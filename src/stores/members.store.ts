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
    () => data.value?.members.filter((m) => m.character.active_spec_name) ?? []
  );

  const pickedMembers = ref<Member[]>([]);
  const selectedMembers = useSessionStorage<Member[]>('selected', []);

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
          team.members.find((m) => m.character.name === member.character.name)
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
    if (tanks.value.length) {
      text += `${tanks.value.length} tank${tanks.value.length > 1 ? 's' : ''}`;
      if (damageDealers.value.length || healers.value.length) {
        text += ', ';
      }
    }
    if (damageDealers.value.length) {
      text += `${damageDealers.value.length} dps`;
      if (healers.value.length) {
        text += ', ';
      }
    }
    if (healers.value.length) {
      text += `${healers.value.length} healer${healers.value.length > 1 ? 's' : ''}`;
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
              [member.character.name, member.character.class, member.character.active_spec_name]
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
        active_spec_role: role
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
    const uniqueNames = new Set(selectedMembers.value.map((member) => member.character.name));
    const amount = Math.ceil(uniqueNames.size / 5);
    // console.log(`randomising ${amount} teams`);

    // lust allocation logic
    let lusts: (Member | undefined)[] = [];
    if (spreadLust.value) {
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
          pickedMembers.value.push(member);
          lusts.push(member);
        }
      }
    }

    // captain allocation logic
    let captains = selectedMembers.value.filter((member) => member.captain);
    if (captains.length > amount) {
      error.value = 'Too many team captains';
      return;
    } else {
      pickedMembers.value.push(...captains);
    }

    let workingMembers = [...selectedMembers.value];
    /* remove already picked members, lusts and captains */
    function pruneWorkingMembers(name: string) {
      workingMembers = workingMembers.filter((m) => name !== m.character.name);
      lusts = lusts.filter((m) => name !== m?.character.name);
      captains = captains.filter((m) => name !== m.character.name);
    }

    for (let index = 0; index < amount; index++) {
      const members: Member[] = [];
      shuffle(workingMembers); // shuffle eligible members

      const captain = captains.shift();

      const lust = lusts.shift();
      if (lust) {
        workingMembers.unshift(lust);
      }

      const tank =
        captain?.character.active_spec_role === 'TANK'
          ? captain
          : workingMembers.find((member) => member.character.active_spec_role === 'TANK');
      if (!tank) {
        if (!teams.value.length) {
          error.value = 'Not enough tanks';
        }
        break;
      }
      members.push(tank);
      pruneWorkingMembers(tank.character.name);

      const dps: Member[] = [];
      if (captain?.character.active_spec_role === 'DPS') {
        dps.push(captain);
      }
      for (const member of workingMembers) {
        if (dps.find((d) => d.character.name === member.character.name)) continue;
        if (member.character.active_spec_role === 'DPS') {
          dps.push(member);
        }
        if (dps.length === 3) {
          break;
        }
      }
      if (dps.length < 3) {
        if (!teams.value.length) {
          error.value = 'Not enough dps';
        }
        break;
      }
      members.push(...dps);
      for (const dd of dps) {
        pruneWorkingMembers(dd.character.name);
      }

      const healer =
        captain?.character.active_spec_role === 'HEALING'
          ? captain
          : workingMembers.find((member) => member.character.active_spec_role === 'HEALING');
      if (!healer) {
        if (!teams.value.length) {
          error.value = 'Not enough healers';
        }
        break;
      }
      members.push(healer);
      pruneWorkingMembers(healer.character.name);

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
      const playersLeft = uniqueNames.size - teams.value.length * 5;
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
    selectedNames,
    filteredMembers,
    isFetching,
    statusCode,
    toggleCaptain,
    toggleSpec,
    remove,
    randomise,
    addPug,
    reset,
    removeTeam,
    add
  };
});
