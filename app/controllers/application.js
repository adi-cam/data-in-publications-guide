import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class extends Controller {
  @service data;

  @action copy(event) {
    const span = event.target.querySelector('span');
    navigator.clipboard.writeText(document.location);
    span.style.opacity = '1';
    setTimeout(() => {
      span.style.opacity = '0';
    }, 1000);
  }

  @action share() {
    window.location = `mailto:xyz@abc.com?subject=Data%20in%20Publications%20Guide&body=Visit%20here:%20${window.location}`;
  }
}
