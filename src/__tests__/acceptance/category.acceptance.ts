import { Client, expect } from '@loopback/testlab';
import { MicroCatalogApplication } from '../..';
import { clearDb, setupApplication } from './test-helper';
import { appendFile } from 'fs';

setTimeout(() => {
  describe('Categories', () => {
    let app: MicroCatalogApplication;
    let client: Client;

    setTimeout(() => {
      before('setupApplication', async () => {
        ({ app, client } = await setupApplication());
      });
    }, 5000);

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
}, 5000);
