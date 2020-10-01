Vue.component("vimage", {
	template: `
			<span>
				<input 
					:title="pid"
					v-model="plugin.fn"
					v-bind:class="success ? 'input-success' : 'input-error'"
					:size="plugin.fn.length"/>
				<button 
					@click="savePlugin"
					class="bttn-unite bttn-md bttn-primary">
					<i class="fa fa-save"></i>
				</button>
				<br/>
				<button 
					@click="changeFnLeft" 
					class="bttn-pill bttn-md bttn-info">
						<i class="fa fa-caret-left"></i>
				</button>
				<button 
					@click="changeFnRight"
					class="bttn-pill bttn-md bttn-info">
						<i class="fa fa-caret-right"></i>
				</button>
				<br/>
				<input v-model="image.src" :size="image.src.length"/>
				<br/>
				<a :href="image.href" target="_blank">
				<img
					:src="image.src"
					@error="success=false"
					v-bind:class="success ? 'poster' : 'thumbnail'"/>
				</a>
				<br/>
			</span>`,
	props: ["image", "imageDef", "plugins"],
	computed: {
		plugin: function () {
			this.plugins[this.image.hostID] || { fn: ".src", fns: [] };
		},
		pid: function () {
			this.image.hostID;
		},
	},
	watch: {
		"plugin.fn": function () {
			poster();
			this.$emit("pluginChanged", this.pid, this.plugin);
		},
	},
	data: function () {
		return { plugin: { fn: "src." }, success: false };
	},
	methods: {
		poster: function () {
			try {
				var src = this.imageDef.src;
				src = eval(this.plugin.fn);
				new URL(src); // error if it's not an url
				this.success = image.src != src;
				this.image.src = src;
				this.image.href = src;
				this.image.poster = src;
			} catch (err) {
				console.log("Error in plugin", err);
				this.success = false;
				this.image.src = this.imageDef.src;
				this.image.href = this.imageDef.href;
			}
		},
		savePlugin: function () {
			this.plugin.fns = _([this.plugin.fn])
				.concat(this.plugin.fns)
				.uniq()
				.without("src.")
				.value();

			PluginList.doc(this.pid).set(plugin);
		},
	},
});
