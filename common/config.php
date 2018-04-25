<?php
/*******************************************************************************
SiteWin10 20 30（MySQL版）
共通設定情報ファイルの定義

*******************************************************************************/
#=================================================================================
# 共有ライブラリ読み込み
# 外部サーバーの場合は/common/lib/に共有ライブラリを設置する。
#=================================================================================
if (strpos($_SERVER['PHP_SELF'], 'zeeksdg') === false) {
    set_include_path(get_include_path() . PATH_SEPARATOR . __DIR__ . '/lib');
}

// 設定ファイル＆共通ライブラリの読み込み
require_once 'dbOpe.php';       // ＤＢ操作クラスライブラリ
require_once 'util_lib.php';    // 汎用処理クラスライブラリ
require_once 'Spyc.php';        // yamlライブラリ

#=================================================================================
# マルチバイト関数用に言語と文字コードを指定する（文字列置換、メール送信等で必須）
#=================================================================================
mb_language("Japanese");
mb_internal_encoding("UTF-8");

//エラーメッセージの表示の時エンコードがsjisで文字化けをするのを回避
header("Content-Type: text/html; charset=UTF-8");
header("Content-Language: ja");

date_default_timezone_set('Asia/Tokyo');//php 5.3.0から時間設定をしないと警告が出てしまうためここで設定をする。


#=================================================================================
# ＤＢ接続の情報（定数化）
#=================================================================================
if (strpos(__FILE__, "demopage.jp") !== false) {
    error_reporting(E_ERROR | E_WARNING | E_PARSE);
    ini_set('display_errors', 1);

    define('DB_SERVER', 'localhost');
    define('DB_NAME', 'develop');
    define('DB_USER', 'develop');
    define('DB_PASS', 'test2222');
    define('DB_DSN', "mysql:dbname=".DB_NAME.";host=".DB_SERVER.";charset=utf8;");
} else {
    error_reporting(0);
    ini_set('display_errors', 0);

    define('DB_SERVER', 'localhost');
    define('DB_NAME', 'master');
    define('DB_USER', 'master');
    define('DB_PASS', 'test1111');
    define('DB_DSN', "mysql:dbname=".DB_NAME.";host=".DB_SERVER.";charset=utf8;");
}

$PDO = new dbOpe(DB_DSN, DB_USER, DB_PASS);

#=================================================================================
# 管理画面のIDとパスワード
#=================================================================================
define('BO_ID', 'test');        # ID
define('BO_PW', 'pass');        # PW

#=================================================================================
# 運用サポート用の情報（定数化）
#=================================================================================
// 運用サポートURL
define('UW_INFO_URL', 'http://mx03.zeeksdg.net/zeeksdg/navi_info2/');

// ユーザーズウェブ上の顧客コード
define('UW_CUSTOMER_CODE', '');

#=================================================================================
# 頻繁に行う簡易処理のファンクション化（匿名関数）
#=================================================================================
// UNIX時間＋マイクロ秒によるID生成
$makeID = create_function('', 'return date("U")."-".sprintf("%06d",(microtime() * 1000000));');

// パスワード作成
$makePass = create_function('', '$pass = crypt(mt_rand(0,99999999),"CP");return preg_replace("/[^a-zA-Z0-9]/","",$pass);');

require_once 'functions.php';
