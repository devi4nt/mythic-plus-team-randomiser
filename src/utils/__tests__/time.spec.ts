import { describe, it, expect, vi } from 'vite-plus/test';
import { pause } from '../time';

describe('pause', () => {
  it('resolves after the specified duration', async () => {
    vi.useFakeTimers();
    let resolved = false;
    void pause(1000).then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);
    vi.advanceTimersByTime(1000);
    await vi.waitFor(() => expect(resolved).toBe(true));

    vi.useRealTimers();
  });
});
