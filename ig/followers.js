//FOLLOW IG

var fromfollow = ".isgrP";
var fromlikes = ".Igw0E.IwRSH.eGOV_.vwCYk.i0EQd > div";

var fdate = new Date().toString();
var ldate = new Date().toString();
var counter = 0;
var div = document.querySelector(fromfollow);

var btntxt = "";

var i = setInterval(() => {
	var btn = getBtn();

	if (btn) {
		btntmp = btn.parentNode.parentNode.innerText.trim();
		ldate = new Date().toString();

		console.log(btntmp);
		console.log(ldate);

		if (btntmp == btntxt) {
			clearInterval(i);
			console.log(fdate + "\n" + ldate + "\n" + counter);
			console.log("done...");
			return false;
		}
		btn.click();
		btntxt = btntmp;
		counter++;
	}
	div.scrollBy(0, 55);
}, 35 * 1000);

function getBtn() {
	var btns = Array.from(div.querySelectorAll("button")).filter(
		(btn) => btn.innerText.trim() == "Seguir"
	);

	return btns[0];
}
