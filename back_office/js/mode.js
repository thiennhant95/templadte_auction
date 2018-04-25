/* ================================================================ *
    mode.js ---- 計上方法連動入力フィールド
* ================================================================ */

function changeMode() {
	var sale_data = {};
	//成約番号
	sale_data.agreement_order_id = $('#agreement_order_id').val();
	if( !sale_data.agreement_order_id ){
		console.log('AgreementOrderId not found');
		return;
	}

	//計上方式
	if( document.getElementById('SaleMode1') && document.getElementById('SaleMode1').checked ){
		sale_data.mode = 1;
	} else if( document.getElementById('SaleMode2') && document.getElementById('SaleMode2').checked){
		sale_data.mode = 2;
	}

	//販路
	if(document.getElementById('sales_contact')){
		sale_data.sales_contact = parseInt(document.getElementById('sales_contact').value,10);
	}

	//落札手数料
	if( document.getElementById('SaleSuccessfulFee')){
		sale_data.successful_fee = parseInt(document.getElementById('SaleSuccessfulFee').value, 10) || 0;
	}

	//還付金
	if( document.getElementById('SaleRefund')){
		sale_data.refund = parseInt(document.getElementById('SaleRefund').value, 10);
	}

	//車両本体額
	if( document.getElementById('vehicle_price')){
		sale_data.vehicle_price = parseInt(document.getElementById('vehicle_price').value, 10);
	}

	//販売額
	if( document.getElementById('sales_price')){
		sale_data.sales_price = parseInt(document.getElementById('sales_price').value, 10);
	}

	//リサイクル料金
	if( document.getElementById('sales_recycling_fee')){
		sale_data.recycling_fee = parseInt(document.getElementById('sales_recycling_fee').value, 10);
	}

	//差引額
	if( document.getElementById('balance')){
		sale_data.balance = parseInt(document.getElementById('balance').value, 10);
	}

	//代行手数料
	if(document.getElementById('SaleAgencyDisposal')){
		sale_data.agency_disposal = parseInt(document.getElementById('SaleAgencyDisposal').value, 10);
	}

	$.ajax({
		'url': '../../Sales/calculate_including_tax',
		'type': 'POST',
		'dataType': 'JSON',
		'data': sale_data
	}).done(function( json ){
		if ( json.Sale.mode == '1') {
			if( document.getElementById('salesPrice')){
				document.getElementById('salesPrice').style.display = "";
			}
			if( document.getElementById('vehiclePrice')){
				document.getElementById('vehiclePrice').style.display = "none";
			}
			if( document.getElementById('recyclingFee')){
				document.getElementById('recyclingFee').style.display = "none";
			}
			if( document.getElementById('sale_agency_disposal_tr')){
				document.getElementById('sale_agency_disposal_tr').style.display = "none";
			}

		} else if (json.Sale.mode == '2') {
			if( document.getElementById('salesPrice')){
				document.getElementById('salesPrice').style.display = "none";
			}
			if( document.getElementById('vehiclePrice')){
				document.getElementById('vehiclePrice').style.display = "";
			}
			if( document.getElementById('recyclingFee')){
				document.getElementById('recyclingFee').style.display = "";
			}
			if( document.getElementById('sale_agency_disposal_tr')){
				document.getElementById('sale_agency_disposal_tr').style.display = "";
			}
		}
		var sum_price_string = String(parseInt(json.Sale.including_tax)).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' );
		document.getElementById('including_tax_output').innerHTML = sum_price_string + " 円";

	}).fail(function(){
		console.log('changeMode failed');
	})


}

addOnload(changeMode);
