function Mock() {}
Mock.prototype = {
	size: 1,
	message: 'foo'
};

describe('toEqualProperties', function() {
	it('shows diff', function() {
		var a = new Mock;
		a.point = {
			x: 2,
			y: 3
		};

		var b = {
			message: 'foo',
			size: 1,
			point: {
				x: 2,
				y: 3
			}
		}

		expect(a).toEqualProperties(b);
	});
});
