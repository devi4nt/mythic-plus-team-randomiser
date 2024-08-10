import type { Team } from '../../types';

export const mockTeam: Team = {
  id: 'team-one',
  members: [
    {
      rank: 1,
      character: {
        name: 'Devølutiøn',
        class: 'Demon Hunter',
        active_spec_name: 'Vengeance',
        active_spec_role: 'TANK'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Quelish',
        class: 'Priest',
        active_spec_name: 'Shadow',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Magemong',
        class: 'Mage',
        active_spec_name: 'Fire',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Omnivoker',
        class: 'Evoker',
        active_spec_name: 'Augmentation',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 0,
      character: {
        name: 'Shamong',
        class: 'Shaman',
        active_spec_name: 'Restoration',
        active_spec_role: 'HEALING'
      }
    }
  ]
};
