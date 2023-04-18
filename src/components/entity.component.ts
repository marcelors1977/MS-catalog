import {Component} from '@loopback/core';
import {DeleteCategoryRelationObserver} from '../observers/delete-category-relation.observer';
import {UpdateCategoryRelationObserver} from '../observers/update-category-relation.observer';

export class EntityComponent implements Component {
  lifeCycleObservers = [
    UpdateCategoryRelationObserver,
    DeleteCategoryRelationObserver,
  ];
}
