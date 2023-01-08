import { bind, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { rabbitmqSubscribe } from '../decorators';
import { CategoryRepository } from '../repositories';

@bind({ scope: BindingScope.TRANSIENT })
export class CategorySyncService {
  constructor(
    @repository(CategoryRepository) private categoryRepo: CategoryRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'category',
    routingKey: 'model.category.created'
  })
  async categoryCreate({ data }: { data: any }) {
    await this.categoryRepo.create(data);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'category',
    routingKey: 'model.category.updated'
  })
  async categoryUpdate({ data }: { data: any }) {
    await this.categoryRepo.updateById(data.id, data);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'category',
    routingKey: 'model.category.deleted'
  })
  async categoryDelete({ data }: { data: any }) {
    await this.categoryRepo.deleteById(data.id, data);
  }
}
