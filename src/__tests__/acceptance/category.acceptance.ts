import { Client, expect, httpGetAsync } from '@loopback/testlab';
import { MicroCatalogApplication } from '../..';
import { clearDb, setupApplication } from './test-helper';

describe('Categories', () => {
  let app: MicroCatalogApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    await httpGetAsync('http://elasticsearch:9200/_cluster/health/catalog-test?wait_for_status=green&timeout=5s&pretty');
  });

  beforeEach(clearDb);

  after(async () => {
    await app.stop();
  });

  it('Invoces GET /categories', async () => {
    const response = await client.get('/categories').expect(200);
    expect(response.body).to.containDeep({
      results: [],
      count: 0,
    });
  });
});
