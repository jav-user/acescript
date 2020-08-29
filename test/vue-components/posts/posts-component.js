Vue.component("posts", {
	template: `
		<div>
			<h3>Posts</h3>
			<h4>{{test}}</h4>
			<div class="row">
				<div class="col s12 m6" :style="{ fontSize: postFontSize + 'em' }">
					<post class="collection-item" 
						v-for="post in posts" 
						v-bind:post="post" 
						v-bind:key="post.id"
						v-on:enlarge-font-size="postFontSize+=0.1"
						v-on:rest-font-size="postFontSize-=$event"
						v-on:change-test="test=$event"
						></post>
				</div>
			</div>
		</div>`,
	data: function () {
		return {
			test:"Test Event",
			postFontSize: 1,
			posts: [
				{
					id: 1,
					title: "My journey with Vue",
					content: "Lorem <b>Ipsum</b>",
				},
				{ id: 2, title: "Blogging with Vue", content: "Lorem 2" },
				{ id: 3, title: "Why Vue is so fun" },
				{
					id: 4,
					title: "Card Title",
					content: `I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.`,
				},
			],
		};
	},
});
