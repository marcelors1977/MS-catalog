import {Gender, GenderRelations} from '../models';
import {Esv7DataSource} from '../datasources';
import {inject} from '@loopback/core';
import {BaseRepository} from './base.repository';

export class GenderRepository extends BaseRepository<
  Gender,
  typeof Gender.prototype.id,
  GenderRelations
> {
  constructor(@inject('datasources.esv7') dataSource: Esv7DataSource) {
    super(Gender, dataSource);
  }
}
