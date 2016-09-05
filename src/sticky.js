
const Sticky = function (selector) {
  const sticky = this;

  sticky.version = '1.0.6';

  sticky.selector = selector;

  sticky.vp = sticky.getViewportSize();
  sticky.scrollTop = sticky.getScrollTopPosition();
  sticky.elements = [];

  sticky.run();
};

Sticky.prototype = {
  run: function () {
    const elements = document.querySelectorAll(this.selector);

    // run sticky only when dom is fully loaded
    const DOMContentLoaded = setInterval(() => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        clearInterval(DOMContentLoaded);

        this.iterate(elements, (el) => this.activate(el));

        window.addEventListener('scroll', () => {
          this.scrollTop = this.getScrollTopPosition();
          this.setPosition();
        });

        window.addEventListener('resize', () => {
          this.vp = this.getViewportSize();
          this.updatePosition();
        });

        this.isSet = true;
        this.setPosition();
      }
    }, 100);
  },

  activate: function (el) {
    el.sticky = {};

    el.sticky.active = false;

    el.sticky.breakpoint = parseInt(el.getAttribute('data-sticky-for')) || 0;
    el.sticky.marginTop = parseInt(el.getAttribute('data-margin-top')) || 0;
    el.sticky.class = el.getAttribute('data-sticky-class') || false;

    el.sticky.rect = this.getRect(el);

    // fix when el is image that has not yet loaded and width, height = 0
    if (el.tagName.toLowerCase() === 'img') {
      el.onload = () => el.sticky.rect = this.getRect(el);
    }

    el.sticky.container = this.getContainer(el);
    el.sticky.container.rect = this.getRect(el.sticky.container);

    if (el.sticky.breakpoint < this.vp.width && !el.sticky.active) {
      el.sticky.active = true;
    }

    window.addEventListener('resize', () => {
      this.vp = this.getViewportSize();

      if (el.sticky.breakpoint < this.vp.width && !el.sticky.active) {
        el.sticky.active = true;
        this.setPosition();
      } else if (el.sticky.breakpoint >= this.vp.width && el.sticky.active) {
        el.sticky.active = false;
        this.setPosition();
      }
    });

    this.elements.push(el);
  },

  getRect: function (el) {
    const position = this.getTopLeftPosition(el);

    position.width = el.offsetWidth;
    position.height = el.offsetHeight;

    return position;
  },

  updateRect: function () {
    this.iterate(this.elements, (el) => {
      this.removeStyle(el, [ 'position', 'width', 'top', 'left' ]);

      el.sticky.rect = this.getRect(el);
      el.sticky.container.rect = this.getRect(el.sticky.container);
    });
  },

  getTopLeftPosition: function (el) {
    let top = 0, left = 0;

    do {
      top += el.offsetTop  || 0;
      left += el.offsetLeft || 0;
      el = el.offsetParent;
    } while(el);

    return { top, left };
  },

  getContainer: function (el) {
    let container = el;

    while (
      typeof container.getAttribute('data-sticky-container') !== 'string'
      && container !== document.documentElement
    ) {
      container = container.parentNode;
    }

    return container;
  },

  getViewportSize: function () {
    return {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  },

  getScrollTopPosition: function () {
    return (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0) || 0;
  },

  setPosition: function () {
    this.iterate(this.elements, (el) => {
      this.removeStyle(el, [ 'position', 'width', 'top', 'left' ]);

      if ((this.vp.height < el.sticky.rect.height) || !el.sticky.active) {
        return;
      }

      if (this.scrollTop > (el.sticky.rect.top - el.sticky.marginTop)) {
        this.addStyle(el, {
          position: 'fixed',
          width: el.sticky.rect.width + 'px',
          left: el.sticky.rect.left + 'px',
        });

        if (
          (this.scrollTop + el.sticky.rect.height + el.sticky.marginTop)
          > (el.sticky.container.rect.top + el.sticky.container.rect.height)
        ) {

          if (el.sticky.class) el.classList.remove(el.sticky.class);

          this.addStyle(el, {
            top: (el.sticky.container.rect.top + el.sticky.container.rect.height) - (this.scrollTop + el.sticky.rect.height) + 'px' }
          );
        } else {
          if (el.sticky.class) el.classList.add(el.sticky.class);

          this.addStyle(el, { top: el.sticky.marginTop + 'px' });
        }
      } else {
        if (el.sticky.class) el.classList.remove(el.sticky.class);

        this.removeStyle(el, [ 'position', 'width', 'top', 'left' ]);
      }
    });
  },

  updatePosition: function () {
    this.updateRect();
    this.setPosition();
  },

  update: function () {
    if (this.isSet) {
      const self = this;

      const thisUpdate = function () {
        self.update();
      };

      this.iterate(this.elements, (element) => {
        if (typeof element.sticky !== 'undefined') {
          this.updatePosition();
        } else {
          setTimeout(thisUpdate, 100);
        }
      });
    }
  },

  addStyle: function (el, styles) {
    for (let property in styles) {
      if (styles.hasOwnProperty(property)) {
        el.style[property] = styles[property];
      }
    }
  },

  removeStyle: function (el, properties) {
    this.iterate(properties, (property) => el.style[property] = null);
  },

  iterate: function (array, callback) {
    for (let i = 0, len = array.length; i < len; i++) {
      callback(array[i]);
    }
  }
};

if (
  typeof module === 'object'
  && typeof module.exports === 'object'
) {
  module.exports = exports = Sticky;
}
