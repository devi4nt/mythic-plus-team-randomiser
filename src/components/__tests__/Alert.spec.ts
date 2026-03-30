import { describe, it, expect, vi } from 'vite-plus/test';

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

  it('fades out after timeout', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Alert, {
      props: { type: 'info', timeout: 3000 },
      slots: { default: ['TIMED'] }
    });

    expect(wrapper.classes()).toContain('opacity-100');

    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();

    expect(wrapper.classes()).toContain('opacity-0');
    vi.useRealTimers();
  });
});
