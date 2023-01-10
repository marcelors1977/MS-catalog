import { bind, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Message } from 'amqplib';
import { rabbitmqSubscribe } from '../decorators';
import { CastMemberRepository } from '../repositories';

@bind({ scope: BindingScope.TRANSIENT })
export class CastMemberSyncService {
  constructor(
    @repository(CastMemberRepository) private castMemberRepo: CastMemberRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'micro-catalog/sync-videos/cast-member',
    routingKey: 'model.castmember.*'
  })
  async handler({ data, message }: { data: any, message: Message }) {
    const action = message.fields.routingKey.split('.')[2];
    switch (action) {
      case 'created':
        await this.castMemberRepo.create(data);
        break;
      case 'updated':
        await this.castMemberRepo.updateById(data.id, data);
        break;
      case 'deleted':
        await this.castMemberRepo.deleteById(data.id);
        break;
      default:
        break;
    }
  }
}
