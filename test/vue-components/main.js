Vue.component("button-counter", {
	// data: {
	// 	count: 0,
	// },
	data: function () {
		return {
			count: 0,
		};
	},
	template:
		'<button v-on:click="count++">You clicked me {{ count }} times.</button>',
});

Vue.component("todo-item", {
	template: "<li>{{todo.text}}</li>",
	props: ["todo"],
});

Vue.component("grocery-list", {
	template: `<div>
					<h3>GroceryLists</h3>
					<todo-item 
						v-for="todo in groceryList" 
						v-bind:todo="todo" 
						v-bind:key="todo.id"></todo-item>
				</div>`,
	data: function () {
		return {
			groceryList: [
				{ id: 0, text: "Vegetables" },
				{ id: 1, text: "Cheese" },
				{ id: 2, text: "Whatever else humans are supposed to eat" },
			],
		};
	},
});

var app = new Vue({
	el: "#app-components",
});
