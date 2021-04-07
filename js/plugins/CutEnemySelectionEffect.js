//=============================================================================
// CutEnemySelectionEffect.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017 Tsumio
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/08/18 競合を避けるための微調整＆戦闘テストにも対応。
// 1.0.0 2017/08/17 公開。
// ----------------------------------------------------------------------------
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:
 * @plugindesc This plugin cut enemy selection effect.That's all.
 * @author Tsumio
 *
 * @param SwitchNumberForCutting
 * @type switch
 * @desc If this switch is on, enemy selection effect is cutted.
 * @default 1
 * 
 * @help This plugin cut enemy selection effect.That's all.
 * 
 * ----how to use----
 * You can use this plugin just by setting 'SwitchNumberForCutting' parameter.
 * 
 * 
 * ----plugin command----
 * There is no plugin command.
 * 
 * 
 * 
 * --Terms of Use--
 * This plugin is free for both commercial and non-commercial use.
 * You don't have to make sure to credit.
 * Furthermore, you may edit the source code to suit your needs,
 * so long as you don't claim the source code belongs to you.
 * 
 */

/*:ja
 * @plugindesc エネミーの選択中の点滅をカットするプラグイン。
 * @author ツミオ
 *
 * @param カット用のスイッチ番号
 * @type switch
 * @desc このスイッチ番号がONのとき、エネミー選択中の点滅はスキップされます。
 * @default 1
 * 
 * @help エネミーの選択中の点滅をカットするプラグイン。
 * 
 * 【使用方法】
 * プラグインの導入後、プラグインパラメーターから「カット用のスイッチ番号」を設定してください。
 * 
 * 
 * 【プラグインコマンド】
 * このプラグインにプラグインコマンドはありません。
 *
 *
 * 
 * 利用規約：
 * 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 * についても制限はありません。
 * 自由に使用してください。
 * 
 */

(function() {
    'use strict';
    var pluginName = 'CutEnemySelectionEffect';

////=============================================================================
//// NTMO
////  Declare NTMO namespace.
////=============================================================================
    var NTMO = NTMO || {};
    NTMO.CESE = function(){
    };


////=============================================================================
//// Local function
////  These functions checks & formats pluguin's command parameters.
////  I borrowed these functions from Triacontane.Thanks!
////=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //This function is not written by Triacontane.Tsumio wrote this function !
    var getParamDouble = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return Number(value);
    };

    //This function is not written by Triacontane.Tsumio wrote this function !
    var convertParam = function(param) {
        if(param !== undefined){
            try {
                return JSON.parse(param);
            }catch(e){
                console.group();
                console.error('%cParameter is invalid ! You should check the following parameter !','background-color: #5174FF');
                console.error('Parameter:' + eval(param));
                console.error('Error message :' + e);
                console.groupEnd();
            }
        }
    };

////=============================================================================
//// Get and set pluguin parameters.
////=============================================================================
    var param                          = {};
    param.switchNum_cutting            = getParamNumber(['SwitchNumberForCutting', 'カット用のスイッチ番号']);

////==============================
//// Convert parameters.
////==============================
    
    //There is none.


//////=============================================================================
///// Sprite_Enemy
/////  Override some methods for cutting enemy selectinon effect.
/////=============================================================================

    var _Sprite_Enemy_updateSelectionEffect = Sprite_Enemy.prototype.updateSelectionEffect;
    Sprite_Enemy.prototype.updateSelectionEffect = function() {
        _Sprite_Enemy_updateSelectionEffect.call(this);
        if(this.isCuttingSwitchOn_CESE() || BattleManager.isBattleTest()){
            var target = this._effectTarget;
            if (this._battler.isSelected()) {
                    target.setBlendColor([0, 0, 0, 0]);
            }
        }
    };

    //This is additional method.
    Sprite_Enemy.prototype.isCuttingSwitchOn_CESE = function() {
        return $gameSwitches.value(param.switchNum_cutting);
    };

})();