var objectDiff = typeof exports != 'undefined' ? exports : {};

/**
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */
objectDiff.diff = function diff(a, b) {

	if (a === b) {
		return {
			changed: 'equal',
			value: a
		}
	}

	var value = {};
	var equal = true;

	for (var key in a) {
		if (key in b) {
			if (a[key] === b[key]) {
				value[key] = {
					changed: 'equal',
					value: a[key]
				}
			} else {
				var typeA = typeof a[key];
				var typeB = typeof b[key];
				if (a[key] && b[key] && (typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {
					var valueDiff = diff(a[key], b[key]);
					if (valueDiff.changed == 'equal') {
						value[key] = {
							changed: 'equal',
							value: a[key]
						}
					} else {
						equal = false;
						value[key] = valueDiff;
					}
				} else {
					equal = false;
					value[key] = {
						changed: 'primitive change',
						removed: a[key],
						added: b[key]
					}
				}
			}
		} else {
			equal = false;
			value[key] = {
				changed: 'removed',
				value: a[key]
			}
		}
	}

	for (key in b) {
		if (!(key in a)) {
			equal = false;
			value[key] = {
				changed: 'added',
				value: b[key]
			}
		}
	}

	if (equal) {
		return {
			changed: 'equal',
			value: a
		}
	} else {
		return {
			changed: 'object change',
			value: value
		}
	}
};

(function() {


	/**
	 * @param {string} key
	 * @return {string}
	 */
	function stringifyObjectKey(key) {
		return /^[a-z0-9_$]*$/i.test(key) ?
			key :
			JSON.stringify(key);
	}

	/**
	 * @param {string} string
	 * @return {string}
	 */
	function escapeHTML(string) {
		return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	/**
	 * @param {Object} obj
	 * @return {string}
	 */
	function inspect(obj) {

		return _inspect('', obj);

		/**
		 * @param {string} accumulator
		 * @param {object} obj
		 * @see http://jsperf.com/continuation-passing-style/3
		 * @return {string}
		 */
		function _inspect(accumulator, obj) {
			switch(typeof obj) {
				case 'object':
					if (!obj) {
						accumulator += 'null';
						break;
					}
					var keys = Object.keys(obj);
					var length = keys.length;
					if (length === 0) {
						accumulator += '<span>{}</span>';
					} else {
						accumulator += '<span>{</span>\n<div class="diff-level">';
						for (var i = 0; i < length; i++) {
							var key = keys[i];
							accumulator = _inspect(accumulator + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>', obj[key]);
							if (i < length - 1) {
								accumulator += '<span>,</span>\n';
							}
						}
						accumulator += '\n</div><span>}</span>'
					}
					break;

				case 'string':
					accumulator += JSON.stringify(escapeHTML(obj));
					break;

				case 'undefined':
					accumulator += 'undefined';
					break;

				default:
					accumulator += escapeHTML(String(obj));
					break;
			}
			return accumulator;
		}
	}
})();
