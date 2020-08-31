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



async function loadPlugins() {
	const ids = [];

	for (var id in Torrent.images) {
		var img = Torrent.images[id];
		ids.push(img.hostID);
	}
	// console.log(ids)
	const refs = ids.map((id) => PluginsList.doc(id).get());
	return Promise.all(refs).then((q) => {
		const plugins = {};
		q.forEach((doc) => {
			if (doc.exists) plugins[doc.id] = doc.data();
		});
		return plugins;
	});
}



async function savePlugin(id, plugin) {
	new narray(plugin.fns).push(plugin.fn).unique()
	PluginsList.doc(id).set(plugin);
}

Vue.component("vimages", function (solve, reject) {
	loadPlugins().then((plugins) => {
		solve({
			template: `
	<span>
		<span v-for="(image, id) in images">
			<input
				:title="image.host"
				v-model="plugins[image.hostID].fn"
				v-bind:class="success ? 'input-success' : 'input-error'"
				:size="plugins[image.hostID].fn.length"/>
				<button @click="savePlugin(image.hostID)">save</button>
				<br/>
			<button @click="changeFnLeft(image.hostID)" >
					<i class="fa fa-caret-left"></i>
			</button>
			<button @click="changeFnRight(image.hostID)" >
					<i class="fa fa-caret-right"></i>
			</button><br/>
			<input v-model="image.src" :size="image.src.length"/>
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
					imagesDef: JSON.parse(JSON.stringify(Torrent.images)),
					plugins: plugins || {},
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
				// console.log(this.plugins);
				for (var iid in this.images) {
					var image = this.images[iid];
					var pid = image.hostID
					if (!this.plugins[pid]) {
						var plugin = {
							host: image.host,
							fn: "src.",
							fns: [],
						};
					}

					this.onPlugin(pid);
					this.$set(this.plugins, pid, plugin);
				}

				var pluginsFn = new narray([]);
				console.log(this.plugins);
				for (var id in this.plugins) {
					console.log(id);
					var plugin = this.plugins[id];
					pluginsFn.push(plugin.fn);
					this.$watch(
						`$data.plugins.${id}.fn`,
						function (n, o) {
							console.log(id, "test...");
							this.onPlugin(id);
						},
						{ deep: true }
					);
					console.log(this.$watch);

					this.counters[id] = 0;
				}

				this.pluginsFn = pluginsFn.unique().exec();
			},
			methods: {
				savePlugin(id) {
					savePlugin(id, this.plugins[id]);
				},
				onPlugin(id) {
					console.log("onPlugin...",id)
					var host = this.plugins[id].host;
					var fn = this.plugins[id].fn;
					console.log(id, host, fn);

					for (var id in this.images) {
						var img = this.images[id];
						if (img.host == host) {
							this.poster2(id, fn);
						}
					}
				},
				poster2(id, fn) {
					console.log(id, fn);
					var image = this.images[id];
					var imageDef = this.imagesDef[id];

					image.src = imageDef.src;
					image.href = imageDef.href;
					var src = image.src;
					try {
						src = eval(fn);
						var Src = new URL(src);
						this.success = image.src != src;
						image.src = src;
						image.href = src;
					} catch (err) {
						console.log("Error in plugin");
						this.success = false;
						image.src = imageDef.src;
						image.href = imageDef.href;
					}
				},
				poster(id) {
					// console.log(id, this.imagesDef[id].src);
					var image = this.images[id];
					image.src = this.imagesDef[id].src;
					image.href = this.imagesDef[id].href;
					var src = image.src;
					try {
						src = eval(this.plugins[image.hostID].fn);
						var Src = new URL(src);
						console.log(image.src != src);
						this.success = image.src != src;
						image.src = src;
						image.href = src;
					} catch (err) {
						console.log("Error in plugin");
						this.success = false;
						image.src = this.imagesDef[id].src;
						image.href = this.imagesDef[id].href;
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
	});
});

const appImages = new Vue({
	el: "#app-images",
});
