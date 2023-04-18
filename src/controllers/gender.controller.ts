import {
  Count,
  CountSchema,
  EntityNotFoundError,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {GenderFilterBuilder} from '../filter/gender.filter';
import {Gender} from '../models';
import {GenderRepository} from '../repositories';
import {PaginatorSerializer} from '../utils/paginatorSerializer';

export class GenderController {
  constructor(
    @repository(GenderRepository)
    public genderRepository: GenderRepository,
  ) {}

  @get('/genders/count', {
    responses: {
      '200': {
        description: 'Gender model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Gender) where?: Where<Gender>): Promise<Count> {
    return this.genderRepository.count(where);
  }

  @get('/genders', {
    responses: {
      '200': {
        description: 'Array of Gender model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Gender, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Gender) filter?: Filter<Gender>,
  ): Promise<PaginatorSerializer<Gender>> {
    const newFilter = new GenderFilterBuilder(filter).build();
    return this.genderRepository.paginate(newFilter);
  }

  @get('/genders/{id}', {
    responses: {
      '200': {
        description: 'Gender model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Gender, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Gender, {exclude: 'where'}) filter?: Filter<Gender>,
  ): Promise<Gender> {
    // const newFilter1 = new GenderFilterBuilder({
    //   where: {
    //     //@ts-ignore
    //     'categories.name': 'x'
    //   }
    // }).build();
    // const { stringify } = require('qs');
    // console.log(stringify({ filter: newFilter1 }));
    // // process.exit(0);

    const newFilter = new GenderFilterBuilder(filter)
      .where({
        id,
      })
      .build();

    console.dir(newFilter, {depth: 8});

    const obj = await this.genderRepository.findOne(newFilter);

    if (!obj) {
      throw new EntityNotFoundError(Gender, id);
    }

    return obj;
  }
}
