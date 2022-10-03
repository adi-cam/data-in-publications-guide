import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class extends Controller {
  @service data;

  @action print() {
    window.print();
  }

  @action share() {
    window.location = `mailto:xyz@abc.com?subject=EU%20Publication%20Wizard&body=Visit%20here:%20${window.location}`;
  }
}
