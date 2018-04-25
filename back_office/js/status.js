/* ================================================================ *
    status.js ---- ステータス連動入力フィールド
* ================================================================ */

function entryChange(){
	if(document.getElementById('changeSelect')){
		switch (document.getElementById('changeSelect').value) {
			case '0':
				document.getElementById('agreementArea1').style.display = "none";
				document.getElementById('rephoneArea1').style.display = "none";
				document.getElementById('rephoneArea2').style.display = "none";
				document.getElementById('rephoneArea3').style.display = "none";
				document.getElementById('rephoneArea4').style.display = "none";
				document.getElementById('failureArea1').style.display = "";
				document.getElementById('failureArea2').style.display = "";
				break;

			case '1':
			case '6':
				document.getElementById('agreementArea1').style.display = "none";
				document.getElementById('rephoneArea1').style.display = "none";
				document.getElementById('rephoneArea2').style.display = "";
				document.getElementById('rephoneArea3').style.display = "none";
				document.getElementById('rephoneArea4').style.display = "";
				document.getElementById('failureArea1').style.display = "none";
				document.getElementById('failureArea2').style.display = "none";
				break;

			case '3':
				document.getElementById('agreementArea1').style.display = "none";
				document.getElementById('rephoneArea1').style.display = "";
				document.getElementById('rephoneArea2').style.display = "";
				document.getElementById('rephoneArea3').style.display = "";
				document.getElementById('rephoneArea4').style.display = "";
				document.getElementById('failureArea1').style.display = "none";
				document.getElementById('failureArea2').style.display = "none";
				break;

			case '9':
				document.getElementById('agreementArea1').style.display = "";
				document.getElementById('rephoneArea1').style.display = "none";
				document.getElementById('rephoneArea2').style.display = "none";
				document.getElementById('rephoneArea3').style.display = "none";
				document.getElementById('rephoneArea4').style.display = "none";
				document.getElementById('failureArea1').style.display = "none";
				document.getElementById('failureArea2').style.display = "none";
				break;

			default:
				document.getElementById('agreementArea1').style.display = "none";
				document.getElementById('rephoneArea1').style.display = "none";
				document.getElementById('rephoneArea2').style.display = "none";
				document.getElementById('rephoneArea3').style.display = "none";
				document.getElementById('rephoneArea4').style.display = "none";
				document.getElementById('failureArea1').style.display = "none";
				document.getElementById('failureArea2').style.display = "none";
		}
	}
}

function statusChange(){
	radio = document.getElementsByName('data[Inquiry][status_cd]');

	if (radio[0].checked) {
		document.getElementById('agreementArea1').style.display = "none";
		document.getElementById('rephoneArea1').style.display = "none";
		document.getElementById('rephoneArea2').style.display = "none";
		document.getElementById('rephoneArea3').style.display = "none";
		document.getElementById('rephoneArea4').style.display = "none";
		document.getElementById('failureArea1').style.display = "";
		document.getElementById('failureArea2').style.display = "";
	} else if (radio[1].checked) {
		document.getElementById('agreementArea1').style.display = "none";
		document.getElementById('rephoneArea1').style.display = "none";
		document.getElementById('rephoneArea2').style.display = "";
		document.getElementById('rephoneArea3').style.display = "none";
		document.getElementById('rephoneArea4').style.display = "";
		document.getElementById('failureArea1').style.display = "none";
		document.getElementById('failureArea2').style.display = "none";
	} else if (radio[3].checked) {
		document.getElementById('agreementArea1').style.display = "none";
		document.getElementById('rephoneArea1').style.display = "";
		document.getElementById('rephoneArea2').style.display = "";
		document.getElementById('rephoneArea3').style.display = "";
		document.getElementById('rephoneArea4').style.display = "";
		document.getElementById('failureArea1').style.display = "none";
		document.getElementById('failureArea2').style.display = "none";
	} else if (radio[6].checked) {
		document.getElementById('agreementArea1').style.display = "none";
		document.getElementById('rephoneArea1').style.display = "none";
		document.getElementById('rephoneArea2').style.display = "";
		document.getElementById('rephoneArea3').style.display = "none";
		document.getElementById('rephoneArea4').style.display = "";
		document.getElementById('failureArea1').style.display = "none";
		document.getElementById('failureArea2').style.display = "none";
	} else if (radio[7].checked) {
		document.getElementById('agreementArea1').style.display = "none";
		document.getElementById('rephoneArea1').style.display = "none";
		document.getElementById('rephoneArea2').style.display = "";
		document.getElementById('rephoneArea3').style.display = "none";
		document.getElementById('rephoneArea4').style.display = "";
		document.getElementById('failureArea1').style.display = "none";
		document.getElementById('failureArea2').style.display = "none";
	} else if (radio[8].checked) {
		document.getElementById('agreementArea1').style.display = "";
		document.getElementById('rephoneArea1').style.display = "none";
		document.getElementById('rephoneArea2').style.display = "none";
		document.getElementById('rephoneArea3').style.display = "none";
		document.getElementById('rephoneArea4').style.display = "none";
		document.getElementById('failureArea1').style.display = "none";
		document.getElementById('failureArea2').style.display = "none";
	} else {
		document.getElementById('agreementArea1').style.display = "none";
		document.getElementById('rephoneArea1').style.display = "none";
		document.getElementById('rephoneArea2').style.display = "none";
		document.getElementById('rephoneArea3').style.display = "none";
		document.getElementById('rephoneArea4').style.display = "none";
		document.getElementById('failureArea1').style.display = "none";
		document.getElementById('failureArea2').style.display = "none";
	}
}

addOnload(entryChange);
addOnload(statusChange);
