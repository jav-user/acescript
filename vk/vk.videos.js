// ==UserScript==
// @name VKVids
// @namespace VKVids Script
// @match https://vk.com/search
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js
// @grant none
// ==/UserScript==

function createGUIHeader() {

    $("#search_header").before(`<div>
      <input id="nselectv" 
      type="checkbox"/> Select All
      <button type="button" id="copy-selected">copy selected</button>
    </div>`)

    $("#nselectv").on("change", function() {
        var checked = this.checked
        console.log("checked", checked)
        $(".nselectv").prop("checked", checked).trigger("change");
    })

    $("#copy-selected").on("click", function() {
        var selections = []
        $(".nselectv:checked").each((i, selection) => {
            selections.push($(selection).val())
        })
        new nstring(selections.join("\n")).copy()
        alert(selections.length +" links copied!")
    })
}

function createGUIItems() {
    if (!$(".video_item:not(.ndev)")) return false;
    $(".video_item:not(.ndev)").each((i, item) => {
        var title = $(item).find(".video_item_title").text().trim()
        var url = $(item).find(".video_item_title").prop("href").trim()

        $(item).append(`
  <div 
    title="Select ${title}"
    class="ndev"
    >
    <input
      data-item="${$(item).attr('id')}"
      value="${url}"
      class="nselectv"
      type="checkbox"/>Seleccionar
  </div>
`).addClass("ndev")

    })

    $(".nselectv:not(.nfunction)").each((i, select) => {
        var $item = $("#" + $(select).attr("data-item"))
        //console.log($item)
        
        $(select).on("change", function() {
          var checked = this.checked
            $item.toggleClass("nchecked", checked)
            $(select).parent().toggleClass('nchecked', checked);
            var selected=$(".nselectv:checked").length;
            $("#copy-selected").text(`copy selected (${selected})`)
        })
        $(select).addClass("nfunction")
    })

}


function createStyles() {

    $("head").append(`<style>
.nchecked{
  background-color: #cce9ff !important;
}
</style>`)

}

$(document).ready(() => {

    createGUIHeader();

    setInterval(() => {

        createGUIItems()

    }, 5 * 1000)

    createStyles();
})