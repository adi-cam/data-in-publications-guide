import { modifier } from 'ember-modifier';

export default modifier(
  (element, args, { linkSelector = '', elementSelector = '', activeClass = 'active', maxOffset = 50 }) => {
    // define handler
    const handler = () => {
      // get links and elements
      const links = element.querySelectorAll(linkSelector);
      const elements = document.querySelectorAll(elementSelector);

      // find active element
      let active = 0;
      for (const [i, element] of elements.entries()) {
        if (element.getBoundingClientRect().top <= maxOffset) {
          active = i;
        }
      }

      // unset class
      for (const link of links) {
        link.classList.remove(activeClass);
      }

      // set class
      links[active].classList.add(activeClass);
    };

    // call handler
    handler();

    // add scroll handler
    document.addEventListener('scroll', handler);

    return () => {
      // remove scroll handler
      document.removeEventListener('scroll', handler);
    };
  }
);
