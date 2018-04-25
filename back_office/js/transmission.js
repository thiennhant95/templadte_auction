/* ================================================================ *
    transmission.js ---- トランスミッション連動変速数入力制約
* ================================================================ */
function changeTransmission(){
	if (document.getElementById('OwnCarTransmission1').checked) {
		document.getElementById('gear_number').disabled = false;
	} else {
		document.getElementById('gear_number').disabled = true;
	}
}

addOnload(changeTransmission);
