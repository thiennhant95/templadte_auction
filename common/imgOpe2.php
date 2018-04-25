<?php
/******************************************************************************************************************************
■画像アップロード操作クラスライブラリ

    簡単に画像アップロード（＆リサイズ）を行うためのクラスです。
    ファイルタイプ別に処理され、保存されます。

    現在の対応形式は、
        JPEG    ○
        GIF     △（読み込みはできるが、書き出すときはJPEG画像になる）
        PNG     ○
        SWF     ○（単純なアップロードのみです。当たり前ですが）

    ◆使用上の注意
        必ず、インスタンスを生成すること

    ◆メソッド
        ●コンストラクタ

            imgOpe(保存先ディレクトリ, 保存ファイル名, 出力画像の幅, 出力画像の高さ);
                ※いずれの引数も省略可。

        ●保存先ディレクトリの設定

            setRoot(保存先ディレクトリ);
                ※保存先ディレクトリは、複数指定可（配列に対応）

        ●保存ファイル名の設定

            setImageName(保存ファイル名);
                ※ファイル名には、拡張子を付けないこと。

        ●出力画像のサイズ（幅、高さ）の設定

            setSize(出力画像の幅, 出力画像の高さ);

        ●リサイズとアスペクト比に関してのフラグ設定

            resizeOn();     リサイズフラグをtrueに設定
            resizeOff();    リサイズフラグをfalseに設定
            fixedOn();      アスペクト比固定フラグをtrueに設定
            fixedOff();     アスペクト比固定フラグをfalseに設定

        ●画像向きの適用

            imageCreateFromExif(新たに作った画像, exif情報を参照するための元画像);

        ●画像ファイルの読み込み

            load(画像のテンポラリ名);
                ※画像のテンポラリ名・・・例）$_FILES['image']['tmp_name']

        ●画像の保存

            save(保存先ディレクトリ、保存ファイル名、出力画像の幅、出力画像の高さ、アスペクト比固定フラグ);

        ●画像のアップロード（読み込み・保存を行う）

            up(画像のテンポラリ名, 保存ファイル名);
                ※このメソッドは、インスタンスを生成後、出力画像の設定を行ってから、使用すること。

 Version Up Info
 2017/04/11 : v1.1 とりあえず修正
******************************************************************************************************************************/
class imgOpe
{

    // 入力画像についてのデータ
    public $srcImage;    // 画像のテンポラリ名
    public $image;            // 画像のリソース（中身のデータ）
    public $srcW;            // 画像の幅（x軸方向の長さ）
    public $srcH;            // 画像の高さ（y軸方向の長さ）
    public $fileType;    // ファイル形式
    public $fileExt;        // ファイルの拡張子

    // 出力設定
    public $root;            // 画像の保存先ルートディレクトリ（複数可）
    public $rootNum;        // 保存先の数
    public $dstW;            // 出力画像の幅（x軸方向の長さ）
    public $dstH;            // 出力画像の高さ（y軸方向の長さ）
    public $imageName;    // 画像の保存ファイル名
    public $isResize;    // 画像をリサイズするかどうかのフラグ
    public $isFixed;        // 画像をアスペクト比固定で保存するかどうかのフラグ

    //=============================================================================================================================
    // ◆コンストラクタ
    //
    // 使用例１：$myimgOpe = new imgOpe();
    // 出力設定を全て省略して生成
    //
    // ２：$myimgOpe = new imgOpe( "/home/demo3/html/a/", "upImage", 200, 150 );
    // 出力設定を全て設定して生成（設定しない項目は NULL もしくは "" にする）
    //
    //=============================================================================================================================
    public function imgOpe($dstRoot = '', $dstImageName = '', $width = '', $height = '')
    {
        // 入力画像の初期化
        $this->image    = '';
        $this->srcW     = 0;
        $this->srcH     = 0;
        $this->fileType = '';
        $this->fileExt  = '';

        // 出力先の設定
        $this->rootNum  = 0;
        $this->isResize = true;  // リサイズする
        $this->isFixed  = false; // アスペクト比固定しない（出力画像サイズに強制）
        if (!empty($dstRoot)) {
            $this->setRoot($dstRoot);
        }
        if (!empty($dstImageName)) {
            $this->setImageName($dstImageName);
        }
        if (!empty($width) || !empty($height)) {
            $this->setSize($width, $height);
        }
    }

    //=============================================================================================================================
    // ◆保存先ディレクトリの設定メソッド
    //
    // 使用方法：引数に保存先ディレクトリのパス$dstRootを与える。$dstRootは配列でも可
    //
    // 使用例１：$myimgOpe->setRoot( "/home/demo3/html/...../" );
    //
    // ２：$roots[0] = "/home/demo3/html/a/";
    // $roots[0] = "/home/demo3/html/b/";
    // $myimgOpe->setRoot( $roots );
    //
    //=============================================================================================================================
    public function setRoot($dstRoot)
    {

        #-----------------------------
        # 引数チェック
        #-----------------------------
        if (empty($dstRoot)) {
            exit('保存先ディレクトリ設定エラー<br>引数が未設定のため、強制終了しました。<br>“画像の保存先ディレクトリ”のリストを指定してください。');
        }

        #-----------------------------
        # 指定ディレクトリが書き込み可能かどうかチェック
        #-----------------------------
        if (is_array($dstRoot)) {
            // 指定ディレクトリが複数の場合
            foreach ($dstRoot as $oneroot) {
                if (!is_writable($oneroot)) {
                    exit("保存先ディレクトリ設定エラー<br>指定された保存先ディレクトリ \"{$oneroot}\" は書き込み不可です。");
                }
            }
        } else {
            // 指定ディレクトリが１つの場合
            if (!is_writable($dstRoot)) {
                exit("保存先ディレクトリ設定エラー<br>指定された保存先ディレクトリ \"{$dstRoot}\" は書き込み不可です。");
            }
        }

        #-----------------------------
        # 設定
        #-----------------------------
        $this->root =& $dstRoot;
        $this->rootNum = count($dstRoot);
    }

    //=============================================================================================================================
    // ◆出力画像のファイル名の設定メソッド
    //
    // 使用方法：引数に保存ファイル名$dstImageNameを与える。※拡張子は付けない
    //
    // 使用例  ：$myimgOpe->setImageName("upImage");
    //
    //=============================================================================================================================
    public function setImageName($dstImageName)
    {
        #-----------------------------
        # 引数チェック
        #-----------------------------
        if (empty($dstImageName)) {
            exit('出力画像ファイル名設定エラー<br>引数が未設定のため、強制終了しました。<br>“画像の保存ファイル名”を指定してください。');
        }
        #-----------------------------
        # 設定
        #-----------------------------
        $this->imageName = $dstImageName;
    }

    //=============================================================================================================================
    // ◆出力画像サイズの設定メソッド
    //
    // 使用方法：引数に出力画像のサイズ（幅：$width、高さ：$height）を与える。
    //
    // 使用例  ：$myimgOpe->setSize(200, 150);
    //
    //=============================================================================================================================
    public function setSize($width, $height)
    {
        #-----------------------------
        # 引数チェック
        #-----------------------------
        if (empty($width) || empty($height)) {
            exit('出力画像サイズ設定エラー<br>引数が未設定のため、強制終了しました。<br>“出力画像の幅”、“出力画像の高さ”の順で設定してください。');
        }
        #-----------------------------
        # 設定
        #-----------------------------
        if ($width <= 0 || $height <= 0) {    // 幅・高さの値チェック
            $this->isResize = false;
        } else {
            $this->dstW = $width;
            $this->dstH = $height;
        }
    }

    //=============================================================================================================================
    // ◆フラグの設定
    //
    // リサイズとアスペクト比固定に関してのフラグを設定する
    // デフォルトは、リサイズ：On　アスペクト比固定：off
    //
    // 使用例  ：$myimgOpe->resizeOn();
    // 設定した画像サイズに、リサイズするように設定
    //
    //=============================================================================================================================
    public function resizeOn()
    {
        $this->isResize = true;
    }
    public function resizeOff()
    {
        $this->isResize = false;
    }
    public function fixedOn()
    {
        $this->isFixed  = true;
    }
    public function fixedOff()
    {
        $this->isFixed  = false;
    }

    //=============================================================================================================================
    // ◆画像向きの設定
    // 元画像のexif情報を元に回転と反転をさせる
    // exif情報が存在するのはjpgのみ
    //=============================================================================================================================
    public function imageCreateFromExif($createImg, $exifImg)
    {
        if (empty($createImg) || empty($exifImg)) {
            exit('画像が読み込めませんでした');
        }
        // jpgでもexifが無い場合はあるよね。。
        $exif = @exif_read_data($exifImg);
        if ($createImg && $exif && isset($exif['Orientation'])) {
            $ort = $exif['Orientation'];
            if ($ort == 6 || $ort == 5) {
                $createImg = imagerotate($createImg, 270, null);
            } elseif ($ort == 3 || $ort == 4) {
                $createImg = imagerotate($createImg, 180, null);
            } elseif ($ort == 8 || $ort == 7) {
                $createImg = imagerotate($createImg, 90, null);
            }

            if ($ort == 5 || $ort == 4 || $ort == 7) {
                imageflip($createImg, IMG_FLIP_HORIZONTAL);
            }
        }
        return $createImg;
    }

    //=============================================================================================================================
    // ◆画像ファイルの読み込みメソッド
    //
    // 使用方法：引数に入力画像のテンポラリ名$srcImageを与える。
    //
    // 使用例  ：$myimgOpe->load($_FILES['image']['tmp_name']);
    //
    //=============================================================================================================================
    public function load($srcImage)
    {

        /*******************************************************************************
        GetImageSizeの返り値（連想配列）

        0       ： 画像の幅（ピクセル）
        1       ： 画像の高さ（ピクセル）
        2       ： 画像の種類（フラグ）
        3       ： IMGタグで直接利用できる文字列　"height=yyy width=xxx"
        bits    ： RGBの場合は3、CMYKの場合は4を返す（JPEG画像以外は信用できなそう？）
        channels： 画像の色数（JPEG画像以外は信用できなそう？）
        mime    ： 画像のMIMEタイプ

        画像の種類フラグ
            1 = GIF, 2 = JPG, 3 =PNG, 4 = SWF, 5 = PSD, 6 = BMP,
            7 = TIFF_II(intel byte order), 8 = TIFF_MM(motorola byte order),
            9 = JPC, 10 = JP2, 11 = JPX, 12 = JB2, 13 = SWC, 14 = IFF, 15 = WBMP, 16 = XBM
        ********************************************************************************/

        #-----------------------------
        # 引数チェック
        #-----------------------------
        if (empty($srcImage)) {
            return true;
        } elseif (!is_uploaded_file($srcImage)) {
            return false;
        } else {
            $this->srcImage = $srcImage;
        }

        #-----------------------------
        # 画像情報の取得
        #-----------------------------
        $param = GetImageSize($this->srcImage);

        // RGB形式の画像ファイルがアップロードされていた場合エラー
        if ($param['channels'] == 4) {
            exit('CMYK形式の画像はアップロード出来ません。RGB形式に保存し直してからアップロードしてください。');
        }

        $this->srcW     = $param[0];    // 幅
        $this->srcH     = $param[1];    // 高さ
        $this->fileType = $param[2];    // ファイルタイプ
        if (!$this->fileType) {
            foreach ($_FILES as $file) {
                if ($file['tmp_name'] == $this->srcImage) {
                    $filename = $file['name'];
                    break;
                }
            }
            exit("画像ファイルの読み込みエラー<br>指定された画像ファイル \"{$filename}\" にアクセスできない、あるいは正しい画像ではないため、強制終了しました。<br>正しい画像のテンポラリ名を指定してください。");
        }

        #-----------------------------
        # ファイルタイプ別に新規画像を作成＆ファイル拡張子を設定
        # 元画像のexif情報を元に画像を回転と反転もさせる
        #-----------------------------
        switch ($this->fileType) {
            case IMAGETYPE_GIF:
                $this->image = ImageCreateFromGIF($this->srcImage);
                $this->fileExt = '.gif';
                break;
            case IMAGETYPE_JPEG:
                $this->image = ImageCreateFromJPEG($this->srcImage);
                $this->image = $this->imageCreateFromExif($this->image, $this->srcImage);
                $this->fileExt = '.jpg';
                break;
            case IMAGETYPE_PNG:
                $this->image = ImageCreateFromPNG($this->srcImage);
                $this->fileExt = '.png';
                break;
            case IMAGETYPE_SWC:
                $this->fileExt = '.swf';
                break;
            default:
                foreach ($_FILES as $file) {
                    if ($file['tmp_name'] == $this->srcImage) {
                        $filename = $file['name'];
                        break;
                    }
                }
                exit("画像ファイルの読み込みエラー<br>指定された画像ファイル \"{$filename}\" は扱えない形式のため、強制終了しました。");
        }
        return true;
    }

    //=============================================================================================================================
    // ◆画像ファイルの保存メソッド
    //
    // 使用方法：引数に保存先ディレクトリ、保存ファイル名、出力画像の幅、出力画像の高さ、アスペクト比固定フラグを与える。
    // どの引数もコンストラクタや他のメソッドで設定してあれば、省略可
    //
    // 使用例  ：$myimgOpe->save("/home/demo3/html/a/", "upImage", 200, 150, true);
    //
    //=============================================================================================================================
    public function save($dstRoot = '', $dstImageName = '', $width = '', $height = '', $aspect = '')
    {

        // エラーメッセージの初期化
        $error_mes = '';

        #-----------------------------
        # 引数チェック
        #-----------------------------
        // 保存先ディレクトリ設定のチェック
        if ($dstRoot) {
            $this->setRoot($dstRoot);
        } elseif (!$this->root) {
            $error_mes .= '画像ファイルの出力エラー<br>画像の保存先ディレクトリを設定してください。';
        }

        // 画像の保存ファイル名設定のチェック
        if ($dstImageName) {
            $this->setImageName($dstImageName);
        } elseif (!$this->imageName) {
            $error_mes .= '画像ファイルの出力エラー<br>画像の保存ファイル名を設定してください。';
        }

        // 出力画像の幅と高さ設定のチェック
        if ($width && $height) {
            $this->setSize($width, $height);
        } elseif (!$this->dstW && !$this->dstH && $this->isResize == true) {
            $error_mes .= '画像ファイルの出力エラー<br>出力画像の幅と高さを設定してください。';
        }

        // アスペクト比設定のチェック
        if ($aspect) {
            $this->isFixed = $aspect;
        }

        // エラーがあったら強制終了
        if ($error_mes) {
            exit("<p>以下の理由で強制終了しました。</p>\n{$error_mes}<p>“画像の保存先ディレクトリ”、“画像の保存ファイル名”、“出力画像の幅”、“出力画像の高さ”、“アスペクト比設定フラグ”の順で設定し直してください。</p>\n");
        }

        #-----------------------------
        # 画像の加工＆保存
        #-----------------------------
        if ($this->fileType == IMAGETYPE_SWC || ($this->isResize == false || !$this->dstW || !$this->dstH)) {
            ///////////////////////////////////////////////
        // Flashファイルの場合と、リサイズしない場合はそのままファイルをアップロード
            for ($i = 0; $i < $this->rootNum; $i++) {
                if ($this->rootNum == 1) {
                    $up_result = move_uploaded_file($this->srcImage, $this->root . $this->imageName . $this->fileExt);
                } else {
                    $up_result = copy($this->srcImage, $this->root[$i] . $this->imageName . $this->fileExt);
                }
                if (!$up_result) {
                    return false;
                }
            }
        } else {
            ///////////////////////////////////////////////
        // リサンプル＆リサイズして保存
            // アスペクト比の設定によって、処理を分ける
            if ($this->isFixed) {
                // アスペクト比固定（元画像に合わせる）
                $aspect_ratio = $this->srcW / $this->srcH;
                if ($this->srcW > $this->dstW && $this->srcH > $this->dstH) {
                    // 入力画像の幅、高さともに設定した出力画像サイズより大きい場合
                    if (abs($this->srcW - $this->dstW) < abs($this->srcH - $this->dstH)) {
                        // 高さの方が大きい場合
                        // $this->dstH はそのまま
                        $this->dstW = ceil($aspect_ratio * $this->dstH);    // 横サイズ
                    } else {
                        // 幅の方が大きい場合
                        // $this->dstW はそのまま
                        $this->dstH = ceil($this->dstW / $aspect_ratio);    // 縦サイズ
                    }
                } elseif ($this->srcW > $this->dstW) {
                    // 幅のみ設定した出力画像サイズより大きい場合
                    // $this->dstW はそのまま
                    $this->dstH = ceil($this->dstW / $aspect_ratio);    // 縦サイズ
                } elseif ($this->srcH > $this->dstH) {
                    // 高さのみ設定した出力画像サイズより大きい場合
                    // $this->dstH はそのまま
                    $this->dstW = ceil($aspect_ratio * $this->dstH);    // 横サイズ
                } else {
                    // 入力画像のサイズが出力画像サイズ以下の場合の場合は入力画像のサイズにする
                    $this->dstW = $this->srcW;
                    $this->dstH = $this->srcH;
                }

                // 出力画像の作成
                $outputImg = ImageCreateTrueColor($this->dstW, $this->dstH);
                $icr = ImageCopyResampled($outputImg, $this->image, 0, 0, 0, 0, $this->dstW, $this->dstH, $this->srcW, $this->srcH);
                if (!$icr) {
                    return false;
                }
            } else {
                // アスペクト比無視（設定した出力画像サイズに強制）
                // 出力画像の作成
                $outputImg = ImageCreateTrueColor($this->dstW, $this->dstH);
                $icr = ImageCopyResampled($outputImg, $this->image, 0, 0, 0, 0, $this->dstW, $this->dstH, $this->srcW, $this->srcH);
                if (!$icr) {
                    return false;
                }
            }

            // 画像の保存
            for ($i = 0; $i < $this->rootNum; $i++) {
                if ($this->rootNum == 1) {
                    $outName = $this->root . $this->imageName . $this->fileExt;
                } else {
                    $outName = $this->root[$i] . $this->imageName . $this->fileExt;
                }

                switch ($this->fileType) {
                    case IMAGETYPE_GIF:
                        $up_result = ImageGIF($outputImg, $outName, 100);
                        break;
                    case IMAGETYPE_JPEG:
                        $up_result = ImageJPEG($outputImg, $outName, 100);
                        break;
                    case IMAGETYPE_PNG:
                        $up_result = ImagePNG($outputImg, $outName, 0);
                        break;
                }
                if (!$up_result) {
                    return false;
                }
            }

            ImageDestroy($outputImg);
            ImageDestroy($this->image);
        }

        return true;
    }

    //=============================================================================================================================
    // ◆画像ファイルの簡易アップロードメソッド
    //
    // （面倒なので）load と save をまとめて一度にやるためのメソッド
    //
    // 使用方法：インスタンスを生成し、出力画像の設定をした後、このメソッドを使用する
    //
    // 使用例  ：$myimgOpe = new imgOpe("/home/demo3/html/a/", "", 200, 150);
    // $myimgOpe->up($_FILES['image1']['tmp_name'], "upImage1");
    // $myimgOpe->up($_FILES['image2']['tmp_name'], "upImage2");
    // $myimgOpe->up($_FILES['image3']['tmp_name'], "upImage3");
    //
    // image1, image2, image3の３つの画像は全て /home/demo3/html/a/ の中に
    // 200×150のサイズで保存される。
    // ファイル名はそれぞれ upImage1, upImage2, upImage3 に拡張子が付いたものとなる。
    //
    //=============================================================================================================================
    public function up($srcImage, $dstImageName = '')
    {
        #-----------------------------
        # 引数チェック
        #-----------------------------
        if (empty($srcImage)) {
            return true;
        }
        #-----------------------------
        # 画像アップロード
        #-----------------------------
        // 画像の読み込み
        $load_result = $this->load($srcImage);
        if (!$load_result) {
            return false;
        }
        if ($dstImageName) {
            // 画像ファイル名の設定
            $this->setImageName($dstImageName);
        }
        if ($load_result) {
            // 画像の保存
            $save_result = $this->save();
        }
        return $save_result;
    }
}
