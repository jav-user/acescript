function loadImgComponent() {
	if (!TableData.description) return false;
	// console.log(TableData.description);
	TableData.description.$.find("img").remove();
	TableData.description.$.append(`
		<div id="app-images">
			<vimages></vimages>
		</div>`);
}
loadImgComponent();

Vue.component("vimages", {
	template: `
	<span>
		<span v-for="(image, id) in images">
			<input 
				v-model="plugin" 
				@keyup="poster(id)" 
				v-bind:class="this.success ? 'input-success' : 'input-error'"/>
				<br/>
			<input v-model="image.src"/><br/>
			<a :href="image.href" target="_blank">
				<img 
					:src="image.src" 
					v-bind:class="this.success ? 'thumbnail' : 'poster'"
					/>
			</a>
		</span>
	</span>`,
	data: function () {
		return {
			images: Torrent.images,
			def_images: new nobj(Torrent.images).clone().exec(),
			plugin: "src",
		};
	},
	methods: {
		poster(id) {
			var image = this.images[id];
			var src = image.src;
			try {
				src = eval(this.plugin);
				this.success = image.src != src;
				image.src = src;
				image.href = src;
			} catch (err) {
				console.log(err);
				this.success = false;
				image.src = this.def_images[id].src;
				image.href = this.def_images[id].href;
			}
		},
	},
});

const appImages = new Vue({
	el: "#app-images",
});
