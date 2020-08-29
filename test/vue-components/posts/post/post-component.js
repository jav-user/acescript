var cardTmpl = `
	<div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">{{post.title}}</span>
          <p v-html="post.content"></p>
        </div>
        <div class="card-action">
          <a  v-on:click="$emit('enlarge-font-size')">Enlarge font size</a>
          <a  v-on:click="$emit('rest-font-size')">Rest font size</a>
          <input v-on:keyup="$emit('change-test',test)" v-model="test"></input>
        </div>
      </div>`;

Vue.component("post", {
	template: cardTmpl,
	data: function () {
		return {
			test: null,
		};
	},
	// template: `
	// 	<div class="blog-post">
	//  			<b>{{post.id}} - {{ post.title }}</b>
	//  			<div v-html="post.content" class="blog-post"></div>
	//  			<a class="waves-effect waves-light btn">button</a>
	// 	</div>`,
	props: ["post"],
});
