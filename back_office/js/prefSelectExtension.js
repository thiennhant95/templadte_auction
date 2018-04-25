// --------------------------------------------------------------------
// Author  : mashimonator
// Create  : 2009/10/07
// Update  : 2009/10/07
// Description : 都道府県選択プルダウンを使い易くする
// --------------------------------------------------------------------

/*@cc_on 
var doc = document;
eval('var document = doc');
@*/
var prefSelectExtension = {
	//-----------------------------------------
	// 設定値
	//-----------------------------------------
	conf : {
		targetClass : 'pref_name',
		selectSerial : 'prefSelectExtension_###_target',
		shimSerial : 'prefSelectExtension_###_shim',
		idBaseStr : 'prefSelectExtension',
		viewingSerial : null,
		viewingMenu : null,
		viewingShim : null,
		selectedPref : null,
		count : 0
	},
	//-----------------------------------------
	// 地方・都道府県（select要素にoptgroup要素が含まれない場合に使用する）
	//-----------------------------------------
	pref : [
		[ '北海道', [ '北海道' ] ],
		[ '東北', [ '青森県', '秋田県', '岩手県', '山形県', '宮城県', '福島県' ] ],
		[ '関東', [ '栃木県', '群馬県', '茨城県', '埼玉県', '千葉県', '東京都', '神奈川県' ] ],
		[ '中部', [ '山梨県', '長野県', '新潟県', '富山県', '石川県', '福井県', '静岡県', '岐阜県', '愛知県' ] ],
		[ '近畿', [ '三重県', '和歌山県', '奈良県', '滋賀県', '京都府', '大阪府', '兵庫県' ] ],
		[ '中国', [ '鳥取県', '岡山県', '島根県', '広島県', '山口県' ] ],
		[ '四国', [ '徳島県', '香川県', '愛媛県', '高知県' ] ],
		[ '九州', [ '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県' ] ]
	],
	//-----------------------------------------
	// 初期処理
	//-----------------------------------------
	init : function() {
		// 対象のselect要素を取得
		var selects = prefSelectExtension.getTargetElements('select', prefSelectExtension.conf.targetClass);
		var len = selects.length;
		if ( prefSelectExtension.isUnderIE7() ) {
			// ---IE7以下の場合
			for ( var i = 0; i < len; i++ ) {
				// select要素にシリアルを付加
				selects[i].className += ' ' + prefSelectExtension.getSelectSerial();
				// イベントに関数を付加
				selects[i].onmousedown = function() {
					var str = this.className.split('_');
					prefSelectExtension.createPulldown(str[1]);
				}
				// カウントアップ
				prefSelectExtension.conf.count += 1;
			}
		} else {
			// ---IE8,Firefox,Safarai,Opera,Chrome
			for ( var i = 0; i < len; i++ ) {
				// select要素にシリアルを付加
				selects[i].className += ' ' + prefSelectExtension.getSelectSerial();
				// select要素に拡張を施す
				prefSelectExtension.setExtension( selects[i] );
				// カウントアップ
				prefSelectExtension.conf.count += 1;
			}
		}
		// 疑似プルダウンの削除処理を付加
		prefSelectExtension.addEvent( document, 'click', prefSelectExtension.removePulldown );
	},
	//-----------------------------------------
	// select要素の拡張処理
	//-----------------------------------------
	setExtension : function( element ) {
		// select要素のサイズを取得
		var size = prefSelectExtension.getElementSize(element);
		// select要素のポジションを取得
		var pos = prefSelectExtension.getElementPosition(element);
		// select要素用のshimを生成
		prefSelectExtension.createShim( pos.top, pos.left, size.width, size.height, false );
		// select要素に被せるlayerを生成
		prefSelectExtension.createLayer( pos.top, pos.left, size.width, size.height );
	},
	//-----------------------------------------
	// 疑似プルダウンを表示する
	//-----------------------------------------
	createPulldown : function( serial ) {
		// 既に表示中のmenuがあれば削除する
		if ( prefSelectExtension.removePulldownInCreate(serial) ) {
			// クリックされた要素がプルダウン表示中のselect要素であれば抜ける
			return;
		}
		// クリックされたselect要素を取得
		var targetSerial = prefSelectExtension.conf.selectSerial.replace( '###', serial );
		var select = prefSelectExtension.getTargetElements( 'select', targetSerial );
		if ( prefSelectExtension.isUnderIE7() ) {
			select[0].disabled = true;
		}
		if ( select[0] ) {
			// div要素を生成
			var div = document.createElement('div');
			div.id = prefSelectExtension.conf.idBaseStr + '_menu';
			div.style.zIndex = '150';
			// dl要素を生成
			var dl = document.createElement('dl');
			dl.className = prefSelectExtension.conf.idBaseStr;
			// ---select要素にoptgroup要素が含まるか否かで分岐
			if ( !prefSelectExtension.existOptgroup(select[0]) ) {
				// selected属性が指定されている県を取得
				prefSelectExtension.conf.selectedPref = prefSelectExtension.getSelectedOption(select[0]);
				var areaLen = prefSelectExtension.pref.length;
				for ( var i = 0; i < areaLen; i++ ) {
					// dt要素を生成
					var dt = document.createElement('dt');
					dt.className = prefSelectExtension.conf.idBaseStr + '_areaLabel';
					dt.innerHTML = prefSelectExtension.pref[i][0];
					// dt要素をdl要素に追加
					dl.appendChild(dt);
					// dd要素を生成
					var dd = document.createElement('dd');
					dd.className = prefSelectExtension.conf.idBaseStr + '_area';
					// 地域に属する県の数だけLOOP
					var prefLen = prefSelectExtension.pref[i][1].length;
					for ( var x = 0; x < prefLen; x++ ) {
						if ( prefSelectExtension.conf.selectedPref && prefSelectExtension.pref[i][1][x].match(prefSelectExtension.conf.selectedPref) ) {
							// span要素を生成
							var span = document.createElement('span');
							span.className = prefSelectExtension.conf.idBaseStr + '_selected';
							span.innerHTML = prefSelectExtension.pref[i][1][x];
							// span要素をdd要素に追加
							dd.appendChild(span);
						} else {
							// a要素を生成
							var a = document.createElement('a');
							a.className = prefSelectExtension.conf.idBaseStr + '_link';
							a.innerHTML = prefSelectExtension.pref[i][1][x];
							// href属性をセット
							a.setAttribute('href',"javascript:prefSelectExtension.setSelectValue('" + prefSelectExtension.getOptionValueFromPrefName(select[0],prefSelectExtension.pref[i][1][x]) + "');");
							// a要素をdd要素に追加
							dd.appendChild(a);
						}
					}
					// dd要素をdl要素に追加
					dl.appendChild(dd);
				}
			} else {
				// select要素の子要素を取得
				var children = select[0].childNodes;
				var len = children.length;
				for (var i = 0; i < len; i++) {
					// 子要素がnodeの場合のみ処理
					if ( children[i].nodeType == '1' ) {
						if ( children[i].nodeName.match(/optgroup/i) ) {
							//--- optgroup要素の場合
							// dt要素を生成
							var dt = document.createElement('dt');
							dt.className = prefSelectExtension.conf.idBaseStr + '_areaLabel';
							dt.innerHTML = children[i].getAttribute('label');
							// dt要素をdl要素に追加
							dl.appendChild(dt);
							// optgroup要素の子要素を取得
							var grandchildren = children[i].childNodes;
							var len2 = grandchildren.length;
							// dd要素を生成
							var dd = document.createElement('dd');
							dd.className = prefSelectExtension.conf.idBaseStr + '_area';
							for (var x = 0; x < len2; x++) {
								if ( grandchildren[x].nodeType == '1' && grandchildren[x].nodeName.match(/option/i) ) {
									if ( !grandchildren[x].selected ) {
										// a要素を生成
										var a = document.createElement('a');
										a.className = prefSelectExtension.conf.idBaseStr + '_link';
										a.innerHTML = grandchildren[x].innerHTML;
										// href属性をセット
										a.setAttribute('href',"javascript:prefSelectExtension.setSelectValue('" + grandchildren[x].value + "');");
										// a要素をdd要素に追加
										dd.appendChild(a);
									} else {
										// span要素を生成
										var span = document.createElement('span');
										span.className = prefSelectExtension.conf.idBaseStr + '_selected';
										span.innerHTML = grandchildren[x].innerHTML;
										// span要素をdd要素に追加
										dd.appendChild(span);
									}
								}
							}
							// dd要素をdl要素に追加
							dl.appendChild(dd);
						}
					}
				}
			}
			// dl要素をdiv要素に追加
			div.appendChild(dl);
			div.style.position = 'absolute';
			div.style.visibility = 'hidden';
			div.style.top = '0px';
			div.style.left = '0px';
			// htmlに反映
			document.body.appendChild(div);
			// select要素のポジション・サイズを取得
			var pos = prefSelectExtension.getElementPosition( select[0] );
			var size = prefSelectExtension.getElementSize( select[0] );
			var divSize = prefSelectExtension.getElementSize( div );
			// ブラウザの画面サイズを取得
			var browserSize = prefSelectExtension.getBrowserSize();
			var tmpTop = 0;
			var tmpLeft = 0;
			// プルダウン表示位置（横）設定
			if ( (pos.left + size.width + divSize.width) <= browserSize.width ) {
				// 収まる場合
				tmpLeft = pos.left;
			} else {
				// はみ出る場合
				tmpLeft = (pos.left - (divSize.width - size.width));
			}
			// プルダウン表示位置（縦）設定
			if ( (pos.top + size.height + divSize.height) <= browserSize.height ) {
				// 収まる場合
				tmpTop = (pos.top + size.height + 1);
			} else {
				// はみ出る場合
				tmpTop = (pos.top - (divSize.height + 1));
			}
			// 高さと幅をセット
			div.style.left = tmpLeft + 'px';
			div.style.top = tmpTop + 'px';
			// 擬似プルダウンを表示
			div.style.visibility = 'visible';
			// 表示中の疑似プルダウンを保持
			prefSelectExtension.conf.viewingMenu = div;
			// 疑似プルダウンを表示中のselect要素のシリアルを保持
			prefSelectExtension.conf.viewingSerial = serial;
			// shimを生成
			prefSelectExtension.createShim( tmpTop, tmpLeft, div.scrollWidth, div.scrollHeight, true );
			// focusを移動
			div.focus();
		}
	},
	//-----------------------------------------
	// 疑似プルダウンで選択された値をselect要素にセットする
	//-----------------------------------------
	setSelectValue : function( index ) {
		// 対象のselect要素を取得
		var targetSerial = prefSelectExtension.conf.selectSerial.replace( '###', prefSelectExtension.conf.viewingSerial );
		var select = prefSelectExtension.getTargetElements( 'select', targetSerial );
		// 擬似プルダウンを削除
		prefSelectExtension.removePulldown();
		if ( index && select[0] ) {
			// 選択された値をselect要素に反映
			var optLen = select[0].options.length;
			for ( var i = 0; i < optLen; i++ ) {
				if ( select[0].options[i].value == index ) {
					select[0].selectedIndex = i;
				}
			}
			// focusを移動
			select[0].focus();
			// onchangeイベントを呼び出し
			if ( select[0].onchange ) {
				select[0].onchange();
			}
		}
	},
	//-----------------------------------------
	// 疑似プルダウンを削除する（新規プルダウン生成時）
	//-----------------------------------------
	removePulldownInCreate : function ( serial ) {
		var state = false;
		// 既に表示中のmenuがあれば削除する
		if ( prefSelectExtension.conf.viewingSerial ) {
			var viewingSerial = prefSelectExtension.conf.viewingSerial;
			document.body.removeChild(prefSelectExtension.conf.viewingMenu);
			prefSelectExtension.conf.viewingMenu = null;
			document.body.removeChild(prefSelectExtension.conf.viewingShim);
			prefSelectExtension.conf.viewingShim = null;
			if ( prefSelectExtension.isUnderIE7() ) {
				prefSelectExtension.changeSelectDisabled( prefSelectExtension.conf.viewingSerial, false);
			}
			prefSelectExtension.conf.viewingSerial = null;
			if ( viewingSerial == serial ) {
				// クリックされた要素がプルダウン表示中のselect要素であればtrueをセット
				state = true;
			}
		}
		return state;
	},
	//-----------------------------------------
	// 疑似プルダウンを削除する
	//-----------------------------------------
	removePulldown : function( event ) {
		var element;
		// イベント発生元の要素を取得
		if ( event && event.target ) {
			element = event.target;
		} else if ( window.event && window.event.srcElement ) {
			element = window.event.srcElement;
		}
		if ( element ) {
			// 擬似プルダウンがイベント発生元の場合は抜ける
			if ( prefSelectExtension.checkEventTarget(element) ) {
				if ( prefSelectExtension.isFirefox() ) {
					// イベントをキャンセル
					event.returnValue = false;
					event.cancelBubble = true;
				}
				return;
			}
			// layerがイベント発生元の場合は抜ける
			if ( !prefSelectExtension.isUnderIE7() ) {
				var str = prefSelectExtension.conf.shimSerial.split('_');
				var divs = prefSelectExtension.getTargetElements('div', str[0]);
				var len = divs.length;
				for ( var i = 0; i < len; i++ ) {
					if (  element == divs[i] ) {
						// イベントをキャンセル
						event.returnValue = false;
						event.cancelBubble = true;
						return;
					}
				}
			}
		}
		// 擬似プルダウンを削除
		if ( prefSelectExtension.conf.viewingSerial ) {
			document.body.removeChild(prefSelectExtension.conf.viewingMenu);
			prefSelectExtension.conf.viewingMenu = null;
			document.body.removeChild(prefSelectExtension.conf.viewingShim);
			prefSelectExtension.conf.viewingShim = null;
			if ( prefSelectExtension.isUnderIE7() ) {
				prefSelectExtension.changeSelectDisabled( prefSelectExtension.conf.viewingSerial, false);
			}
			prefSelectExtension.conf.viewingSerial = null;
		}
	},
	//-----------------------------------------
	// select要素に被せるlayerを生成する
	//-----------------------------------------
	createLayer : function( top, left, width, height ) {
		// div要素を生成
		var div = document.createElement('div');
		// div要素にシリアルを付加
		div.className += ' ' + prefSelectExtension.getShimSerial();
		// 基本スタイル設定
		div.style.zIndex = '200';
		// 透明度設定
		if ( !prefSelectExtension.isIE8() ) {
			div.style.opacity = .00;
			div.style.filter = 'alpha(opacity=0)';
			div.alpha = 0;
		}
		// サイズ設定
		div.style.width = width + 'px';
		div.style.height = ( height + 2) + 'px';
		// ポジション設定
		div.style.position = 'absolute';
		div.style.top = top + 'px';
		div.style.left = left + 'px';
		// イベントに関数を付加
		div.onmousedown = function() {
			var str = this.className.split('_');
			prefSelectExtension.createPulldown(str[1]);
		}
		// htmlに反映
		document.body.appendChild(div);
	},
	//-----------------------------------------
	// shimを生成する
	//-----------------------------------------
	createShim : function( top, left, width, height, flg ) {
		// iframe要素を生成
		var iframe = document.createElement('iframe');
		// idを設定
		if ( flg ) {
			iframe.id = prefSelectExtension.conf.idBaseStr + '_shim';
		}
		// 基本スタイル設定
		iframe.setAttribute('frameBorder', '0');
		iframe.setAttribute('scrolling', 'no');
		iframe.style.border = 'none';
		iframe.style.zIndex = '100';
		// 透明度設定
		if ( !prefSelectExtension.isUnderIE7() ) {
			iframe.style.opacity = .00;
			iframe.style.filter = 'alpha(opacity=0)';
			iframe.alpha = 0;
			iframe.allowTransparency = 'true';
		}
		// サイズ設定
		iframe.style.width = width + 'px';
		if ( flg ) {
			iframe.style.height = height + 'px';
		} else {
			iframe.style.height = ( height + 2 ) + 'px';
		}
		// ポジション設定
		iframe.style.position = 'absolute';
		iframe.style.top = top + 'px';
		iframe.style.left = left + 'px';
		// htmlに反映
		document.body.appendChild(iframe);
		if ( flg ) {
			prefSelectExtension.conf.viewingShim = iframe;
		}
	},
	//-----------------------------------------
	// select要素のdisabledを切り替える（IE7以下のみ使用）
	//-----------------------------------------
	changeSelectDisabled : function( serial, state ) {
		var select = prefSelectExtension.getTargetElements( 'select', serial );
		var len = select.length;
		for (var i = 0; i < len; i++) {
			select[i].disabled = state;
		}
	},
	//-----------------------------------------
	// イベント発生元が擬似プルダウンかを判定する
	//-----------------------------------------
	checkEventTarget : function( element ) {
		var result = false;
		if ( element.nodeType == '1' && element.className.match(prefSelectExtension.conf.idBaseStr) ) {
			result = true;
		}
		return result;
	},
	//-----------------------------------------
	// select要素にoptgroupが含まれるかを返す
	//-----------------------------------------
	existOptgroup : function( element ) {
		var optgroup = element.getElementsByTagName('OPTGROUP');
		if ( optgroup.length && optgroup.length > 0 ) {
			return true;
		} else {
			return false;
		}
	},
	//-----------------------------------------
	// selected属性が指定されているoption要素の県名を返す
	//-----------------------------------------
	getSelectedOption : function( element ) {
		var result = false;
		var opt = element.getElementsByTagName('OPTION');
		var len = opt.length;
		for (var i = 0; i < len; i++) {
			if ( opt[i].selected ) {
				result = opt[i].innerHTML;
				break;
			}
		}
		return result;
	},
	//-----------------------------------------
	// 県名からvalueを取得して返す
	//-----------------------------------------
	getOptionValueFromPrefName : function( element, prefName ) {
		var result = false;
		var opt = element.getElementsByTagName('OPTION');
		var len = opt.length;
		for (var i = 0; i < len; i++) {
			if ( opt[i].innerHTML.match(prefName) ) {
				result = opt[i].getAttribute('value');
				break;
			}
		}
		return result;
	},
	//-----------------------------------------
	// select要素用シリアルを返す
	//-----------------------------------------
	getSelectSerial : function() {
		return prefSelectExtension.conf.selectSerial.replace( '###', prefSelectExtension.conf.count );
	},
	//-----------------------------------------
	// shim用シリアルを返す
	//-----------------------------------------
	getShimSerial : function() {
		return prefSelectExtension.conf.shimSerial.replace( '###', prefSelectExtension.conf.count );
	},
	//-----------------------------------------
	// 対象要素のサイズを取得する
	//-----------------------------------------
	getElementSize : function( element ) {
		var w = element.offsetWidth;
		var h = element.offsetHeight;
		return ({ 'width': w, 'height': h });
	},
	//-----------------------------------------
	// ブラウザの画面サイズを取得する
	//-----------------------------------------
	getBrowserSize : function() {
		var w = 0;
		var h = 0;
		if ( window.innerWidth ) {
			w = window.innerWidth;
		} else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
			w = document.documentElement.clientWidth;
		} else if ( document.body ) {
			w = document.body.clientWidth;
		}
		w = (document.documentElement.scrollLeft || document.body.scrollLeft) + w;
		if ( window.innerHeight ) {
			h = window.innerHeight;
		} else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
			h = document.documentElement.clientHeight;
		} else if ( document.body ) {
			h = document.body.clientHeight;
		}
		h = (document.documentElement.scrollTop || document.body.scrollTop) + h;
		return ({ 'width': w, 'height': h });
	},
	//-----------------------------------------
	// 対象要素のポジションを取得する
	//-----------------------------------------
	getElementPosition : function( element ) {
		var offsetTrail = (typeof element == 'string') ? document.getElementById(element): element;
		var x = 0;
		var y = 0;
		while (offsetTrail) {
			x += offsetTrail.offsetLeft;
			y += offsetTrail.offsetTop;
			offsetTrail = offsetTrail.offsetParent;
		}
		if ( navigator.userAgent.indexOf('Mac') != -1 && typeof doc.body.leftMargin != 'undefined' ) {
			x += document.body.leftMargin;
			y += document.body.topMargin;
		}
		return ({ 'left': x, 'top': y });
	},
	//-----------------------------------------
	// ターゲットタグを取得する
	//-----------------------------------------
	getTargetElements : function( tag, cls ) {
		var elements = new Array();
		var targetElements = document.getElementsByTagName(tag.toUpperCase());
		var len = targetElements.length;
		for ( var i = 0; i < len; i++ ) {
			if ( targetElements[i].className.match(cls) ) {
				elements[elements.length] = targetElements[i];
			}
		}
		return elements;
	},
	//-----------------------------------------
	// IE判定
	//-----------------------------------------
	isIE : function() {
		IE='\v'=='v';
		if(IE){
			return true;
		}else{
			return false;
		}
	},
	//-----------------------------------------
	// IE7以下判定
	//-----------------------------------------
	isUnderIE7 : function() {
		IE='\v'=='v';
		if ( IE ) {
			if ( document.documentMode ) {
				if ( document.documentMode == '7' || document.documentMode == '5' ) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		} else {
			return false;
		}
	},
	//-----------------------------------------
	// IE8判定
	//-----------------------------------------
	isIE8 : function() {
		IE='\v'=='v';
		if( IE && document.documentMode && document.documentMode != '7' && document.documentMode != '5' ){
			return true;
		}else{
			return false;
		}
	},
	//-----------------------------------------
	// Firefox判定
	//-----------------------------------------
	isFirefox : function() {
		FF=/a/[-1]=='a';
		if(FF){
			return true;
		}else{
			return false;
		}
	},
	//-----------------------------------------
	// イベントに関数を付加する
	//-----------------------------------------
	addEvent : function( target, event, func ) {
		try {
			target.addEventListener(event, func, false);
		} catch (e) {
			target.attachEvent('on' + event, func);
		}
	}
}
// 実行
prefSelectExtension.addEvent( window, 'load', prefSelectExtension.init );