import type { Character } from '../types';

export const safeClass = (str: string) => {
  return str.toLowerCase().replace(/ /g, '-');
};

export const characterSpecClass = (character: Character) =>
  `spec_${safeClass(character.class)}_${safeClass(character.active_spec_name)}`;

export const characterClass = (character: Character) => `class_${safeClass(character.class)}`;

export const characterTextClass = (character: Character) =>
  `class-color--${safeClass(character.class)}`;
