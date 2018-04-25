/* ================================================================ *
    schedule.js ---- 日程確認待連動引取予定日入力制約
* ================================================================ */
function checkPendingSchedule(){
	if( document.getElementById('chk_pending_schedule').checked ){
		document.getElementById('trade_datepicker').value = "";
		document.getElementById('TradeScheduleTime1').checked = false;
		document.getElementById('TradeScheduleTime2').checked = false;
		document.getElementById('TradeScheduleTime0').checked = true;
		document.getElementById('trade_datepicker').disabled = true;
		document.getElementById('TradeScheduleTime1').disabled = true;
		document.getElementById('TradeScheduleTime2').disabled = true;
		document.getElementById('TradeScheduleTime0').disabled = true;
		document.getElementById('trade_datepicker2').value = "";
		document.getElementById('TradeScheduleTime21').checked = false;
		document.getElementById('TradeScheduleTime22').checked = false;
		document.getElementById('TradeScheduleTime20').checked = true;
		document.getElementById('trade_datepicker2').disabled = true;
		document.getElementById('TradeScheduleTime21').disabled = true;
		document.getElementById('TradeScheduleTime22').disabled = true;
		document.getElementById('TradeScheduleTime20').disabled = true;
	} else {
		document.getElementById('trade_datepicker').disabled = false;
		document.getElementById('TradeScheduleTime1').disabled = false;
		document.getElementById('TradeScheduleTime2').disabled = false;
		document.getElementById('TradeScheduleTime0').disabled = false;
		document.getElementById('trade_datepicker2').disabled = false;
		document.getElementById('TradeScheduleTime21').disabled = false;
		document.getElementById('TradeScheduleTime22').disabled = false;
		document.getElementById('TradeScheduleTime20').disabled = false;
	}
}

addOnload(checkPendingSchedule);

//オンロードさせ、リロード時に選択を保持
//window.onload = checkPendingSchedule;
