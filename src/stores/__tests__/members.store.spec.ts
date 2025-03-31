import { expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { describe, test, beforeEach, afterEach, vi } from 'vitest';
import { useMembersStore } from '../members.store';
import { useConfigStore } from '../config.store';
import { useTeamsStore } from '../teams.store';
import { nextTick, ref, type Ref } from 'vue';
import type { GuildProfile, Member } from '../../types';
import { mockGuildProfile } from '../../data/__mocks__/mock-guild-profile';
import { useAlertStore } from '../alert.store';
import { mockMembers } from '../../data/__mocks__/mock-members';
import { classSpecLust } from '../../data/specs';

vi.mock('@vueuse/core', async (original) => {
  const actual = (await original()) as object;
  return {
    ...actual,
    useFetch: () => ({
      json: (): { isFetching: Ref<boolean>; data: Ref<GuildProfile>; statusCode: Ref<number> } => ({
        data: ref(mockGuildProfile),
        isFetching: ref(false),
        statusCode: ref(200)
      })
    })
  };
});

describe('members store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();

    const config = useConfigStore();
    config.region = 'EU';
    config.realm = 'realm-name';
    config.guild = 'Blank Slate';
    config.fancy = false;
    config.spreadLust = true;

    const store = useMembersStore();
    // mock add function, structuredClone doesn't seem to be working in this context?!
    store.add = (member: Member) => {
      store.selectedMembers.push({ ...member, character: { ...member.character } });
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();

    // reset store
    const store = useMembersStore();
    store.reset();
  });

  test('it is defined', async () => {
    const store = useMembersStore();
    expect(store).toBeDefined();
  });

  test('it loads guild profile', async () => {
    const store = useMembersStore();
    expect(store.isFetching).toBe(false);
    expect(store.members.length).toBe(10);
    expect(store.statusCode).toBe(200);
  });

  test('it raises fatal', async () => {
    const store = useMembersStore();
    const alert = useAlertStore();
    store.statusCode = 400;
    await nextTick();
    expect(alert.fatal).toBeDefined();
    store.statusCode = 200;
    await nextTick();
    expect(alert.fatal).not.toBeDefined();
  });

  test('has members', async () => {
    const store = useMembersStore();
    expect(store.members.length).toBe(10);
  });

  test('it can filter members', async () => {
    const store = useMembersStore();

    // role filters
    store.role = 'TANK';
    expect(store.filteredMembers.length).toBe(2);
    store.role = 'DPS';
    expect(store.filteredMembers.length).toBe(6);
    store.role = 'HEALING';
    expect(store.filteredMembers.length).toBe(2);
    store.role = 'ALL';

    // class filter
    store.filter = 'Priest';
    expect(store.filteredMembers.length).toBe(1);

    // spec filter
    store.filter = 'Shadow';
    expect(store.filteredMembers.length).toBe(1);

    // name filter
    store.filter = 'Quelish';
    expect(store.filteredMembers.length).toBe(1);

    store.filter = 'Devølutiøn';
    expect(store.filteredMembers.length).toBe(1);

    store.filter = 'Devolution'; // check diacritics are normalised
    expect(store.filteredMembers.length).toBe(1);

    // no match filter
    store.filter = 'XXXXXXXXXXXXXXX';
    expect(store.filteredMembers.length).toBe(0);
  });

  test('it can change member role', async () => {
    const store = useMembersStore();
    store.addPug('TANK');
    const pug = store.selectedMembers[0];
    expect(pug).toBeDefined();

    if (pug) {
      const { character } = pug;
      expect(character.active_spec_role).toBe('TANK');
      expect(character.active_spec_name).toBe('Brewmaster');

      store.toggleSpec(pug!);
      expect(character.active_spec_role).toBe('HEALING');
      expect(character.active_spec_name).toBe('Mistweaver');

      store.toggleSpec(pug!);
      expect(character.active_spec_role).toBe('DPS');
      expect(character.active_spec_name).toBe('Windwalker');

      store.toggleSpec(pug!);
      expect(character.active_spec_role).toBe('TANK');
      expect(character.active_spec_name).toBe('Brewmaster');
    }
  });

  test('it can pick teams', async () => {
    const alert = useAlertStore();
    const store = useMembersStore();
    // add all members to selected
    for (const member of store.filteredMembers) {
      store.add(member);
    }

    await store.randomise();
    expect(alert.success).toBe('Teams successfully randomised');
    expect(alert.error).toBeUndefined();

    const teams = useTeamsStore();
    expect(teams.teams.length).toBe(2);
    for (const team of teams.teams) {
      expect(team.members.length).toBe(5);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'TANK').length
      ).toBe(1);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'DPS').length
      ).toBe(3);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'HEALING').length
      ).toBe(1);
    }

    // remove teams
    store.removeTeam(0);
    store.removeTeam(0);
    expect(teams.teams.length).toBe(0);

    // check reset
    store.reset();

    expect(store.selectedMembers.length).toBe(0);
    expect(store.rolesText).toBe('');
    expect(teams.teams.length).toBe(0);
  });

  test('it displays correct roles text', async () => {
    const store = useMembersStore();
    // add all members to selected
    for (const member of store.filteredMembers) {
      store.add(member);
    }

    expect(store.selectedMembers.length).toBe(store.filteredMembers.length);
    expect(store.rolesText).toBe('2 tanks, 6 dps, 2 healers');

    // add a player which can be a healer or dps
    const dpsHealer = store.filteredMembers.find((m) => m.character.name === 'Quelish');
    if (dpsHealer) {
      expect(dpsHealer).toBeDefined();
      store.toggleRole(dpsHealer, 'HEALING');
      store.add(dpsHealer);
    }

    // add a player which can be a tank or dps
    const dpsTank = store.filteredMembers.find((m) => m.character.name === 'Devolutíon');
    if (dpsTank) {
      expect(dpsTank).toBeDefined();
      store.toggleRole(dpsTank, 'TANK');
      store.add(dpsTank);
    }

    expect(store.rolesText).toBe('2-3 tanks, 4-6 dps, 2-3 healers');

    // check reset
    store.reset();

    expect(store.rolesText).toBe('');
  });

  test('it can spread lusts', /* { repeats: 100 }, */ async () => {
    const store = useMembersStore();
    const members = mockMembers();
    for (const member of members) {
      store.add(member);
    }
    await store.randomise();

    const teams = useTeamsStore();
    for (const team of teams.teams) {
      expect(team.members.length).toBe(5);
      const lusts = team.members.filter(
        (member) => classSpecLust[member.character.class as keyof typeof classSpecLust]
      );
      if (!lusts.length) {
        console.log(team.members);
      }
      expect(lusts.length).toBeGreaterThan(0);
    }
  });

  test('it can allow players to fulfil multiple roles', { repeats: 25 }, async () => {
    const store = useMembersStore();
    for (const member of store.filteredMembers) {
      store.add(member);
      store.toggleSpec(member);
      store.add(member);
      store.toggleSpec(member);
      store.add(member);
    }

    expect(store.selectedMembers.length).toBe(30);

    await store.randomise();

    const teams = useTeamsStore();
    expect(teams.teams.length).toBe(2);

    for (const team of teams.teams) {
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'TANK').length
      ).toBe(1);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'DPS').length
      ).toBe(3);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'HEALING').length
      ).toBe(1);
      expect(team.members.length).toBe(5);

      const unique = new Set(
        team.members.map((member) => `${member.character.name}-${member.character.realm}`)
      );
      // console.log(`unique names:`, unique);
      expect(unique.size).toBe(5);
    }
  });

  test('it can make a pug team', async () => {
    const store = useMembersStore();
    store.addPug('TANK');
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('HEALING');

    await store.randomise();

    const teams = useTeamsStore();
    expect(teams.teams.length).toBe(1);
    for (const team of teams.teams) {
      expect(team.members.length).toBe(5);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'TANK').length
      ).toBe(1);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'DPS').length
      ).toBe(3);
      expect(
        team.members.filter((member) => member.character.active_spec_role === 'HEALING').length
      ).toBe(1);
    }

    // reset
    store.reset();
  });

  test('it raises errors for invalid teams', async () => {
    const store = useMembersStore();
    const alert = useAlertStore();

    // check no tanks
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('HEALING');

    await store.randomise();
    expect(alert.error).toBe('Not enough tanks');

    // reset
    store.reset();

    // check not enough dps
    store.addPug('TANK');
    store.addPug('TANK');
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('HEALING');

    await store.randomise();
    expect(alert.error).toBe('Not enough damage dealers');

    // reset
    store.reset();

    // check not enough healers
    store.addPug('TANK');
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('DPS');
    store.addPug('DPS');

    await store.randomise();
    expect(alert.error).toBe('Not enough healers');

    // reset
    store.reset();

    // check not enough players
    let excludedFirstDps = false;
    for (const member of store.filteredMembers) {
      if (member.character.active_spec_role === 'DPS' && !excludedFirstDps) {
        excludedFirstDps = true;
        continue;
      }
      store.add(member);
    }
    expect(store.selectedMembers.length).toBe(store.filteredMembers.length - 1);
    await store.randomise();
    expect(alert.warning).toBe(
      `Too few eligible players to assign all roles 1 teams created, 4 players left`
    );
  });
});
