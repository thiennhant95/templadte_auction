/*
* 桁　西暦などの汎用関数
*
*/

//元号→西暦
function era_to_ad( era_name , era_year ){
	if( isNaN( era_year ) ){
		return '';
	}
	era_year = parseInt(era_year,10);
	var ad = 0;
	if( era_name == 'H' || era_name == '平成'){
		ad = 1988 + era_year;
	} else if( (era_name == 'S' || era_name == '昭和') &&  65 > era_year ){
		ad = 1925 + era_year;
	} else {
		ad = '';
	}
	return ad;
}

//ページ内フォームデータの一括取得
function get_form_data(){
	if( typeof $ == 'undefined'){
		return null;
	}
	var result = {};
	$('input').each(function(){
		var type = $(this).attr('type');
		if( type == 'checkbox' ){
			if($(this).prop('checked')){
				result[$(this).attr('name')] = $(this).val();
			}
		} else if( type == 'radio' ){
			if( $(this).prop('selected') ){
				result[$(this).attr('name')] = $(this).val();
			}
		} else {
			result[$(this).attr('name')] = $(this).val();
		}
	});

	$('textarea').each(function(){
		result[$(this).attr('name')] = $(this).val();
	});

	$('select').each(function(){
		result[$(this).attr('name')] = $(this).val();
	});
	return result;
}
/*
* pickOutNumber 数字以外文字削除 for Javascript
* @params (String) str
* @returns (String) result
*/

function pickOutNumber( val ){
	val = '' + val;	
	return val.replace(/[^0-9０－９]/g,'');
}

