Vue.component("vimages", {
	template: `<span>
					<span v-if="!isEmpty(plugins)">
						<h3>images</h3>
						<vimage
							v-for="(image, id) in images" 
							v-if="image"
							:key="id"
							:image="image"
							:imageDef:"imageDef"
							:plugins="plugins"
							:pluginsDef="pluginsDef"
							@pluginChanged="onPluginChanged"></vimage>
					</span>
					<span v-else>
						Loading...
					</span>
				</span>`,
	data: function () {
		return {
			images: Torrent.images,
			imagesDef: new nobj(Torrent.images).clone().exec(),
			plugins: {},
			pluginsDef: {},
			// success: false,
		};
	},
	methods: {
		onPluginChanged(pid, plugin) {
			this.plugins[pid] = plugin;
		},
		isEmpty(obj) {
			return Object.keys(obj).length == 0;
		},
		loadPlugins: function () {
			this.plugins = {};
			PluginList.get().then((qs) => {
				qs.forEach((doc) => (this.plugins[doc.id] = doc.data()));
				this.pluginsDef = _(this.plugins).clone();
			});
		},
	},
});
