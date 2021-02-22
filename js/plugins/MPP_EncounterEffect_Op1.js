//=============================================================================
// MPP_EncounterEffect_Op1.js
//=============================================================================
// Copyright (c) 2020 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc You can set detailed parameters for MPP_EncounterEffect.js.
 * @author Mokusei Penguin
 * @url 
 * 
 * @base MPP_EncounterEffect
 * @orderAfter MPP_EncounterEffect
 *
 * @help [version 1.1]
 * This plugin is for RPG Maker MV and MZ.
 * 
 * ▼ Important
 *  - The processing becomes heavier as the number of
 *    screen divisions increases.
 * 
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠ is half-width)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 * @param Type 1 Params
 * @desc 
 * @default
 * @type struct<type1>
 * 
 * @param Type 2 Params
 * @desc 
 * @default
 * @type struct<type2>
 * 
 * @param Type 3 Params
 * @desc 
 * @default
 * @type struct<type3>
 * 
 * @param Line Width
 * @desc Debris edging width
 * @default 4
 * @type number
 * 
 * @param Flash Opacity
 * @desc 
 * @default 255
 * @type number
 * @max 255
 * 
 * @param Break Rate
 * @desc Movement rate when the screen breaks(%)
 * @default 100
 * @type number
 * 
 * @param Slide Rate
 * @desc Screen misalignment rate when the screen cracks(%)
 * @default 100
 * @type number
 * 
 * @param Rotation Rate
 * @desc 
 * @default 100
 * @type number
 * 
 */

/*~struct~type1:
 * @param Shape Type
 * @type select
 * @option square
 * @option triangle
 * @desc 
 * @default square
 * 
 * @param Break Duration
 * @type number
 * @min 1
 * @desc 
 * @default 45
 * 
 * @param Interval Duration
 * @type number
 * @min 1
 * @desc 
 * @default 45
 * 
 * @param Scatter Duration
 * @type number
 * @desc 
 * @default 0
 * 
 * @param Move Duration
 * @type number
 * @min 15
 * @desc 
 * @default 60
 * 
 * @param Split Radial
 * @type number
 * @min 4
 * @desc Number to divide radially
 * @default 10
 * 
 * @param Radial Random Rate
 * @type number
 * @max 100
 * @desc Random number when dividing radially(%)
 * @default 90
 * @parent Split Radial
 * 
 * @param Circle Radius
 * @type number
 * @min 32
 * @desc Basic radius when dividing into a circle
 * @default 96
 * 
 * @param Circle Increase Rate
 * @type number
 * @desc Rate of increase when dividing into circles(%)
 * @default 150
 * @parent Circle Radius
 * 
 * @param Circle Random Rate
 * @type number
 * @max 100
 * @desc Random number when dividing into a circle(%)
 * @default 40
 * @parent Circle Radius
 * 
 */

/*~struct~type2:
 * @param Shape Type
 * @type select
 * @option square
 * @option triangle
 * @option random
 * @desc 
 * @default random
 * 
 * @param Break Direction
 * @type select
 * @option left
 * @option center
 * @option right
 * @option inside
 * @option outside
 * @desc 
 * @default left
 * 
 * @param Scatter Direction
 * @type select
 * @option left
 * @option right
 * @option outside
 * @desc 
 * @default left
 * 
 * @param Break Duration
 * @type number
 * @min 1
 * @desc 
 * @default 30
 * 
 * @param Interval Duration
 * @type number
 * @min 1
 * @desc 
 * @default 45
 * 
 * @param Scatter Duration
 * @type number
 * @desc 
 * @default 35
 * 
 * @param Move Duration
 * @type number
 * @min 15
 * @desc 
 * @default 70
 * 
 * @param Split X
 * @type number
 * @min 1
 * @desc 
 * @default 7
 * 
 * @param X Random Rate
 * @type number
 * @max 100
 * @desc 
 * @default 80
 * @parent Split X
 * 
 * @param Split Y
 * @type number
 * @min 1
 * @desc 
 * @default 5
 * 
 * @param Y Random Rate
 * @type number
 * @max 100
 * @desc 
 * @default 80
 * @parent Split Y
 * 
 */

/*~struct~type3:
 * @param Shape Type
 * @type select
 * @option square
 * @option triangle
 * @option random
 * @desc 
 * @default triangle
 * 
 * @param Break Direction
 * @type select
 * @option left
 * @option center
 * @option right
 * @option inside
 * @option outside
 * @desc 
 * @default inside
 * 
 * @param Break Duration
 * @type number
 * @min 1
 * @desc 
 * @default 35
 * 
 * @param Interval Duration
 * @type number
 * @min 1
 * @desc 
 * @default 40
 * 
 * @param Scatter Duration
 * @type number
 * @desc 
 * @default 16
 * 
 * @param Move Duration
 * @type number
 * @min 15
 * @desc 
 * @default 100
 * 
 * @param Split X
 * @type number
 * @min 1
 * @desc 
 * @default 8
 * 
 * @param X Random Rate
 * @type number
 * @max 100
 * @desc 
 * @default 80
 * @parent Split X
 * 
 * @param Split Y
 * @type number
 * @min 1
 * @desc 
 * @default 6
 * 
 * @param Y Random Rate
 * @type number
 * @max 100
 * @desc 
 * @default 80
 * @parent Split Y
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc MPP_EncounterEffect.js の細かなパラメータを設定できます。
 * @author 木星ペンギン
 * @url 
 * 
 * @base MPP_EncounterEffect
 * @orderAfter MPP_EncounterEffect
 *
 * @help [version 1.1]
 * このプラグインはRPGツクールMVおよびMZ用です。
 * 
 * ▼ 注意点
 *  - 画面分割する数を増やすほど処理が重くなります。
 * 
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 * @param Type 1 Params
 * @text タイプ1 設定
 * @desc タイプ1 パラメータ
 * @default
 * @type struct<type1>
 * 
 * @param Type 2 Params
 * @text タイプ2 設定
 * @desc タイプ2 パラメータ
 * @default
 * @type struct<type2>
 * 
 * @param Type 3 Params
 * @text タイプ3 設定
 * @desc タイプ3 パラメータ
 * @default
 * @type struct<type3>
 * 
 * @param Line Width
 * @text 線の幅
 * @desc 破片の縁取りの幅
 * @default 4
 * @type number
 * 
 * @param Flash Opacity
 * @text フラッシュの強さ
 * @desc 
 * @default 255
 * @type number
 * @max 255
 * 
 * @param Break Rate
 * @text 画面割れ移動率
 * @desc 画面が割れる際の移動率(%)
 * @default 100
 * @type number
 * 
 * @param Slide Rate
 * @text 画面ズレ率
 * @desc 画面が割れる際の画面ズレ率(%)
 * @default 100
 * @type number
 * 
 * @param Rotation Rate
 * @text 破片回転率
 * @desc 
 * @default 100
 * @type number
 * 
 */

/*~struct~type1:ja
 * @param Shape Type
 * @text 破片の形状
 * @type select
 * @option 四角形
 * @value square
 * @option 三角形
 * @value triangle
 * @desc 
 * @default square
 * 
 * @param Break Duration
 * @text 画面割れ時間
 * @type number
 * @min 1
 * @desc 画面割れのエフェクト時間
 * @default 45
 * 
 * @param Interval Duration
 * @text 待機時間
 * @type number
 * @min 1
 * @desc 画面割れ後の待機時間
 * @default 45
 * 
 * @param Scatter Duration
 * @text 飛び散る時間
 * @type number
 * @desc 全ての破片が移動を開始するまでの時間
 * @default 0
 * 
 * @param Move Duration
 * @text 移動時間
 * @type number
 * @min 15
 * @desc 戦闘開始時のエフェクト時間
 * @default 60
 * 
 * @param Split Radial
 * @text 分割数
 * @type number
 * @min 4
 * @desc 放射状に分割する数
 * @default 10
 * 
 * @param Radial Random Rate
 * @text 乱数
 * @type number
 * @max 100
 * @desc 放射状に分割する際の乱数(%)
 * @default 90
 * @parent Split Radial
 * 
 * @param Circle Radius
 * @text 基本半径
 * @type number
 * @min 32
 * @desc 円状に分割する際の基本半径
 * @default 96
 * 
 * @param Circle Increase Rate
 * @text 増加率
 * @type number
 * @desc 円状に分割する際の増加率(%)
 * @default 150
 * @parent Circle Radius
 * 
 * @param Circle Random Rate
 * @text 乱数
 * @type number
 * @max 100
 * @desc 円状に分割する際の乱数(%)
 * @default 40
 * @parent Circle Radius
 * 
 */

/*~struct~type2:ja
 * @param Shape Type
 * @text 破片の形状
 * @type select
 * @option 四角形
 * @value square
 * @option 三角形
 * @value triangle
 * @option ランダム
 * @value random
 * @desc 
 * @default random
 * 
 * @param Break Direction
 * @text 割れる方向
 * @type select
 * @option left
 * @option center
 * @option right
 * @option inside
 * @option outside
 * @desc 画面が割れる方向
 * @default left
 * 
 * @param Scatter Direction
 * @text 散っていく方向
 * @type select
 * @option left
 * @option right
 * @option outside
 * @desc 画面が散っていく方向
 * @default left
 * 
 * @param Break Duration
 * @text 画面割れ時間
 * @type number
 * @min 1
 * @desc 画面割れのエフェクト時間
 * @default 30
 * 
 * @param Interval Duration
 * @text 待機時間
 * @type number
 * @min 1
 * @desc 画面割れ後の待機時間
 * @default 45
 * 
 * @param Scatter Duration
 * @text 飛び散る時間
 * @type number
 * @desc 全ての破片が移動を開始するまでの時間
 * @default 35
 * 
 * @param Move Duration
 * @text 移動時間
 * @type number
 * @min 15
 * @desc 戦闘開始時のエフェクト時間
 * @default 70
 * 
 * @param Split X
 * @text 横分割数
 * @type number
 * @min 1
 * @desc 横に分割する数
 * @default 7
 * 
 * @param X Random Rate
 * @text 乱数
 * @type number
 * @max 100
 * @desc 横に分割する際の乱数(%)
 * @default 80
 * @parent Split X
 * 
 * @param Split Y
 * @text 縦分割数
 * @type number
 * @min 1
 * @desc 縦に分割する数
 * @default 5
 * 
 * @param Y Random Rate
 * @text 乱数
 * @type number
 * @max 100
 * @desc 横に分割する際の乱数(%)
 * @default 80
 * @parent Split Y
 * 
 */

/*~struct~type3:ja
 * @param Shape Type
 * @text 破片の形状
 * @type select
 * @option 四角形
 * @value square
 * @option 三角形
 * @value triangle
 * @option ランダム
 * @value random
 * @desc 
 * @default triangle
 * 
 * @param Break Direction
 * @text 画面割れ方向
 * @type select
 * @option left
 * @option center
 * @option right
 * @option inside
 * @option outside
 * @desc 画面が割れる方向
 * @default inside
 * 
 * @param Break Duration
 * @text 画面割れ時間
 * @type number
 * @min 1
 * @desc 画面割れのエフェクト時間
 * @default 35
 * 
 * @param Interval Duration
 * @text 待機時間
 * @type number
 * @min 1
 * @desc 画面割れ後の待機時間
 * @default 40
 * 
 * @param Scatter Duration
 * @text 飛び散る時間
 * @type number
 * @desc 全ての破片が移動を開始するまでの時間
 * @default 16
 * 
 * @param Move Duration
 * @text 移動時間
 * @type number
 * @min 15
 * @desc 戦闘開始時のエフェクト時間
 * @default 100
 * 
 * @param Split X
 * @text 横分割数
 * @type number
 * @min 1
 * @desc 横に分割する数
 * @default 8
 * 
 * @param X Random Rate
 * @text 乱数
 * @type number
 * @max 100
 * @desc 横に分割する際の乱数(%)
 * @default 80
 * @parent Split X
 * 
 * @param Split Y
 * @text 縦分割数
 * @type number
 * @min 1
 * @desc 縦に分割する数
 * @default 6
 * 
 * @param Y Random Rate
 * @text 乱数
 * @type number
 * @max 100
 * @desc 横に分割する際の乱数(%)
 * @default 80
 * @parent Split Y
 * 
 */

(() => {
    'use strict';
    
    const pluginName = "MPP_EncounterEffect_Op1";
    
    //Plugin Parameters
    const parameters = PluginManager.parameters(pluginName);
    const reviver = (key, value) => {
        try {
            return JSON.parse(value, reviver);
        } catch (e) {
            return value;
        }
    };
    const reviveParams = name => {
        try {
            return JSON.parse(parameters[name], reviver);
        } catch (e) {
            return null;
        }
    };
    
    const param_Type1Params = reviveParams("Type 1 Params");
    const param_Type2Params = reviveParams("Type 2 Params");
    const param_Type3Params = reviveParams("Type 3 Params");
    const param_LineWidth = Number(parameters["Line Width"] || 4);
    const param_FlashOpacity = Number(parameters["Flash Opacity"] || 255);
    const param_BreakRate = Number(parameters["Break Rate"] || 100);
    const param_SlideRate = Number(parameters["Slide Rate"] || 100);
    const param_RotationRate = Number(parameters["Rotation Rate"] || 100);
    
    //-------------------------------------------------------------------------
    // EncounterEffect
    
    const _EncounterEffect_params = EncounterEffect.params;
    EncounterEffect.params = function() {
        let params;
        switch (this._type) {
            case 1:
                params = param_Type1Params;
                break;
            case 2:
                params = param_Type2Params;
                break;
            case 3:
                params = param_Type3Params;
                break;
        }
        return params || _EncounterEffect_params.call(this);
    };
    
    //-------------------------------------------------------------------------
    // Encounter_Fragment
    
    Encounter_Fragment.prototype.lineWidth = function() {
        return param_LineWidth;
    };

    Encounter_Fragment.prototype.flashOpacity = function() {
        return param_FlashOpacity;
    };

    Encounter_Fragment.prototype.breakRate = function() {
        return param_BreakRate / 100;
    };

    Encounter_Fragment.prototype.slideRate = function() {
        return param_SlideRate / 100;
    };
    
    Encounter_Fragment.prototype.rotationRate = function() {
        return param_RotationRate / 100;
    };

})();
