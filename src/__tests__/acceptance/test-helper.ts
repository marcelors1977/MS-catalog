import { MicroCatalogApplication } from '../..';
import { givenHttpServerConfig, Client, httpGetAsync } from '@loopback/testlab';
import config from '../../../config';
import supertest from 'supertest';
import dbConfig from '../../datasources/esv7.datasource.config';
import { Esv7DataSource } from '../../datasources';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    port: 9000,
  });

  const app = new MicroCatalogApplication({
    ...config,
    rest: restConfig,
  });

  await app.boot();
  app.bind('datasources.esv7').to(testDb);
  await app.start();

  const client = supertest('http://127.0.0.1:9000');
  return { app, client };
}

export const testDb = new Esv7DataSource({
  ...dbConfig,
  index: 'catalog-test',
});

export async function heathCheckIndex() {
  await httpGetAsync('http://elasticsearch:9200/_cluster/health/catalog-test?wait_for_status=green&timeout=5s&pretty');
}

export async function clearDb() {
  await testDb.deleteAllDocuments();
}

export interface AppWithClient {
  app: MicroCatalogApplication;
  client: Client;
}
