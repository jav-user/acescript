const getTorrentInfo = () => {
  var Magnet = new ntorrent(RawInfo.torrent.$[0]).getMagnets()[0];
  Torrent.size = RawInfo.size.text;
  Torrent.images = Images.map((Img) => Img.url);
  Torrent.name = Magnet.name;
  Torrent.magnet = Magnet.url;
  Torrent.title = RawInfo.torrent.text.trim();
  Torrent.poster = RawInfo.poster.$.find("img").attr("src");
  Torrent.hash = Magnet.params.get("xt");

  Torrent.categories = getCategories().join(", ");

  if (Torrent.categories.indexOf("adult") != -1) {
    Torrent.studio = getStudio();
    Torrent.stars = getStars().join(", ");
  }
};

const createInfoForm = () => {
  // console.log(Torrent);
  $torrentForm = $(torrentFormTpl);

  $table.before($torrentForm);

  $("h1").text(Torrent.title + " [" + Torrent.size + "]");

  $torrentForm.find("input[name=poster]").on("change", function () {
    changePoster(this);
  });

  new n$form($torrentForm)
    .data(Torrent)
    .default()
    .toggleNull("tr:first")
    .toggle()
    .submit(function ($form) {
      var arr = $form.serializeArray();
      var str = $form.serialize();
      var params = new URLSearchParams(params);
      console.log(arr, params.get("name"));
    });

  new n$input($torrentForm.find("input")).autoSize();

  // new njq($torrentForm)
  // .nosubmit()
  // .autoSize()
  // .hide("hidden")
  // .value(Torrent)
  // .defaultBtn("button.btn-default[name=default-{name}]")
  //               .toggleBtn()
  //             .toggleNull("tr:first");
};

getTorrentInfo();
createInfoForm();

function changePoster(el) {
  try {
    var url = new URL(el.value);
    RawInfo.poster.$.find("img").attr("src", el.value);
    $(el).css("color", "green");
  } catch (err) {
    $(el).css("color", "red");
    console.log("err-img", err);
  }
}

function getCategories() {
  var categories = Array.from(RawInfo.category.$.find("a"))
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

function getTags() {
  var tags = {
    asian: {
      starts: ["asian"],
    },
    blacked: {
      starts: ["bbc", "blacked"],
    },
    bath: {
      starts: ["bath"],
    },
    busty: {
      equals: ["busty"],
    },
    classic: {
      starts: ["classic"],
    },
    game: {
      equals: ["game", "poker"],
    },
    incest: {
      studios: ["brattysis", "puretaboo", "spyfam"],
      equals: ["bro", "sis", "step"],
      starts: ["brother", "family", "sibling", "sister"],
    },
    javu: {
      studios: [
        "1pondo",
        "bigtitstokyo",
        "caribbeancom",
        "heyzo",
        "japanhdv",
        "javhd",
      ],
      equalsEvery: [
        ["jav", "uncensored"],
        ["caribbean", "com"],
      ],
      starts: ["caribbeancom"],
    },
    lovey: { equals: ["date", "dating"] },
    massage: {
      starts: ["massage"],
    },
    mix: {
      equals: ["compilation"],
    },
    orgasm: {
      start: ["orgasm", "squirt"],
    },
    shaved: {
      equals: ["shaved"],
    },
    shower: {
      equals: ["shower"],
    },
    strip: {
      equals: ["strip"],
      starts: ["strip", "undress"],
    },
    xart: {
      studios: [
        "21naturals",
        "babes",
        "eroticax",
        "femjoy",
        "metart",
        "nfbusty",
        "nubilefilms",
        "nubiles",
        "sexart",
        "x-art",
        "vixen",
        "thewhiteboxxx",
        "tushy",
      ],
      starts: ["nubile"],
    },
    xmovie: {
      equals: ["dvdrip"],
    },
  };
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

console.log("dom info...");
