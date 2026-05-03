import { sendEventToCloud } from '@/lib/cloudLogging';

describe('Cloud Logging Utility', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'logged' }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call fetch with correct parameters after batching', async () => {
    const eventName = 'test_event';
    const payload = { data: 'test' };
    
    // Send 3 events to trigger batch
    await sendEventToCloud(eventName, payload);
    await sendEventToCloud(eventName, payload);
    await sendEventToCloud(eventName, payload);
    
    expect(global.fetch).toHaveBeenCalledWith('/api/log-event', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('batch'),
    }));
  });

  it('should handle fetch errors silently', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Down')) as jest.Mock;
    
    // Should not throw
    await expect(sendEventToCloud('fail_event', {})).resolves.not.toThrow();
  });
});
