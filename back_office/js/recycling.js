/* ================================================================ *
    recycling.js ----- リサイクル料預託状況連動入力フィールド
* ================================================================ */

function changeRecycling() {
	radio = document.getElementsByName('data[ScrapAuction][recycling_deposit]');
	if (radio[1].checked || radio[2].checked) {
		document.getElementById('recyclingFeeSA').disabled = false;
	} else {
		document.getElementById('recyclingFeeSA').value = 0;
		document.getElementById('recyclingFeeSA').disabled = true;
	}
}

//function init_auction() {
//	checkPendingSchedule();
//	changeRecycling();
//}

//addOnload(changeRecycling);

//オンロードさせ、リロード時に選択を保持
//window.onload = init_auction;
