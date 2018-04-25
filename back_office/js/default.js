/* ================================================================ *
    default.js
* ================================================================ */
function addOnload(func) {
	try {
		window.addEventListener("load", func, false);
	} catch (e) {
		window.attachEvent("onload", func);
	}
}

// 3桁数値区切り
function addFigure(str) {
	var num = new String(str).replace(/,/g, "");
	while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
	return num;
}

function delFigure(str) {
	var num = new String(str).replace(/,/g, "");
	return num;
}
