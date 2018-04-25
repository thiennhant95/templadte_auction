/* ================================================================ *
    classification.js ---- 車両区分連動軽自動車排気量表示
* ================================================================ */
function changeDisplacement(){
	if (document.getElementById('displacement').value == "") {
		if (document.getElementById('OwnCarCarClassification2').checked) {
			document.getElementById('displacement').value = "660";
		} else if (document.getElementById('OwnCarCarClassification1').checked) {
			document.getElementById('displacement').value = "";
		}
	}
}
