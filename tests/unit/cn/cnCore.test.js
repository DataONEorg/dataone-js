import * as cnCore from '@/cn/cnCore';
import { setupFetchMock, teardownFetchMock } from '../../testUtils';

beforeEach(async () => {
  await setupFetchMock('NODELIST');
});

afterEach(() => {
  teardownFetchMock();
});

describe('listNodes function', () => {
  test('should return a list of nodes', async () => {
    const nodes = await cnCore.listNodes('PROD');
    expect(nodes.length).toBe(4);
  });

  test('should throw an error if the CN environment is not recognized', async () => {
    await expect(cnCore.listNodes('foo')).rejects.toThrow(
      'Unrecognized CN environment: foo',
    );
  });

  test('should convert each node into a D1Node object', async () => {
    const nodes = await cnCore.listNodes('PROD');
    expect(nodes[0].constructor.name).toBe('D1Node');
  });
});
