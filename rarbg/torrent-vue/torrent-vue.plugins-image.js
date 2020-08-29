Vue.component("plugins-image", {
	template: `<div>
			<plugin-image 
				v-for="image in imagesc" 
				:key="image.id"
				:_image="image">
			</plugin-image>
		</div>`,
	data: function() {
		return {
			images: [
				{
					thumb:
						"https://imagecurl.com/images/10405080512224957639_thumb.png",
				},
				{
					thumb:
						"https://imagecurl.com/images/87966011277606418545_thumb.png",
				},
			],
			plugins: {
				"imagecurl.com": {
					fn: `imgSrc.replace("_thumb","")`,
				},
			},
		};
	},
	computed: {
		imagesc: function() {
			var vm = this;
			var images = [];
			vm.images.forEach((image) => {
				var host = new URL(image.thumb).hostname;
				var plugin = vm.plugins[host];
				var imgSrc = image.thumb;
				var url = eval(plugin.fn);
				var img = {
					host: host,
					plugin: plugin,
					thumb: image.thumb,
					url: url,
					default: url,
				};
				img.id=CryptoJS.MD5(JSON.stringify(img)).toString();
				images.push(img);
			});
			return images;
		},
	},
});
