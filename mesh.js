/*
 * mesh
 * click/touch + drag data linking
 *
 * Copyright (c) Tom Ashworth
 * MIT License
 *
 * mesh is a tool to allow you to quickly understand how different values in a
 * target affect it's outcome, demonstrate a mathematical function or give your
 * users a deeper understanding of their data.
 *
 * Click (or touch) and drag on a 'source' linked to a 'target' to see how
 * things change, and build your own using simple HTML with data attributes.
 *
 * Example usage:

    I have <span data-mesh-source="bananas">6</span> bananas to split between
    me and <span data-mesh-source="others">2</span> others. Each of us gets
    <span data-mesh-target="@bananas / (@others + 1)">2</span> bananas.

    <script src="mesh.js"></script>
    <script>
      $.mesh({
        // Configuration oject (see below)
      });
    </script>

  * Configuration options:
  *
  *   `dragSpeed`
  *   Type: Number
  *   Default: 10
  *   Range: 1 - 15 (suggested, but have a play)
  *   How fast a source will change as it is dragged. Higher is faster.
  *
  *   `saveDelay`
  *   Type Number
  *   Default: 300 (ms)
  *   How long mesh will wait for further changes before saving a source's
  *   value to localStorage.
  *
  *   `updateDelay`
  *   Type: Number
  *   Default: 50 (ms)
  *   How long mesh will wait for further changes to a source before updating
  *   the targets.
  *
  *   `decimalPlaces`
  *   Type: Number
  *   Default: 2
  *   The default number of decimal places mesh will use if a `decimal`
  *   attribute is found on a source or target.
  *
  *   `save`
  *   Type: Boolean
  *   Default: true (if localStorage is available)
  *   Enable saving of source values between page refreshes.
  *
  *   `prefix`
  *   Type: String
  *   Default: 'data-mesh-'
  *   Change the prefix mesh looks for on its attributes. Should have
  *   a trailing hyphen.
  *
  *   `touch`
  *   Type: Boolean
  *   Default: depends on device (if `ontouchstart` is found in the `window`)
  *   Force mesh to use listen for touch events. You probably can ignore this.
  *
 */
;(function (window, document, undefined) {

  $.mesh = function (userConfig) {
    /* Defaul config */
    var defaultConfig = {
      prefix        : 'data-mesh-',
      save          : ('localStorage' in window),
      touch         : ('ontouchstart' in window),
      decimalPlaces : 2,
      dragSpeed     : 1,
      saveDelay     : 300,
      updateDelay   : 50
    };

    /* Build a config from the one supplied */
    var config = $.extend({}, defaultConfig, userConfig || {});

    /* Events to listen to */
    var events = {
      start : (config.touch ? 'touchstart' : 'mousedown'),
      move  : (config.touch ? 'touchmove' : 'mousemove'),
      end   : (config.touch ? 'touchend' : 'mouseup'),
      reset : 'dblclick'
    };

    /* Recognised attribute types */
    var attr = {
      source    : config.prefix + 'source',
      target    : config.prefix + 'target',
      floor     : config.prefix + 'floor',
      decimal   : config.prefix + 'decimal',
      min       : config.prefix + 'min',
      max       : config.prefix + 'max',
      positive  : config.prefix + 'positive',
      active    : config.prefix + 'active',
      currency  : config.prefix + 'currency'
    };

    /* Decimal place rounding */
    var roundToDp = function (value, decimalPlaces) {
      var exponent = Math.pow(10, decimalPlaces);
      return Math.round(value * exponent) / exponent;
    };

    var currency = function (value) {
      var raw = roundToDp(value, 2),
          whole = Math.floor(raw),
          decimal = '00' + roundToDp((raw - whole) * 100, 0);
      return whole + '.' + decimal.slice(-2);
    };

    /* Grab the nodes we want */
    var $body    = $('body'),
        $sources = $('['+attr.source+']'),
        $targets = $('['+attr.target+']'),
        data     = {};

    /* Update all the targets with the calculated value from the sources */
    var updateTargets = $targets.each.bind($targets, function () {
      var $this         = $(this),
          result        = 0,
          decimalPlaces = config.decimalPlaces,
          expression, interpolated;

      /* Grab the raw expression from the target and filter it */
      expression =
        $this
          .attr(attr.target)
          /* Remove disallowed values
             (allow: a-z, 0-9, maths operators, brackets,
                     dots, commas, @ and whitespace) */
          .replace(/[^a-z0-9\/\+\-\*\(\)\.,\@\s]/gi, '');

      /* Grab all the source names & replace them with values */
      Object.keys(data)
        .forEach(function (source) {
          var regexp = new RegExp('@' + source, 'ig');
          expression = expression.replace(regexp, data[source]);
        });

      try {

        /* Eval it (eek) against the page */
        result = parseFloat(eval(expression), 10);

        /* Round to decimal places if required */
        if ($this.is('['+attr.decimal+']')) {
          decimalPlaces = parseInt($this.attr(attr.decimal), 10) ||
                          decimalPlaces;
          result = roundToDp(result, decimalPlaces);
        }

        /* Round it if required*/
        if ($this.is('['+attr.floor+']')) result = Math.floor(result);

        if ($this.is('['+attr.currency+']')) result = currency(result);

      } catch (e) {
        result = '0 (an error occurred)';
        console.log('Could not process expression "%s"', expression);
      }

      /* Send it on back */
      $this.text(result || 0);
    });

    /* Set a timer to update all targets */
    var prepareUpdate = (function () {
      var updateTimer;
      return function () {
        clearTimeout(updateTimer);
        updateTimer = setTimeout(updateTargets, config.updateDelay || 100);
      };
    }());

    /* Set a timer to save a particular source */
    var prepareSave = (function () {
      var saveTimer = {};
      return function (source, value) {
        if (!config.save) return;
        clearTimeout(saveTimer[source]);
        saveTimer[source] = setTimeout(function () {
          /* Just save to localStorage with the appropriate prefix */
          localStorage.setItem(config.prefix + source, value);
        }, config.saveDelay || 100);
      };
    }());

    /* Restore a value from localStorage if it's enabled */
    var restore = function (source) {
      return (config.save ? localStorage.getItem(config.prefix + source)
                          : false);
    };

    /* Extract important information for an event */
    var extractEvent = function (e) {
      var touch;
      /* If it's a touch event, copy the info over */
      if (config.touch && e.originalEvent.touches.length > 0) {
        /* Assume one touch. Possible improvement here */
        touch = e.originalEvent.touches[0];
        /* Copy it real good */
        Object.keys(touch)
          .forEach(function (key) {
            e[key] = touch[key];
          });
      }
      return e;
    };

    /* Initialise all the sources, including attaching event handlers */
    $sources.each(function () {
      var $this        = $(this),
          source       = $this.attr(attr.source),
          initialValue = parseFloat($this.text(), 10),
          minValue     = parseFloat($this.attr(attr.min), 10) || -Infinity,
          maxValue     = parseFloat($this.attr(attr.max), 10) || Infinity;

      /* Allow numbers to be clamped to positive values */
      if ($this.is('['+attr.positive+']') &&
          minValue === -Infinity) {
        minValue = 0;
      }

      /* Update the value of this source */
      var updateValue = function (value) {
        /* Clamp or limit the value */
        if (value !== 0 && !value) value = 0;
        if (value < minValue) value = minValue;
        if (value > maxValue) value = maxValue;

        /* Update the display and storage */
        $this.text(value);
        data[source] = value;

        /* Update the targets and save */
        prepareUpdate();
        prepareSave(source, value);
      };

      /* Store information about current drag*/
      var drag = { active: false, start: {}, pos: {} };
      /* And an update function for the source's value */
      var update = function (e) {
        if (!drag.active) return;

        /* Grab the important data */
        e = extractEvent(e);
        drag.pos.y = e.pageY;

        var raw_diff, diff;

        /* Calculate the value based on the drag distance */
        raw_diff = (drag.start.y - drag.pos.y) / (10 / (config.dragSpeed || 1));
        /* If this source is allowed to be decimal, don't floor it */
        diff = ($this.is('['+attr.decimal+']') ? roundToDp(raw_diff, 1)
                                               : Math.floor(raw_diff));

        /* Calculate the new value */
        val = roundToDp(drag.start.val + diff, 1);

        /* And perform an update */
        updateValue(val);
      };

      var end = function () {
        drag.active = false;
        $body
          .removeAttr(attr.active)
          .removeClass(attr.active);
      };

      /* Setup */

      /* If we're saving, and there's a value, grab it */
      updateValue(restore(source) || initialValue);

      /* Drag handlers. Yeah, this is alot. */
      $this
        .on(events.start, function (e) {
          if (drag.active) return;
          e = extractEvent(e);
          e.preventDefault();
          drag.active = true;
          drag.start.y = e.pageY;
          drag.start.val = parseFloat($this.text(), 10);
          $body
            .attr(attr.active, true)
            .addClass(attr.active);
        })
        .on(events.move, update)
        .on(events.end, end)
        .on(events.reset, updateValue.bind(this, initialValue));

      $this
        .parents()
        .on(events.move, update)
        .on(events.end, end);
    });

    /* Let's go! */
    prepareUpdate();
  };

}(window, document));
