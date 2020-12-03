// ==UserScript==
// @name MangaFox
// @namespace MangaFox Scripts
// @match http://fanfox.net/manga/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js
// @require https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js
// @grant none
// ==/UserScript==


$(document).ready(function() {
    loadComponents();
    // $(".line-list-morebt").trigger("click");
    $(".detail-main").prepend("<div id='main-control'><main-control></main-control></div>")

    Vue.prototype.$bus = new Vue();


    new Vue({
        el: "#main-control",
        data() {
            return {}
        }
    })

    loadStyles();



    var manga = $("title").text().split("-")[0].replace("Manga", "").trim().split(" ")
    var len = manga.length;
    manga = manga.slice(0, 5).join(" ")
    if (len > 5) {
        manga = manga + "..."
    }

    Array.from($(".detail-main-list > li")).slice(0, 5).forEach((item) => {

        var url = $(item).find("a").eq(0).prop("href");
        var name = $(item).find("a").text().trim();
        var chapter = url.split("/").reverse()[1].match(/[0-9]{1,5}/)
        if (chapter) {
            chapter = "00000000000" + chapter;
            chapter = chapter.substring(chapter.length - 4, chapter.length);
        }


        const data = {
            url: url,
            name: name,
            chapter: chapter,
            manga: manga,

        }


        // console.log(url)
        $(item).append(`<btn-get v-bind:data="data" @selected-chapter="selected=$event"></btn-get>`)

        $(item).attr("v-bind:class", "{nselected: selected}")


        new Vue({
            el: item,
            data() {
                return {
                    data: data,
                    manga: manga,
                    selected: false,
                }
            },
            methods: {
                isSelected: function($event) {
                    console.log($event)
                }
            }


        })

    })



})



function loadStyles() {
    $("body").append(`
<style>
.nselected, .nselected a, .nselected div , .nselected p {
   background: #c5c5ff;
   text-color: white !important;
}
</style>
`)
}

function loadComponents() {



    Vue.component("main-control", {
        data: function() {
            return { selected: false }
        },
        methods: {
            isSelected: function() {
                this.$bus.$emit('selected-all', this.selected)
            }
        },
        template: `<span><input type="checkbox" v-model="selected" @change="isSelected()" /></span>`

    })


    

    Vue.component('btn-get', {
        mounted() {
            var vm = this
            this.$bus.$on("selected-all", (selected) => {
                this.selected = selected;
                console.log(selected)
                this.select()
            })
        },
        data: function() {
            return {
                selected: false,
            }
        },
        props: ["data"],
        methods: {
            select: function() {
                this.$emit('selected-chapter', this.selected)

            }
        },

        template: `<div><input type="checkbox" v-model="selected" @change="select"  /> select</div>`
    })




}