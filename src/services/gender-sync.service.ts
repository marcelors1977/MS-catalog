import { bind, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Message } from 'amqplib';
import { rabbitmqSubscribe } from '../decorators';
import { GenderRepository } from '../repositories';

@bind({ scope: BindingScope.TRANSIENT })
export class GenderSyncService {
  constructor(
    @repository(GenderRepository) private genderRepo: GenderRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'micro-catalog/sync-videos/gender',
    routingKey: 'model.gender.*'
  })
  async handler({ data, message }: { data: any, message: Message }) {
    const action = message.fields.routingKey.split('.')[2];
    switch (action) {
      case 'created':
        await this.genderRepo.create(data);
        break;
      case 'updated':
        await this.genderRepo.updateById(data.id, data);
        break;
      case 'deleted':
        await this.genderRepo.deleteById(data.id);
        break;
      default:
        break;
    }
  }
}
