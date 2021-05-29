/*
 * ==============================================================================
 * ** Victor Engine MV - Control Text
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.29 > First release.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Control Text'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.ControlText = VictorEngine.ControlText || {};

(function() {

	VictorEngine.ControlText.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.ControlText.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Control Text', 'VE - Basic Module', '1.06');
	};

	VictorEngine.ControlText.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ControlText.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
*------------------------------------------------------------------------------ 
 * @plugindesc v1.00 - Use escape codes everywhere on windowns.
 * @author Victor Sant
 *
 * @param Automatic Text Code
 * @desc Enable escape codes for all text.
 * true - ON	false - OFF
 * @default true
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 *  
 *  Escape codes are codes such as \c[x], \n[x], \i[x] and others, that
 *  can be used on messages and some other windows.
 *
 *  Text with codes are slower than the default draw text. Also, text with 
 *  codes won't stretch to fit the text width. So you can set if all text will
 *  automatically use codes or if only specified text will do.
 *  If you set the plugin parameter 'Automatic Text Code' true, all text will
 *  use escape codes. If it's disabled, you will need to add the escape code
 *  \# at the start of any text you might want to use escape codes.
 *
 * ------------------------------------------------------------------------------
 */

(function() {
	
	//=============================================================================
	// Parameters
	//=============================================================================
	
	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.ControlText = {};
		VictorEngine.Parameters.ControlText.AutoText = eval(parameters["Automatic Text Code"]);
	};
	
	//=============================================================================
	// Window_Base
	//=============================================================================

	/* Overwritten function */
	Window_Base.prototype.processNormalCharacter = function(textState) {
		var c = textState.text[textState.index++];
		var w =	VictorEngine.ControlText.textWidth.call(this, c);
		this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
		textState.x += w;
	};
	
	VictorEngine.ControlText.drawText = Window_Base.prototype.drawText;
	Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
		if (text) var sign = String(text).match(/^\\#/);
		if (VictorEngine.Parameters.ControlText.AutoText || (sign && sign[0].contains("\#"))) {
			this.drawCodeText(String(text), x, y, maxWidth, align)
		} else {
			VictorEngine.ControlText.drawText.call(this, text, x, y, maxWidth, align);
		}
	};
	
	VictorEngine.ControlText.convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	Window_Base.prototype.convertEscapeCharacters = function(text) {
		text = VictorEngine.ControlText.convertEscapeCharacters.call(this, text);
		text = VictorEngine.ControlText.convertEscapeCharacters.call(this, text);
		text = VictorEngine.ControlText.convertEscapeCharacters.call(this, text);
		text = text.replace(/\x1b\#/g, '');
		return text;
	};
	
	VictorEngine.ControlText.textWidth = Window_Base.prototype.textWidth;
	Window_Base.prototype.textWidth = function(text) {
		if (text) var sign = String(text).match(/^\\#/);
		if (VictorEngine.Parameters.ControlText.AutoText || (sign && sign[0].contains("\#"))) {
			return this.getCodeX(String(text)).width
		} else {
			return VictorEngine.ControlText.textWidth.call(this, text);
		}
	};
	
	Window_Base.prototype.drawCodeText = function(text, x, y, maxWidth, align) {
		if (text) {
			var x = this.getCodeX(text, x, y, maxWidth, align).x
			var textState = { index: 0, x: x, y: y, left: x };
			textState.text = this.convertEscapeCharacters(text);
			textState.height = this.calcTextHeight(textState, false);
			while (textState.index < textState.text.length) {
				this.processCharacter(textState);
			}
		}
	};
	
	Window_Base.prototype.getCodeX = function(text, x, y, maxWidth, align) {
		if (text) {
			var textState = { index: 0, x: 0 };
			textState.text = this.convertEscapeCharacters(text);
			while (textState.index < textState.text.length) {
				this.processCharacter(textState);
			}
			if (align === 'center') x += (maxWidth - textState.x) / 2;
			if (align === 'right')  x += (maxWidth - textState.x);
			return {x: x, width: textState.x};
		} else {
			return {x: 0, width: 0};
		}
	};
	
})();