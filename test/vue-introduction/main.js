Vue.component("todo-item", {
	template: "<li>{{todo.text}}</li>",
	props: ["todo"],
});

var app7 = new Vue({
	el: "#app7",
	data: {
		groceryList: [
			{ id: 0, text: "Vegetables" },
			{ id: 1, text: "Cheese" },
			{ id: 2, text: "Whatever else humans are supposed to eat" },
		],
	},
});

var app6 = new Vue({
	el: "#app-6",
	data: {
		message: "Hello Vue!",
	},
});

var app5 = new Vue({
	el: "#app-5",
	data: {
		message: "Hello Vue.js!",
	},
	methods: {
		reverseMessage: function () {
			console.log(this);
			this.message = this.message.split("").reverse().join("");
		},
	},
});

var app4 = new Vue({
	el: "#app-4",
	data: {
		todos: [
			{ text: "Learn JavaScript" },
			{ text: "Learn Vue" },
			{ text: "Build something awesome" },
		],
	},
});

var app3 = new Vue({
	el: "#app-3",
	data: {
		seen: 123,
	},
});

var app2 = new Vue({
	el: "#app-2",
	data: {
		message: "You loaded this page on " + new Date().toLocaleString(),
		fn1: function () {
			console.log("clicked....", this);
		},
	},
});

var app = new Vue({
	el: "#app",
	data: {
		message: "Hola Vue!",
	},
});
