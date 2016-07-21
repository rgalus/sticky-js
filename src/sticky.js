
((win, doc) => {
  'use strict';

  const stickyElements = doc.querySelectorAll('[data-sticky]');

  const vp = {
    width: Math.max(doc.documentElement.clientWidth, win.innerWidth || 0),
    height: Math.max(doc.documentElement.clientHeight, win.innerHeight || 0),
  };

  const breakpoints = {
    medium: 640,
    large: 1024,
    xlarge: 1200,
  };

  for (let i = 0, len = stickyElements.length; i < len; i++) {
    win.addEventListener('load', () => activate(stickyElements[i]));
  }

  function activate(el) {
    el.sticky = {};

    if (el.hasAttribute('data-margin-top')) {
      el.sticky.margin = parseInt(el.getAttribute('data-margin-top'));
    } else {
      el.sticky.margin = 0;
    }

    getRectangles(el);
    setPosition(el);

    win.addEventListener('resize', () => {
      vp.width = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0);
      vp.height = Math.max(doc.documentElement.clientHeight, win.innerHeight || 0);

      getRectangles(el);
      setPosition(el);
    });

    win.addEventListener('scroll', () => setPosition(el));
  }

  function getRectangles(el) {
    el.classList.remove('sticky');
    removeStyles(el);

    el.sticky.top = getTopLeftPosition(el).top;
    el.sticky.left = getTopLeftPosition(el).left;
    el.sticky.width = el.offsetWidth;
    el.sticky.height = el.offsetHeight;

    let container = el;

    while (typeof container.getAttribute('data-sticky-container') !== 'string' && container !== doc.querySelector('main')) {
      container = container.parentNode;
    }

    el.sticky.container = getTopLeftPosition(container);
    el.sticky.container.width = container.offsetWidth;
    el.sticky.container.height = container.offsetHeight;

    return el;
  }

  function getTopLeftPosition(el) {
    let top = 0, left = 0;
    do {
        top += el.offsetTop  || 0;
        left += el.offsetLeft || 0;
        el = el.offsetParent;
    } while(el);

    return { top, left };
  }

  function setPosition(el) {
    if (vp.width < breakpoints[el.getAttribute('data-sticky-on')]) return;
    if (vp.height < el.sticky.height) return;

    const scrollTop = (win.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0) || 0;

    if (scrollTop > (el.sticky.top - el.sticky.margin)) {
      el.classList.add('sticky');
      el.style.left = el.sticky.left + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.width = el.sticky.width + 'px';

      if ((scrollTop + el.sticky.height + el.sticky.margin) > (el.sticky.container.top + el.sticky.container.height)) {
        el.style.top = (el.sticky.container.top + el.sticky.container.height) - (scrollTop + el.sticky.height) + 'px';
      } else {
        el.style.top = el.sticky.margin + 'px';
      }

    } else {
      el.classList.remove('sticky');
      removeStyles(el);
    }
  }

  function removeStyles(el) {
    el.style.width = null;
    el.style.top = null;
    el.style.left = null;
    el.style.right = null;
    el.style.bottom = null;
  }


})(window, document);
