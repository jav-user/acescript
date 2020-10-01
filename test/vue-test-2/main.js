// $(document).ready(function() {
// 	$("#jq").after($(`<div id="main-app">{{title}}<vform></vform></div>`));
// 	loadVue();
// });

Vue.component("vform", {
	template: `<input :size="text.length" v-model="text"/>`,
	data: function () {
		return {
			size: "10",
			text: "Testing...",
		};
	},
});

document.querySelectorAll(".main-app").forEach((el) => {
	new Vue({
		el: el,
		data: { title: "TITLE" },
	});
});

// }
