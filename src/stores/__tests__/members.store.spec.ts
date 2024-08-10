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
    config.realm = 'connected-quelthalas';
    config.guild = 'Blank Slate';
    config.fancy = false;

    const store = useMembersStore();
    // mock add function, structuredClone doesn't seem to be working in this context?!
    store.add = (member: Member) => {
      store.selectedMembers.push({ ...member });
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('it is defined', async () => {
    const store = useMembersStore();
    expect(store).toBeDefined();
  });

  test('it loads guild profile', async () => {
    const store = useMembersStore();
    expect(store.isFetching).toBe(false);
    expect(store.filteredMembers.length).toBe(10);
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

    // no match filter
    store.filter = 'XXXXXXXXXXXXXXX';
    expect(store.filteredMembers.length).toBe(0);
  });

  test('it can pick teams', async () => {
    const alert = useAlertStore();
    const store = useMembersStore();
    // add all members to selected
    for (const member of store.filteredMembers) {
      store.add(member);
    }
    expect(store.selectedMembers.length).toBe(store.filteredMembers.length);
    expect(store.rolesText).toBe('2 tanks, 6 dps, 2 healers');

    await store.randomise();
    alert.success = 'Teams successfully randomised';

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
    expect(alert.error).toBe('Not enough dps');

    // reset
    store.reset();
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
