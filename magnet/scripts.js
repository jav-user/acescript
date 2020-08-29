const scriptsRef = db
	.collection("magnetScripts")
	.doc(window.location.hostname)
	.collection("scripts");

const $mainForm = $(
	`<form class="scripts-form">
    <input type="text" name="script" placeholder="script"/>
    <input type="text" name="rx" placeholder="rx"/>
    <button id="save-script">Save</button>
    <button id="change-script">Change</button>
    <button id="delete-script">Delete</button>
  </form>
  `
);

$("body").prepend($mainForm);

$mainForm.on("submit", function (e) {
	e.preventDefault();
	var $this = $(this);
	var btnid = $this.find("button:focus").attr("id");
	// var data = await $this.serializeObject()

	$this.serializeObject().done((data) => {
		console.log("input data", data);

		switch (btnid) {
			case "save-script":
				saveScript(data, $this);
				break;
			case "change-script":
				changeScript($this);
				break;
			case "delete-script":
				deleteScript(data, $this);
				break;
		}

		validateScriptsForm();
	});
});

const saveScript = (data, $f) => {
	let rx = data.rx.trim();
	let rxid = CryptoJS.MD5(rx).toString();

	scriptsRef
		.doc(rxid)
		.set({
			rx: data.rx.trim(),
			script: data.script.trim(),
			date: Date.now(),
		})
		.then((done) => {
			$f.find("input").css("color", "blue");
		})
		.catch((err) => {
			console.log("err", err);
			$f.find("input").css("color", "red");
		});
};

let scriptIndex = 0;
const changeScript = ($f) => {
	if (!scriptsData.length) return false;
	scriptIndex++;
	if (scriptIndex >= scriptsData.length) scriptIndex = 0;
	$f.find("[name=script]").val(scriptsData[scriptIndex].script);
	$f.find("[name=rx]").val(scriptsData[scriptIndex].rx);
};

const deleteScript = (data, $f) => {
	let rxid = CryptoJS.MD5(data.rx.trim()).toString();
	scriptsRef
		.doc(rxid)
		.delete()
		.then((done) => $f.find("input").css("color", ""));
};

const adjustInputsSize = function () {
	$inputs = $(this);
	// $inputs.each((i,input)=>{

	// })
};

const validateScriptsForm = () => {
	var $inputs = $mainForm.find("input");
	$inputs.each((i, input) => {
		$(input).attr("size", $(input).val().trim().length + 1);
	});
	var rxValid = validateRx();
	var scriptValid = validateScript();
	$mainForm.find("input[name=rx]").css("color", rxValid ? "green" : "red");
	$mainForm
		.find("input[name=script]")
		.css("color", scriptValid ? "green" : "red");
	$mainForm
		.find("button#save-script")
		// .not("#change-script")
		.attr("disabled", rxValid && scriptValid ? false : true);
};

$mainForm.find("input").on("keyup", validateScriptsForm);

const validateRx = () => {
	var $this = $mainForm.find("input[name=rx]");
	var rx = $this.val().trim();
	var match = window.location.pathname.match(rx);
	return match;
	// var $btns = $mainForm.find("button").not("[name=change-script]");
};

// $mainForm.find("input[name=rx]").on("keyup", validateRxScrit);

const validateScript = () => {
	var $this = $mainForm.find("input[name=script]");
	var script = $this.val().trim();

	var $firstLink = $($magnetLinks[0]);
	var tmpscript = `var result=$firstLink${script}`;
	// console.log("tmpscript",tmpscript);

	var $btns = $mainForm.find("button").not("[name=change-script]");

	var valid = null;
	try {
		eval(tmpscript);
		// console.log("result", result);
		let matches = result.toLowerCase().match(nes.fileSizeRx);
		valid = matches;
	} catch (err) {}

	return valid;
};

// $mainForm.find("[name=script]").on("keyup", validateScript);



const scriptsData = [];
scriptsRef
	.orderBy("date", "desc")
	.get()
	.then((sn) => {
		sn.forEach((doc) => {
			let data = doc.data();
			if (window.location.pathname.match(data.rx))
				scriptsData.push({ rx: data.rx, script: data.script });
		});
		if (scriptsData.length) {
			$mainForm.find("[name=script]").val(scriptsData[0].script);
			$mainForm.find("[name=rx]").val(scriptsData[0].rx);
			$mainForm.find("input").css("color", "green");
		} else {
			$mainForm.find("[name=script]").val("");
			$mainForm
				.find("[name=rx]")
				.val("^" + window.location.pathname + "$");
		}
		console.log("scriptsData", scriptsData);
		$("input").keyup();
	});
