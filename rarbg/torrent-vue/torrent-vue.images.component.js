Vue.component("vimages",{
	template:`
	<span>
		<span v-for="image in images">
		<input v-model="image.url"/><br/>
		<input v-model="image.url"/><br/>
		<img :src="image.url"/>
		</span>
	</span>`,
	data:function(){
		return {
			images: Torrent.imagesArr,
			imagesDef: $.extend({},Torrent.imagesArr),
		}
	}
})