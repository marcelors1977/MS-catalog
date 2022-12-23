import { Request, RestBindings, get, ResponseObject } from '@loopback/rest';
import { ClassDecoratorFactory, inject, MetadataInspector } from '@loopback/context';
import { repository } from '@loopback/repository';
import { CategoryRepository } from '../repositories';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

interface MyClassMetaData {
  name: string;
}

function myClassDecorator(spec: MyClassMetaData): ClassDecorator {
  const factory = new ClassDecoratorFactory<MyClassMetaData>(
    'meta-data-my-class-decorator',
    spec
  );

  return factory.create();
}

/**
 * A simple controller to bounce back http requests
 */
@myClassDecorator({ name: 'code education' })
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(CategoryRepository) private categoryRepo: CategoryRepository
  ) {
  }

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/categories')
  async index() {
    await this.categoryRepo.create({
      id: '1',
      name: 'minha primeira categoria',
      // eslint-disable-next-line @typescript-eslint/camelcase
      create_at: new Date(),
      // eslint-disable-next-line @typescript-eslint/camelcase
      updated_at: new Date
    })
    return this.categoryRepo.find();
  }
}

const meta = MetadataInspector.getClassMetadata<MyClassMetaData>(
  'meta-data-my-class-decorator',
  PingController
)

console.log(meta);
