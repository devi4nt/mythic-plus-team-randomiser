import type { GuildProfile } from '../../types';

export const mockGuildProfile: GuildProfile = {
  name: 'Blank Slate',
  faction: 'Horde',
  region: 'EU',
  realm: 'realm-name',
  last_crawled_at: '',
  profile_url: '',
  members: [
    {
      rank: 0,
      character: {
        name: 'Shamong',
        realm: 'realm-name',
        class: 'Shaman',
        active_spec_name: 'Restoration',
        active_spec_role: 'HEALING'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Quelish',
        realm: 'realm-name',
        class: 'Priest',
        active_spec_name: 'Shadow',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Magemong',
        realm: 'realm-name',
        class: 'Mage',
        active_spec_name: 'Fire',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Omnivoker',
        realm: 'realm-name',
        class: 'Evoker',
        active_spec_name: 'Augmentation',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Kengoh',
        realm: 'realm-name',
        class: 'Shaman',
        active_spec_name: 'Enhancement',
        active_spec_role: 'DPS'
      }
    },
    {
      rank: 1,
      character: {
        name: 'Devølutiøn',
        realm: 'realm-name',
        class: 'Demon Hunter',
        active_spec_name: 'Vengeance',
        active_spec_role: 'TANK'
      }
    },
    {
      rank: 2,
      character: {
        name: 'Flipe',
        realm: 'realm-name',
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
        realm: 'realm-name',
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
        realm: 'realm-name',
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
        realm: 'realm-name',
        race: 'Tauren',
        class: 'Paladin',
        active_spec_name: 'Protection',
        active_spec_role: 'TANK'
      }
    }
  ]
};
