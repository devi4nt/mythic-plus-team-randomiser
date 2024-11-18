import { expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { describe, test, beforeEach, afterEach, vi } from 'vitest';
import { useTeamsStore } from '../teams.store';
import { useConfigStore } from '../config.store';
import { mockTeams } from '../../data/__mocks__/mock-team';

describe('members store', () => {
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
    store.add(teams[0]);
    store.add(teams[1]);
    expect(store.amount).toBe(2);

    store.remove(1);
    expect(store.amount).toBe(1);

    store.remove(0);
    expect(store.amount).toBe(0);

    store.add(teams[2]);
    expect(store.amount).toBe(1);

    store.reset();
    expect(store.amount).toBe(0);
  });
});
