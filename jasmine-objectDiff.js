objectDiff.jasmine = {

	toEqualProperties: function(expected) {
		var diff = objectDiff.diff(expected, this.actual);
		this.message = function() {
			return JSON.stringify(diff);
		};
		return diff.changed === 'equal';
	}
};
