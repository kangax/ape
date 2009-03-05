// Inspired by Prototype.js `String.prototype` extensions

(function(){
  
  var global = this;
  global.APE = global.APE || { };

  function escapeRe(s) {
    return (s + '').replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function unescapeHTML(s) {
    return s.replace(/&lt;/g,'<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  }

  function trim(s) {
    return s.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '');
  }

  function stripTags(s) {
    return s.replace(/<\/?("[^"]*"|'[^']*'|[^>])+>/g, '');
  }

  var camelize = (function(){
    function replacer(m, ch) {
      return ch.toUpperCase();
    }
    function camelize(s) {
      return s.replace(/\-(\w)/g, replacer);
    }
    return camelize;
  })();

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + 
      s.substring(1).toLowerCase();
  }

  var interpolate = (function(){
    var hop = Object.prototype.hasOwnProperty;
    function interpolate(string, source) {
      if (source == null) { 
        source = { };
      }
      // TODO: change regex so that it is possible to escape control sequences - i.e. "#"
      return string.replace(/#\{([^\}]*)\}/g, function(m, prop) {
        return hop.call(source, prop) ? source[prop] : '';
      });
    }
    return interpolate;
  })();
  
  // original version by Dean Edwards (see: ie7.js)
  if ('x'.replace(/x/, function(){ return ''; })) {
    var origReplace = String.prototype.replace;
    String.prototype.replace = function(expression, replacement) {
      if (typeof replacement == "function") { // Safari doesn't like functions
        if (expression && expression instanceof RegExp) {
          var regexp = expression;
          var global = regexp.global;
          if (global == null) {
            global = /gi?m?$/.test(regexp);
          }
          // we have to convert global RexpExps for exec() to work consistently
          if (global) {
            regexp = new RegExp(regexp.source); // non-global
          }
        } else {
          regexp = new RegExp(escapeRegex(expression));
        }
        var match, 
            string = this, 
            result = "";
        while (string && (match = regexp.exec(string))) {
          result += string.slice(0, match.index) + replacement.apply(this, match);
          string = string.slice(match.index + match[0].length);
          if (!global) break;
        }
        return result + string;
      }
      return origReplace.apply(this, arguments);
    };
  }

  APE.lang = {
    // string extensions
    escapeHTML: escapeHTML,
    unescapeHTML: unescapeHTML,
    escapeRe: escapeRe,
    trim: trim,
    stripTags: stripTags,
    capitalize: capitalize,
    camelize: camelize,
    interpolate: interpolate
  }
  
})();