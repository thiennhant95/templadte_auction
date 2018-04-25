/* ================================================================ *
    contact.js ---- 販売先変更時の販売先クリア
* ================================================================ */
function clearSalesContactInfo(){
	document.getElementById('contact_name').value = "";
	document.getElementById('contact_cd').value = "";
	document.getElementById('contact_cd_output').innerHTML = "";
	document.getElementById('contact_phone_number_div').innerHTML = "";
}

function clearSalesContactCode() {
	document.getElementById('contact_cd').value = "";
	document.getElementById('contact_cd_output').innerHTML = "";
	document.getElementById('contact_phone_number_div').innerHTML = "";
}

function changeSalesContactInfo(){
	if (document.getElementById('sales_contact1').value == '9') {
		document.getElementById('contact_name1').value = document.getElementById('customer_name').value;
		document.getElementById('contact_cd1').value = document.getElementById('customer_cd').value;
		document.getElementById('contact_cd_output1').innerHTML = document.getElementById('customer_cd').value;
	} else {
		document.getElementById('contact_name1').value = document.getElementById('contact_name').innerHTML;
		document.getElementById('contact_cd1').value = document.getElementById('contact_cd').value;
		document.getElementById('contact_cd_output1').innerHTML = document.getElementById('contact_cd').value;
	}
}

function changeSalesContactCode() {
	document.getElementById('contact_cd1').value = "";
	document.getElementById('contact_cd_output1').innerHTML = "";
}
