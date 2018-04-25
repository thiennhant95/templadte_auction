<?php
#=================================================================================
# インクルード処理用関数
#=================================================================================

if (file_exists(__DIR__."/config.php")) {
    require_once(__DIR__."/config.php");
}

// if (file_exists(__DIR__."/INI_config.php")) {
//     require_once(__DIR__."/INI_config.php");
// }

// SP階層？
$SP_FLG = (strpos(__DIR__, '/sp/') !== false) ? true : false ;

/**
 * [getSEO description].
 * @return [type] [description]
 */
function getSEO()
{
    global $SP_FLG;
    // yamlの読込
    require_once 'Spyc.php';        // yamlライブラリ
    $data = spyc_load_file(($SP_FLG) ? __DIR__.'/../../common/seo.yaml' : __DIR__.'/seo.yaml' );

    if(!is_array($data)) {
        exit('yaml file error');
    }

    foreach ($data['seo'] as $v) {
        if (strpos($_SERVER['REQUEST_URI'], $v['page']) !== false) {
            return $v;
        }
    }

    // 一致するのがなかったら
    return $data['default'];
}

// PCのcommonにyamlファイルがあるかのチェック
if ( (!$SP_FLG && file_exists(__DIR__.'/seo.yaml') ) ||  ($SP_FLG && file_exists(__DIR__.'/../../common/seo.yaml') ) ) {
    $SEO = getSEO();

    define('SEO_TITLE', $SEO['title']);
    define('SEO_DESCRIPTION', $SEO['description']);
    define('SEO_KEYWORDS', $SEO['keywords']);
    define('SEO_H1', $SEO['h1']);
}


/*
 sample code
<title><?=SEO_TITLE?></title>
<meta name="description" content="<?=SEO_DESCRIPTION?>">
<meta name="Keywords" content="<?=SEO_KEYWORDS?>">
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 相対パスを取得

//このサイトのＴＯＰ階層を抽出する（裏側のファイルのパスなどに使用）
$base_path = str_replace("/common", "", dirname(__FILE__));

//ドキュメントルート ディレクトリのパスを除去する
$inc_path =  str_replace($_SERVER['DOCUMENT_ROOT'], '', $base_path) . '/';

// ディレクトリ名
$plc = basename(dirname($_SERVER['PHP_SELF']));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　function で内容を出力　案件によって、左・右メニュー、フッターに動的カテゴリーなど
//　データベースへの接続が必要な場合がある。
//　変数名を多く使うと、同じ変数名を使用されてしまい誤動作を起こす可能性があるためfunctionを使用
//　（変数が初期化されていないと表示内容のデータが出てしまう、別なところで配列で使っているなどがある場合）
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 置換をすれば楽にパスが変更できる
// href="../ → href="{$inc_path}
// src="../ → src="{$inc_path}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	ヘッダー
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DispHeader(){
    global $inc_path;

  /**
   * variable functions
   * <h1>{$cname('SEO_H1')}</h1>
   */
  $cname = 'constant';

$html = <<<EDIT

EDIT;

//内容を返す。（ここで表示だとショッピングのテンプレートでは表示が難しい為、データを返す）
return $html;
}


function DispHeader2()
{
    global $inc_path;

    $html = <<<EDIT
EDIT;

    //内容を返す。（ここで表示だとショッピングのテンプレートでは表示が難しい為、データを返す）
    return $html;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	サイド
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DispSide()
{
    global $inc_path;

$html = <<<EDIT
EDIT;

    //内容を返す。（ここで表示だとショッピングのテンプレートでは表示が難しい為、データを返す）
    return $html;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	フッター
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DispFooter()
{
    global $inc_path;

    $html = <<<EDIT

EDIT;

    //内容を返す。（ここで表示だとショッピングのテンプレートでは表示が難しい為、データを返す）
    return $html;

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	全ページに追加するタグ
//	Head閉じタグの直前に挿入
// Googleアナリティクスもここに
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DispBeforeHeadEndTag()
{
    global $inc_path;

    $html = <<<EDIT


EDIT;

    //内容を返す。（ここで表示だとショッピングのテンプレートでは表示が難しい為、データを返す）
    return $html;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	全ページに追加するタグ
//	body閉じタグの直前に挿入
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DispBeforeBodyEndTag()
{
    global $inc_path;

    $html = <<<EDIT
EDIT;

    //内容を返す。（ここで表示だとショッピングのテンプレートでは表示が難しい為、データを返す）
    return $html;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	アクセス解析
//	body閉じタグの直前に挿入
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DispAccesslog()
{
    global $inc_path;

// プレビューはログを取らない
if (!empty($_POST['act'])) {
    return $html;
}

/*
$ua = $_SERVER['HTTP_USER_AGENT'];
if ((strpos($ua, 'Android') !== false) && (strpos($ua, 'Mobile') !== false) || (strpos($ua, 'iPhone') !== false) || (strpos($ua, 'Windows Phone') !== false)) {
    // スマートフォンからアクセスされた場合
    $link_type = "log_sp.php";
} elseif ((strpos($ua, 'Android') !== false) || (strpos($ua, 'iPad') !== false) || strpos($ua,'Silk') !== false) {
    // タブレットからアクセスされた場合
    $link_type = "log_tb.php";
} else {
    // その他（PC）からアクセスされた場合
    $link_type = "log.php";
}
*/
$link_type = "log.php";

    $html = <<<EDIT
<!-- ここから -->
<script type="text/javascript" src="https://www.google.com/jsapi?key="></script>
<script src="https://api.all-internet.jp/accesslog/access.js" language="javascript" type="text/javascript"></script>
<script language="JavaScript" type="text/javascript">
<!--
var s_obj = new _WebStateInvest();
document.write('<img src="{$inc_path}{$link_type}?referrer='+escape(document.referrer)+'&st_id_obj='+encodeURI(String(s_obj._st_id_obj))+'" width="1" height="1" style="display:none">');
//-->
</script>
<!-- ここまで -->
EDIT;

//内容を返す。（ここで表示だとショッピングのテンプレートでは表示が難しい為、データを返す）
return $html;
}
