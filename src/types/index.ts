export type ClassType =
  | 'Priest'
  | 'Warrior'
  | 'Mage'
  | 'Rogue'
  | 'Hunter'
  | 'Warlock'
  | 'Shaman'
  | 'Druid'
  | 'Paladin'
  | 'Demon Hunter'
  | 'Death Knight'
  | 'Monk'
  | 'Evoker';

export type PriestClassSpec = 'Holy' | 'Discipline' | 'Shadow';
export type WarriorClassSpec = 'Arms' | 'Fury' | 'Protection';
export type MageClassSpec = 'Fire' | 'Frost' | 'Arcane';
export type RogueClassSpec = 'Subtlety' | 'Outlaw' | 'Assassination';
export type HunterClassSpec = 'Beast Mastery' | 'Marksmanship' | 'Survival';
export type WarlockClassSpec = 'Affliction' | 'Demonology' | 'Destruction';
export type ShamanClassSpec = 'Elemental' | 'Enhancement' | 'Restoration';
export type DruidClassSpec = 'Restoration' | 'Balance' | 'Feral' | 'Guardian';
export type PaladinClassSpec = 'Protection' | 'Retribution' | 'Holy';
export type DemonHunterClassSpec = 'Vengeance' | 'Havoc';
export type DeathKnightClassSpec = 'Blood' | 'Unholy' | 'Frost';
export type MonkClassSpec = 'Windwalker' | 'Brewmaster' | 'Mistweaver';
export type EvokerClassSpec = 'Devastation' | 'Preservation' | 'Augmentation';

export type ClassSpec =
  | PriestClassSpec
  | WarriorClassSpec
  | MageClassSpec
  | RogueClassSpec
  | HunterClassSpec
  | WarlockClassSpec
  | ShamanClassSpec
  | DruidClassSpec
  | PaladinClassSpec
  | DemonHunterClassSpec
  | DeathKnightClassSpec
  | MonkClassSpec
  | EvokerClassSpec;

export type ClassRole = 'DPS' | 'TANK' | 'HEALING';
export type ClassFilter = ClassRole | 'ALL';

export interface Character {
  name: string;
  race?: string;
  class: ClassType;
  active_spec_name: ClassSpec;
  active_spec_role: ClassRole;
  gender?: 'male' | 'female';
  faction?: 'horde' | 'alliance';
  achievement_points?: number;
  honorable_kills?: number;
  region?: Lowercase<Region>;
  realm?: string;
  last_crawled_at?: string;
  profile_url?: string;
  profile_banner?: string;
}

export interface Team {
  id: string;
  members: Member[];
}

export interface GuildProfile {
  name: string;
  faction: string;
  region: string;
  realm: string;
  last_crawled_at: string;
  profile_url: string;
  members: Member[];
}

export interface Member {
  rank: number;
  character: Character;
  captain?: boolean;
  pug?: boolean;
}

export interface IAlert {
  type: 'error' | 'warning' | 'success';
  message: string;
}

export type Region = 'CN' | 'EU' | 'KR' | 'TW' | 'US';

export interface IRegion {
  value: Region;
  label: string;
}
export interface IRealm {
  value: string;
  label: string;
}

export interface IShareData {
  config: {
    version: number;
    region: Region;
    realm: string;
    guild: string;
  };
  teams: Team[];
  unselected: Member[];
}
