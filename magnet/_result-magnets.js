// ==UserScript==
// @name Magnets
// @namespace AceScript Magnets
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require https://jav-user.github.io/scripts/nes/nes_functions.js?a=4
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
//// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.16.0/jquery.validate.min.js
// @require https://jav-user.github.io/jquery-longclick/jquery-longclick.js
// @require https://www.jqueryscript.net/demo/Serialize-Form-To-Objects-jQuery-serializeObject/jquery.serializeObject.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://jav-user.github.io/scripts/fire/config.js
// @require https://jav-user.github.io/scripts/magnets/magnets.js
// @grant none
// ==/UserScript==

nes.addStyle(
	"https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css",
	"jq-ui-base"
);
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
const magnets = [];

const $magnetLinks = Array.from($("a")).filter((a) =>
  a.href.startsWith("magnet:?")
);

String.prototype.toVal = function () {
  return this.toString().replace(/[+]/g, " ");
};
String.prototype.fromVal = function () {
  return this.toString().replace(/ /g, "+");
};

//$scriptsForm.find("[name=script]").val(123)

var tags = [];
db.collection("magnetTags").onSnapshot((sn) => {
  tags = [];
  sn.docChanges().forEach((change) => {
    let doc = change.doc;
    tags.push(doc.data().tag);
  });
  tags = tags.sort();
  function split(val) {
    return val.split(/,\s*/).filter((tag) => tag);
  }
  $("input[name=tags]").autocomplete({
    source: function (request, response) {
      var currentTags = split(request.term);
      var _tags = tags.filter((tag) => currentTags.indexOf(tag) == -1);
      var search = split(request.term).pop();
      console.log("search", search);
      var matcher = new RegExp(
        "^" + $.ui.autocomplete.escapeRegex(search),
        "i"
      );
      response(
        _tags
          .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 5)
        /*  $.grep(_tags, function (item) {
          //console.log("item", item);
          //return matcher.test(item);
          return item.toLowerCase().includes(search.toLowerCase())
        })*/
      );
    },
    select: function (event, ui) {
      // Add the selected term appending to the current values with a comma
      var terms = split(this.value);
      // remove the current input
      terms.pop();
      // add the selected item
      terms.push(ui.item.value);
      // join all terms with a comma
      this.value = terms.join(", ");
      return false;
    },
    focus: function () {
      // prevent value inserted on focus when navigating the drop down list
      return false;
    },
  });
});

$magnetLinks.forEach((a) => {
  var fs = $(a)
    .parent()
    .find("font.detDesc")
    .text()
    .toLowerCase()
    .match(nes.fileSizeRx)[0];
  var fileSize = nes.getFileSize(fs, "mb");

  console.log("filesize", fileSize);

  var href = decodeURIComponent(a.href);

  let search = href.split("?")[1];

  let obj = {};
  let trs = [];

  search.split("&").forEach((_data) => {
    var data = _data.split("=");
    if (data[0] != "tr") obj[data[0]] = data[1];
    else trs.push(data[1]);
  });

  const dn = obj.dn;
  //obj.dn = obj.dn.replace(/[+]/g, " ");

  const magnetid = CryptoJS.MD5(obj.xt).toString();
  magnets.push(magnetid);

  console.log(obj);

  let $el = $(`
<span class="nes-magnet" id="magnet_${magnetid}">
  <input name="dn"
   value="${obj.dn.toVal()}" 
   size=${obj.dn.length}/>
<input
  placeholder="tags..."
  name="tags"
  size=1
   value=""/>
 <hr/>
 <button name="saveM"
  title="Save magnet ${obj.dn}">
  Save Magnet</button>
<button name="deleteM"
  title="Delete magnet ${obj.dn}">
  Delete Magnet</button>
</span>
`);

  var $saveM = $el.find("button[name=saveM]");
  var $deleteM = $el.find("button[name=deleteM]");
  var $dn = $el.find("input[name=dn]");
  var $inputs = $el.find("input");
  var $tags = $el.find("input[name=tags]");

  $saveM.on("click", function () {
    $inputs.css("color", "purple");
    obj.dn = $dn.val().fromVal();
    let search = Object.entries(obj)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    trs.forEach((tr) => (search += "&" + $.param({ tr: tr })));

    var magnet = "magnet:?" + search;
    var tags = $tags
      .val()
      .split(",")
      .trim()
      .unique()
      .filter((tag) => tag);
    console.log("tags", tags);

    var batch = db.batch();

    var magnetRef = db.collection("magnets").doc(magnetid);
    var scriptSize = $mainForm.find("input[name=script]").val().trim();
    eval(`var htmlSize =$(a)${scriptSize}`);
    var strSize = htmlSize.toLowerCase().match(nes.fileSizeRx)[0];
    console.log("strSize", strSize);
    var fileSize = nes.getFileSize(strSize);
    console.log("fileSize", fileSize);

    var magnetDoc = {
      magnet: magnet,
      _updated: Date.now(),
      host: window.location.hostname,
      path: window.location.pathname,
      search: window.location.search,
      tags: tags,
      dn: obj.dn,
      xt: obj.xt,
      trs: trs,
      fileSize: fileSize,
    };
    batch.set(magnetRef, magnetDoc);

    tags.forEach((tag) => {
      var tagid = CryptoJS.MD5(tag).toString();
      var tagRef = db.collection("magnetTags").doc(tagid);
      batch.set(tagRef, { tag: tag }, { merge: true });
      let _tags = tags.filter((_tag) => _tag != tag);
      let relatedTags = {};
      relatedTags[magnetid + "_tags"] = _tags;
      batch.set(tagRef, relatedTags, { merge: true });
    });

    batch
      .commit()
      .then(console.log(magnetid + " added"))
      .catch((err) => {
        alert("error");
        console.log(err);
        $inputs.css("color", "red");
      });
  });

  $deleteM.on("click", () => {
    $inputs.css("color", "purple");
    var batch = db.batch();
    var magnetRef = db.collection("magnets").doc(magnetid);
    batch.delete(magnetRef);
    var tags = $tags
      .val()
      .split(",")
      .trim()
      .unique()
      .filter((tag) => tag);
    console.log("tags", tags);
    tags.forEach((tag) => {
      let tagid = CryptoJS.MD5(tag).toString();
      let relatedTags = {};
      relatedTags[magnetid + "_tags"] = firebase.firestore.FieldValue.delete();
      batch.update(db.collection("magnetTags").doc(tagid), relatedTags);
    });

    batch
      .commit()
      .then((success) => $dn.css("color", ""))
      .catch((err) => {
        console.log("err", err);
        $dn.css("color", "red");
      });
  });

  $el.find("input").on("keyup", function () {
    $(this).attr("size", $(this).val().trim().length + 1);
  });

  $(a).after($el);
});

const getMagnets = (magnets, callback) => {
  let magnetRefs = magnets.map((id) => {
    return db
      .collection("magnets")
      .doc(id)
      .onSnapshot((doc) => {
        onChanges(doc);
      });
  });
  Promise.all(magnetRefs)
    .then((done) => {
      console.log("Done");
    })
    .catch((error) => console.log(error));
};

getMagnets(magnets);

const onChanges = function (doc) {
  if (doc.exists) {
    var magnet_id = "#magnet_" + doc.id;
    var data = doc.data();
    var $dn = $(magnet_id).find("input[name=dn]");
    var $tags = $(magnet_id).find("input[name=tags]");
    var $inputs = $(magnet_id).find("input");
    $inputs.css({ color: "green" });
    $dn.val(data.dn.toVal() || $dn.val());
    $tags.val(data.tags ? data.tags.join(", ") : "");

    $inputs.each((i, input) => {
      $(input).attr("size", $(input).val().trim().length + 1);
    });
  }
};


$("[name=saveM]").longclick({
  // holdText: "Saving All...",  // default: "Hold..."
  // heldText: "Saved...",        // default: null (will revert back to original text)
  duration: 3000                  // default: 1000
}).on("longclick", function() {
    $("[name=saveM]").click();
    console.log("Saved...")
})


$("[name=deleteM]").longclick({
  duration:3000
}).on("longclick",()=>{
  $("[name=deleteM]").click();
  console.log("Deleted...")
})