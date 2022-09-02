import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import evaluate from 'simple-evaluate';

export default class extends Controller {
  @service data;

  queryParams = ['page', 'title', 'answers'];

  @tracked page = 1;
  @tracked title = '';
  @tracked answers = {};

  get filteredGroupedQuestions() {
    return Object.fromEntries(
      Object.entries(this.data.groupedQuestions).map((group) => {
        return [
          group[0],
          group[1].filter((question) => {
            return this.matchCondition(question.condition);
          }),
        ];
      })
    );
  }

  /* common */

  get answerData() {
    return Object.fromEntries(
      Object.keys(this.answers).map((key) => {
        if (typeof this.answers[key] === 'string') {
          return ['_' + this.answers[key], true];
        } else {
          return ['_' + key, true];
        }
      })
    );
  }

  matchCondition(condition) {
    // match condition by expression
    let matched = condition.length === 0;
    for (let expression of condition) {
      if (evaluate(this.answerData, expression.replaceAll(/\d+/g, '_$&'))) {
        matched = true;
      }
    }

    return matched;
  }

  /* questions */

  @action setTitle(e) {
    this.title = e.target.value;
  }

  @action setAnswer(qid, oid) {
    this.answers[qid] = oid;
    this.answers = this.answers; // eslint-disable-line
  }

  @action toggleAnswer(qid, oid, on) {
    this.answers[oid] = on;
    this.answers = this.answers; // eslint-disable-line
  }

  /* recommendations */

  get filteredGroupedRecommendations() {
    return Object.fromEntries(
      Object.entries(this.data.groupedRecommendations)
        .map((group) => {
          return [
            group[0],
            group[1].filter((recommendation) => {
              return this.matchCondition(recommendation.condition);
            }),
          ];
        })
        .filter((group) => group[1].length > 0)
    );
  }

  get filteredTopics() {
    return Object.keys(this.filteredGroupedQuestions);
  }

  @action print() {
    window.print();
  }

  @action share() {
    window.location = `mailto:xyz@abc.com?subject=EU%20Publication%20Wizard&body=Visit%20here:%20${window.location}`;
  }
}
