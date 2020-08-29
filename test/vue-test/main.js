$(document).ready(function() {
	$("#jq").after($(`<div id="main-app">{{title}}<vform></vform></div>`));
	loadVue();
});

Vue.component("vform",{
	template:`<input :size="text.length" v-model="text"/>`,
	data:function(){
		return {
			size:"10",
			text: "Testing..."
		}
	}	
})

function loadVue() {
	const app = new Vue({
		el: "#main-app",
		data: { title: "TITLE" },
	});
}
