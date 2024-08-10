import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import Alert from '../Alert.vue';

describe('Alert', () => {
  it('renders info alert', () => {
    const wrapper = mount(Alert, {
      props: { type: 'info' },
      slots: {
        default: ['INFO']
      }
    });
    expect(wrapper.text()).toContain('INFO');
    expect(wrapper.classes()).toContain('bg-blue-600');
  });

  it('renders warning alert', () => {
    const wrapper = mount(Alert, {
      props: { type: 'warning' },
      slots: {
        default: ['WARNING']
      }
    });
    expect(wrapper.text()).toContain('WARNING');
    expect(wrapper.classes()).toContain('bg-yellow-600');
  });

  it('renders error alert', () => {
    const wrapper = mount(Alert, {
      props: { type: 'error' },
      slots: {
        default: ['ERROR']
      }
    });
    expect(wrapper.text()).toContain('ERROR');
    expect(wrapper.classes()).toContain('bg-red-600');
  });
});
