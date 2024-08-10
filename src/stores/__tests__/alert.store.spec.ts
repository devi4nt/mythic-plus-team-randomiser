import { expect } from 'vitest';
import { setActivePinia, createPinia, storeToRefs } from 'pinia';
import { describe, test, beforeEach, afterEach, vi } from 'vitest';
import { useAlertStore } from '../alert.store';
import { nextTick } from 'vue';

describe('alert store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('it generates alerts', async () => {
    const store = useAlertStore();
    const { alert, error, warning, success } = storeToRefs(store);

    // check error alert
    error.value = 'Oh no! Something went really wrong';
    await nextTick();
    expect(alert.value).toStrictEqual({ type: 'error', message: error.value });
    vi.advanceTimersByTime(3000); // advancing by 3000ms
    expect(alert.value).toBeUndefined();
    expect(error.value).toBeUndefined();

    // check warning alert
    warning.value = 'Oh no! Something went wrong';
    await nextTick();
    expect(alert.value).toStrictEqual({ type: 'warning', message: warning.value });
    vi.advanceTimersByTime(5500); // advancing by 5500ms
    expect(alert.value).toBeUndefined();
    expect(warning.value).toBeUndefined();

    // check success alert
    success.value = 'Great success';
    await nextTick();
    expect(alert.value).toStrictEqual({ type: 'success', message: success.value });
    vi.advanceTimersByTime(3000); // advancing by 3000ms
    expect(alert.value).toBeUndefined();
    expect(success.value).toBeUndefined();
  });
});
