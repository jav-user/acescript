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
				v-model="plugins[image.host].fn" 
				v-bind:class="success ? 'input-success' : 'input-error'"/>
				<br/>
			<input v-model="image.src"/><br/>
			<a :href="image.href" target="_blank">
				<img 
					:src="image.src" 
					v-bind:class="success ? 'poster' : 'thumbnail'"
					/>
			</a>
		</span>
	</span>`,
	data: function () {
		return {
			images: Torrent.images,
			def_images: JSON.parse(JSON.stringify(Torrent.images)),
			plugins: {
				"imgcarry.com": {
					fn: "src",
					host: "imgcarry.com",
				},
			},
			success: false,
		};
	},
	mounted(){
		this.$watch('plugins', function(a,b,c){
			console.log(a["imgcarry.com"].fn,b["imgcarry.com"].fn,c)
		}, { deep: true })
	},
	watch: {
		// plugins: function (a, b, c) {
		// 	console.log(a, b, c);
		// },
	},
	created() {
		// var id = CryptoJS.MD5("imgcarry.com").toString();
		// console.log("id", id);
	},
	methods: {
		poster(id) {
			// console.log(id, this.def_images[id].src);
			var image = this.images[id];
			image.src = this.def_images[id].src;
			image.href = this.def_images[id].href;
			var src = image.src;
			try {
				src = eval(this.plugin);
				var Src = new URL(src);
				console.log(image.src != src);
				this.success = image.src != src;
				image.src = src;
				image.href = src;
			} catch (err) {
				console.log("Error in plugin");
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
