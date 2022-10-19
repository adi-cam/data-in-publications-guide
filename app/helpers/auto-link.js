import urlRegex from 'url-regex';

import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function nl2br([text]) {
  return htmlSafe((text || '').replace(urlRegex(), '<a href="$&" target="_blank">$&</a>'));
});
