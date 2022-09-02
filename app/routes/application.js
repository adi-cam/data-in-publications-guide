import Base from './base';

import { inject as service } from '@ember/service';

export default class extends Base {
  @service data;

  async model() {
    return this.data.load();
  }
}
