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

const plugins = {
	aeb9208a35f74624279ed80ef78782c6: {
		fn: "src..",
		fns: ["src..", "src..."],
		host: "www.imgcarry.com",
	},
	noloc: {
		fn: "rick",
		fns: ["rick", "rick..."],
	},
	parec: {
		fn: "falso",
		fns: ["falso", "falso..."],
	},
};

Vue.component("vimages", {
	template: `
	<span>
		<span v-for="(image, id) in images">
			<button @click="changeFnLeft(image.hostID)" >
					<i class="fa fa-caret-left"></i>
			</button>
			<button @click="changeFnRight(image.hostID)" >
					<i class="fa fa-caret-right"></i>
			</button>
			<input
				:title="image.host"
				v-model="plugins[image.hostID].fn" 
				v-bind:class="success ? 'input-success' : 'input-error'"/>
				<br/>
			<input v-model="image.src"/>
				<br/>
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
			plugins: plugins,
			pluginsDef: JSON.parse(JSON.stringify(plugins)),
			success: false,
			counters: {},
		};
	},
	mounted() {
		console.log(this.pluginsFn);
	},
	watch: {
		// plugins: function (a, b, c) {
		// 	console.log(a, b, c);
		// },
	},
	created() {
		for (var id in this.images) {
			var image = this.images[id];
			if (!this.plugins[image.hostID]) {
				this.plugins[image.hostID] = {
					host: image.host,
					fn: "src.",
					fns: [],
				};
			}
		}

		var pluginsFn = new narray([]);
		for (var id in this.plugins) {
			console.log(id);
			var plugin = this.plugins[id];
			pluginsFn.push(plugin.fn);
			this.$watch(`$data.plugins.${id}.fn`, function (n, o) {
				console.log(this.plugins[id]);
			});

			this.counters[id] = 0;
		}

		this.pluginsFn = pluginsFn.unique().exec();
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
		changeFnRight(id) {
			var pluginsFn = new narray([])
				.push(this.plugins[id].fns)
				.push(this.pluginsFn)
				.push([this.plugins[id].fn])
				.unique()
				.exec();

			var max = pluginsFn.length;
			this.counters[id]++;
			if (this.counters[id] == max) this.counters[id] = 0;

			this.plugins[id].fn = pluginsFn[this.counters[id]];
		},
		changeFnLeft(id) {
			var pluginsFn = new narray([])
				.push(this.plugins[id].fns)
				.push(this.pluginsFn)
				.push([this.plugins[id].fn])
				.unique()
				.exec();

			var max = pluginsFn.length;
			this.counters[id]--;
			if (this.counters[id] == -1) this.counters[id] = max;

			this.plugins[id].fn = pluginsFn[this.counters[id]];
		},
	},
});

const appImages = new Vue({
	el: "#app-images",
});
