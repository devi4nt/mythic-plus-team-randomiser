import { ClassType, ClassSpec, ClassRole } from "@/types";

export const classSpecs: Record<ClassType, ClassSpec[]> = {
  Priest: ["Holy", "Discipline", "Shadow"],
  Warrior: ["Arms", "Fury", "Protection"],
  Mage: ["Fire", "Frost", "Arcane"],
  Rogue: ["Subtlety", "Outlaw", "Assassination"],
  Hunter: ["Beast Mastery", "Marksmanship", "Survival"],
  Warlock: ["Affliction", "Demonology", "Destruction"],
  Shaman: ["Elemental", "Enhancement", "Restoration"],
  Druid: ["Restoration", "Balance", "Feral", "Guardian"],
  Paladin: ["Protection", "Retribution", "Holy"],
  "Demon Hunter": ["Vengeance", "Havoc"],
  "Death Knight": ["Blood", "Unholy", "Frost"],
  Monk: ["Windwalker", "Brewmaster", "Mistweaver"],
  Evoker: ["Devastation", "Preservation", "Augmentation"],
};

export const classSpecRole: Record<
  ClassType,
  Partial<Record<ClassSpec, ClassRole>>
> = {
  Priest: {
    Holy: "HEALING",
    Discipline: "HEALING",
    Shadow: "DPS",
  },
  Warrior: {
    Arms: "DPS",
    Fury: "DPS",
    Protection: "TANK",
  },
  Mage: {
    Fire: "DPS",
    Frost: "DPS",
    Arcane: "DPS",
  },
  Rogue: {
    Subtlety: "DPS",
    Outlaw: "DPS",
    Assassination: "DPS",
  },
  Hunter: {
    "Beast Mastery": "DPS",
    Marksmanship: "DPS",
    Survival: "DPS",
  },
  Warlock: {
    Affliction: "DPS",
    Demonology: "DPS",
    Destruction: "DPS",
  },
  Shaman: {
    Elemental: "DPS",
    Enhancement: "DPS",
    Restoration: "HEALING",
  },
  Druid: {
    Restoration: "HEALING",
    Balance: "DPS",
    Feral: "DPS",
    Guardian: "TANK",
  },
  Paladin: {
    Protection: "TANK",
    Retribution: "DPS",
    Holy: "HEALING",
  },
  "Demon Hunter": {
    Vengeance: "TANK",
    Havoc: "DPS",
  },
  "Death Knight": {
    Blood: "TANK",
    Unholy: "DPS",
    Frost: "DPS",
  },
  Monk: {
    Windwalker: "DPS",
    Brewmaster: "TANK",
    Mistweaver: "HEALING",
  },
  Evoker: {
    Devastation: "DPS",
    Preservation: "HEALING",
    Augmentation: "DPS",
  },
};
