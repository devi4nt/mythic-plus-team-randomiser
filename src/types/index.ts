export type ClassType =
  | "Priest"
  | "Warrior"
  | "Mage"
  | "Rogue"
  | "Hunter"
  | "Warlock"
  | "Shaman"
  | "Druid"
  | "Paladin"
  | "Demon Hunter"
  | "Death Knight"
  | "Monk"
  | "Evoker";

export type ClassSpec =
  | "Holy"
  | "Discipline"
  | "Shadow"
  | "Arms"
  | "Fury"
  | "Protection"
  | "Fire"
  | "Frost"
  | "Arcane"
  | "Subtlety"
  | "Outlaw"
  | "Assassination"
  | "Beast Mastery"
  | "Marksmanship"
  | "Survival"
  | "Affliction"
  | "Demonology"
  | "Destruction"
  | "Elemental"
  | "Enhancement"
  | "Restoration"
  | "Balance"
  | "Feral"
  | "Guardian"
  | "Retribution"
  | "Vengeance"
  | "Havoc"
  | "Blood"
  | "Unholy"
  | "Windwalker"
  | "Brewmaster"
  | "Mistweaver"
  | "Devastation"
  | "Preservation"
  | "Augmentation";

export type ClassRole = "DPS" | "TANK" | "HEALING";
export type ClassFilter = ClassRole | "ALL";

export interface Character {
  name: string;
  race: string;
  class: ClassType;
  active_spec_name: ClassSpec;
  active_spec_role: ClassRole;
  gender: "male" | "female";
  faction: "horde" | "alliance";
  achievement_points: number;
  honorable_kills: number;
  region: "eu";
  realm: "Quel'Thalas" | "Azjol-Nerub";
  last_crawled_at: string;
  profile_url: string;
  profile_banner: string;
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
}

export interface IAlert {
  type: "error" | "warning" | "success";
  message: string;
}
