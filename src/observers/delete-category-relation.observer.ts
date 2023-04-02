import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CategoryRepository, GenderRepository} from '../repositories';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class DeleteCategoryRelationObserver implements LifeCycleObserver {
  constructor(
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
    @repository(GenderRepository) private genderRepo: GenderRepository,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    this.categoryRepo.modelClass.observe(
      'after delete',
      async ({where, ...other}) => {
        await this.genderRepo.deleteRelation('categories', where);
      },
    );
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
