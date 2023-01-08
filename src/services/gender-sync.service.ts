import { bind, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { rabbitmqSubscribe } from '../decorators';
import { GenderRepository } from '../repositories';

@bind({ scope: BindingScope.TRANSIENT })
export class GenderSyncService {
  constructor(
    @repository(GenderRepository) private genderRepo: GenderRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'gender',
    routingKey: 'model.gender.created'
  })
  async genderCreate({ data }: { data: any }) {
    await this.genderRepo.create(data);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'gender',
    routingKey: 'model.gender.updated'
  })
  async genderUpdate({ data }: { data: any }) {
    await this.genderRepo.updateById(data.id, data);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'gender',
    routingKey: 'model.gender.deleted'
  })
  async genderDelete({ data }: { data: any }) {
    await this.genderRepo.deleteById(data.id, data);
  }
}
