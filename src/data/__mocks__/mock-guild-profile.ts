import type { GuildProfile } from '../../types';

export const mockGuildProfile: GuildProfile = {
  name: 'Blank Slate',
  faction: 'Horde',
  region: 'EU',
  realm: 'connected-quelthalas',
  last_crawled_at: '',
  profile_url: '',
  members: [
    {
      rank: 0,
      character: {
        name: 'Shamong',
        class: 'Shaman',
        active_spec_name: 'Restoration',
        active_spec_role: 'HEALING'
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
      rank: 1,
      character: {
        name: 'Kengoh',
        class: 'Shaman',
        active_spec_name: 'Enhancement',
        active_spec_role: 'DPS'
      }
    },
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
      rank: 2,
      character: {
        name: 'Flipe',
        race: 'Blood Elf',
        class: 'Paladin',
        active_spec_name: 'Holy',
        active_spec_role: 'HEALING'
      }
    },
    {
      rank: 2,
      character: {
        name: 'Vorlix',
        race: 'Blood Elf',
        class: 'Mage',
        active_spec_name: 'Fire',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 2,
      character: {
        name: 'Devolutíon',
        race: 'Highmountain Tauren',
        class: 'Druid',
        active_spec_name: 'Balance',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 2,
      character: {
        name: 'Palut',
        race: 'Tauren',
        class: 'Paladin',
        active_spec_name: 'Protection',
        active_spec_role: 'TANK'
      }
    }
  ]
};
