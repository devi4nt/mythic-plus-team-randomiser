import { expect } from 'vite-plus/test';
import { setActivePinia, createPinia } from 'pinia';
import { describe, test, beforeEach, afterEach, vi } from 'vite-plus/test';
import { useTeamsStore } from '../teams.store';
import { useConfigStore } from '../config.store';
import { mockTeams } from '../../data/__mocks__/mock-team';

describe('teams store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    const config = useConfigStore();
    config.fancy = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('it is defined', async () => {
    const store = useTeamsStore();
    expect(store).toBeDefined();
  });

  test('it can add / remove a team', async () => {
    const store = useTeamsStore();
    const teams = mockTeams({ amount: 3 });
    await store.add(teams[0]);
    await store.add(teams[1]);
    expect(store.amount).toBe(2);

    store.remove(1);
    expect(store.amount).toBe(1);

    store.remove(0);
    expect(store.amount).toBe(0);

    await store.add(teams[2]);
    expect(store.amount).toBe(1);

    store.reset();
    expect(store.amount).toBe(0);
  });

  test('it can swap members with the same role between teams', async () => {
    const store = useTeamsStore();
    const teams = mockTeams({ amount: 2 });
    await store.add(teams[0]);
    await store.add(teams[1]);

    const sourceTeam = store.teams[0];
    const destTeam = store.teams[1];
    const source = sourceTeam.members.find((m) => m.character.active_spec_role === 'DPS')!;
    const destination = destTeam.members.find((m) => m.character.active_spec_role === 'DPS')!;

    const sourceName = source.character.name;
    const destName = destination.character.name;

    store.swap(sourceTeam, source, destination);

    expect(destTeam.members.some((m) => m.character.name === sourceName)).toBe(true);
    expect(sourceTeam.members.some((m) => m.character.name === destName)).toBe(true);
  });

  test('it prevents swapping members with different roles', async () => {
    const store = useTeamsStore();
    const teams = mockTeams({ amount: 2 });
    await store.add(teams[0]);
    await store.add(teams[1]);

    const sourceTeam = store.teams[0];
    const destTeam = store.teams[1];
    const tank = sourceTeam.members.find((m) => m.character.active_spec_role === 'TANK')!;
    const dps = destTeam.members.find((m) => m.character.active_spec_role === 'DPS')!;

    const tankName = tank.character.name;
    const dpsName = dps.character.name;

    store.swap(sourceTeam, tank, dps);

    // Members should not have moved
    expect(sourceTeam.members.some((m) => m.character.name === tankName)).toBe(true);
    expect(destTeam.members.some((m) => m.character.name === dpsName)).toBe(true);
  });

  test('it handles invalid swap arguments gracefully', async () => {
    const store = useTeamsStore();
    const teams = mockTeams({ amount: 1 });
    await store.add(teams[0]);

    const sourceTeam = store.teams[0];
    const member = sourceTeam.members[0];
    const originalMembers = [...sourceTeam.members];

    // Missing arguments — should not throw
    store.swap(undefined, member, member);
    store.swap(sourceTeam, undefined, member);
    store.swap(sourceTeam, member, undefined);

    // Destination is in the same team as source — should be a no-op
    store.swap(sourceTeam, sourceTeam.members[0], sourceTeam.members[1]);

    // Team members should be unchanged
    expect(sourceTeam.members).toEqual(originalMembers);
  });
});
