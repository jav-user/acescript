class n$dom {
	constructor($el) {
		this.$el = $el;
	}
	addClass(classes, strict) {
		// data = data || {};
		if (typeof classes == "string" || Array.isArray(classes)) {
			this.$el.addClass(classes);
			return this;
		}

		if (typeof classes == "object") {
			var add = [];
			var remove = [];
			for (var k in classes) {
				if (classes[k]) {
					add.push(k);
				} else {
					remove.push(k);
				}
			}
			this.$el.addClass(add);
			if (strict) this.$el.removeClass(remove);
		}

		return this;
	}
}
