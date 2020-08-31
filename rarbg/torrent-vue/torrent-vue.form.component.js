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
