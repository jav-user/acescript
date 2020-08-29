class n$form extends n$dom {
	constructor($el) {
		super($el);
		this.$el = $el;
	}
	data(data) {
		var vm = this;
		vm.data = data;
		vm.$el.find("input").val(function () {
			return vm.data[this.name];
		});
		return vm;
	}
	default(data) {
		var vm = this;
		vm.data = data || vm.data;

		vm.$el.find("input").each((i, input) => {
			var val = vm.data[input.name];
			var $btn = vm.$el.find(
				`button[type=button][ndefault-${input.name}]`
			);
			// console.log($btn[0], input, val, input.name);
			$btn.on("click", function () {
				$(input).val(val).trigger("change");
			});
		});
		return this;
	}

	submit(submit) {
		var vm = this;
		vm.$el.on("submit", function (e) {
			e.preventDefault();
			if (submit) submit(vm.$el);
		});
		return this;
	}
	$submit() {
		return this.$el.find("[type=submit]:focus");
	}
	getParams() {
		var vm = this;
		var params = vm.$el.serialize();
		return new URLSearchParams(params);
	}
	toggle(show) {
		var vm = this;
		vm.$el.find("[ntoggle]").toggle(show);
		console.log("$ntoggle", vm.$el.find("[ntoggle]"));
		vm.$el
			.find("button[type=button][ntoggle-btn]")
			.on("click", function () {
				console.log("toggling...");
				vm.$el.find("[ntoggle]").toggle();
			});
		return vm;
	}
	toggleNull(parentq) {
		this.$el.find("input").each((i, input) => {
			var $input = $(input);
			if (!$input.val().trim()) {
				$input.parents(parentq).attr("ntoggle", true);
			}
		});
		return this;
	}
	$elements(data) {
		var vm = this;
		for (var query in data) {
			var val = data[query];
			var $el = vm.$el.find(query);
			$el.on(val.evt, function () {
				val.f(this);
			});
		}
		return vm;
	}
	$event(query, evts, callback, data) {
		if (typeof evts == "string") evts = [evts];
		var vm = this;
		evts.forEach((evt) => {
			vm.$el.find(query).on(evt, callback);
		});
		return vm;
	}
}
