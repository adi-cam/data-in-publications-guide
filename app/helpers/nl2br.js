import Helper from '@ember/component/helper';

export default class extends Helper {
  compute([str]) {
    return str.replaceAll('\n', '<br>');
  }
}
