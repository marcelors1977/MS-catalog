import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class Category extends Entity {
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
  })
  name: string;

  @property({
    type: 'boolean',
    required: true
  })
  is_active?: boolean = true;

  @property({
    type: 'date',
    required: true
  })
  create_at: Date;

  @property({
    type: 'date',
    required: true
  })
  updated_at: Date;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
