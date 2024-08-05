import type { ClassFilter, ClassRole, GuildProfile, Member, Team } from '../types';
import { useFetch, useSessionStorage } from '@vueuse/core';
import { defineStore, storeToRefs } from 'pinia';
import { computed, type Ref, ref, watch } from 'vue';
import { useConfigStore } from './config.store';
import { shuffle } from '../utils/array';
import { classSpecRole, classSpecs } from '../data/specs';
import { useAlertStore } from './alert.store';
import { v4 as uuidv4 } from 'uuid';
import { useTeamsStore } from './teams.store';

export const useMembersStore = defineStore('members', () => {
  const configStore = useConfigStore();
  const { region, realm, guild, autoPug } = storeToRefs(configStore);

  const alertStore = useAlertStore();
  const { fatal, warning, success } = storeToRefs(alertStore);

  const teamsStore = useTeamsStore();
  const { teams } = storeToRefs(teamsStore);

  const filter = ref('');
  // const rank = ref(6);
  const role = ref<ClassFilter>('ALL');

  // https://raider.io/api#/guild/getApiV1GuildsProfile
  const { isFetching, error, data, statusCode } = useFetch(
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

  const members = computed(
    () => data.value?.members.filter((m) => m.character.active_spec_name) ?? []
  );

  const pickedMembers = ref<Member[]>([]);
  const selectedMembers = useSessionStorage<Member[]>('selected', []);
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

  // randomly select a team member
  function randomMember(members: Ref<Member[]>, filter?: (member: Member) => boolean) {
    const unpickedMembers = members.value.filter(
      (member) =>
        // exclude already picked members (by name)
        !pickedMembers.value.find((pm) => pm.character.name === member.character.name) &&
        // optional additional filter
        (!filter || filter(member))
    );
    shuffle(unpickedMembers);
    return unpickedMembers[Math.floor(Math.random() * unpickedMembers.length)];
  }

  function selectCaptain() {
    return randomMember(
      ref([...tanks.value, ...damageDealers.value, ...healers.value]),
      (member: Member) => !!member.captain
    );
  }

  function selectTank() {
    return randomMember(tanks);
  }

  function selectDamageDealer() {
    return randomMember(damageDealers);
  }

  function selectHealer() {
    return randomMember(healers);
  }

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

  function addPug(role: ClassRole = 'DPS') {
    const member: Member = {
      rank: 7,
      character: {
        name: uuidv4(),
        class: 'Monk',
        active_spec_name: 'Windwalker',
        active_spec_role: role
      },
      pug: true
    };
    selectedMembers.value.push(member);
    pugs.value.push(member);
  }

  function reset() {
    teamsStore.reset();
    pickedMembers.value.length = 0;
    error.value = null;
    // reset selected members
    selectedMembers.value.length = 0;
  }

  async function randomise() {
    teamsStore.reset();
    pickedMembers.value.length = 0;
    error.value = null;

    // auto pug logic
    if (autoPug.value) {
      // remove existing pugs
      const currentPugs = selectedMembers.value.filter((member) => member.pug);
      currentPugs.forEach((member) => remove(member));

      const amount = Math.ceil(selectedMembers.value.length / 5);

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

    const amount = Math.ceil(selectedMembers.value.length / 5);

    // select captains
    const captains = [];
    for (let index = 0; index < amount; index++) {
      const captain = selectCaptain();
      if (captain) {
        pickedMembers.value.push(captain);
        captains.push(captain);
      }
    }
    // console.log(`picking ${amount} teams`);
    for (let index = 0; index < amount; index++) {
      // console.log(`picking team: ${index + 1}`);
      // randomly select a tank
      const captain = captains[index];
      const tank =
        captain && captain.character.active_spec_role === 'TANK' ? captain : selectTank();
      if (!tank) {
        if (!teams.value.length) {
          error.value = 'Not enough tanks';
        }
        break;
      }
      pickedMembers.value.push(tank);
      // randomly select damage dealers
      const dps1 =
        captain && captain.character.active_spec_role === 'DPS' ? captain : selectDamageDealer();
      if (dps1) {
        pickedMembers.value.push(dps1);
      }
      const dps2 = selectDamageDealer();
      if (dps2) {
        pickedMembers.value.push(dps2);
      }
      const dps3 = selectDamageDealer();
      if (dps3) {
        pickedMembers.value.push(dps3);
      }
      if (!dps1 || !dps2 || !dps3) {
        if (!teams.value.length) {
          error.value = 'Not enough dps';
        }
        break;
      }
      // randomly select a healer
      const healer =
        captain && captain.character.active_spec_role === 'HEALING' ? captain : selectHealer();
      if (!healer) {
        if (!teams.value.length) {
          error.value = 'Not enough healers';
        }
        break;
      }
      if (healer) {
        pickedMembers.value.push(healer);
      }
      const team: Team = {
        id: uuidv4(),
        members: [tank, dps1, dps2, dps3, healer]
      };
      await teamsStore.add(team);
      // console.log(
      //   `team members: ${team.members
      //     .map((member) => member.character.name)
      //     .join(", ")}`
      // );
    }

    const roundedAmount = Math.floor(amount);
    const playersLeft = selectedMembers.value.length - teams.value.length * 5;
    if (amount !== roundedAmount || teams.value.length !== roundedAmount) {
      warning.value = `Too few eligible players to assign all roles ${teams.value.length} teams created, ${playersLeft} players left`;
    } else if (!error.value) {
      success.value = 'Teams successfully randomised';
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
    selectedMembers,
    filteredMembers,
    isFetching,
    statusCode,
    error,
    toggleCaptain,
    toggleSpec,
    remove,
    randomise,
    addPug,
    reset,
    removeTeam
  };
});
