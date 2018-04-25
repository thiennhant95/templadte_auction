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
var mileageSelectExtension = {
	//-----------------------------------------
	// 設定値
	//-----------------------------------------
	conf : {
		targetClass : 'mileage',
		selectSerial : 'mileageSelectExtension_###_target',
		shimSerial : 'mileageSelectExtension_###_shim',
		idBaseStr : 'mileageSelectExtension',
		viewingSerial : null,
		viewingMenu : null,
		viewingShim : null,
		selectedPref : null,
		count : 0
	},
	//-----------------------------------------
	// 地方・都道府県（select要素にoptgroup要素が含まれない場合に使用する）
	//-----------------------------------------
	mileage : [
		[ '', [ '0～9,999km', '10,000～19,999km', '20,000～29,999km', '30,000～39,999km', '40,000～49,999km' ] ],
		[ '', [ '50,000～59,999km', '60,000～69,999km', '70,000～79,999km', '80,000～89,999km', '90,000～99,999km' ] ],
		[ '', [ '100,000～109,999km', '110,000～119,999km', '120,000～129,999km', '130,000～139,999km', '140,000～149,999km' ] ],
		[ '', [ '150,000～159,999km', '160,000～169,999km', '170,000～179,999km', '180,000～189,999km', '190,000～199,999km' ] ],
		[ '', [ '200,000km以上' ] ]
	],
	//-----------------------------------------
	// 初期処理
	//-----------------------------------------
	init : function() {
		// 対象のselect要素を取得
		var selects = mileageSelectExtension.getTargetElements('select', mileageSelectExtension.conf.targetClass);
		var len = selects.length;
		if ( mileageSelectExtension.isUnderIE7() ) {
			// ---IE7以下の場合
			for ( var i = 0; i < len; i++ ) {
				// select要素にシリアルを付加
				selects[i].className += ' ' + mileageSelectExtension.getSelectSerial();
				// イベントに関数を付加
				selects[i].onmousedown = function() {
					var str = this.className.split('_');
					mileageSelectExtension.createPulldown(str[1]);
				}
				// カウントアップ
				mileageSelectExtension.conf.count += 1;
			}
		} else {
			// ---IE8,Firefox,Safarai,Opera,Chrome
			for ( var i = 0; i < len; i++ ) {
				// select要素にシリアルを付加
				selects[i].className += ' ' + mileageSelectExtension.getSelectSerial();
				// select要素に拡張を施す
				mileageSelectExtension.setExtension( selects[i] );
				// カウントアップ
				mileageSelectExtension.conf.count += 1;
			}
		}
		// 疑似プルダウンの削除処理を付加
		mileageSelectExtension.addEvent( document, 'click', mileageSelectExtension.removePulldown );
	},
	//-----------------------------------------
	// select要素の拡張処理
	//-----------------------------------------
	setExtension : function( element ) {
		// select要素のサイズを取得
		var size = mileageSelectExtension.getElementSize(element);
		// select要素のポジションを取得
		var pos = mileageSelectExtension.getElementPosition(element);
		// select要素用のshimを生成
		mileageSelectExtension.createShim( pos.top, pos.left, size.width, size.height, false );
		// select要素に被せるlayerを生成
		mileageSelectExtension.createLayer( pos.top, pos.left, size.width, size.height );
	},
	//-----------------------------------------
	// 疑似プルダウンを表示する
	//-----------------------------------------
	createPulldown : function( serial ) {
		// 既に表示中のmenuがあれば削除する
		if ( mileageSelectExtension.removePulldownInCreate(serial) ) {
			// クリックされた要素がプルダウン表示中のselect要素であれば抜ける
			return;
		}
		// クリックされたselect要素を取得
		var targetSerial = mileageSelectExtension.conf.selectSerial.replace( '###', serial );
		var select = mileageSelectExtension.getTargetElements( 'select', targetSerial );
		if ( mileageSelectExtension.isUnderIE7() ) {
			select[0].disabled = true;
		}
		if ( select[0] ) {
			// div要素を生成
			var div = document.createElement('div');
			div.id = mileageSelectExtension.conf.idBaseStr + '_menu';
			div.style.zIndex = '150';
			// dl要素を生成
			var dl = document.createElement('dl');
			dl.className = mileageSelectExtension.conf.idBaseStr;
			// ---select要素にoptgroup要素が含まるか否かで分岐
			if ( !mileageSelectExtension.existOptgroup(select[0]) ) {
				// selected属性が指定されている県を取得
				mileageSelectExtension.conf.selectedPref = mileageSelectExtension.getSelectedOption(select[0]);
				var areaLen = mileageSelectExtension.mileage.length;
				for ( var i = 0; i < areaLen; i++ ) {
					// dt要素を生成
					//var dt = document.createElement('dt');
					//dt.className = mileageSelectExtension.conf.idBaseStr + '_areaLabel';
					//dt.innerHTML = mileageSelectExtension.mileage[i][0];
					// dt要素をdl要素に追加
					//dl.appendChild(dt);
					// dd要素を生成
					var dd = document.createElement('dd');
					dd.className = mileageSelectExtension.conf.idBaseStr + '_area';
					// 地域に属する県の数だけLOOP
					var mileageLen = mileageSelectExtension.mileage[i][1].length;
					for ( var x = 0; x < mileageLen; x++ ) {
						if ( mileageSelectExtension.conf.selectedPref && mileageSelectExtension.mileage[i][1][x].match(mileageSelectExtension.conf.selectedPref) ) {
							// span要素を生成
							var span = document.createElement('span');
							span.className = mileageSelectExtension.conf.idBaseStr + '_selected';
							span.innerHTML = mileageSelectExtension.mileage[i][1][x];
							// span要素をdd要素に追加
							dd.appendChild(span);
						} else {
							// a要素を生成
							var a = document.createElement('a');
							a.className = mileageSelectExtension.conf.idBaseStr + '_link';
							a.innerHTML = mileageSelectExtension.mileage[i][1][x];
							// href属性をセット
							a.setAttribute('href',"javascript:mileageSelectExtension.setSelectValue('" + mileageSelectExtension.getOptionValueFromPrefName(select[0],mileageSelectExtension.mileage[i][1][x]) + "');");
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
							//var dt = document.createElement('dt');
							//dt.className = mileageSelectExtension.conf.idBaseStr + '_areaLabel';
							//dt.innerHTML = children[i].getAttribute('label');
							// dt要素をdl要素に追加
							//dl.appendChild(dt);
							// optgroup要素の子要素を取得
							var grandchildren = children[i].childNodes;
							var len2 = grandchildren.length;
							// dd要素を生成
							var dd = document.createElement('dd');
							dd.className = mileageSelectExtension.conf.idBaseStr + '_area';
							for (var x = 0; x < len2; x++) {
								if ( grandchildren[x].nodeType == '1' && grandchildren[x].nodeName.match(/option/i) ) {
									if ( !grandchildren[x].selected ) {
										// a要素を生成
										var a = document.createElement('a');
										a.className = mileageSelectExtension.conf.idBaseStr + '_link';
										a.innerHTML = grandchildren[x].innerHTML;
										// href属性をセット
										a.setAttribute('href',"javascript:mileageSelectExtension.setSelectValue('" + grandchildren[x].value + "');");
										// a要素をdd要素に追加
										dd.appendChild(a);
									} else {
										// span要素を生成
										var span = document.createElement('span');
										span.className = mileageSelectExtension.conf.idBaseStr + '_selected';
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
			var pos = mileageSelectExtension.getElementPosition( select[0] );
			var size = mileageSelectExtension.getElementSize( select[0] );
			var divSize = mileageSelectExtension.getElementSize( div );
			// ブラウザの画面サイズを取得
			var browserSize = mileageSelectExtension.getBrowserSize();
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
			mileageSelectExtension.conf.viewingMenu = div;
			// 疑似プルダウンを表示中のselect要素のシリアルを保持
			mileageSelectExtension.conf.viewingSerial = serial;
			// shimを生成
			mileageSelectExtension.createShim( tmpTop, tmpLeft, div.scrollWidth, div.scrollHeight, true );
			// focusを移動
			div.focus();
		}
	},
	//-----------------------------------------
	// 疑似プルダウンで選択された値をselect要素にセットする
	//-----------------------------------------
	setSelectValue : function( index ) {
		// 対象のselect要素を取得
		var targetSerial = mileageSelectExtension.conf.selectSerial.replace( '###', mileageSelectExtension.conf.viewingSerial );
		var select = mileageSelectExtension.getTargetElements( 'select', targetSerial );
		// 擬似プルダウンを削除
		mileageSelectExtension.removePulldown();
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
		if ( mileageSelectExtension.conf.viewingSerial ) {
			var viewingSerial = mileageSelectExtension.conf.viewingSerial;
			document.body.removeChild(mileageSelectExtension.conf.viewingMenu);
			mileageSelectExtension.conf.viewingMenu = null;
			document.body.removeChild(mileageSelectExtension.conf.viewingShim);
			mileageSelectExtension.conf.viewingShim = null;
			if ( mileageSelectExtension.isUnderIE7() ) {
				mileageSelectExtension.changeSelectDisabled( mileageSelectExtension.conf.viewingSerial, false);
			}
			mileageSelectExtension.conf.viewingSerial = null;
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
			if ( mileageSelectExtension.checkEventTarget(element) ) {
				if ( mileageSelectExtension.isFirefox() ) {
					// イベントをキャンセル
					event.returnValue = false;
					event.cancelBubble = true;
				}
				return;
			}
			// layerがイベント発生元の場合は抜ける
			if ( !mileageSelectExtension.isUnderIE7() ) {
				var str = mileageSelectExtension.conf.shimSerial.split('_');
				var divs = mileageSelectExtension.getTargetElements('div', str[0]);
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
		if ( mileageSelectExtension.conf.viewingSerial ) {
			document.body.removeChild(mileageSelectExtension.conf.viewingMenu);
			mileageSelectExtension.conf.viewingMenu = null;
			document.body.removeChild(mileageSelectExtension.conf.viewingShim);
			mileageSelectExtension.conf.viewingShim = null;
			if ( mileageSelectExtension.isUnderIE7() ) {
				mileageSelectExtension.changeSelectDisabled( mileageSelectExtension.conf.viewingSerial, false);
			}
			mileageSelectExtension.conf.viewingSerial = null;
		}
	},
	//-----------------------------------------
	// select要素に被せるlayerを生成する
	//-----------------------------------------
	createLayer : function( top, left, width, height ) {
		// div要素を生成
		var div = document.createElement('div');
		// div要素にシリアルを付加
		div.className += ' ' + mileageSelectExtension.getShimSerial();
		// 基本スタイル設定
		div.style.zIndex = '200';
		// 透明度設定
		if ( !mileageSelectExtension.isIE8() ) {
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
			mileageSelectExtension.createPulldown(str[1]);
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
			iframe.id = mileageSelectExtension.conf.idBaseStr + '_shim';
		}
		// 基本スタイル設定
		iframe.setAttribute('frameBorder', '0');
		iframe.setAttribute('scrolling', 'no');
		iframe.style.border = 'none';
		iframe.style.zIndex = '100';
		// 透明度設定
		if ( !mileageSelectExtension.isUnderIE7() ) {
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
			mileageSelectExtension.conf.viewingShim = iframe;
		}
	},
	//-----------------------------------------
	// select要素のdisabledを切り替える（IE7以下のみ使用）
	//-----------------------------------------
	changeSelectDisabled : function( serial, state ) {
		var select = mileageSelectExtension.getTargetElements( 'select', serial );
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
		if ( element.nodeType == '1' && element.className.match(mileageSelectExtension.conf.idBaseStr) ) {
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
	getOptionValueFromPrefName : function( element, mileageName ) {
		var result = false;
		var opt = element.getElementsByTagName('OPTION');
		var len = opt.length;
		for (var i = 0; i < len; i++) {
			if ( opt[i].innerHTML.match(mileageName) ) {
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
		return mileageSelectExtension.conf.selectSerial.replace( '###', mileageSelectExtension.conf.count );
	},
	//-----------------------------------------
	// shim用シリアルを返す
	//-----------------------------------------
	getShimSerial : function() {
		return mileageSelectExtension.conf.shimSerial.replace( '###', mileageSelectExtension.conf.count );
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
mileageSelectExtension.addEvent( window, 'load', mileageSelectExtension.init );