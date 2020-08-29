class n$input {
	constructor($input) {
		this.$input = $input; 
	}

	autoSize() {
		this.$input.each((i, input) => {
			var size = $(input).attr("size");
			$(input).attr("nsize", size || "");
		});
		this.$input.on("keyup", function () {
			var size = $(this).val().trim().length;
			$(this).attr("size", size);
		});
		this.$input.on("focus", function () {
			$(this).trigger("keyup");
		});

		this.$input.on("blur", function () {
			var nsize = $(this).attr("nsize");
			$(this).attr("size", nsize);
		});

		return this;
	}

	exec() {
		return this.$input;
	}
}
