import {bind, BindingScope} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Message} from 'amqplib';
import {rabbitmqSubscribe} from '../decorators';
import {CastMemberRepository} from '../repositories';
import {BaseModelSyncService} from './base-model-sync.service';
import {ValidatorService} from './validator.service';

@bind({scope: BindingScope.SINGLETON})
export class CastMemberSyncService extends BaseModelSyncService {
  constructor(
    @repository(CastMemberRepository)
    private castMemberRepo: CastMemberRepository,
    @service(ValidatorService) private validator: ValidatorService,
  ) {
    super(validator);
  }

  @rabbitmqSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE
      ? process.env.RABBITMQ_EXCHANGE
      : '',
    queue: 'micro-catalog/sync-videos/cast-member',
    routingKey: 'model.cast_member.*',
    queueOptions: {
      deadLetterExchange: process.env.RABBITMQ_DLX_EXCHANGE
        ? process.env.RABBITMQ_DLX_EXCHANGE
        : '',
    },
  })
  async handler({data, message}: {data: any; message: Message}) {
    await this.sync({
      repo: this.castMemberRepo,
      data,
      message,
    });
  }
}
