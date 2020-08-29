CMDS = {};

var loadMangasGUI = function () {
    var $custom_manga = $(`
        <div class="nes_custom">
            <div class="manga_info"></div>
            <center>
                <button class="btn_get">Get Comic</button>
                
                <button class="btn_copy" style="display:none">
                    Copy
                </button>
                <hr/>
                <button class="btn_skip">Skip</button>
                <button class="btn_noskip" style="display:none">
                    No Skip
                </button>
            </center>
            <br/><br/>
        </div>`);

    $(".nes_custom").remove();

    $(".post").each((i, post) => {
        let $el = $custom_manga.clone();
        let $h2 = $(post).find("h2");
        let url = $h2.find("a").attr("href");
        let folder = $h2.text().toValidFileName();
        let $btn = $el.find("button.btn_get");
        $btn.text("Get " + folder);
        $btn.attr("data-folder", folder);
        $btn.attr("data-url", url);
        $btn.on("click", function () {
            getManga($el);
        });

        let $btn_copy = $el.find("button.btn_copy");
        let $btn_skip = $el.find("button.btn_skip");
        let $btn_noskip = $el.find("button.btn_noskip");

        $btn_skip.on("click", function () {
            $btn.addClass("skip_manga");
            $btn.css({ color: "gray" });
            $btn_skip.hide();
            $btn_noskip.show();
            CMDS[folder] = CMDS[folder] ? CMDS[folder] : {};
            CMDS[folder].skip = true;
        });

        $btn_noskip.on("click", function () {
            $btn.removeClass("skip_manga");
            $btn.css({ color: "", fontWeight: "bold" });
            $btn_skip.show();
            $btn_noskip.hide();
            CMDS[folder].skip = false;
        });

        $btn_copy.on("click", function () {
            let cmd = CMDS[folder];
            nes.copy(cmd.cmd);
            alert("copied! " + cmd.num + " images");
            console.log(cmd.cmd);
            // let cmds = `D:\n${CMDS.join("\n")\n}`
            // nes.copy(cmds)
            // alert("Copied "+CMDS.length+" mangas!")
            // console.log(cmds)
        });

        $h2.after($el);
    });

    var $custom_mangas = $(`
        <div class="nes_custom">
            <div class="mangas_info"></div>
            <button class="btn_get_all">Get All</button>
            <button class="btn_copy_all" style="display:none">Copy All</button>
            <br/><br/>
        </div>
        `);

    $custom_mangas.find("button.btn_get_all").on("click", getMangas);
    $custom_mangas.find("button.btn_copy_all").on("click", copyMangas);

    $("h1.page-title").after($custom_mangas);
};

loadMangasGUI();

var getManga = function ($el, solve) {
    var $btn = $el.find("button.btn_get");
    var $btn_copy = $el.find("button.btn_copy");
    var $info = $el.find(".manga_info");

    var url = $btn.attr("data-url");
    var folder = $btn.attr("data-folder");

    $info.text("...loading");
    $.get(url)
        .then((html) => {
            var $aimgs = $(html).find(".dgwt-jg-item > a");
            var imgurls = Array.from($aimgs).map((a) => a.href);
            // alert(imgurls.length);

            //         console.log(imgurls, folder)
            var cmd = nesMg.getCmd(imgurls, folder);
            //         console.log(html)
            // if (CMDS.indexOf(cmd)) CMDS.push(cmd);
            CMDS[folder] = CMDS[folder] ? CMDS[folder] : {};
            (CMDS[folder].cmd = cmd),
                (CMDS[folder].num = imgurls.length),
                $info.text(`Done! (${imgurls.length} images)`);
            var color = "red";
            if (imgurls.length > 1) color = "orange";
            if (imgurls.length > 5) color = "green";

            $info.css({ color: color, fontWeight: "bold" });
            $btn.hide();
            $btn_copy.show();
            $("button.btn_copy_all").show();
            if (solve) solve();

            //         nes.copy(CMD)
            // alert(NUM + " images copied!")
        })
        .catch((err) => {
            alert("Error in " + folder + "!");
            console.log("err", err);
            if (solve) solve();
        });
};

function copyMangas() {
    // let cmds = CMDS.join("\n");
    // nes.copy(cmds);
    // alert("Copied " + CMDS.length + " mangas!");
    // console.log(cmds);
    //
    let imgs = 0;
    let cmds = [];
    let mangas = 0;
    for (var key in CMDS) {
        let cmd = CMDS[key];
        if (!cmd.skip) {
            cmds.push(cmd.cmd);
            imgs = imgs + cmd.num;
            mangas++;
        }
    }

    let _cmds = cmds.join("\n");
    nes.copy(_cmds);
    console.log(_cmds);
    alert(`Copied ${mangas} mangas and ${imgs} images!`);
}

async function getMangas() {
    var btns = Array.from($(".nes_custom .btn_get:not(.skip_manga)"));
    // .slice(0, 3);
    var $mangas_info = $(".mangas_info");
    $mangas_info.css({ color: "", fontWeight: "bold" });

    for (var [i, btn] of btns.entries()) {
        await new Promise((solve) => {
            var $el = $(btn).parent().parent();
            getManga($el, solve);
            // console.log(btn);
            var info = `${$(btn).attr("data-folder")} (${i + 1} of ${
                btns.length
            })`;
            $(".mangas_info").text("Doing... " + info);
            if (i + 1 == btns.length) {
                $mangas_info.text("Done " + info);
                $mangas_info.css({ color: "green" });
            }
        });
    }
}

// skip done
// red if 0 images done?

var blacklist = ["furry", "futanari", "shemale", "yaoi"];
var whitelist = [
    "bath",
    "big boobs",
    "bikini",
    "doujin",
    "full color",
    "kissing",
    "school",
    "sister",
    "teen",
    "x-ray",
];
var $posts = $(".post");
$posts.each((i, post) => {
    var $post = $(post);
    var $content = $post.find(".post-inner");
    var $tags = $post.find(".post-tag > a");
    $tags.each((i, tag) => {
        var $tag = $(tag);
        var tagname = tag.innerText.toLowerCase();
        $tag.css({ color: "black", fontWeight: "bold" });

        if (tagname.includesSome(blacklist)) {
            $tag.css("color", "red");
            $content.css("backgroundColor", "gray");
            $post.css("opacity", 0.35);
            $post.find("button.btn_skip").click();
        } else if (tagname.includesSome(whitelist)) {
            $tag.css("color", "blue");
        }
    });
    //     var tags = Array.from($tags).map((tag)=>tag.innerText)
    //     console.log(title, tags)
});
