import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import Player from '../Player.vue';
import { mockCharacter } from '../../data/__mocks__/mock-character';

describe('Player', () => {
  it('renders player', () => {
    const wrapper = mount(Player, {
      props: { character: mockCharacter }
    });
    const html = wrapper.html();
    expect(html).toContain('class-color--priest');
    expect(html).toContain('class_priest');
    expect(html).toContain('spec_priest_shadow');
    expect(html).toContain('Shadow');
  });

  it('renders pug player', () => {
    const wrapper = mount(Player, {
      props: { character: mockCharacter, pug: true }
    });
    const html = wrapper.html();
    expect(wrapper.classes()).toContain('pug');
    expect(html).toContain('Pug');
    expect(html).toContain('Damage dealer');
  });
});
