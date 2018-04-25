// CTI発信 (Click to Call)
$(document).on('click', '.call_phone', function(){
	var call_link = $(this);
	var div = $(this).parent();
	var incoming_number = call_link.attr('incoming_number');
	var dial_number = call_link.attr('dial_number');
	var speaker_cd = call_link.attr('speaker_cd');
	var inquiry_id = call_link.attr('inquiry_id');

	if (inquiry_id == '') {
		alert('問合情報が登録されていません。');
		return false;
	}

	if (confirm(incoming_number + ' に電話をかけますか？')) {
		var prev_html = div.html();
		$(this).hide();
		div.html('<img src="/crm/img/load-12px.gif" id="loading" alt="loading" />');
		$.ajax({
			type: 'POST',
			url: '/crm/Cti/dial',
			datatype: 'json',
			data: {
				'inquiry_id' : inquiry_id,
				'dial_number' : dial_number,
				'incoming_number' : incoming_number,
				'speaker_cd' : speaker_cd
			}
		})
			.done(function(data){
				if (data == '') {
					alert('電話の発信に失敗しました。');
					div.html(prev_html);
				} else {
					var json = $.parseJSON(data);
					location.href = 'calltocm:' + json.incoming_number + ':' + dial_number;
					div.html(prev_html);
				}
			})
			.fail(function(jqXHR, textStatus) {
				alert('電話の発信ができませんでした。');
				div.html(prev_html);
			});
		return false;
	} else {
		return false;
	}
});
