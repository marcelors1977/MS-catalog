import {DefaultCrudRepository, EntityNotFoundError} from '@loopback/repository';
import {Message} from 'amqplib';
import {pick} from 'lodash';
import {ValidatorService} from './validator.service';

export interface SyncOptions {
  repo: DefaultCrudRepository<any, any>;
  data: any;
  message: Message;
}

export interface SyncRelationsOPtions {
  id: string;
  repo: DefaultCrudRepository<any, any>;
  relationName: string;
  relationIds: string[];
  relationRepo: DefaultCrudRepository<any, any>;
  message: Message;
}

export abstract class BaseModelSyncService {
  constructor(public validateService: ValidatorService) {}

  protected async sync({repo, data, message}: SyncOptions) {
    const {id} = data || {};
    const action = this.getAction(message);
    const entity = this.createEntity(data, repo);
    switch (action) {
      case 'created':
        await this.validateService
          .validate({
            data: entity,
            entityClass: repo.entityClass,
          })
          .catch(console.error);
        await repo.create(entity);
        break;
      case 'updated':
        await this.updateOrCreate({repo, id, entity});
        break;
      case 'deleted':
        await repo.deleteById(id);
        break;
    }
  }

  protected getAction(message: Message) {
    return message.fields.routingKey.split('.')[2];
  }

  protected createEntity(data: any, repo: DefaultCrudRepository<any, any>) {
    return pick(data, Object.keys(repo.entityClass.definition.properties));
  }

  protected async updateOrCreate({
    repo,
    id,
    entity,
  }: {
    repo: DefaultCrudRepository<any, any>;
    id: string;
    entity: any;
  }) {
    const exists = await repo.exists(id);
    await this.validateService.validate({
      data: entity,
      entityClass: repo.entityClass,
      ...(exists && {options: {partial: true}}),
    });
    return exists ? repo.updateById(id, entity) : repo.create(entity);
  }

  async syncRelations({
    id,
    repo,
    relationName,
    relationIds,
    relationRepo,
    message,
  }: SyncRelationsOPtions) {
    const fiedsRelation = this.extractFieldsRelation(repo, relationName);
    const collection = await relationRepo.find({
      where: {
        or: relationIds.map((idRelation) => ({id: idRelation})),
      },
      fields: fiedsRelation,
    });

    if (!collection.length) {
      const error = new EntityNotFoundError(
        relationRepo.entityClass,
        relationIds,
      );
      error.name = 'EntityNotFound';
      throw error;
    }

    const action = this.getAction(message);
    switch (action) {
      case 'attached':
        await (repo as any).attachRelation(id, relationName, collection);
        break;
      case 'detached':
        await (repo as any).detachRelation(id, relationName, collection);
        break;
      default:
        break;
    }
  }

  protected extractFieldsRelation(
    repo: DefaultCrudRepository<any, any>,
    relation: string,
  ) {
    return Object.keys(
      repo.modelClass.definition.properties[relation].jsonSchema.items
        .properties,
    ).reduce((obj: any, field: string) => {
      obj[field] = true;
      return obj;
    }, {});
  }
}
