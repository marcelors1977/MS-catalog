import { bind, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { rabbitmqSubscribe } from '../decorators';
import { CastMemberRepository } from '../repositories';

@bind({ scope: BindingScope.TRANSIENT })
export class CastMemberSyncService {
  constructor(
    @repository(CastMemberRepository) private castMemberRepo: CastMemberRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'castmember',
    routingKey: 'model.castmember.created'
  })
  async castMemberCreate({ data }: { data: any }) {
    await this.castMemberRepo.create(data);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'castmember',
    routingKey: 'model.castmember.updated'
  })
  async castMemberUpdate({ data }: { data: any }) {
    await this.castMemberRepo.updateById(data.id, data);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'castmember',
    routingKey: 'model.castmember.deleted'
  })
  async castMemberDelete({ data }: { data: any }) {
    await this.castMemberRepo.deleteById(data.id, data);
  }

}
