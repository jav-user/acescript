function colorFromString(value) {
	value = value + "";
	result = "";

	value = value.split("");

	// Filter non hex values
	for (var i = 0; i < value.length; i++) {
		var val = value[i];

		if (!/^[0-9A-F]{1}$/i.test(val)) {
			val = 0;
		}

		result += val;
	}

	// Multiple of 3
	if (result.length % 3) {
		result += Array(3 - (result.length % 3) + 1).join("0");
	}

	// Multiple of 6
	if (result.length % 6) {
		// result += Array((6 - result.length % 6) + 1).join("0");
	}

	// Split in 3 groups with equal size
	var regexp = new RegExp("([A-Z0-9]{" + result.length / 3 + "})", "i");
	result = result.split(regexp);

	// Remove first 0 (if there is one at first postion of every group
	if (result[1].length > 2) {
		if (
			((result[1].charAt(0) == result[3].charAt(0)) ==
				result[5].charAt(0)) ==
			0
		) {
			result[1] = result[1].substr(1);
			result[3] = result[3].substr(1);
			result[5] = result[5].substr(1);
		}
	}

	// Truncate (first 2 chars stay, the rest gets deleted)
	result[1] = result[1].slice(0, 2);
	result[3] = result[3].slice(0, 2);
	result[5] = result[5].slice(0, 2);

	// Add element if color consists of just 1 char per color
	if (result[1].length == 1) {
		result[1] += result[1];
		result[3] += result[3];
		result[5] += result[5];
	}

	// Output
	var color = "#" + result[1] + result[3] + result[5];
	return color;
}

function invertColor(hex, bw) {
	if (hex.indexOf("#") === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error("Invalid HEX color.");
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	if (bw) {
		// http://stackoverflow.com/a/3943023/112731
		return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
	}
	// invert color components
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);
	// pad each with zeros and return
	return "#" + padZero(r) + padZero(g) + padZero(b);
}

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
	var hexDigits = new Array(
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"a",
		"b",
		"c",
		"d",
		"e",
		"f"
	);

	function hex(x) {
		return isNaN(x)
			? "00"
			: hexDigits[(x - (x % 16)) / 16] + hexDigits[x % 16];
	}
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
function colorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, "");
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#",
		c,
		i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
		rgb += ("00" + c).substr(c.length);
	}
	return rgb;
}
