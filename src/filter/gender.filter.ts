import {Gender} from '../models';
import {DefaultFilter} from './default-filter';

export class GenderFilterBuilder extends DefaultFilter<Gender> {
  protected defaultFilter() {
    return this.isActive(Gender);
  }
}
