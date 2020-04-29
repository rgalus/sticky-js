function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Sticky.js
 * Library for sticky elements written in vanilla javascript. With this library you can easily set sticky elements on your website. It's also responsive.
 *
 * @version 1.2.2
 * @author Rafal Galus <biuro@rafalgalus.pl>
 * @website https://rgalus.github.io/sticky-js/
 * @repo https://github.com/rgalus/sticky-js
 * @license https://github.com/rgalus/sticky-js/blob/master/LICENSE
 */
var Sticky =
/*#__PURE__*/
function () {
  /**
   * Sticky instance constructor
   * @constructor
   * @param {string} selector - Selector which we can find elements
   * @param {string} options - Global options for sticky elements (could be overwritten by data-{option}="" attributes)
   */
  function Sticky() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Sticky);

    this.selector = selector;
    this.elements = [];
    this.version = '1.2.2';
    this.vp = this.getViewportSize();
    this.body = document.querySelector('body');
    this.options = {
      wrap: options.wrap || false,
      marginTop: options.marginTop || 0,
      stickyFor: options.stickyFor || 0,
      stickyClass: options.stickyClass || null,
      stickyContainer: options.stickyContainer || 'body'
    };
    this.updateScrollTopPosition = this.updateScrollTopPosition.bind(this);
    this.updateScrollTopPosition();
    window.addEventListener('load', this.updateScrollTopPosition);
    window.addEventListener('scroll', this.updateScrollTopPosition);
    this.run();
  }
  /**
   * Function that waits for page to be fully loaded and then renders & activates every sticky element found with specified selector
   * @function
   */


  _createClass(Sticky, [{
    key: "run",
    value: function run() {
      var _this = this;

      // wait for page to be fully loaded
      var pageLoaded = setInterval(function () {
        if (document.readyState === 'complete') {
          clearInterval(pageLoaded);
          var elements = document.querySelectorAll(_this.selector);

          _this.forEach(elements, function (element) {
            return _this.renderElement(element);
          });
        }
      }, 10);
    }
    /**
     * Function that assign needed variables for sticky element, that are used in future for calculations and other
     * @function
     * @param {node} element - Element to be rendered
     */

  }, {
    key: "renderElement",
    value: function renderElement(element) {
      var _this2 = this;

      // create container for variables needed in future
      element.sticky = {}; // set default variables

      element.sticky.active = false;
      element.sticky.marginTop = parseInt(element.getAttribute('data-margin-top')) || this.options.marginTop;
      element.sticky.stickyFor = parseInt(element.getAttribute('data-sticky-for')) || this.options.stickyFor;
      element.sticky.stickyClass = element.getAttribute('data-sticky-class') || this.options.stickyClass;
      element.sticky.wrap = element.hasAttribute('data-sticky-wrap') ? true : this.options.wrap; // @todo attribute for stickyContainer
      // element.sticky.stickyContainer = element.getAttribute('data-sticky-container') || this.options.stickyContainer;

      element.sticky.stickyContainer = this.options.stickyContainer;
      element.sticky.container = this.getStickyContainer(element);
      element.sticky.container.rect = this.getRectangle(element.sticky.container);
      element.sticky.rect = this.getRectangle(element); // fix when element is image that has not yet loaded and width, height = 0

      if (element.tagName.toLowerCase() === 'img') {
        element.onload = function () {
          return element.sticky.rect = _this2.getRectangle(element);
        };
      }

      if (element.sticky.wrap) {
        this.wrapElement(element);
      } // activate rendered element


      this.activate(element);
    }
    /**
     * Wraps element into placeholder element
     * @function
     * @param {node} element - Element to be wrapped
     */

  }, {
    key: "wrapElement",
    value: function wrapElement(element) {
      element.insertAdjacentHTML('beforebegin', '<span></span>');
      element.previousSibling.appendChild(element);
    }
    /**
     * Function that activates element when specified conditions are met and then initalise events
     * @function
     * @param {node} element - Element to be activated
     */

  }, {
    key: "activate",
    value: function activate(element) {
      if (element.sticky.rect.top + element.sticky.rect.height < element.sticky.container.rect.top + element.sticky.container.rect.height && element.sticky.stickyFor < this.vp.width && !element.sticky.active) {
        element.sticky.active = true;
      }

      if (this.elements.indexOf(element) < 0) {
        this.elements.push(element);
      }

      if (!element.sticky.resizeEvent) {
        this.initResizeEvents(element);
        element.sticky.resizeEvent = true;
      }

      if (!element.sticky.scrollEvent) {
        this.initScrollEvents(element);
        element.sticky.scrollEvent = true;
      }

      this.setPosition(element);
    }
    /**
     * Function which is adding onResizeEvents to window listener and assigns function to element as resizeListener
     * @function
     * @param {node} element - Element for which resize events are initialised
     */

  }, {
    key: "initResizeEvents",
    value: function initResizeEvents(element) {
      var _this3 = this;

      element.sticky.resizeListener = function () {
        return _this3.onResizeEvents(element);
      };

      window.addEventListener('resize', element.sticky.resizeListener);
    }
    /**
     * Removes element listener from resize event
     * @function
     * @param {node} element - Element from which listener is deleted
     */

  }, {
    key: "destroyResizeEvents",
    value: function destroyResizeEvents(element) {
      window.removeEventListener('resize', element.sticky.resizeListener);
    }
    /**
     * Function which is fired when user resize window. It checks if element should be activated or deactivated and then run setPosition function
     * @function
     * @param {node} element - Element for which event function is fired
     */

  }, {
    key: "onResizeEvents",
    value: function onResizeEvents(element) {
      this.vp = this.getViewportSize();
      element.sticky.rect = this.getRectangle(element, false);
      element.sticky.container.rect = this.getRectangle(element.sticky.container, false);

      if (element.sticky.rect.top + element.sticky.rect.height < element.sticky.container.rect.top + element.sticky.container.rect.height && element.sticky.stickyFor < this.vp.width && !element.sticky.active) {
        element.sticky.active = true;
      } else if (element.sticky.rect.top + element.sticky.rect.height >= element.sticky.container.rect.top + element.sticky.container.rect.height || element.sticky.stickyFor >= this.vp.width && element.sticky.active) {
        element.sticky.active = false;
      }

      this.setPosition(element);
    }
    /**
     * Function which is adding onScrollEvents to window listener and assigns function to element as scrollListener
     * @function
     * @param {node} element - Element for which scroll events are initialised
     */

  }, {
    key: "initScrollEvents",
    value: function initScrollEvents(element) {
      var _this4 = this;

      element.sticky.scrollListener = function () {
        return _this4.onScrollEvents(element);
      };

      window.addEventListener('scroll', element.sticky.scrollListener);
    }
    /**
     * Removes element listener from scroll event
     * @function
     * @param {node} element - Element from which listener is deleted
     */

  }, {
    key: "destroyScrollEvents",
    value: function destroyScrollEvents(element) {
      window.removeEventListener('scroll', element.sticky.scrollListener);
    }
    /**
     * Function which is fired when user scroll window. If element is active, function is invoking setPosition function
     * @function
     * @param {node} element - Element for which event function is fired
     */

  }, {
    key: "onScrollEvents",
    value: function onScrollEvents(element) {
      if (element.sticky.active) {
        this.setPosition(element);
      }
    }
    /**
     * Main function for the library. Here are some condition calculations and css appending for sticky element when user scroll window
     * @function
     * @param {node} element - Element that will be positioned if it's active
     */

  }, {
    key: "setPosition",
    value: function setPosition(element) {
      this.css(element, {
        position: '',
        width: '',
        top: '',
        left: ''
      });

      if (this.vp.height < element.sticky.rect.height || !element.sticky.active) {
        return;
      }

      if (!element.sticky.rect.width) {
        element.sticky.rect = this.getRectangle(element);
      }

      if (element.sticky.wrap) {
        this.css(element.parentNode, {
          display: 'block',
          width: element.sticky.rect.width + 'px',
          height: element.sticky.rect.height + 'px'
        });
      }

      if (element.sticky.rect.top === 0 && element.sticky.container === this.body) {
        this.css(element, {
          position: 'fixed',
          top: element.sticky.rect.top + 'px',
          left: element.sticky.rect.left + 'px',
          width: element.sticky.rect.width + 'px'
        });
      } else if (this.scrollTop > element.sticky.rect.top - element.sticky.marginTop) {
        this.css(element, {
          position: 'fixed',
          width: element.sticky.rect.width + 'px',
          left: element.sticky.rect.left + 'px'
        });

        if (this.scrollTop + element.sticky.rect.height + element.sticky.marginTop > element.sticky.container.rect.top + element.sticky.container.offsetHeight) {
          if (element.sticky.stickyClass) {
            element.classList.remove(element.sticky.stickyClass);
          }

          this.css(element, {
            top: element.sticky.container.rect.top + element.sticky.container.offsetHeight - (this.scrollTop + element.sticky.rect.height) + 'px'
          });
        } else {
          if (element.sticky.stickyClass) {
            element.classList.add(element.sticky.stickyClass);
          }

          this.css(element, {
            top: element.sticky.marginTop + 'px'
          });
        }
      } else {
        if (element.sticky.stickyClass) {
          element.classList.remove(element.sticky.stickyClass);
        }

        this.css(element, {
          position: '',
          width: '',
          top: '',
          left: ''
        });

        if (element.sticky.wrap) {
          this.css(element.parentNode, {
            display: '',
            width: '',
            height: ''
          });
        }
      }
    }
    /**
     * Function that updates element sticky rectangle (with sticky container), then activate or deactivate element, then update position if it's active
     * @function
     */

  }, {
    key: "update",
    value: function update() {
      var _this5 = this;

      this.forEach(this.elements, function (element) {
        element.sticky.rect = _this5.getRectangle(element);
        element.sticky.container.rect = _this5.getRectangle(element.sticky.container);

        _this5.activate(element);

        _this5.setPosition(element);
      });
    }
    /**
     * Destroys sticky element, remove listeners
     * @function
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var _this6 = this;

      window.removeEventListener('load', this.updateScrollTopPosition);
      window.removeEventListener('scroll', this.updateScrollTopPosition);
      this.forEach(this.elements, function (element) {
        _this6.destroyResizeEvents(element);

        _this6.destroyScrollEvents(element);

        delete element.sticky;
      });
    }
    /**
     * Function that returns container element in which sticky element is stuck (if is not specified, then it's stuck to body)
     * @function
     * @param {node} element - Element which sticky container are looked for
     * @return {node} element - Sticky container
     */

  }, {
    key: "getStickyContainer",
    value: function getStickyContainer(element) {
      var container = element.parentNode;

      while (!container.hasAttribute('data-sticky-container') && !container.parentNode.querySelector(element.sticky.stickyContainer) && container !== this.body) {
        container = container.parentNode;
      }

      return container;
    }
    /**
     * Function that returns element rectangle & position (width, height, top, left)
     * @function
     * @param {node} element - Element which position & rectangle are returned
     * @return {object}
     */

  }, {
    key: "getRectangle",
    value: function getRectangle(element, useAnimationFrame) {
      this.css(element, {
        position: '',
        width: '',
        top: '',
        left: ''
      }, useAnimationFrame);
      var width = Math.max(element.offsetWidth, element.clientWidth, element.scrollWidth);
      var height = Math.max(element.offsetHeight, element.clientHeight, element.scrollHeight);
      var top = 0;
      var left = 0;

      do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);

      return {
        top: top,
        left: left,
        width: width,
        height: height
      };
    }
    /**
     * Function that returns viewport dimensions
     * @function
     * @return {object}
     */

  }, {
    key: "getViewportSize",
    value: function getViewportSize() {
      return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      };
    }
    /**
     * Function that updates window scroll position
     * @function
     * @return {number}
     */

  }, {
    key: "updateScrollTopPosition",
    value: function updateScrollTopPosition() {
      this.scrollTop = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0) || 0;
    }
    /**
     * Helper function for loops
     * @helper
     * @param {array}
     * @param {function} callback - Callback function (no need for explanation)
     */

  }, {
    key: "forEach",
    value: function forEach(array, callback) {
      for (var i = 0, len = array.length; i < len; i++) {
        callback(array[i]);
      }
    }
    /**
     * Helper function to add/remove css properties for specified element.
     * @helper
     * @param {node} element - DOM element
     * @param {object} properties - CSS properties that will be added/removed from specified element
     */

  }, {
    key: "css",
    value: function css(element, properties, useAnimationFrame) {
      if (typeof useAnimationFrame === 'undefined') {
        useAnimationFrame = true;
      }

      if (!useAnimationFrame) {
        for (var property in properties) {
          if (properties.hasOwnProperty(property)) {
            element.style[property] = properties[property];
          }
        }

        return;
      }

      window.requestAnimationFrame(function () {
        for (var _property in properties) {
          if (properties.hasOwnProperty(_property)) {
            element.style[_property] = properties[_property];
          }
        }
      });
    }
  }]);

  return Sticky;
}();
/**
 * Export function that supports AMD, CommonJS and Plain Browser.
 */


(function (root, factory) {
  if (typeof exports !== 'undefined') {
    module.exports = factory;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory;
    });
  } else {
    root.Sticky = factory;
  }
})(this, Sticky);