const { setup, teardown } = require('./_helpers');

describe('Database rules', () => {
  let db;
  let ref;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup();

    // All paths are secure by default
    ref = db.collection('some-nonexistent-collection');
  });

  afterAll(async () => {
    await teardown();
  });

  test('fail when reading/writing an unauthorized collection', async () => {
    // Custom Matchers
    await expect(ref.get()).toDeny();
  });
});