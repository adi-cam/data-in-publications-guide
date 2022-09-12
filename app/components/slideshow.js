import Component from '@glimmer/component';
import { action } from '@ember/object';
import Glide from '@glidejs/glide';

export default class extends Component {
  glide;

  @action setup(element) {
    this.glide = new Glide(element).mount();
  }

  @action teardown() {
    this.glide.destroy();
  }
}
