import { safeClass } from './../../utils/classes';
import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import PlayerTeam from '../PlayerTeam.vue';
import { mockTeam } from '../../data/__mocks__/mock-team';

describe('PlayerTeam', () => {
  it('renders team', () => {
    const wrapper = mount(PlayerTeam, {
      props: { index: 0, ...mockTeam }
    });
    const html = wrapper.html();
    for (const member of mockTeam.members) {
      expect(html).toContain('Team 1');
      expect(html).toContain(member.character.name);
      expect(html).toContain(member.character.class);
      expect(html).toContain(`class-color--${safeClass(member.character.class)}`);
      expect(html).toContain(`class_${safeClass(member.character.class)}`);
      expect(html).toContain(
        `spec_${safeClass(member.character.class)}_${safeClass(member.character.active_spec_name)}`
      );
    }
  });
});
