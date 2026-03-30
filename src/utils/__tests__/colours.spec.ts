import { describe, it, expect } from 'vite-plus/test';
import { classColourLookup } from '../colours';

describe('classColourLookup', () => {
  it('maps all classes to hex colour codes', () => {
    expect(Object.keys(classColourLookup).length).toBe(13);
    for (const colour of Object.values(classColourLookup)) {
      expect(colour).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
