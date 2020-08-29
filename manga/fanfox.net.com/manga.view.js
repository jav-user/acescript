const $lista, $chapters;

/**
 * MAIN MENU
 */
const menuHtml = `
	<span class='nes'>
		<input type='checkbox' name='select-all' onchange="selectAll()"/>
		<label>Select All</label>
		<button name='get-interval' onclick="getInterval()">Get Interval</button>
		<button name='get-selected' onclick="getSelected()">Get Selected</button>
		<button name="copy-selected" onclick="copySelected()">Copy Selected</button>
	</span>`;

/**
 * CHAPTER
 */
const nselector = new html(`
	<span>
		<hr/>
		<input type='checkbox' name="select" onchange="selectChapter({{id}})"/>
	</span> `);

const nbtns = new html(`
	<span class='nes'>
		<span>
			<button  name="get" onclick="getChapter({{id}})">Get pages</button>
			<button  name="copy" onclick="copyChapter({{id}})">Copy</button>
		</span>
		<hr/>
	</span>`);

function createGUI() {
	 $lista = $("ul.detail-main-list");
	 $chapters = $lista.children("li");

	$lista.parent().parent().before($(menuHtml));

	$chapters.each((i, chapter) => {
		const $chapter = $(chapter).show();

		var chapter = {
			url: $chapter.find("a")[0].href,
			name: nstring($chapter.find(".title3").text())
				.validFN()
				.exec()
				.trim(),
			$chapter: $chapter,
		};
		chapter.id = getChapterId($chapter);

		var $selector = nselector.mustache("id", chapter.id).$();
		var $btns = nbtns.mustache("id", chapter.id).$();

		$chapter.find("a").before($selector).after($btns);

		chapters[chapter.id] = chapter;
	});
}
