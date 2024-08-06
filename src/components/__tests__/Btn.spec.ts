import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import Btn from '../Btn.vue';

describe('Btn', () => {
  it('renders properly', () => {
    const wrapper = mount(Btn, {
      props: { type: 'default' },
      slots: {
        default: ['DEFAULT']
      }
    });
    expect(wrapper.text()).toContain('DEFAULT');
    expect(wrapper.classes()).toContain('bg-white/10');
    expect(wrapper.attributes().type).toBe('button');
    expect(wrapper.isVisible()).toBeTruthy();
  });

  it('can be disabled', () => {
    const wrapper = mount(Btn, {
      props: { disabled: true }
    });
    expect(wrapper.attributes().disabled).toBeDefined();
  });
});
