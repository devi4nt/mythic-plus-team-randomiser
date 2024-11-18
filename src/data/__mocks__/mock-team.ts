import type { Team } from '../../types';
import { mockMembers } from './mock-members';

export const mockTeams = ({ amount }: { amount: number }) => {
  const teams: Team[] = [];
  for (let i = 0; i < amount; i++) {
    teams.push({
      id: `team-${i}`,
      members: [
        ...mockMembers({ amount: 1, roleFilter: 'TANK' }),
        ...mockMembers({ amount: 3, roleFilter: 'DPS' }),
        ...mockMembers({ amount: 1, roleFilter: 'HEALING' })
      ]
    });
  }
  return teams;
};
