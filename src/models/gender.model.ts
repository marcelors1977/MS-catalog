import {getModelSchemaRef} from '@loopback/openapi-v3';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {Category, SmallCategory} from './category.model';

@model({settings: {strict: false}})
export class Gender extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 1,
      maxLength: 255,
    },
  })
  name: string;

  @property({
    type: 'boolean',
    required: false,
    default: true,
  })
  is_active: boolean;

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: string;

  @hasMany(() => Category)
  @property({
    type: 'object',
    jsonSchema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          is_active: {
            type: 'boolean',
          },
        },
      },
      uniqueItems: true,
    },
  })
  categories: SmallCategory;

  constructor(data?: Partial<Gender>) {
    super(data);
  }
}

export interface GenderRelations {
  // describe navigational properties here
}

export type GenderWithRelations = Gender & GenderRelations;
