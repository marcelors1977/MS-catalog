import {DefaultCrudRepository} from '@loopback/repository';
import {Gender, GenderRelations} from '../models';
import {Esv7DataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GenderRepository extends DefaultCrudRepository<
  Gender,
  typeof Gender.prototype.id,
  GenderRelations
> {
  constructor(
    @inject('datasources.esv7') dataSource: Esv7DataSource,
  ) {
    super(Gender, dataSource);
  }
}
