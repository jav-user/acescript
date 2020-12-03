class nstring {
	constructor(str) {
		this.val = str;
	}
	capitalize() {
		this.val = this.val
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.substr(1))
			.join(" ");

		return this;
	}

	copy() {
		var tempInput = document.createElement("textarea");
		tempInput.value = this.val;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand("copy");
		document.body.removeChild(tempInput);
		return true;
	}

	fileSize(_type) {
		var fileSizeRx =
			"[0-9]{1,}[.]{0,1}[0-9]{0,}[ ]{0,}[ ]{0,}[kmg]{0,1}[i]{0,1}[b]";
		var str = this.val.trim().toLowerCase();
		str = str.replace("bytes", "b");

		var match = "^" + fileSizeRx + "$";
		if (!str.match(match)) return false;

		var num = str.match(/^[0-9]{1,}[.]{0,1}[0-9]{0,}/)[0];
		num = Number.parseFloat(num);

		var type = str.match(/[kmg]{0,1}[i]{0,1}[b]$/)[0].replace("i", "");

		var types = {
			b: 1,
			kb: Math.pow(10, 3),
			mb: Math.pow(10, 6),
			gb: Math.pow(10, 9),
		};

		if (!_type) return num * types[type];

		return (num * types[type]) / types[_type.toLowerCase()];
	}

	lower() {
		this.val = this.val.toLowerCase();
		return this;
	}

	upper() {
		this.val = this.val.toUpperCase();
		return this;
	}

	upperCount() {
		var i = 0;
		this.val.forEach((ch) => {
			if (ch.toUpperCase() == ch) i++;
		});
		return i;
	}
	splitAll() {
		this.val = this.val.split(/[-., ]/);
		return this.val;
	}
	splitUpper() {
		this.val = this.val.split(/(?=[A-Z])/);
		return this.val;
	}

	validFN() {
		this.val = this.val
			.replace(/[?]/g, "_")
			.replace(/[:]/g, "-")
			.replace(/[;]/g, ",")
			.replace(/[*]/g, "")
			.replace(/[/]/g, "-")
			.replace(/[\\]/g, "-")
			.replace(/[{]/g, "[")
			.replace(/[}]/g, "]")
			.replace(/["]/g, "'")
			.replace(/[>]/g, "]")
			.replace(/[<]/g, "[")
			.replace(/[|]/g, "-");
		return this;
	}

   includesEvery(arr) {
         
        let includes = (el) => this.val.includes((el + ""));
        return arr.every(includes);
    };

    includesSome(arr) {
         
        let includes = (el) => this.val.includes((el + ""));
        return arr.some(includes);
    };

    String.prototype.includesSome = function (arr) {
        let str = this.toString().toLowerCase();
        let includes = (el) => str.includes((el + "").toLowerCase());
        return arr.some(includes);
    };

	exec() {
		return this.val;
	}
}
