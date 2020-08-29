if (window.location.pathname.startsWith("/torrent/")) {
    const RarbgRef = db.collection("javuser").doc("Rarbg");
    const ImgPluginsRef = RarbgRef.collection("imgPlugins");
    const MissingPluginsRef = RarbgRef.collection("missingPlugins");

    var TorrentName = null;
    var TorrentSize = null;
    var TorrentPoster = null;
    var clicked = false;

    imgPlugins = {};
    // var batch = db.batch();

    //Inicia

    const getPlugins = () => {
        var strPlugins = Lockr.get("strPlugins");
        console.log("strPluginsOff", strPlugins);
        $("h1").css("color", "purple");
        return ImgPluginsRef.get().then((q) => {
            if (q.size) {
                q.forEach((doc) => {
                    var fn = doc.data().f;
                    if (fn) strPlugins[doc.id] = fn;
                });
                $("h1").css("color", "green");
                console.log("connected!!");
                Lockr.set("strPlugins", strPlugins);
            }

            return strPlugins;
        });
    };

    const getTblData = () => {
        var $table = $("table.lista").eq(0);
        console.log("$table", $table);

        var $trs = $table.children("tbody").children("tr");
        const tbldata = {};
        $trs.each((i, tr) => {
            var $tds = $(tr).children("td");
            var key = $tds
                .eq(0)
                .text()
                .toLowerCase()
                .replace(/[:]/g, "")
                .trim();
            var val = {
                text: $tds.eq(1).text().replace(/[\n]/g, ""),
                html: `<div>${$tds.eq(1).html()}</div>`,
            };
            // $tds.eq(1).text().replace(/[\n\t]/g," ").trim()
            tbldata[key] = val;
        });

        return tbldata;
    };

    getPlugins().then((plugins) => {
        // imgPlugins = plugins;
        strPlugins = plugins;
        const batch = db.batch();
        $("#description img").each((i, img) => {
            var imgurl = new URL(img.src);
            var link = $(img).parent().attr("href");
            console.log("imgSrc", img.src);
            var id = imgurl.hostname;
            console.log("imgid", id);
            console.log("plugin...", id, imgPlugins[id]);
            var imgSrc = img.src;
            var newSrc = strPlugins[id] ? eval(strPlugins[id]) : img.src;
            console.log("plugin", id, imgPlugins[id]);
            // console.log("strplugin",strPlugins[id])
            const ImgRef = ImgPluginsRef.doc(id);
            const MissingImgRef = MissingPluginsRef.doc(id);

            if (img.src != newSrc) {
                console.log("newSrc: " + newSrc);
                img.src = newSrc;
                img.style.maxWidth = "750px";
                img.parentNode.href = newSrc;

                batch.update(ImgRef, { hasf: true });
                batch.delete(MissingImgRef);
            } else {
                console.log("imgsrc: " + img.src);
                console.log("newSrc: " + newSrc);
                var doc = {
                    page: window.location.href,
                    imgSrc: img.src,
                    // link: link,
                    date: Date.now(),
                    dateStr: new Date().toString(),
                };

                batch.set(MissingImgRef, doc);
                batch.set(
                    ImgRef,
                    {
                        hasf: false,
                    },
                    {
                        merge: true,
                    }
                );
            }
        });
    });

    //TorrentName

    //TorrentSize
    const tblData = getTblData();

    console.log("tblData", tblData);

    TorrentName = $("h1").text();

    TorrentSize = tblData.size.text;

    $("h1").text(TorrentName + ` [${TorrentSize}]`);

    TorrentPoster = $(tblData.poster.html).find("img").attr("src");

    //MagnetOnClick
    var links = Array.from($("a[href]")).filter((a) => a.href);
    var mgt = links.filter((a) => a.href.startsWith("magnet:"))[0];
    var tor = links.filter((a) => a.href.endsWith(".torrent"))[0];

    mgt.onclick = function () {
        var torrent = {
            name: TorrentName,
            size: TorrentSize,
            url: window.location.href,
            poster: TorrentPoster,
            torrent: tor.href,
            magnet: mgt.href,
            date: Date.now(),
            dateStr: new Date().toString(),
        };

        if (!clicked) {
            RarbgRef.collection("Torrents")
                .doc(`${TorrentName} [${TorrentSize}]`)
                .set(torrent)
                .then((r) => {
                    clicked = true;
                    mgt.parentNode.style.backgroundColor = "#B9E5FF";
                    console.log(mgt.parentNode);
                    console.log("clicked");
                });
        } else {
            console.log("Already clicked!!");
        }

        // clicked = true
    };
}
