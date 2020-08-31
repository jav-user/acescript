// ==UserScript==
// @name RarbgTorrent
// @namespace RarbgTorrent Script
// @match *://rarbgweb.org/torrent/*
// @grant none
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js?a=2
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrents.js?a=1
//// @require https://jav-user.github.io/acescript/rarbg/torrent3.result.js?a=1
// ==/UserScript==

new ndom()
	.addStyleOnce(
		"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
		"font-awesome"
	)
	.addStyle(
		"https://jav-user.github.io/acescript/rarbg/torrent-vue/torrent-vue.css",
		"torrent-vue-css"
	);

const RarbgRef = db.collection("RARBG").doc("RARBG");
const PluginsList = RarbgRef.collection("plugins_");
// const HistoryRef = RarbgRef.collection("history_");
// const UploadersRef = RarbgRef.collection("uploaders_");

// console.log("scripts...");

// $("h1").parents("table:first").attr("id", "vform");
// $("body").attr("id", "torrent-app");

// $(document).ready(function () {

// });
const $table = $("table.lista").eq(0);
const TableData = {};
const Torrent = {};
const Images = {};
$table.before(`<div id="vform"><vform></vform></div>`);
const getTableData = () => {
	var $trs = $table.children("tbody").children("tr");
	$trs.each((i, tr) => {
		var $tds = $(tr).children("td");
		var key = $tds.eq(0).text().toLowerCase().replace(/[:]/g, "").trim();
		var val = {
			text: $tds.eq(1).text().replace(/[\n]/g, ""),
			html: `<div>${$tds.eq(1).html()}</div>`,
			$: $tds.eq(1),
		};
		TableData[key] = val;
	});
	return TableData;
};

getTableData();

const getImages = () => {
	if (!TableData["description"]) return false;
	var $d = TableData["description"].$;
	var $imgs = $d.find("img");
	$imgs.each((i, img) => {
		var SRC = new URL(img.src);
		var data = {
			thumbnail: img.src,
			// thumbnailSrc: SRC,
			src: img.src,
			host: SRC.hostname,
			hostID: CryptoJS.MD5(SRC.hostname).toString(),
			href: $(img).parents("a:first").prop("href"),
		};

		var dom = {
			html: img,
			$: $imgs.eq(i),
		};
		const id = CryptoJS.MD5(data.thumbnail).toString();
		Images[id] = data;
	});
	// console.log($imgs)
};
getImages();
const getTorrentInfo = () => {
	var Magnet = new ntorrent(TableData.torrent.$[0]).getMagnets()[0];
	Torrent.size = TableData.size.text;
	// Torrent.images = Images.map((Img) => Img.url);
	Torrent.images = Images;
	// Torrent.imagesArr = [];
	// for (var id in Images) {
	// 	const image = {
	// 		id: id,
	// 		thumbnail: Images[id].thumbnail,
	// 		url: Images[id].thumbnail,
	// 	};
	// 	Torrent.images[id] = image;
	// 	Torrent.imagesArr.push(image);
	// }
	// Torrent.name = Magnet.name;
	// Torrent.hash = Magnet.hash;
	// Torrent.magnetUrl = Magnet.url;
	// Torrent.trackers = 	Magnet.trackers;
	Torrent.magnet = Magnet;
	// Torrent.magnet = Magnet;
	Torrent.title = TableData.torrent.text.trim();
	Torrent.poster = TableData.poster.$.find("img").attr("src");
	Torrent.hash = Magnet.params.get("xt");

	Torrent.category = getCategory();

	if (Torrent.category.id == 4) {
		Torrent.studio = getStudio();
		Torrent.stars = getStars().join(", ");
	}
};

getTorrentInfo();

function getCategory() {
	const $a = TableData.category.$.find("a");
	var url = $a.prop("href");
	var name = $a.text();
	var search = new URL(url).search;
	var params = new URLSearchParams(search);
	var id = params.get("category");
	return {
		id: id,
		url: url,
		name: name,
	};
}

function getCategories() {
	var categories = Array.from(TableData.category.$.find("a"))
		.map((a) => $(a).text())
		.map((cat) => {
			var c = cat.toLowerCase();
			if (c.includes("xxx")) return "adult";
			if (c.includes("episodes")) return "series";
			if (c.includes("movies")) return "movies";
			return cat;
		});
	return categories;
}

function getStars() {
	var title = Torrent.title;
	var stars = [];
	var match1 = "- [a-zA-Z,& ]{1,} [-,]{1}";
	var match2 = "[0-9]{2}.[0-9]{2}.[0-9]{2,4}.[a-zA-Z]{1,}.[a-zA-Z]{1,}";

	var star = title.match(match1);
	if (star) star = star[0].replaceAll("-", "").trim();

	if (!star) {
		star = title.match(match2);
		if (star) star = star[0].replace(/[0-9.]/g, " ").trim();
	}

	if (star && title.toLowerCase().includes("photodromm"))
		star = star.split(" ")[0] + " (Photodromm) ";

	if (star) {
		stars = star
			.split(" And ")
			.join(",")
			.split(" and ")
			.join(",")
			.split(" & ")
			.join(",")
			.split(",")
			.map((a) => a.trim())
			.filter((a) => a != "");
	}

	return stars;
}

function getStudio() {
	var studio = Torrent.title.split(".")[0].split(" - ")[0].split("Vol.")[0];

	if (studio != Torrent.name) {
		studio = studio.trim();
		if (studio == studio.toUpperCase()) {
			studio = new nstring(studio).lower().capitalize().exec();
		}
	}
	return studio;
}
Vue.component("vform", {
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
		<span v-for="(image, id) in images">
			<input
				:title="image.host"
				v-model="plugins[image.hostID].fn"
				v-bind:class="success ? 'input-success' : 'input-error'"
				:size="plugins[image.hostID].fn.length"/>
				<button @click="savePlugin(image.hostID)">
					<i class="fa fa-save"></i>
				</button>
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
					@error="success=false"
					v-bind:class="success ? 'poster' : 'thumbnail'"
					/>
			</a>
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
						},
						{ deep: true }
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
				onPlugin(id) {
					// console.log(id)
					var host = this.plugins[id].host;
					var fn = this.plugins[id].fn;
					// console.log(id, host, fn);

					for (var id in this.images) {
						var img = this.images[id];
						if (img.host == host) {
							this.poster2(id, fn);
						}
					}
				},
				poster2(id, fn) {
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
// const app = new Vue({
// 	el: "#torrent-app",
// });

function autoSize() {
	new n$input($("input")).autoSize();
}
autoSize();

