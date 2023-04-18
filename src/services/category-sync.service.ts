import {bind, BindingScope} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Message} from 'amqplib';
import {rabbitmqSubscribe} from '../decorators';
import {CategoryRepository} from '../repositories';
import {ResponseEnum} from '../servers';
import {BaseModelSyncService} from './base-model-sync.service';
import {ValidatorService} from './validator.service';

@bind({scope: BindingScope.SINGLETON})
export class CategorySyncService extends BaseModelSyncService {
  constructor(
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
    @service(ValidatorService) private validator: ValidatorService,
  ) {
    super(validator);
  }

  @rabbitmqSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE
      ? process.env.RABBITMQ_EXCHANGE
      : '',
    queue: 'micro-catalog/sync-videos/category',
    routingKey: 'model.category.*',
    queueOptions: {
      deadLetterExchange: process.env.RABBITMQ_DLX_EXCHANGE
        ? process.env.RABBITMQ_DLX_EXCHANGE
        : '',
    },
  })
  async handler({data, message}: {data: any; message: Message}) {
    await this.sync({
      repo: this.categoryRepo,
      data,
      message,
    });
  }
}
