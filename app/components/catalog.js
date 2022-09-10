import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked state = {};

  @action open(rid, open) {
    this.state[rid] = open;
    this.state = this.state; // eslint-disable-line
  }

  @action openAll(recommendations) {
    for (const recommendation of recommendations) {
      this.state[recommendation.id] = true;
      this.state = this.state; // eslint-disable-line
    }
  }

  @action closeAll(recommendations) {
    for (const recommendation of recommendations) {
      this.state[recommendation.id] = false;
      this.state = this.state; // eslint-disable-line
    }
  }
}
