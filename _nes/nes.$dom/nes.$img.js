class n$img {
	constructor($img) {
		this.$img = $img;
		// this.opt = options;
	}
	watchLoad(opt) {
		var vm = this;
		// let $imgs = vm.$el.find(`img[${opt.attr || "src"}]`);
		let img404 = opt.img404 || "https://i.imgur.com/YHggeAI.png";
		let onLoad = opt.onLoad;
		let onError = opt.onError;
		let load = opt.load || "nload";
		let error = opt.error || "nerror";
		vm.$img
			.on("error", function () {
				$(this).attr("src", img404);
				$(this).attr(error, true).removeAttr(load);
				if (onError) onError(this);
			})
			.on("load", function () {
				var url = $(this).attr("src");

				// console.log()
				if (url != img404) {
					$(this).attr(load, true).removeAttr(error);
					if (onLoad) onLoad(this);
				}
				// else {
				// 	$(this).attr(error, true).removeAttr(load);
				// 	if (onError) onError(this);
				// }
			});
		return vm;
	}
	error() {
		return "https://i.imgur.com/YHggeAI.png";
	}
	exec() {
		return this.$img;
	}
}
