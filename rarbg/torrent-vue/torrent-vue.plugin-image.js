Vue.component("plugin-image", {
	template: `
	<form @submit="submit">
		<hr/>
		  <table>
		    <tbody>
		      <tr>
		        <td>
		          <button type="button" @click="defaultFn">Default</button>
		        </td>
		        <td>
		          <input type="hidden" v-model="image.plugin.host" />
		          <input 
		          	:size="image.plugin.fn.length"  
		          	v-model="image.plugin.fn" />
		          <button type="submit" >save</button>
		        </td>
		      </tr>

		      <tr>
		        <td>
		           <button type="button" @click="defaultImg">Default Img</button>
		           <button type="button" @click="defaultThumb">Default Thumb</button>
		        </td>
		        <td>
		          <input :size="image.url.length" v-model="image.url"  />
		        </td>
		      </tr>

		      <tr>
		      	<td colspan="2">
		      		<img :src="image.url"></img>
		      	</td>
		      </tr>

		      </tbody>
		    </table>
		<br/>
	</form>`,

	props: ["_image"],
	// computed: {
	// 	imagec: function() {
	// 		var vm = this;
	// 		var imgSrc = vm.image.thumb;
	// 		// console.log(vm.image);
	// 		var url = eval(vm.image.plugin.fn);
	// 		return {
	// 			url: url,
	// 			default:url,
	// 			thumb: vm.image.thumb,
	// 			plugin: vm.image.plugin,
	// 		};
	// 	},
	// },
	data:function(){
		return {
			image:this._image
		}
	},
	methods: {
		printImg:function(){
			console.log("image",this.image);
		},
		submit: function(e) {
			e.preventDefault();
		},
		defaultFn: function() {},
		defaultImg: function() {
			this.image.url = this.image.default;
			console.log(this.image.url)
		},
		defaultThumb: function() {
			this.image.url = this.image.thumb;
			console.log(this.image.url)
		},
	},
});
