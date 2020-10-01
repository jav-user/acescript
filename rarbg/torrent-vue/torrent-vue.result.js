                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Vue.component("vform", {
  template: `<form @submit.prevent="submit">
    <table class="lista" >
      <tbody>
          <tr>
            <td class="header2">Actions: </td>
            <td>
                <button type="button" @click="toggle=!toggle">
                  <i class="fa fa-eye" v-show="!toggle"></i>
                  <i class="fa fa-eye-slash" v-show="toggle"></i>
                </button>
                <button type="submit"><i class="fa fa-save"></i></button>
            </td>
          </tr>
          <tr v-show="toggle">
              <td class="header2">title: </td>
              <td class="lista"><input v-model="torrent.title"  /></td>
              <td class="lista"><button  type="button" @click="ndefault('title')" title="default"><i class="fa fa-undo"></i></button></td>
          </tr>
          <tr v-if="torrent.magnet" :title="torrent.magnet.url">
              <td class="header2">magnet: </td>
              <td class="lista">
                 <span>
                   <b>name:</b><br/>
                   <input type="text" v-model="torrent.magnet.name"/>
                   <button  
                     type="button" 
                     @click="torrent.magnet.name = def.magnet.name" title="default">
                       <i class="fa fa-undo"></i>
                   </button>
                   <br/>
                 </span>
                 <span v-show="toggle">
                   <b>hash:</b><br/>
                   <input readonly type="text" v-model="torrent.magnet.hash"/><br/>
                 </span>
                 <span v-show="toggle">
                   <b>trackers:</b>
                   <button  
                       type="button" 
                       @click="torrent.magnet.trackers = def.magnet.trackers" title="default">
                         <i class="fa fa-undo"></i>
                   </button>
                   <button 
                       type="button" 
                       @click="torrent.magnet.trackers.push('')">
                        <i class="fa fa-plus"></i>
                   </button>

                   <br/>
                   <span v-for="(tr,index) in torrent.magnet.trackers">
                     <input type="text" v-model="torrent.magnet.trackers[index]" :size="torrent.magnet.trackers[index].length"/>
                     <button  
                       type="button" 
                       @click="torrent.magnet.trackers.splice(index,1)" title="default">
                          <i class="fa fa-minus"></i>
                     </button>
                     <br/>
                   </span>
                 </span>
                 <span v-show="false">
                   <b>url:</b><br/>
                   <input type="text" v-model="torrent.magnet.url"/><br/>
                 </span>
              </td>
          </tr>
          <tr v-show="toggle">
              <td class="header2">poster: </td>
              <td class="lista"><input v-model="torrent.poster"  /></td>
              <td class="lista"><button  type="button"  @click="ndefault('poster')" title="default"><i class="fa fa-undo"></i></button></td>          
      </tr>
      <tr v-show="toggle && torrent.images">
          <td class="header2">images:</td>
          <td class="lista">
            <span v-for="(image, id) in torrent.images">
            <input :id="id" :value="image.src"/><br/>
          </span>  
          </td>
      </tr>
          <tr v-show="toggle || torrent.studio">
              <td class="header2">studio: </td>
              <td class="lista"><input v-model="torrent.studio" /></td>
              <td class="lista"><button  type="button" @click="ndefault('studio')" title="default"><i class="fa fa-undo"></i></button></td>
          </tr>
          <tr v-show="toggle || torrent.stars">
              <td class="header2">stars: </td>
              <td class="lista"><input v-model="torrent.stars" /></td>
              <td class="lista"><button  type="button" @click="ndefault('stars')" title="default"><i class="fa fa-undo"></i></button></td>
          </tr>
          <tr>
              <td class="header2">category: </td>
              <td class="lista"><input  v-model="torrent.categoryName" /></td>
              <td class="lista"><button  type="button"  @click="ndefault('categoryName')" title="default"><i class="fa fa-undo"></i></button></td>
          </tr>

      </tbody>
    </table>
    </form>`,
  data: function () {
    return {
      torrent: Torrent,
      def: JSON.parse(JSON.stringify(Torrent)),
      toggle: false,
    };
  },
  created: function () {
    var def = {
      categoryName: this.torrent.category.name,
      // magnetHref: this.torrent.magnet.href,
    };

    $.extend(this.torrent, def);
    $.extend(this.def, def);
  },
  // filters: {
  //   magnet: function (magnet) {
  //     var Url = new URL(magnet)
  //     var params =
  //     // value = value.toString();
  //     // return value.charAt(0).toUpperCase() + value.slice(1);
  //   },
  // },
  watch: {
    "torrent.poster": function (n, o) {
      this.updatePoster();
    },
    "torrent.magnet.name": function (n, o) {
      this.torrent.magnet.params.set("dn", n);
      console.log("dn", o, n);
      this.updateMagnet();
    },
    "torrent.magnet.trackers": function (n, o) {
      this.torrent.magnet.params.delete("tr");
      n.forEach((tr) => {
        this.torrent.magnet.params.append("tr", tr);
      });
      // console.log("trs", this.torrent.magnet.params.getAll("tr"));
      console.log("tr", o, n);
      // autoSize();
      this.updateMagnet();
    },
  },
  methods: {
    updateMagnet() {
      this.torrent.magnet.url =
        "magnet:?" + this.torrent.magnet.params.toString();
    },
    updatePoster() {
      new n$img(
        TableData.poster.$.find("img").prop("src", this.torrent.poster)
      ).watchLoad({});
    },

    ndefault(val) {
      this.torrent[val] = this.def[val];
      console.log(val, this.torrent[val]);
    },
    submit(test) {
      console.log(new nobj(Torrent).clone().exec());
    },
  },
});

const vform = new Vue({
  el: "#vform",
});

console.log(Torrent);
function loadImgComponent() {
	if (!TableData.description) return false;
	TableData.description.$.find("img").remove();
	TableData.description.$.append(`
		<div id="app-images">
			<vimages></vimages>
		</div>`);
}

loadImgComponent();

Vue.component("vimages", function (solve, reject) {
	loadPlugins().then((plugins) => {
		solve({
			template: `
	<span>
		<span 
			v-for="(image, id) in images" 
			:key="id" 
			:set="plugin=plugins[image.hostID]"
			>
			<input
				:set="pid=image.hostID"
				:title="image.host"
				v-model="plugin.fn"
				v-bind:class="success ? 'input-success' : 'input-error'"
				:size="plugin.fn.length"/>
				<button 
					@click="savePlugin(pid)"
					class="bttn-unite bttn-md bttn-primary"
					>
					<i class="fa fa-save"></i>
				</button>
				<button 
					class="bttn-unite bttn-md bttn-danger" 
					@click="deletePlugin(image.hostID)">
					<i class="fa fa-minus-circle"></i>
				</button>
				<br/>
			<button 
				@click="changeFnLeft(image.hostID)" 
				class="bttn-pill bttn-md bttn-info"
				>
					<i class="fa fa-caret-left"></i>
			</button>
			<button 
				@click="changeFnRight(image.hostID)"
				class="bttn-pill bttn-md bttn-info"
				>
					<i class="fa fa-caret-right"></i>
			</button><br/>
			<input v-model="image.src" :size="image.src.length"/>
				<br/>
			<a :href="image.href" target="_blank">
				<img
					:src="image.src"
					@error="success=false"
					v-bind:class="success ? 'poster' : 'thumbnail'"
					/>
			</a>
			<br/>
		</span>
	</span>`,
			data: function () {
				return {
					images: Torrent.images,
					imagesDef: JSON.parse(JSON.stringify(Torrent.images)),
					plugins: new nobj(plugins).clone().exec(),
					pluginsDef: JSON.parse(JSON.stringify(plugins)),
					success: false,
					counters: {},
				};
			},
			created() {
				// console.log(this.plugins);
				for (var id in this.images) {
					var image = this.images[id];
					if (!this.plugins[image.hostID]) {
						var plugin = {
							host: image.host,
							fn: 'src.replace("","")',
							fns: [],
						};
						this.$set(this.plugins, image.hostID, plugin);
					}
				}

				var pluginsFn = new narray([]);
				// console.log(this.plugins);
				for (var id in this.plugins) {
					console.log(id);
					var plugin = this.plugins[id];
					pluginsFn.push(plugin.fn);
					this.$watch(
						`$data.plugins.${id}.fn`,
						function (n, o) {
							// console.log(id, "test...");
							this.onPlugin(id);
						}
						// { deep: true }
					);
					// console.log(this.$watch);

					this.counters[id] = 0;
					this.onPlugin(id);
				}

				this.pluginsFn = pluginsFn.unique().exec();
			},
			methods: {
				savePlugin(id) {
					savePlugin(id, this.plugins[id]);
				},
				deletePlugin(id){
					deletePlugin(id)
					this.plugin[id].fn =".src"
					this.plugin[id].fns =[]
					
				},
				onPlugin(id) {
					// console.log(id)
					var host = this.plugins[id].host;
					var fn = this.plugins[id].fn;
					// console.log(id, host, fn);

					for (var id in this.images) {
						var img = this.images[id];
						if (img.host == host) {
							this.poster(id, fn);
						}
					}
				},
				poster(id, fn) {
					// console.log(id, fn);
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
						image.poster = src;
					} catch (err) {
						console.log("Error in plugin");
						this.success = false;
						image.src = imageDef.src;
						image.href = imageDef.href;
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
					console.log(this.pluginsFn, pluginsFn, this.counters[id]);
					if (this.counters[id] == max) this.counters[id] = 0;

					this.plugins[id].fn = pluginsFn[this.counters[id]];
					// this.$set(this.plugins, id+".fn", pluginsFn[this.counters[id]]);
				},
				changeFnLeft(id) {
					var pluginsFn = new narray([])
						.push(this.plugins[id].fns)
						.push(this.pluginsFn)
						.push([this.plugins[id].fn])
						.unique()
						.exec();
					console.log(this.pluginsFn, pluginsFn, this.counters[id]);
					var max = pluginsFn.length;
					this.counters[id]--;
					if (this.counters[id] == -1) this.counters[id] = max - 1;

					this.plugins[id].fn = pluginsFn[this.counters[id]];
				},
			},
		});
	});
});

if ($("#app-images").length) {
	const appImages = new Vue({
		el: "#app-images",
	});
}

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
		console.log("plugins", new nobj(plugins).clone().exec());
		return plugins;
	});
}

async function loadPlugins2() {
	var plugins = {};
	return PluginsList.get().then((q) => {
		q.forEach((doc) => {
			if (doc.exists) plugins[doc.id] = doc.data();
		});
		console.log("plugins", plugins);
		return new nobj(plugins).clone().exec();
	});
}

async function savePlugin(id, plugin) {
	new narray(plugin.fns).push(plugin.fn).unique();
	PluginsList.doc(id).set(plugin);
}
async function deletePlugin(id) {
	PluginsList.doc(id).remove();
}
// const app = new Vue({
// 	el: "#torrent-app",
// });

function autoSize() {
	new n$input($("input")).autoSize();
}
autoSize();

