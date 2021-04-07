/*
 * ==============================================================================
 * ** Victor Engine MV - Damge Popup
 * ------------------------------------------------------------------------------
 *  VE_DamgePopup.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Damge Popup'] = '2.04';

var VictorEngine = VictorEngine || {};
VictorEngine.DamgePopup = VictorEngine.DamgePopup || {};

(function() {

    VictorEngine.DamgePopup.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.DamgePopup.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Damge Popup', 'VE - Basic Module', '1.20');
    };

    VictorEngine.DamgePopup.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function(name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.DamgePopup.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * ==============================================================================
 * @plugindesc v2.04 - Customize the Damage Popup display.
 * @author Victor Sant
 *
 * @param == Basic Setup ==
 * @default ==============================
 *
 * @param Height Adjust
 * @desc Adjust popup postion based on target graphic height.
 * true - ON     fase - OFF
 * @default false
 *
 * @param Overlap Adjust
 * @desc Adjust Y position if multiple damage diplays overlaps.
 * Default: -32 (Numeric, can be negative)
 * @default -32
 *
 * @param Delay Adjust
 * @desc Delay for multiple simultaneous damage diplay.
 * Default: 0 (Numeric)
 * @default 0
 *
 * @param == HP Damage ==
 * @default ==============================
 *
 * @param HP Damage Text
 * @desc Text display for HP damage popup.
 * %1 = Damage value.  
 * @default %1
 *
 * @param HP Damage Fontface
 * @desc HP damage text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param HP Damage Fontsize
 * @desc HP damage text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param HP Damage Color
 * @desc HP damage text font color.
 * Default: this.normalColor() (allows script code)
 * @default this.normalColor()
 *
 * @param HP Damage Roll
 * @desc Roullete effect for HP damage digits.
 * true - ON     fase - OFF
 * @default false
 *
 * @param HP Damage Delay
 * @desc Delay for each HP damage digit display.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param HP Damage Offset X
 * @desc HP damage popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param HP Damage Offset Y
 * @desc HP damage popup display offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param HP Damage Motion
 * @desc Motion for the HP damage popup.
 * Default: Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 * @default Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 *
 * @param == MP Damage ==
 * @default ==============================
 *
 * @param MP Damage Text
 * @desc Text display for MP damage popup.
 * %1 = Damage value.  
 * @default %1
 *
 * @param MP Damage Fontface
 * @desc MP damage text display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param MP Damage Fontsize
 * @desc MP damage text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param MP Damage Color
 * @desc MP damage text display font color.
 * Default: '#BB99FF' (allows script code)
 * @default '#BB99FF'
 *
 * @param MP Damage Roll
 * @desc Roullete effect for MP damage digits.
 * true - ON     fase - OFF
 * @default false
 *
 * @param MP Damage Delay
 * @desc Delay for each MP damage digit display.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param MP Damage Offset X
 * @desc MP damage popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param MP Damage Offset Y
 * @desc MP damage popup display offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param MP Damage Motion
 * @desc Motion for the MP damage popup.
 * Default: Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 * @default Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 *
 * @param == TP Damage ==
 * @default ==============================
 *
 * @param TP Damage Text
 * @desc Text display for TP damage popup.
 * %1 = Damage value.  
 * @default %1
 *
 * @param TP Damage Fontface
 * @desc TP damage text display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param TP Damage Fontsize
 * @desc TP damage text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param TP Damage Color
 * @desc TP damage text display font color.
 * Default: '#FFBB99' (allows script code)
 * @default '#FFBB99'
 *
 * @param TP Damage Roll
 * @desc Roullete effect for TP damage digits.
 * true - ON     fase - OFF
 * @default false
 *
 * @param TP Damage Delay
 * @desc Delay for each TP damage digit display.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param TP Damage Offset X
 * @desc TP damage popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param TP Damage Offset Y
 * @desc TP damage popup display offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param TP Damage Motion
 * @desc Motion for the TP damage popup.
 * Default: Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 * @default Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 *
 * @param == HP Recovery ==
 * @default ==============================
 *
 * @param HP Recover Text
 * @desc Text display for HP recovery popup.
 * %1 = Recovery value.  
 * @default %1
 *
 * @param HP Recover Fontface
 * @desc HP recovery text display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param HP Recover Fontsize
 * @desc HP recovery text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param HP Recover Color
 * @desc HP recovery text display font color.
 * Default: '#BBFF99' (allows script code)
 * @default '#BBFF99'
 *
 * @param HP Recover Roll
 * @desc Roullete effect for HP recovery digits.
 * true - ON     fase - OFF
 * @default false
 *
 * @param HP Recover Delay
 * @desc Delay for each HP recovery digit display.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param HP Recover Offset X
 * @desc HP recovery popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param HP Recover Offset Y
 * @desc HP recovery popup display offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param HP Recover Motion
 * @desc Motion for the HP recovery popup.
 * Default: Zoom, Move Up, Move Up, Move Up, Move Up
 * @default Zoom, Move Up, Move Up, Move Up, Move Up
 *
 * @param == MP Recovery ==
 * @default ==============================
 *
 * @param MP Recover Text
 * @desc Text display for MP recovery popup.
 * %1 = Recovery value.  
 * @default %1
 *
 * @param MP Recover Fontface
 * @desc MP recovery text display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param MP Recover Fontsize
 * @desc MP recovery text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param MP Recover Color
 * @desc MP recovery text display font color.
 * Default: '#99BBFF' (allows script code)
 * @default '#99BBFF'
 *
 * @param MP Recover Roll
 * @desc Roullete effect for MP recovery digits.
 * true - ON     fase - OFF
 * @default false
 *
 * @param MP Recover Delay
 * @desc Delay for each MP recovery digit display.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param MP Recover Offset X
 * @desc MP recovery popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param MP Recover Offset Y
 * @desc MP recovery popup display offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param MP Recover Motion
 * @desc Motion for the MP recovery popup.
 * Default: Zoom, Move Up, Move Up, Move Up, Move Up
 * @default Zoom, Move Up, Move Up, Move Up, Move Up
 *
 * @param == TP Recovery ==
 * @default ==============================
 *
 * @param TP Recover Text
 * @desc Text display for TP recovery popup.
 * %1 = Recovery value.  
 * @default %1
 *
 * @param TP Recover Fontface
 * @desc TP recovery text display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param TP Recover Fontsize
 * @desc TP recovery text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param TP Recover Color
 * @desc TP recovery text display font color.
 * Default: '#FFFF99' (allows script code)
 * @default '#FFFF99'
 *
 * @param TP Recover Roll
 * @desc Roullete effect for TP recovery digits.
 * true - ON     fase - OFF
 * @default false
 *
 * @param TP Recover Delay
 * @desc Delay for each TP recovery digit display.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param TP Recover Offset X
 * @desc TP recovery popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param TP Recover Offset Y
 * @desc TP recovery popup display offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param TP Recover Motion
 * @desc Motion for the TP recovery popup.
 * Default: Zoom, Move Up, Move Up, Move Up, Move Up
 * @default Zoom, Move Up, Move Up, Move Up, Move Up
 *
 * @param == Miss Popup ==
 * @default ==============================
 *
 * @param Miss Text
 * @desc Text display for Miss popup. (leave blank for no text)
 * Default: Miss
 * @default Miss
 *
 * @param Miss Fontface
 * @desc Miss text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Miss Fontsize
 * @desc Miss text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Miss Color
 * @desc Miss text font color.
 * Default: '#BBBBBB' (allows script code)
 * @default '#BBBBBB'
 *
 * @param Miss Offset X
 * @desc Miss popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Miss Offset Y
 * @desc Miss popup display offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Miss Motion
 * @desc Motion for the miss popup.
 * Default: Wait, Wait, Wait, Wait, Wait
 * @default Wait, Wait, Wait, Wait, Wait
 *
 * @param == Critical Popup ==
 * @default ==============================
 *
 * @param Critical Text
 * @desc Text display for Critical popup. (leave blank for no text)
 * Default: Critical
 * @default Critical
 *
 * @param Critical Fontface
 * @desc Critical text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Critical Fontsize
 * @desc Critical text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Critical Color
 * @desc Critical text font color.
 * Default: '#FF9999' (allows script code)
 * @default '#FF9999'
 *
 * @param Critical Offset X
 * @desc Critical popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Critical Offset Y
 * @desc Critical popup display offset Y.
 * Default: -32 (Numeric, can be negative)
 * @default -32
 *
 * @param Critical Flash Color
 * @desc Flash color for damage digits during criticals.
 * Default: '#FF0000' (Hexadecimal, leave blank for no flash)
 * @default '#FF0000'
 *
 * @param Critical Motion
 * @desc Motion for the critical popup.
 * Default: Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 * @default Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 *
 * @param == State Add Popup ==
 * @default ==============================
 *
 * @param State Add Text
 * @desc Text display for State Add popup. (leave blank for no text)
 * %1 = State Name.    %2 = State Icon.  
 * @default +%1
 *
 * @param State Add Fontface
 * @desc State Add text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param State Add Fontsize
 * @desc State Add text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param State Add Color
 * @desc State Add text font color.
 * Default: '#FFFFBB' (allows script code)
 * @default '#FFFFBB'
 *
 * @param State Add Offset X
 * @desc State Add popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param State Add Offset Y
 * @desc State Add popup display offset Y.
 * Default: 32 (Numeric, can be negative)
 * @default 32
 *
 * @param State Add Motion
 * @desc Motion for the State Add popup.
 * Default: Wait, Wait, Wait, Wait, Wait
 * @default Wait, Wait, Wait, Wait, Wait
 *
 * @param == State Remove Popup ==
 * @default ==============================
 *
 * @param State Remove Text
 * @desc Text display for State Add popup. (leave blank for no text)
 * %1 = State Name.    %2 = State Icon.
 * @default -%1
 *
 * @param State Remove Fontface
 * @desc State Remove text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param State Remove Fontsize
 * @desc State Remove text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param State Remove Color
 * @desc State Remove text font color.
 * Default: '#FFFFBB' (allows script code)
 * @default '#FFFFBB'
 *
 * @param State Remove Offset X
 * @desc State Remove popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param State Remove Offset Y
 * @desc State Remove popup display offset Y.
 * Default: 32 (Numeric, can be negative)
 * @default 32
 *
 * @param State Remove Motion
 * @desc Motion for the State Remove popup.
 * Default: Wait, Wait, Wait, Wait, Wait
 * @default Wait, Wait, Wait, Wait, Wait
 *
 * @param == Buff Add Popup ==
 * @default ==============================
 *
 * @param Buff Add Text
 * @desc Text display for Buff Add popup. (leave blank for no
 * text)  %1 = Param Name  %2 = Debuff Icon  %3 = Debuff Level
 * @default %1 increased
 *
 * @param Buff Add Fontface
 * @desc Buff Add text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Buff Add Fontsize
 * @desc Buff Add text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Buff Add Color
 * @desc Buff Add text font color.
 * Default: '#BBFF99' (allows script code)
 * @default '#BBFF99'
 *
 * @param Buff Add Offset X
 * @desc Buff Add popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Buff Add Offset Y
 * @desc Buff Add popup display offset Y.
 * Default: 32 (Numeric, can be negative)
 * @default 32
 *
 * @param Buff Add Motion
 * @desc Motion for the Buff Add popup.
 * Default: Wait, Wait, Wait, Wait, Wait
 * @default Wait, Wait, Wait, Wait, Wait
 *
 * @param == Debuff Add Popup ==
 * @default ==============================
 *
 * @param Debuff Add Text
 * @desc Text display for Debuff Add popup. (leave blank for no
 * text)  %1 = Param Name  %2 = Debuff Icon  %3 = Debuff Level
 * @default %1 decreased
 *
 * @param Debuff Add Fontface
 * @desc Debuff Add text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Debuff Add Fontsize
 * @desc Debuff Add text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Debuff Add Color
 * @desc Debuff Add text font color.
 * Default: '#FFFFBB' (allows script code)
 * @default '#FFFFBB'
 *
 * @param Debuff Add Offset X
 * @desc Debuff Add popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Debuff Add Offset Y
 * @desc Debuff Add popup display offset Y.
 * Default: 32 (Numeric, can be negative)
 * @default 32
 *
 * @param Debuff Add Motion
 * @desc Motion for the Debuff Add popup.
 * Default: Wait, Wait, Wait, Wait, Wait
 * @default Wait, Wait, Wait, Wait, Wait
 *
 * @param == Buff Remove Popup ==
 * @default ==============================
 *
 * @param Buff Remove Text
 * @desc Text display for Buff Remove popup. (leave blank for no
 * text)  %1 = Param Name  %2 = Debuff Icon 
 * @default %1 cleared
 *
 * @param Buff Remove Fontface
 * @desc Buff Remove text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Buff Remove Fontsize
 * @desc Buff Remove text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Buff Remove Color
 * @desc Buff Remove text font color.
 * Default: '#BBFFFF' (allows script code)
 * @default '#BBFFFF'
 *
 * @param Buff Remove Offset X
 * @desc Buff Remove popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Buff Remove Offset Y
 * @desc Buff Remove popup display offset Y.
 * Default: 32 (Numeric, can be negative)
 * @default 32
 *
 * @param Buff Remove Motion
 * @desc Motion for the Buff Remove popup.
 * Default: Wait, Wait, Wait, Wait, Wait
 * @default Wait, Wait, Wait, Wait, Wait
 *
 * @param == Counter Popup ==
 * @default ==============================
 *
 * @param Counter Text
 * @desc Text display for Counter popup. (leave blank for no text)
 * Default: Counter
 * @default Counter
 *
 * @param Counter Fontface
 * @desc Counter text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Counter Fontsize
 * @desc Counter text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Counter Color
 * @desc Counter text font color.
 * Default: '#FF9999' (allows script code)
 * @default '#FF9999'
 *
 * @param Counter Offset X
 * @desc Counter popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Counter Offset Y
 * @desc Counter popup display offset Y.
 * Default: -16 (Numeric, can be negative)
 * @default -16
 *
 * @param Counter Motion
 * @desc Motion for the Counter popup.
 * Default: Pop High, Wait, Wait, Wait, Stretch
 * @default Pop High, Wait, Wait, Wait, Stretch
 *
 * @param == Reflect Popup ==
 * @default ==============================
 *
 * @param Reflect Text
 * @desc Text display for Reflect popup. (leave blank for no text)
 * Default: Reflect
 * @default Reflect
 *
 * @param Reflect Fontface
 * @desc Reflect text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Reflect Fontsize
 * @desc Reflect text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Reflect Color
 * @desc Reflect text font color.
 * Default: '#99BBFF' (allows script code)
 * @default '#99BBFF'
 *
 * @param Reflect Offset X
 * @desc Reflect popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Reflect Offset Y
 * @desc Reflect popup display offset Y.
 * Default: -16 (Numeric, can be negative)
 * @default -16
 *
 * @param Reflect Motion
 * @desc Motion for the Reflect popup.
 * Default: Pop High, Wait, Wait, Wait, Stretch
 * @default Pop High, Wait, Wait, Wait, Stretch
 *
 * @param == Substitute Popup ==
 * @default ==============================
 *
 * @param Substitute Text
 * @desc Text display for Substitute popup. (leave blank for no text)
 * Default: Substitute
 * @default Substitute
 *
 * @param Substitute Fontface
 * @desc Substitute text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Substitute Fontsize
 * @desc Substitute text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Substitute Color
 * @desc Substitute text font color.
 * Default: '#99BBFF' (allows script code)
 * @default '#99BBFF'
 *
 * @param Substitute Offset X
 * @desc Substitute popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Substitute Offset Y
 * @desc Substitute popup display offset Y.
 * Default: -16 (Numeric, can be negative)
 * @default -16
 *
 * @param Substitute Motion
 * @desc Motion for the Substitute popup.
 * Default: Pop High, Wait, Wait, Wait, Stretch
 * @default Pop High, Wait, Wait, Wait, Stretch
 *
 * @param == Weak Popup ==
 * @default ==============================
 *
 * @param Weak Text
 * @desc Text display for Weak popup. (leave blank for no text)
 * Default: Weak
 * @default Weak
 *
 * @param Weak Fontface
 * @desc Weak text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Weak Fontsize
 * @desc Weak text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Weak Color
 * @desc Weak text font color.
 * Default: '#FFBB99' (allows script code)
 * @default '#FFBB99'
 *
 * @param Weak Flash Color
 * @desc Flash color for damage digits when hit a weakness.
 * Default: '#FF8844' (allows script code, blank for no flash)
 * @default '#FF8844'
 *
 * @param Weak Offset X
 * @desc Weak popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Weak Offset Y
 * @desc Weak popup display offset Y.
 * Default: -32 (Numeric, can be negative)
 * @default -32
 *
 * @param Weak Motion
 * @desc Motion for the Weak popup.
 * Default: Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 * @default Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 *
 * @param == Resist Popup ==
 * @default ==============================
 *
 * @param Resist Text
 * @desc Text display for Resist popup. (leave blank for no text)
 * Default: Resist
 * @default Resist
 *
 * @param Resist Fontface
 * @desc Resist text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Resist Fontsize
 * @desc Resist text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Resist Color
 * @desc Resist text font color.
 * Default: '#BBFFFF' (allows script code)
 * @default '#BBFFFF'
 *
 * @param Resist Flash Color
 * @desc Flash color for damage digits when hit a resistance.
 * Default: '#4488FF' (allows script code, blank for no flash)
 * @default '#4488FF'
 *
 * @param Resist Offset X
 * @desc Resist popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Resist Offset Y
 * @desc Resist popup display offset Y.
 * Default: -32 (Numeric, can be negative)
 * @default -32
 *
 * @param Resist Motion
 * @desc Motion for the Resist popup.
 * Default: Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 * @default Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 *
 * @param == Immune Popup ==
 * @default ==============================
 *
 * @param Immune Text
 * @desc Text display for Immune popup. (leave blank for no text)
 * Default: Immune
 * @default Immune
 *
 * @param Immune Fontface
 * @desc Immune text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Immune Fontsize
 * @desc Immune text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Immune Color
 * @desc Immune text font color.
 * Default: '#BBBBBB' (allows script code)
 * @default '#BBBBBB'
 *
 * @param Immune Flash Color
 * @desc Flash color for damage digits when hit a immunity.
 * Default: '#444444' (allows script code, blank for no flash)
 * @default '#444444'
 *
 * @param Immune Offset X
 * @desc Immune popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Immune Offset Y
 * @desc Immune popup display offset Y.
 * Default: -32 (Numeric, can be negative)
 * @default -32
 *
 * @param Immune Motion
 * @desc Motion for the Immune popup.
 * Default: Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 * @default Pop High, Fall High, Pop Low, Fall Low, Wait, Wait
 *
 * @param == Absorb Popup ==
 * @default ==============================
 *
 * @param Absorb Text
 * @desc Text display for Absorb popup. (leave blank for no text)
 * Default: Absorb
 * @default Absorb
 *
 * @param Absorb Fontface
 * @desc Absorb text font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Absorb Fontsize
 * @desc Absorb text font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Absorb Color
 * @desc Absorb text font color.
 * Default: '#BBFF99' (allows script code)
 * @default '#BBFF99'
 *
 * @param Absorb Flash Color
 * @desc Flash color for damage digits when absorb damage.
 * Default: @@ (allows script code, blank for no flash)
 * @default 
 *
 * @param Absorb Offset X
 * @desc Absorb popup display offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Absorb Offset Y
 * @desc Absorb popup display offset Y.
 * Default: -32 (Numeric, can be negative)
 * @default -32
 *
 * @param Absorb Motion
 * @desc Motion for the Absorb popup.
 * Default: Zoom, Move Up, Move Up, Move Up, Move Up
 * @default Zoom, Move Up, Move Up, Move Up, Move Up
 *
 * @param == Popup Motions ==
 * @default ==============================
 *
 * @param Wait
 * @desc Popup wait motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 20
 *
 * @param Move Up
 * @desc Popup move up motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, -15, 0, 20
 *
 * @param Move Down
 * @desc Popup move down motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 15, 0, 20
 *
 * @param Move Left
 * @desc Popup move left motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, -15, 0, 0, 20
 *
 * @param Move Right
 * @desc Popup move right motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 15, 0, 0, 20
 *
 * @param Zoom
 * @desc Popup zoom motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 300, 300, 0, 0, 0, 30
 *
 * @param Stretch
 * @desc Popup stretch motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 400, 0, -30, 0, 30
 *
 * @param Melt
 * @desc Popup melt motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 400, 0, 30, 0, 30
 *
 * @param Pop High
 * @desc Popup high pop motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, -60, 15
 *
 * @param Fall High
 * @desc Popup fall high motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 60, 15
 *
 * @param Pop Low
 * @desc Popup low pop motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, -20, 15
 *
 * @param Fall Low
 * @desc Popup low fall motion.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 20, 15
 *
 * @param == Custom Motions ==
 * @default ==============================
 *
 * @param Custom 1
 * @desc Popup custom motion 1.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 2
 * @desc Popup custom motion 2.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 3
 * @desc Popup custom motion 3.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 4
 * @desc Popup custom motion 4.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 5
 * @desc Popup custom motion 5.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 6
 * @desc Popup custom motion 6.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 7
 * @desc Popup custom motion 7.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 8
 * @desc Popup custom motion 8.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 9
 * @desc Popup custom motion 9.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 10
 * @desc Popup custom motion 10.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 11
 * @desc Popup custom motion 11.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 12
 * @desc Popup custom motion 12.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 13
 * @desc Popup custom motion 13.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 14
 * @desc Popup custom motion 14.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 15
 * @desc Popup custom motion 15.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 16
 * @desc Popup custom motion 16.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 17
 * @desc Popup custom motion 17.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 18
 * @desc Popup custom motion 18.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 19
 * @desc Popup custom motion 19.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * @param Custom 20
 * @desc Popup custom motion 20.
 * Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 * @default 100, 100, 0, 0, 0, 30
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  Hide Add Popup (for States)
 * ------------------------------------------------------------------------------
 *  <hide add popup>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The state will not display a popup when added if the plugin paramater
 *  'State Popup' is turned On.
 * ==============================================================================
 *
 * ==============================================================================
 *  Hide Remove Popup (for States)
 * ------------------------------------------------------------------------------
 *  <hide remove popup>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The state will not display a popup when removed if the plugin paramater
 *  'State Popup' is turned On.
 * ==============================================================================
 *
 * ==============================================================================
 *  Hide Remove Popup (for Actors and Enemies)
 * ------------------------------------------------------------------------------
 *  <popup offset: X, Y>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Adjust the popup position display for the battle.
 *     X: position X (Numeric, can be negative)
 *     Y: position X (Numeric, can be negative)
 *   The X offset will be inverted if the battler is facing right.
 * ==============================================================================
 *
 * =============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - Popup Font Setup
 *  Each popup type has different configurable values to setup the disply font.
 *  Most of the setup for this plugin is made through plugin parameters.
 *  Several of those plugin parameters allows the use of script codes. If this is
 *  the case, you can use any valid code for basic windows.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  
 *  - Popup Offset
 *  The parameters 'Offset X' and 'Offset Y' defines the popup offset position.
 *  They muust be numeric values.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  
 *  - Popup Fontface
 *  The parameters 'Fontface' defines the font name for the popup display.
 *  You can use script codes that returns a string with the fontname se the
 *  value for it. 
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  
 *  - Popup Fontsize
 *  The parameters 'Fontsize' defines the font size for the popup display.
 *  You can use script codes that returns numeric values as the value for it. 
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  
 *  - Popup Color
 *  The parameter 'Color' defines the font color for the popup display.
 *  The color must be either a hex color code (#000000) or a script code
 *  that returns a color value. 
 *
 *  If using the plugin 'SFonts' the hex color will not work, instead you need
 *  to call this.textColor(X), where X is the SFont color Id.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Damage Delays
 *  The popup for HP, MP and TP have a digit delay setup. This make it so the
 *  digitis are shown one at each time, instead of all at once. This value can be
 *  postive or negative. If positive the digits are shown from left to right, if
 *  negative they are shown from right to left.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Damage Roll
 *  The popup for HP, MP and TP have a digit roll setup. This make it so the
 *  digitis randomly changes at the start of the popup effect, revealing the
 *  actual damage digit number after some frames.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Damage Motions
 *  The popup movement is controlled by a sequence of motions. The combination
 *  of motion values define how the damage popup will behave.
 *  There are 12 pre made motion setup:
 *   - wait
 *   - move down
 *   - move up
 *   - move left
 *   - move right
 *   - zoom
 *   - stretch
 *   - melt
 *   - pop high
 *   - fall high
 *   - pop low
 *   - fall low
 *  Those 12 motions can also be combined with more 20 custom motions to make
 *  the damage movement.
 *
 *  Ex.: rise high, fall high, rise low, fall low, wait  // Bouncing movement.
 *       zoom, move up, move up, move up, move up  // Zoom in and the move up.
 *       zoom, custom 1, custom 2, wait  // Zoom in, use custom motion then wait.
 *
 *  You can add how many setups you want to each motion, they are played in the
 *  same order they are placed.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Motions Setup
 *  Each motion has 6 configurable numeric values:
 *  Zoom X, Zoom Y, Move X, Move Y, Gravity, Duration
 *   - Zoom X : horizontal zoom. (100 = default size)
 *   - Zoom Y : vertical zoom.   (100 = default size)
 *   - Move X : horizontal move distance. (Can be negative, 0 for no mevement)
 *   - Move Y : vertical move distance.   (Can be negative, 0 for no mevement)
 *   - Gravity : Gravity effect height.   (Can be negative, 0 for no mevement)
 *   - Duration : Motion duration in frames.
 * 
 *  Zoom : The zoom movement is transitory. For a zoom in, use a high zoom value
 *   followed by a motion with lower zoom value. For a zoom out, use a lower zoom
 *   value followed by a motion with higher zoom value.
 *
 *  Move : The damg will move for the duration. It will move to the opposite
 *   direction if the value is negative. The horizontal movement is inverted
 *   if the battle mode is set to sideview and the battler is facing right.
 *
 *  Gravity : Gravity movement effect. Positive values will make the display to
 *   'fall' with incresing speed. Negative values will make the display 'jump'
 *   with decreasing speed.
 *
 *  Duration : Duration, in frames, for this motion. The duration of the popup
 *  is the total duration for all motions.
 *
 *  Ex.: 100, 100, 0, 0, 0, 30   // waiting motion
 *       100, 100, 0, 40, 30, 30 // bouncin right motion
 *       300, 300, 0, 0, 0, 30   // zoom motion
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Custom Popup Calls
 *  You can make script calls to show custom popup effects on a battler:
 *  
 *  battler.callCustomPopup(text, motion, font, size, color, x, y)
 * 
 *  battler : must be a valid Game_Battler object.
 *  text   : the text do be displayed.
 *  motion : motion sequence for the popup effect.
 *  font  : font name for the popup text.
 *  size  : font size for the popup text.
 *  color : font color for the popup text.
 *  x : popup effect offset X.
 *  y : popup effect offset Y.
 *
 *  All values except the offset x and offset y must be Strings. You can use the
 *  same values as you use for the plugin parameters setup. It's adivised that
 *  you store the values on local variables to make the setup more readable.
 *  You can ommit any value beside the text and motion.
 *
 *  Ex.:
 *   var text = 'Cancel';
 *   var motion = 'Pop High, Wait, Wait, Wait, Stretch';
 *   var font = 'this.standardFontFace()';
 *   var size = 'this.standardFontSize()';
 *   var color = '#BBFFFF';
 *   this.callCustomPopup(text, motion, font, size, color)
 *
 *   ** Notice that the code use 'this' for the battler, so it's a code to be
 *   used on a Game_Battler class (or it's children).
 *
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.04.21 > First release.
 *  v 2.00 - 2016.04.21 > Plugin recoded, it now uses the Game Font instead of
 *                      > images for damage popup display.
 *  v 2.01 - 2016.05.09 > Fixed issue with the plugin not working without the
 *                        Control Text plugin.
 *                      > Fixed issue with MP popup display.
 *  v 2.02 - 2016.05.12 > Comatibility with Basic Module 1.20.
 *  v 2.03 - 2016.05.31 > Comatibility with Battle Motions.
 *  v 2.04 - 2017.07.20 > Fixed issue with popup not showing randomly for the
 *                        1st action.
 * =============================================================================
 */

(function() {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.DamgePopup = {};
        VictorEngine.Parameters.DamgePopup.HeightAdjust = eval(parameters["Height Adjust"]);
        VictorEngine.Parameters.DamgePopup.OverlapAdjust = Number(parameters["Overlap Adjust"]) || 0;
        VictorEngine.Parameters.DamgePopup.DelayAdjust = Number(parameters["Delay Adjust"]) || 0;
        VictorEngine.Parameters.DamgePopup.Wait = String(parameters["Wait"]).trim();
        VictorEngine.Parameters.DamgePopup.Up = String(parameters["Move Up"]).trim();
        VictorEngine.Parameters.DamgePopup.Down = String(parameters["Move Down"]).trim();
        VictorEngine.Parameters.DamgePopup.Left = String(parameters["Move Left"]).trim();
        VictorEngine.Parameters.DamgePopup.Right = String(parameters["Move Right"]).trim();
        VictorEngine.Parameters.DamgePopup.Zoom = String(parameters["Zoom"]).trim();
        VictorEngine.Parameters.DamgePopup.Stretch = String(parameters["Stretch"]).trim();
        VictorEngine.Parameters.DamgePopup.Melt = String(parameters["Melt"]).trim();
        VictorEngine.Parameters.DamgePopup.PopHigh = String(parameters["Pop High"]).trim();
        VictorEngine.Parameters.DamgePopup.PopLow = String(parameters["Pop Low"]).trim();
        VictorEngine.Parameters.DamgePopup.FallHigh = String(parameters["Fall High"]).trim();
        VictorEngine.Parameters.DamgePopup.FallLow = String(parameters["Fall Low"]).trim();
        var list = ['HP Damage', 'MP Damage', 'TP Damage', 'HP Recover', 'MP Recover', 'TP Recover', 'Miss',
            'Critical', 'State Add', 'State Remove', 'Buff Add', 'Debuff Add', 'Buff Remove',
            'Counter', 'Reflect', 'Substitute', 'Weak', 'Resist', 'Immune', 'Absorb'
        ];
        for (var i = 0; i < list.length; i++) {
            var type = list[i];
            VictorEngine.Parameters.DamgePopup[type + ' Text'] = String(parameters[type + ' Text']).trim();
            VictorEngine.Parameters.DamgePopup[type + ' Fontface'] = String(parameters[type + ' Fontface']).trim();
            VictorEngine.Parameters.DamgePopup[type + ' Fontsize'] = String(parameters[type + ' Fontsize']).trim();
            VictorEngine.Parameters.DamgePopup[type + ' Color'] = String(parameters[type + ' Color']).trim();
            VictorEngine.Parameters.DamgePopup[type + ' Motion'] = String(parameters[type + ' Motion']).trim();
            VictorEngine.Parameters.DamgePopup[type + ' Flash'] = String(parameters[type + ' Flash Color']).trim();
            VictorEngine.Parameters.DamgePopup[type + ' Delay'] = Number(parameters[type + ' Delay']) || 0;
            VictorEngine.Parameters.DamgePopup[type + ' Offset X'] = Number(parameters[type + ' Offset X']) || 0;
            VictorEngine.Parameters.DamgePopup[type + ' Offset Y'] = Number(parameters[type + ' Offset Y']) || 0;
            VictorEngine.Parameters.DamgePopup[type + ' Roll'] = eval(parameters[type + ' Roll'] || 'false');
        }
        var list = ['Wait', 'Move Up', 'Move Down', 'Move Left', 'Move Right', 'Zoom', 'Stretch', 'Melt',
            'Pop High', 'Pop Low', 'Fall High', 'Fall Low'
        ];
        for (var i = 0; i < list.length; i++) {
            var type = list[i];
            VictorEngine.Parameters.DamgePopup[type] = String(parameters[type]).trim();
        }
        for (var i = 1; i < 21; i++) {
            var type = list[i];
            VictorEngine.Parameters.DamgePopup['Custom ' + String(i)] = String(parameters['Custom ' + String(i)]).trim();
        }
    }

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.DamgePopup.loadParameters = VictorEngine.loadParameters;
    VictorEngine.loadParameters = function() {
        VictorEngine.DamgePopup.loadParameters.call(this);
        VictorEngine.DamgePopup.processParameters();
    };

    VictorEngine.DamgePopup.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function(data, index) {
        VictorEngine.DamgePopup.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['state'])) {
            VictorEngine.DamgePopup.loadNotes1(data);
        }
        if (this.objectSelection(index, ['actor', 'enemy'])) {
            VictorEngine.DamgePopup.loadNotes2(data);
        }
    };

    VictorEngine.DamgePopup.processParameters = function() {
        if (!this.loaded) {
            this.loaded = true;
            this.processPopup();
            this.processMotions();
        }
    };

    VictorEngine.DamgePopup.loadNotes1 = function(data) {
        data.hidePopup = data.hidePopup || {};
        data.hidePopup.add = !!data.note.match(/<hide add popup>/i);
        data.hidePopup.rmv = !!data.note.match(/<hide remove popup>/i);
    };

    VictorEngine.DamgePopup.loadNotes2 = function(data) {
        data.popupOffset = data.popupOffset || {
            x: 0,
            y: 0
        };
        var regex = new RegExp('<popup offset[ ]*:[ ]*(\\d+)[ ]*,[ ]*(\\d+)[ ]*>', 'gi');
        while (match = regex.exec(data.note)) {
            data.popupOffset.x = Number(match[1]);
            data.popupOffset.y = Number(match[2]);
        };
    };

    VictorEngine.DamgePopup.processPopup = function() {
        this.popup = {};
        var list = ['HP Damage', 'MP Damage', 'TP Damage', 'HP Recover', 'MP Recover', 'TP Recover', 'Miss',
            'Critical', 'State Add', 'State Remove', 'Buff Add', 'Debuff Add', 'Buff Remove',
            'Counter', 'Reflect', 'Substitute', 'Weak', 'Resist', 'Immune', 'Absorb'
        ];
        for (var i = 0; i < list.length; i++) {
            this.popup[list[i]] = this.setupPopup(list[i]);
        }
    };

    VictorEngine.DamgePopup.processMotions = function() {
        var parameters = VictorEngine.Parameters.DamgePopup;
        this.motions = {};
        var list = ['Wait', 'Move Up', 'Move Down', 'Move Left', 'Move Right', 'Zoom',
            'Stretch', 'Melt', 'Pop High', 'Pop Low', 'Fall High', 'Fall Low'
        ];
        for (var i = 0; i < list.length; i++) {
            this.motions[list[i].toLowerCase()] = this.setupMotions(parameters[list[i]]);
        }
        for (var i = 1; i < 21; i++) {
            this.motions['custom ' + String(i)] = this.setupMotions(parameters['Custom ' + String(i)]);
        }
    };

    VictorEngine.DamgePopup.setupPopup = function(type) {
        var parameters = VictorEngine.Parameters.DamgePopup;
        var result = {};
        var motion = parameters[type + ' Motion'];
        result.list = motion.split(/\s*[,;]\s*/).map(function(value) {
            return value.toLowerCase()
        });
        result.text = parameters[type + ' Text'];
        result.font = parameters[type + ' Fontface'];
        result.size = parameters[type + ' Fontsize'];
        result.roll = parameters[type + ' Roll'];
        result.delay = parameters[type + ' Delay'];
        result.color = parameters[type + ' Color'];
        result.flash = parameters[type + ' Flash'];
        result.x = parameters[type + ' Offset X'];
        result.y = parameters[type + ' Offset Y'];
        return result;
    };

    VictorEngine.DamgePopup.setupMotions = function(motion) {
        var result = {};
        var list = motion.split(/\s*[,;]\s*/);
        result.zoom = {
            x: Number(list[0]) || 100,
            y: Number(list[1]) || 100
        };
        result.move = {
            x: Number(list[2]) || 0,
            y: Number(list[3]) || 0
        };
        result.gravity = Number(list[4]) || 0;
        result.duration = Math.max(Number(list[5]), 1) || 20;
        return result;
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    VictorEngine.DamgePopup.invokeCounterAttack = BattleManager.invokeCounterAttack;
    BattleManager.invokeCounterAttack = function(subject, target) {
        target.requestReactionPopup('Counter');
        VictorEngine.DamgePopup.invokeCounterAttack.call(this, subject, target);
    };

    VictorEngine.DamgePopup.invokeMagicReflection = BattleManager.invokeMagicReflection;
    BattleManager.invokeMagicReflection = function(subject, target) {
        target.requestReactionPopup('Reflect');
        VictorEngine.DamgePopup.invokeMagicReflection.call(this, subject, target);
    };

    VictorEngine.DamgePopup.applySubstitute = BattleManager.applySubstitute;
    BattleManager.applySubstitute = function(target) {
        var substitute = VictorEngine.DamgePopup.applySubstitute.call(this, target);
        if (target !== substitute) {
            target.requestReactionPopup('Substitute');
        }
        return substitute;
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.DamgePopup.calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        var result = VictorEngine.DamgePopup.calcElementRate.call(this, target);
        if (result > 1) {
            this._resist = 'Weak';
        } else if (result > 0 && result < 1) {
            this._resist = 'Resist';
        } else if (result === 0) {
            this._resist = 'Immune';
        } else if (result < 0) {
            this._resist = 'Absorb';
        } else {
            this._resist = ''
        }
        return result
    };

    VictorEngine.DamgePopup.executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        VictorEngine.DamgePopup.executeDamage.call(this, target, value);
        var result = target.result();
        if (value > 0 && result.critical) {
            result.resist = 'Critical';
        } else if (this._resist !== 'Absorb' && value >= 0) {
            result.resist = this._resist;
        } else if (this._resist === 'Absorb' && value < 0) {
            result.resist = 'Absorb';
        }
    };

    //=============================================================================
    // Game_ActionResult
    //=============================================================================

    VictorEngine.DamgePopup.clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        VictorEngine.DamgePopup.clear.call(this);
        this.mpAffected = false;
        this.tpAffected = false;
        this.resist = '';
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    VictorEngine.DamgePopup.gainMp = Game_Battler.prototype.gainMp;
    Game_Battler.prototype.gainMp = function(value) {
        this._result.mpAffected = true;
        VictorEngine.DamgePopup.gainMp.call(this, value);
    };

    VictorEngine.DamgePopup.gainTp = Game_Battler.prototype.gainTp;
    Game_Battler.prototype.gainTp = function(value) {
        this._result.tpAffected = true;
        VictorEngine.DamgePopup.gainTp.call(this, value);
    };

    Game_Battler.prototype.requestReactionPopup = function(reaction) {
        this._reactionPopup = reaction;
    };

    Game_Battler.prototype.reactionPopup = function() {
        return this._reactionPopup;
    };

    Game_Battler.prototype.clearReactionPopup = function() {
        this._reactionPopup = '';
    };

    Game_Battler.prototype.callCustomPopup = function(text, motion, font, size, color, x, y) {
        var result = {};
        result.list = motion.split(/\s*[,;]\s*/).map(function(value) {
            return value.toLowerCase()
        });
        result.text = String(text).trim();
        result.font = String(font) || 'this.standardFontFace()';
        result.size = String(size) || 'this.standardFontSice()';
        result.color = String(color) || 'this.normalColor()';
        result.x = Number(x) || 0;
        result.y = Number(y) || 0;
        this._customPopup = result;
    };

    Game_Battler.prototype.customPopup = function() {
        return this._customPopup;
    };

    Game_Battler.prototype.clearCustomPopup = function() {
        this._customPopup = null;
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================

    Game_Actor.prototype.popupOffset = function() {
        return this.actor() ? this.actor().popupOffset : {
            x: 0,
            y: 0
        };
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================

    Game_Enemy.prototype.popupOffset = function() {
        return this.enemy() ? this.enemy().popupOffset : {
            x: 0,
            y: 0
        };
    };

    //=============================================================================
    // Sprite_Battler
    //=============================================================================

    /* Overwritten function */
    Sprite_Battler.prototype.setupDamagePopup = function() {
        if (this._battler.isDamagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                this.setupDamagePopupSprites();
            }
            this._battler.clearDamagePopup();
            this._battler.clearResult();
        }
        if (this._battler.reactionPopup()) {
            if (this._battler.isSpriteVisible()) {
                var type = this._battler.reactionPopup();
                this.damagePopupSprite(type);
            }
            this._battler.clearReactionPopup();
        }
        if (this._battler.customPopup()) {
            if (this._battler.isSpriteVisible()) {
                var value = this._battler.customPopup();
                this.damagePopupSprite('Custom', value);
            }
            this._battler.clearCustomPopup();
        }
    };

    VictorEngine.DamgePopup.initMembers = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        VictorEngine.DamgePopup.initMembers.call(this);
        this._damageDelay = 0
        this._damageSprites = 0;
    };

    VictorEngine.DamgePopup.update = Sprite_Battler.prototype.update;
    Sprite_Battler.prototype.update = function() {
        VictorEngine.DamgePopup.update.call(this);
        if (this._damages.length === 0) {
            this._damageSprites = 0;
        }
        if (this._battler && !this._popupTest) {
            this.popupTest();
        }
    };

    Sprite_Battler.prototype.popupTest = function() {
        var value = {
            damage: 0,
            resist: ''
        };
        this.damagePopupSprite('Popup Test', value);
        this._popupTest = true;
    };

    Sprite_Battler.prototype.setupDamagePopupSprites = function() {
        this._damageDelay = 0;
        var result = this._battler.result();
        if (result.missed || result.evaded) {
            this.damagePopupSprite('Miss');
        }
        if (result.tpAffected) {
            this.tpDamagePopup(result);
        }
        if (result.mpAffected) {
            this.mpDamagePopup(result);
        }
        if (result.hpAffected) {
            this.hpDamagePopup(result);
        }
        this.addStatesPopup(result.addedStates);
        this.removeStatesPopup(result.removedStates);
        this.addBuffsPopup(result.addedBuffs);
        this.addDebuffsPopup(result.addedDebuffs);
        this.removeBuffsPopup(result.removedBuffs);
    };

    Sprite_Battler.prototype.tpDamagePopup = function(result) {
        var type = result.tpDamage < 0 ? 'TP Recover' : 'TP Damage';
        var value = {
            damage: result.tpDamage,
            resist: result.resist
        };
        this.damagePopupSprite(type, value);
    };

    Sprite_Battler.prototype.mpDamagePopup = function(result) {
        var type = result.mpDamage < 0 ? 'MP Recover' : 'MP Damage';
        var value = {
            damage: result.mpDamage,
            resist: result.resist
        };
        this.damagePopupSprite(type, value);
    };

    Sprite_Battler.prototype.hpDamagePopup = function(result) {
        var type = result.hpDamage < 0 ? 'HP Recover' : 'HP Damage';
        var value = {
            damage: result.hpDamage,
            resist: result.resist
        };
        this.damagePopupSprite(type, value);
    };

    Sprite_Battler.prototype.addStatesPopup = function(states) {
        states.forEach(function(id) {
            var state = $dataStates[id];
            var value = {
                name: state.name,
                icon: state.iconIndex
            }
            if (!state.hidePopup.add) {
                this.damagePopupSprite('State Add', value);
            }
        }, this);
    };

    Sprite_Battler.prototype.removeStatesPopup = function(states) {
        states.forEach(function(id) {
            var state = $dataStates[id];
            var value = {
                name: state.name,
                icon: state.iconIndex
            };
            if (!state.hidePopup.rmv) {
                this.damagePopupSprite('State Remove', value);
            }
        }, this);
    };

    Sprite_Battler.prototype.addBuffsPopup = function(buffs) {
        buffs.forEach(function(id) {
            var level = this._battler._buffs[id];
            var name = VictorEngine.paramName(id);
            var icon = this._battler.buffIconIndex(level > 0 ? level : 1, id);
            var value = {
                name: name,
                icon: icon,
                level: level
            };
            this.damagePopupSprite('Buff Add', value);
        }, this);
    };

    Sprite_Battler.prototype.addDebuffsPopup = function(buffs) {
        buffs.forEach(function(id) {
            var level = this._battler._buffs[id];
            var name = VictorEngine.paramName(id);
            var icon = this._battler.buffIconIndex(level < 0 ? level : -1, id);
            var value = {
                name: name,
                icon: icon,
                level: level
            };
            this.damagePopupSprite('Debuff Add', value);
        }, this);
    };

    Sprite_Battler.prototype.removeBuffsPopup = function(buffs) {
        buffs.forEach(function(id) {
            var name = VictorEngine.paramName(id);
            var icon = this._battler.buffIconIndex(1, icon);
            var value = {
                name: name,
                icon: icon
            };
            this.damagePopupSprite('Buff Remove', value);
        }, this);
    };

    Sprite_Battler.prototype.damagePopupSprite = function(type, value) {
        var sprite = new Sprite_CustomDamage();
        var delay = VictorEngine.Parameters.DamgePopup.DelayAdjust;
        var offset = this._battler.popupOffset();
        var overlap = VictorEngine.Parameters.DamgePopup.OverlapAdjust * this._damageSprites;
        var adjust = VictorEngine.Parameters.DamgePopup.HeightAdjust ? this.center().y : 8;
        sprite.x = this.x + (this._battler.isFacingRight() ? -offset.x : offset.x);
        sprite.y = this.y + this.damageOffsetY() + offset.y + overlap - adjust;
        sprite.delay(this._damageDelay);
        sprite.setup(this._battler, type, value);
        this._damages.push(sprite);
        this.parent.addChild(sprite);
        this._damageSprites++;
        this._damageDelay += VictorEngine.Parameters.DamgePopup.DelayAdjust;
    };

})();

//=============================================================================
// Window_DamageSprite
//=============================================================================

function Window_DamageSprite() {
    this.initialize.apply(this, arguments);
}

Window_DamageSprite.prototype = Object.create(Window_Base.prototype);
Window_DamageSprite.prototype.constructor = Window_DamageSprite;

(function() {

    Window_DamageSprite.prototype.initialize = function(sprite) {
        this._sprite = sprite;
        Window_Base.prototype.initialize.call(this);
        this.opacity = 0;
    };

    Window_DamageSprite.prototype.spriteFontface = function() {
        return eval(this._sprite.font);
    };

    Window_DamageSprite.prototype.spriteFontsize = function() {
        return eval(this._sprite.size);
    };

    Window_DamageSprite.prototype.spriteFontColor = function() {
        return eval(this.getFontColor(this._sprite.color));
    };

    Window_DamageSprite.prototype.textHeight = function() {
        return Math.max(this.spriteFontsize() + 12, Window_Base._iconHeight);
    };

    Window_DamageSprite.prototype.resetFontSettings = function() {
        this.contents.fontFace = this.spriteFontface();
        this.contents.fontSize = this.spriteFontsize();
        this.changeTextColor(this.spriteFontColor())
        this.contents.outlineColor = 'rgba(0, 0, 0, 1)';
        this.contents.outlineWidth = 5;
    };

    Window_DamageSprite.prototype.processDrawIcon = function(iconIndex, textState) {
        this.drawIcon(iconIndex, textState.x + 2, textState.y - 2);
        textState.x += Window_Base._iconWidth + 4;
    };

})();

//=============================================================================
// Sprite_CustomDamage
//=============================================================================

function Sprite_CustomDamage() {
    this.initialize.apply(this, arguments);
}

Sprite_CustomDamage.prototype = Object.create(Sprite_Damage.prototype);
Sprite_CustomDamage.prototype.constructor = Sprite_CustomDamage;

(function() {

    Sprite_CustomDamage.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._textStep = 0;
        this._digitStep = 0;
        this._digitDelay = 0
        this._texts = [];
        this._digits = [];
        this._random = [];
        this._textMotion = [];
        this._digitMotion = [];
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
    };

    Sprite_CustomDamage.prototype.delay = function(delay) {
        this._delay = delay;
    };

    Sprite_CustomDamage.prototype.damageDigits = function(type) {
        return (type === 'HP Damage' || type === 'MP Damage' || type === 'TP Damage' ||
            type === 'HP Recover' || type === 'MP Recover' || type === 'TP Recover' ||
            type === 'Popup Test');
    };

    Sprite_CustomDamage.prototype.setup = function(target, type, value) {
        this._invert = target.isFacingRight();
        this._value = value || {};
        this._type = type;
        if (this.damageDigits(this._type)) {
            if (value.resist) {
                this.createText(value.resist);
            }
            this.createDigits(this._type)
        }
        this.createText(this._type);
        this.setupDuration();
        this.setupSpriteAdjust(target);
        this.setupFlashEffect();
    };

    Sprite_CustomDamage.prototype.setupSpriteAdjust = function(target) {
        this._mainSpriteX = target.mainSprite() ? (target.mainSprite().x || 0) : 0
        this._mainSpriteY = target.mainSprite() ? (target.mainSprite().y || 0) : 0
    };

    Sprite_CustomDamage.prototype.setupFlashEffect = function() {
        var resist = this._value.resist;
        var sprite = this._texts[0];
        if (resist && sprite) {
            var hex = sprite.setup.flash;
            if (hex) {
                var color = VictorEngine.hexToRgb(eval(sprite.window.getFontColor(hex)));
                if (color) {
                    color.push(160);
                    this._flashColor = color;
                    this._flashDuration = Math.floor(this._starting * 2 / 3);
                }
            }
        }
    };

    Sprite_CustomDamage.prototype.popupMotion = function(type) {
        type = type === 'Popup Test' ? 'HP Damage' : type;
        return type === 'Custom' ? this._value : VictorEngine.DamgePopup.popup[type];
    };

    Sprite_CustomDamage.prototype.motions = function(type) {
        var motion = VictorEngine.DamgePopup.motions;
        return motion[type] || motion['wait'];
    };

    Sprite_CustomDamage.prototype.setupDuration = function() {
        var textDuration = this.getDuration(this._texts) || 0;
        var digitDuration = this.getDuration(this._digits) || 0;
        this._duration = Math.max(textDuration, digitDuration) + this._digitDelay;
        this._starting = this._duration;
        for (var i = 0; i < this._texts.length; i++) {
            this._texts[i].duration = textDuration;
            this._texts[i].starting = textDuration;
        }
        for (var i = 0; i < this._digits.length; i++) {
            this._digits[i].duration = digitDuration;
            this._digits[i].starting = digitDuration;
        }
    };

    Sprite_CustomDamage.prototype.getDuration = function(sprites) {
        return sprites.map(function(sprite) {
            return this.getSpriteDuration(sprite);
        }, this).sort(function(a, b) {
            return a - b
        })[0];
    };

    Sprite_CustomDamage.prototype.getSpriteDuration = function(sprite) {
        var result = 0;
        var object = this;
        return sprite.motion.reduce(function(r, type) {
            var motion = object.motions(type) || {};
            return r + (motion.duration || 0);
        }, sprite.delay);
    };

    Sprite_CustomDamage.prototype.createDigits = function(type) {
        var setup = this.popupMotion(type);
        var motion = setup.list.clone();
        var delay = setup.delay || 0;
        var string = Math.abs(this._value.damage).toString();
        for (var i = 0; i < string.length; i++) {
            var sprite = this.createDigitSprite(setup, motion);
            var width = sprite.window.textWidthEx('0');
            var n = Number(string[i]);
            this._random[i] = 0;
            sprite.sx = (i - (string.length - 1) / 2) * width;
            sprite.sy = 0;
            sprite.digit = n;
            sprite.delay = delay < 0 ? Math.abs(delay) * (string.length - i) : delay * i;
            this.setupDigits(sprite, i);
        }
    };

    Sprite_CustomDamage.prototype.createText = function(type) {
        var setup = this.popupMotion(type);
        var list = setup.list.clone();
        var text = this.setupSpriteText(type, setup);
        var sprite = this.createTextSprite(setup, list);
        this.drawSpriteText(sprite, type, text)
    };

    Sprite_CustomDamage.prototype.setupSpriteText = function(type, setup) {
        var value = this._value;
        if (value.text) {
            return value.text;
        } else {
            var text = setup.text;
            if (type === 'State Add' || type === 'State Remove') {
                text = text.format(value.name, '\\i[' + String(value.icon) + ']');
            }
            if (type === 'Buff Add' || type === 'Debuff Add' || type === 'Buff Remove') {
                text = text.format(value.name, '\\i[' + String(value.icon) + ']', String(value.level));
            }
            return text;
        }
    };

    Sprite_CustomDamage.prototype.drawSpriteText = function(sprite, type, text) {
        var window = sprite.window;
        var padding = window.standardPadding() * 2 + 4;
        if (this.damageDigits(type)) {
            var width = window.textWidthEx('0') * this._digits.length;
            var list = text.split('%1');
            var w1 = window.textWidthEx(list[0]) + width;
            var w2 = window.textWidthEx(list[1]) + padding + w1;
            var h = window.textHeight() + padding;
            window.move(0, 0, w2, h);
            window.createContents();
            window.drawTextEx(list[0], 2, 2);
            window.drawTextEx(list[1], w1 + 2, 2);
            sprite.bitmap = window.contents;
            sprite.anchor.x = 0;
            sprite.sx = width / 2 - w1;
            sprite.sy = 0;
        } else {
            var w = window.textWidthEx(text) + padding;
            var h = window.textHeight() + padding;
            window.move(0, 0, w, h);
            window.createContents();
            window.drawTextEx(text, 2, 2);
            sprite.bitmap = window.contents;
            sprite.sx = 0;
            sprite.sy = 0;
        }
    };

    Sprite_CustomDamage.prototype.refreshMotion = function(sprite) {
        var step = sprite.step || 0;
        var list = sprite.motion;
        var type = list[step];
        var next = list[step + 1];
        sprite.text = {};
        sprite.text.steps = list.length;
        sprite.text.motion = this.motions(type) || {};
        sprite.text.duration = sprite.text.motion.duration || 0;
        sprite.text.starting = sprite.text.motion.duration || 0;
        var motion = !step && next ? this.motions(next) : sprite.text.motion;
        sprite.text.zoom = {
            x: motion.zoom.x / 100,
            y: motion.zoom.y / 100
        };
        sprite.step = step + 1;
    };

    Sprite_CustomDamage.prototype.setupDigits = function(sprite, i) {
        var window = sprite.window
        var padding = window.standardPadding() * 2 + 4;
        var w = window.textWidthEx('0') + padding;
        var h = window.textHeight() + padding;
        var roll = sprite.setup.roll && sprite.duration >= sprite.starting / 2;
        var n = roll ? (this._random[i] + Math.randomInt(9) + 1) % 10 : sprite.digit;
        var row = sprite.baseRow;
        this._random[i] = n;
        window.move(0, 0, w, h);
        window.createContents();
        window.drawTextEx(String(n), 2, 2);
        sprite.bitmap = window.contents;
    };

    Sprite_CustomDamage.prototype.createTextSprite = function(setup, motion) {
        var sprite = this.createChildSprite(setup, motion);
        this._texts.push(sprite)
        return sprite;
    };

    Sprite_CustomDamage.prototype.createDigitSprite = function(setup, motion) {
        var sprite = this.createChildSprite(setup, motion);
        this._digits.push(sprite)
        return sprite;
    };

    Sprite_CustomDamage.prototype.createChildSprite = function(setup, motion) {
        var sprite = new Sprite();
        sprite.motion = motion;
        sprite.setup = setup;
        this.refreshMotion(sprite);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.opacity = 0;
        sprite.delay = 0;
        sprite.mx = setup.x;
        sprite.my = setup.y;
        sprite.scale.x = sprite.text.motion.zoom.x / 100;
        sprite.scale.y = sprite.text.motion.zoom.y / 100;
        sprite.x = Math.floor(sprite.sx + sprite.mx);
        sprite.y = Math.floor(sprite.sy + sprite.my);
        sprite.window = new Window_DamageSprite(setup);
        this.addChild(sprite);
        return sprite;
    };

    Sprite_CustomDamage.prototype.update = function() {
        if (this._delay > 0) {
            this._delay--;
        } else {
            Sprite.prototype.update.call(this);
            if (this._duration > 0) {
                this._duration--;
                if (this._texts.length > 0) this.updateTexts();
                if (this._digits.length > 0) this.updateDigits();
                this.updateFlash();
            }
        }
    };

    Sprite_CustomDamage.prototype.updateTexts = function(sprite) {
        for (var i = 0; i < this._texts.length; i++) {
            var sprite = this._texts[i];
            this.updateChild(sprite);
            if (sprite.text.duration === 0) this.refreshMotion(sprite);
        }
    };

    Sprite_CustomDamage.prototype.updateDigits = function() {
        var length = this._digits.length;
        for (var i = 0; i < this._digits.length; i++) {
            var sprite = this._digits[i];
            this.updateChild(sprite);
            sprite.setBlendColor(this._flashColor);
            if (sprite.setup.roll && sprite.text.duration % 4 === 0) this.setupDigits(sprite, i);
            if (sprite.text.duration === 0) this.refreshMotion(sprite);
        }
    };

    Sprite_CustomDamage.prototype.updateChild = function(sprite) {
        if (sprite.delay > 0) {
            sprite.delay--
        } else if (sprite.duration > 0) {
            sprite.duration--;
            sprite.text.duration--;
            this.updateMove(sprite);
            this.updateZoom(sprite);
            this.updateOpacity(sprite);
        }
    };

    Sprite_CustomDamage.prototype.updateFlash = function() {
        if (this._flashDuration > 0) {
            var d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    };

    Sprite_CustomDamage.prototype.updateOpacity = function(sprite) {
        if (sprite.duration >= sprite.starting - 10) {
            sprite.opacity = 255 * (sprite.starting - sprite.duration) / 10;
        }
        if (sprite.duration < 10) {
            sprite.opacity = 255 * sprite.duration / 10;
        }
        if (this._type === 'Popup Test') {
            sprite.opacity = 0;
        }
    };

    Sprite_CustomDamage.prototype.updateZoom = function(sprite) {
        var d = sprite.text.duration;
        if (d > 0) {
            sprite.scale.x = (sprite.scale.x * (d - 1) + sprite.text.zoom.x) / d;
            sprite.scale.y = (sprite.scale.y * (d - 1) + sprite.text.zoom.y) / d;
        }
    };

    Sprite_CustomDamage.prototype.updateMove = function(sprite) {
        sprite.mx += this.updateMoveX(sprite);
        sprite.my += this.updateMoveY(sprite);
        sprite.x = Math.floor(sprite.sx + sprite.mx + this._mainSpriteX);
        sprite.y = Math.floor(sprite.sy + sprite.my + this._mainSpriteY);
    };

    Sprite_CustomDamage.prototype.updateMoveX = function(sprite) {
        var invert = this._invert ? -1 : 1;
        var duration = sprite.text.duration;
        var starting = sprite.text.starting;
        var gravity = sprite.text.motion.gravity;
        var result = sprite.text.motion.move.x * invert / starting;
        if (gravity > 0) {
            result *= 0.2 + (1.8 * duration / starting);
        } else if (gravity < 0) {
            result *= 0.2 + (1.8 * (starting - duration) / starting);
        }
        return result
    };

    Sprite_CustomDamage.prototype.updateMoveY = function(sprite) {
        var duration = sprite.text.duration;
        var starting = sprite.text.starting;
        var gravity = 2 * sprite.text.motion.gravity / starting;
        var result = sprite.text.motion.move.y / starting;
        if (gravity < 0) {
            result += gravity * duration / starting;
        } else if (gravity > 0) {
            result += gravity * (starting - duration) / starting;
        }
        return result
    };

    Sprite_CustomDamage.prototype.isPlaying = function() {
        return this._duration > 0 || this._delay > 0;
    };

})();