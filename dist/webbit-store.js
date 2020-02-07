(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux')) :
  typeof define === 'function' && define.amd ? define(['exports', 'redux'], factory) :
  (global = global || self, factory(global.WebbitStore = {}, global.Redux));
}(this, (function (exports, redux) { 'use strict';

  class SourceProvider {
    static get typeName() {
      return null;
    }

    static get settingsDefaults() {
      return {};
    }

    get settings() {
      return {};
    }

    onSettingsChange(settings) {}

    updateFromProvider() {}

    updateFromDashboard() {}

    getType(value) {
      if (typeof value === 'string') {
        return 'string';
      } else if (typeof value === 'number') {
        return 'number';
      } else if (typeof value === 'boolean') {
        return 'boolean';
      } else if (value instanceof Array) {
        return 'Array';
      } else if (value === null) {
        return 'null';
      }

      return null;
    }

  }

  var INIT_SOURCES = "INIT_SOURCES";
  var CLEAR_SOURCES = "CLEAR_SOURCES";
  var REMOVE_SOURCES = "REMOVE_SOURCES";
  var SOURCES_CHANGED = "SOURCES_CHANGED";
  function initSources(providerName) {
    return {
      type: INIT_SOURCES,
      payload: {
        providerName
      }
    };
  }
  function removeSources(providerName) {
    return {
      type: REMOVE_SOURCES,
      payload: {
        providerName
      }
    };
  }
  function sourcesChanged(providerName, sourceChanges) {
    return {
      type: SOURCES_CHANGED,
      payload: {
        providerName,
        sourceChanges
      }
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;
  /** `Object#toString` result references. */

  var symbolTag = '[object Symbol]';
  /** Used to match words composed of alphanumeric characters. */

  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
  /** Used to match Latin Unicode letters (excluding mathematical operators). */

  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
  /** Used to compose unicode character classes. */

  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
      rsComboSymbolsRange = '\\u20d0-\\u20f0',
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
  /** Used to compose unicode capture groups. */

  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';
  /** Used to compose unicode regexes. */

  var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
      rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
  /** Used to match apostrophes. */

  var reApos = RegExp(rsApos, 'g');
  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */

  var reComboMark = RegExp(rsCombo, 'g');
  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
  /** Used to match complex or compound words. */

  var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')', rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr, rsUpper + '+' + rsOptUpperContr, rsDigits, rsEmoji].join('|'), 'g');
  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */

  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
  /** Used to detect strings that need a more robust regexp to match words. */

  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
  /** Used to map Latin Unicode letters to basic Latin letters. */

  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',
    '\xc1': 'A',
    '\xc2': 'A',
    '\xc3': 'A',
    '\xc4': 'A',
    '\xc5': 'A',
    '\xe0': 'a',
    '\xe1': 'a',
    '\xe2': 'a',
    '\xe3': 'a',
    '\xe4': 'a',
    '\xe5': 'a',
    '\xc7': 'C',
    '\xe7': 'c',
    '\xd0': 'D',
    '\xf0': 'd',
    '\xc8': 'E',
    '\xc9': 'E',
    '\xca': 'E',
    '\xcb': 'E',
    '\xe8': 'e',
    '\xe9': 'e',
    '\xea': 'e',
    '\xeb': 'e',
    '\xcc': 'I',
    '\xcd': 'I',
    '\xce': 'I',
    '\xcf': 'I',
    '\xec': 'i',
    '\xed': 'i',
    '\xee': 'i',
    '\xef': 'i',
    '\xd1': 'N',
    '\xf1': 'n',
    '\xd2': 'O',
    '\xd3': 'O',
    '\xd4': 'O',
    '\xd5': 'O',
    '\xd6': 'O',
    '\xd8': 'O',
    '\xf2': 'o',
    '\xf3': 'o',
    '\xf4': 'o',
    '\xf5': 'o',
    '\xf6': 'o',
    '\xf8': 'o',
    '\xd9': 'U',
    '\xda': 'U',
    '\xdb': 'U',
    '\xdc': 'U',
    '\xf9': 'u',
    '\xfa': 'u',
    '\xfb': 'u',
    '\xfc': 'u',
    '\xdd': 'Y',
    '\xfd': 'y',
    '\xff': 'y',
    '\xc6': 'Ae',
    '\xe6': 'ae',
    '\xde': 'Th',
    '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',
    '\u0102': 'A',
    '\u0104': 'A',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u0105': 'a',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010a': 'C',
    '\u010c': 'C',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010b': 'c',
    '\u010d': 'c',
    '\u010e': 'D',
    '\u0110': 'D',
    '\u010f': 'd',
    '\u0111': 'd',
    '\u0112': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u0118': 'E',
    '\u011a': 'E',
    '\u0113': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u0119': 'e',
    '\u011b': 'e',
    '\u011c': 'G',
    '\u011e': 'G',
    '\u0120': 'G',
    '\u0122': 'G',
    '\u011d': 'g',
    '\u011f': 'g',
    '\u0121': 'g',
    '\u0123': 'g',
    '\u0124': 'H',
    '\u0126': 'H',
    '\u0125': 'h',
    '\u0127': 'h',
    '\u0128': 'I',
    '\u012a': 'I',
    '\u012c': 'I',
    '\u012e': 'I',
    '\u0130': 'I',
    '\u0129': 'i',
    '\u012b': 'i',
    '\u012d': 'i',
    '\u012f': 'i',
    '\u0131': 'i',
    '\u0134': 'J',
    '\u0135': 'j',
    '\u0136': 'K',
    '\u0137': 'k',
    '\u0138': 'k',
    '\u0139': 'L',
    '\u013b': 'L',
    '\u013d': 'L',
    '\u013f': 'L',
    '\u0141': 'L',
    '\u013a': 'l',
    '\u013c': 'l',
    '\u013e': 'l',
    '\u0140': 'l',
    '\u0142': 'l',
    '\u0143': 'N',
    '\u0145': 'N',
    '\u0147': 'N',
    '\u014a': 'N',
    '\u0144': 'n',
    '\u0146': 'n',
    '\u0148': 'n',
    '\u014b': 'n',
    '\u014c': 'O',
    '\u014e': 'O',
    '\u0150': 'O',
    '\u014d': 'o',
    '\u014f': 'o',
    '\u0151': 'o',
    '\u0154': 'R',
    '\u0156': 'R',
    '\u0158': 'R',
    '\u0155': 'r',
    '\u0157': 'r',
    '\u0159': 'r',
    '\u015a': 'S',
    '\u015c': 'S',
    '\u015e': 'S',
    '\u0160': 'S',
    '\u015b': 's',
    '\u015d': 's',
    '\u015f': 's',
    '\u0161': 's',
    '\u0162': 'T',
    '\u0164': 'T',
    '\u0166': 'T',
    '\u0163': 't',
    '\u0165': 't',
    '\u0167': 't',
    '\u0168': 'U',
    '\u016a': 'U',
    '\u016c': 'U',
    '\u016e': 'U',
    '\u0170': 'U',
    '\u0172': 'U',
    '\u0169': 'u',
    '\u016b': 'u',
    '\u016d': 'u',
    '\u016f': 'u',
    '\u0171': 'u',
    '\u0173': 'u',
    '\u0174': 'W',
    '\u0175': 'w',
    '\u0176': 'Y',
    '\u0177': 'y',
    '\u0178': 'Y',
    '\u0179': 'Z',
    '\u017b': 'Z',
    '\u017d': 'Z',
    '\u017a': 'z',
    '\u017c': 'z',
    '\u017e': 'z',
    '\u0132': 'IJ',
    '\u0133': 'ij',
    '\u0152': 'Oe',
    '\u0153': 'oe',
    '\u0149': "'n",
    '\u017f': 'ss'
  };
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
  /** Detect free variable `self`. */

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */

  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array ? array.length : 0;

    if (initAccum && length) {
      accumulator = array[++index];
    }

    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }

    return accumulator;
  }
  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function asciiToArray(string) {
    return string.split('');
  }
  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */


  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }
  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */


  function basePropertyOf(object) {
    return function (key) {
      return object == null ? undefined : object[key];
    };
  }
  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */


  var deburrLetter = basePropertyOf(deburredLetters);
  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */

  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }
  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */


  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }
  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
  }
  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }
  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */


  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }
  /** Used for built-in method references. */


  var objectProto = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
  /** Built-in value references. */

  var Symbol = root.Symbol;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */

  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }

    end = end > length ? length : end;

    if (end < 0) {
      end += length;
    }

    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);

    while (++index < length) {
      result[index] = array[index + start];
    }

    return result;
  }
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */


  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  /**
   * Casts `array` to a slice if it's needed.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {number} start The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the cast slice.
   */


  function castSlice(array, start, end) {
    var length = array.length;
    end = end === undefined ? length : end;
    return !start && end >= length ? array : baseSlice(array, start, end);
  }
  /**
   * Creates a function like `_.lowerFirst`.
   *
   * @private
   * @param {string} methodName The name of the `String` case method to use.
   * @returns {Function} Returns the new case function.
   */


  function createCaseFirst(methodName) {
    return function (string) {
      string = toString(string);
      var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
      var chr = strSymbols ? strSymbols[0] : string.charAt(0);
      var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);
      return chr[methodName]() + trailing;
    };
  }
  /**
   * Creates a function like `_.camelCase`.
   *
   * @private
   * @param {Function} callback The function to combine each word.
   * @returns {Function} Returns the new compounder function.
   */


  function createCompounder(callback) {
    return function (string) {
      return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
    };
  }
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */


  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */


  function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */


  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  /**
   * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to convert.
   * @returns {string} Returns the camel cased string.
   * @example
   *
   * _.camelCase('Foo Bar');
   * // => 'fooBar'
   *
   * _.camelCase('--foo-bar--');
   * // => 'fooBar'
   *
   * _.camelCase('__FOO_BAR__');
   * // => 'fooBar'
   */


  var camelCase = createCompounder(function (result, word, index) {
    word = word.toLowerCase();
    return result + (index ? capitalize(word) : word);
  });
  /**
   * Converts the first character of `string` to upper case and the remaining
   * to lower case.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to capitalize.
   * @returns {string} Returns the capitalized string.
   * @example
   *
   * _.capitalize('FRED');
   * // => 'Fred'
   */

  function capitalize(string) {
    return upperFirst(toString(string).toLowerCase());
  }
  /**
   * Deburrs `string` by converting
   * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
   * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
   * letters to basic Latin letters and removing
   * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to deburr.
   * @returns {string} Returns the deburred string.
   * @example
   *
   * _.deburr('déjà vu');
   * // => 'deja vu'
   */


  function deburr(string) {
    string = toString(string);
    return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
  }
  /**
   * Converts the first character of `string` to upper case.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category String
   * @param {string} [string=''] The string to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.upperFirst('fred');
   * // => 'Fred'
   *
   * _.upperFirst('FRED');
   * // => 'FRED'
   */


  var upperFirst = createCaseFirst('toUpperCase');
  /**
   * Splits `string` into an array of its words.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to inspect.
   * @param {RegExp|string} [pattern] The pattern to match words.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {Array} Returns the words of `string`.
   * @example
   *
   * _.words('fred, barney, & pebbles');
   * // => ['fred', 'barney', 'pebbles']
   *
   * _.words('fred, barney, & pebbles', /[^, ]+/g);
   * // => ['fred', 'barney', '&', 'pebbles']
   */

  function words(string, pattern, guard) {
    string = toString(string);
    pattern = guard ? undefined : pattern;

    if (pattern === undefined) {
      return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
    }

    return string.match(pattern) || [];
  }

  var normalizeKey = key => {
    return key.split('/').map(keyPart => camelCase(keyPart)).join('/');
  };

  var initialState = {
    sources: {}
  };

  var rootReducer = function rootReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case INIT_SOURCES:
        var newSources = _objectSpread2({}, state.sources[action.payload.providerName]);

        if (Object.keys(newSources).length === 0) {
          newSources = {
            __normalizedKey__: undefined,
            __fromProvider__: false,
            __key__: undefined,
            __value__: undefined,
            __sources__: {}
          };
        }

        return _objectSpread2({}, state, {
          sources: _objectSpread2({}, state.sources, {
            [action.payload.providerName]: newSources
          })
        });

      case SOURCES_CHANGED:
        var {
          sourceChanges,
          providerName
        } = action.payload;

        var sourcesRoot = _objectSpread2({}, state.sources[providerName]);

        if (Object.keys(sourcesRoot).length === 0) {
          sourcesRoot = {
            __normalizedKey__: undefined,
            __fromProvider__: false,
            __key__: undefined,
            __value__: undefined,
            __sources__: {}
          };
        }

        var _loop = function _loop(key) {
          var value = sourceChanges[key];
          var keyParts = key.split('/');
          var normalizedKey = normalizeKey(key);
          var normalizedKeyParts = normalizedKey.split('/');
          var sources = sourcesRoot.__sources__;
          normalizedKeyParts.forEach((keyPart, index) => {
            var inSources = keyPart in sources;

            if (!inSources) {
              sources[keyPart] = {
                __fromProvider__: false,
                __normalizedKey__: normalizedKeyParts.slice(0, index + 1).join('/'),
                __key__: keyParts.slice(0, index + 1).join('/'),
                __value__: undefined,
                __sources__: {}
              };
            }

            if (normalizedKeyParts.length - 1 === index) {
              sources[keyPart].__fromProvider__ = true;

              if (typeof value !== 'undefined') {
                sources[keyPart].__value__ = value;
              }
            } else {
              sources = sources[keyPart].__sources__;
            }
          });
        };

        for (var key in sourceChanges) {
          _loop(key);
        }

        return _objectSpread2({}, state, {
          sources: _objectSpread2({}, state.sources, {
            [providerName]: sourcesRoot
          })
        });

      case CLEAR_SOURCES:
        var shouldClear = action.payload.providerName in state.sources;

        if (!shouldClear) {
          return state;
        }

        return _objectSpread2({}, state, {
          sources: _objectSpread2({}, state.sources, {
            [action.payload.providerName]: {
              __fromProvider__: false,
              __normalizedKey__: undefined,
              __key__: undefined,
              __value__: undefined,
              __sources__: {}
            }
          })
        });

      case REMOVE_SOURCES:
        var allSources = _objectSpread2({}, state.sources);

        delete allSources[action.payload.providerName];
        return _objectSpread2({}, state, {
          sources: allSources
        });

      default:
        return state;
    }
  };

  var reduxStore = redux.createStore(rootReducer);

  class SourceManager {
    constructor(provider, providerName) {
      this.providerName = providerName;
      this.provider = provider;
      this.sourceUpdates = {};
      this.provider.updateFromProvider(this._updateSource.bind(this));
      this.interval = setInterval(this._sendUpdates.bind(this), 100);
    }

    _disconnect() {
      clearTimeout(this.interval);
    }

    _updateSource(key, value) {
      if (this.sourceUpdates[key] === undefined) {
        this.sourceUpdates[key] = {
          first: value
        };
      } else {
        this.sourceUpdates[key].last = value;
      }
    }

    subscribe(key, callback, callImmediately) {
      var unsubscribe = reduxStore.subscribe(() => {
        callback(this.getSource(key));
      });

      if (callImmediately) {
        callback(this.getSource(key));
      }

      return unsubscribe;
    }

    getSource(key) {
      var _this = this;

      key = key || '';
      var source = this.getRawSource(key);

      if (!source) {
        return undefined;
      }

      var rawValue = source.__value__;
      var sources = source.__sources__;
      var sourceProvider = this.provider;

      if (Object.keys(sources).length > 0) {
        var value = {};

        var _loop = function _loop(propertyName) {
          var source = sources[propertyName];

          var sourceValue = _this.getSource(source.__key__);

          Object.defineProperty(value, propertyName, {
            get() {
              return sourceValue;
            },

            set(value) {
              var sourceKey = source.__key__;

              if (typeof sourceKey === 'string' && sourceProvider) {
                sourceProvider.updateFromDashboard(sourceKey, value);
              }
            }

          });
        };

        for (var propertyName in sources) {
          _loop(propertyName);
        }

        return value;
      }

      if (typeof rawValue === 'boolean') {
        return rawValue;
      } else if (typeof rawValue === 'number') {
        return rawValue;
      } else if (typeof rawValue === 'string') {
        return rawValue;
      } else if (rawValue instanceof Array) {
        return [...rawValue];
      }

      return {};
    }

    getRawSource(key) {
      key = key || '';
      var sourcesRoot = reduxStore.getState().sources[this.providerName];

      if (typeof sourcesRoot === 'undefined') {
        return null;
      }

      var keyParts = normalizeKey(key).split('/');
      var sources = sourcesRoot.__sources__;

      for (var index in keyParts) {
        var keyPart = keyParts[index];

        if (keyParts.length - 1 === parseInt(index)) {
          return keyPart in sources ? sources[keyPart] : null;
        }

        if (keyPart in sources) {
          sources = sources[keyPart].__sources__;
        } else {
          return null;
        }
      }

      return null;
    }

    _sendUpdates() {
      if (Object.keys(this.sourceUpdates).length === 0) {
        return;
      } // send first updates then last


      var firstUpdates = {};
      var lastUpdates = {};

      for (var key in this.sourceUpdates) {
        var values = this.sourceUpdates[key];
        firstUpdates[key] = values.first;
        if ('last' in values) lastUpdates[key] = values.last;
      }

      reduxStore.dispatch(sourcesChanged(this.providerName, firstUpdates));

      if (Object.keys(lastUpdates).length > 0) {
        setTimeout(() => {
          reduxStore.dispatch(sourcesChanged(this.providerName, lastUpdates));
        });
      }

      this.sourceUpdates = {};
    }

  }

  var managers = {};
  var providerTypes = {};
  var providers = {};
  var sourceProviderListeners = [];
  var hasSourceManager = providerName => {
    return providerName in managers;
  };
  var getSourceManager = providerName => {
    return managers[providerName];
  };

  var addSourceManager = (providerType, providerName) => {
    providerName = providerName || providerType;

    if (hasSourceManager(providerName) || !hasSourceProvider(providerName) || !hasSourceProviderType(providerType)) {
      return;
    }

    managers[providerName] = new SourceManager(getSourceProvider(providerName), providerName);
    reduxStore.dispatch(initSources(providerName));
  };

  var removeSourceManager = providerName => {
    if (!hasSourceManager(providerName)) {
      return;
    }

    var manager = getSourceManager(providerName);

    manager._disconnect();

    reduxStore.dispatch(removeSources(providerName));
    delete managers[providerName];
  };

  var addSourceProviderType = constructor => {
    var {
      typeName
    } = constructor;

    if (hasSourceProviderType(typeName)) {
      return;
    }

    if (Object.getPrototypeOf(constructor).name === 'SourceProvider') {
      providerTypes[typeName] = constructor;
    }
  };
  var hasSourceProviderType = typeName => {
    return typeName in providerTypes;
  };
  var addSourceProvider = (providerType, providerName, settings) => {
    settings = settings || {};

    if (typeof providerName !== 'string') {
      providerName = providerType;
    }

    if (!hasSourceProviderType(providerType) || hasSourceProvider(providerName)) {
      return null;
    }

    var SourceProvider = providerTypes[providerType];
    providers[providerName] = new SourceProvider(_objectSpread2({}, SourceProvider.settingsDefaults, {}, settings));
    addSourceManager(providerType, providerName);
    sourceProviderListeners.forEach(listener => {
      listener(providerName);
    });
    return providers[providerName];
  };
  var sourceProviderAdded = listener => {
    if (typeof listener !== 'function') {
      return;
    }

    sourceProviderListeners.push(listener);
  };
  var removeSourceProvider = providerName => {
    if (!hasSourceProvider(providerType)) {
      return;
    }

    delete providers[providerName];
    removeSourceManager(providerName);
  };
  var getSourceProvider = providerName => {
    return providers[providerName];
  };
  var getSourceProviderTypeNames = () => {
    return Object.keys(providerTypes);
  };
  var getSourceProviderNames = () => {
    return Object.keys(providers);
  };
  var hasSourceProvider = providerName => {
    return providerName in providers;
  };
  var getState = () => {
    return reduxStore.getState();
  };

  var SourceProvider$1 = SourceProvider;
  var SourceManager$1 = SourceManager;

  exports.SourceManager = SourceManager$1;
  exports.SourceProvider = SourceProvider$1;
  exports.addSourceProvider = addSourceProvider;
  exports.addSourceProviderType = addSourceProviderType;
  exports.getSourceManager = getSourceManager;
  exports.getSourceProvider = getSourceProvider;
  exports.getSourceProviderNames = getSourceProviderNames;
  exports.getSourceProviderTypeNames = getSourceProviderTypeNames;
  exports.getState = getState;
  exports.hasSourceManager = hasSourceManager;
  exports.hasSourceProvider = hasSourceProvider;
  exports.hasSourceProviderType = hasSourceProviderType;
  exports.removeSourceProvider = removeSourceProvider;
  exports.sourceProviderAdded = sourceProviderAdded;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
