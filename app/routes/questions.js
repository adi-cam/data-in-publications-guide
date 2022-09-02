import Base from './base';

export default class extends Base {
  queryParams = {
    page: {},
    title: {
      replace: true,
    },
    answers: {
      replace: true,
    },
  };

  serializeQueryParam(value, key) {
    if (key === 'answers') {
      return Object.entries(value || {})
        .filter((item) => item[1])
        .map((item) => {
          return item[1] === true ? item[0] : `${item[0]}-${item[1]}`;
        })
        .join('.');
    }
    return value;
  }

  deserializeQueryParam(value, key) {
    if (key === 'answers') {
      return Object.fromEntries(
        (value || '').split('.').map((str) => {
          const seg = str.split('-');
          return seg.length > 1 ? seg : [seg[0], true];
        })
      );
    }
    return value;
  }
}
