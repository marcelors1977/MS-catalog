import {bind, BindingScope, inject} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Message} from 'amqplib';
import {rabbitmqSubscribe} from '../decorators';
import {CategoryRepository, GenderRepository} from '../repositories';
import {BaseModelSyncService} from './base-model-sync.service';
import {ValidatorService} from './validator.service';

@bind({scope: BindingScope.SINGLETON})
export class GenderSyncService extends BaseModelSyncService {
  constructor(
    @repository(GenderRepository) private genderRepo: GenderRepository,
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
    @service(ValidatorService) private validator: ValidatorService,
  ) {
    super(validator);
  }

  @rabbitmqSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE
      ? process.env.RABBITMQ_EXCHANGE
      : '',
    queue: 'micro-catalog/sync-videos/gender',
    routingKey: 'model.gender.*',
    queueOptions: {
      deadLetterExchange: process.env.RABBITMQ_DLX_EXCHANGE
        ? process.env.RABBITMQ_DLX_EXCHANGE
        : '',
    },
  })
  async handler({data, message}: {data: any; message: Message}) {
    const newData = Object.keys(data).reduce((obj: any, key: string) => {
      if (key !== 'categories') {
        obj[key] = data[key];
      }
      return obj;
    }, {});

    await this.sync({
      repo: this.genderRepo,
      data: newData,
      message,
    });
  }

  @rabbitmqSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE
      ? process.env.RABBITMQ_EXCHANGE
      : '',
    queue: 'micro-catalog/sync-videos/gender_categories',
    routingKey: 'model.gender_categories.*',
    queueOptions: {
      deadLetterExchange: process.env.RABBITMQ_DLX_EXCHANGE
        ? process.env.RABBITMQ_DLX_EXCHANGE
        : '',
    },
  })
  async handlerCategories({data, message}: {data: any; message: Message}) {
    await this.syncRelations({
      id: data.id,
      repo: this.genderRepo,
      relationName: 'categories',
      relationIds: data.relation_ids,
      relationRepo: this.categoryRepo,
      message,
    });
  }
}
