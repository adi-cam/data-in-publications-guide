import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  @service data;
  @controller application;

  @tracked state = {};

  get filteredGroupedRecommendations() {
    return Object.fromEntries(
      Object.entries(this.data.groupedRecommendations)
        .map((group) => {
          return [
            group[0],
            group[1].filter((recommendation) => {
              return this.application.matchCondition(recommendation.condition);
            }),
          ];
        })
        .filter((group) => group[1].length > 0)
    );
  }

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

  @action print() {
    window.print();
  }

  @action share() {
    window.location = `mailto:xyz@abc.com?subject=EU%20Publication%20Wizard&body=Visit%20here:%20${window.location}`;
  }
}
