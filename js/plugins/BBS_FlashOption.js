//=============================================================================
// Bluebooth Plugins - Flash Option
// BBS_FlashOption.js
//=============================================================================

//=============================================================================
 /*:
 * @title Flash Option
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Aug 28, 2016
 * @filename BBS_FlashOption.js
 *
 * @plugindesc v1.02 Adds user option to enable/disable screen flashes for those
 * with sensitive eyes.
 * Special Thanks to Tsukihime for all the help.
 * Special Thanks to 'Ramza' Michael Sweeney for all the support.
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *  - Free for use in non-commercial projects with credits
 *  - Free for commercial use with credits
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param Enable Screen Flashes
 * @desc Set to 'true' to enable screen flashes by default.  Overridden by user preferences.
 * Default: true
 * @default true
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * Adds user option to enable/disable screen flashes for those
 * with sensitive eyes.
 * 
 * ============================================================================
 * Change Log
 * ============================================================================
 * 1.02 - Now handles battle screen flashes as well as command224.
 * 1.01 - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.FlashOption = 1;
BBS.FlashOption = BBS.FlashOption || {};

(function() {

	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_FlashOption');
	var pDefFlashes = String(parameters['Enable Screen Flashes'] || 'false');
	
	//=============================================================================
	// Window_Options
	//=============================================================================

	var bbs_nf_Window_Options_addGeneralOptions =
		Window_Options.prototype.addGeneralOptions;
	Window_Options.prototype.addGeneralOptions = function() {
		bbs_nf_Window_Options_addGeneralOptions.call(this);
		this.addCommand('Screen Flashes?', 'flashes');
	};

	//=============================================================================
	// ConfigManager
	//=============================================================================

	getDefaultFlashOption = function() {
		if (pDefFlashes.match(/true/i)) {
		  return true;
		} else if (pDefFlashes.match(/false/i)) {
		  return false;
		} else {
		  return Utils.isNwjs();
		}
	};

	ConfigManager.flashes = getDefaultFlashOption();

	var bbs_nf_Configmanager_makeData = ConfigManager.makeData;
	ConfigManager.makeData = function() {
		var config = bbs_nf_Configmanager_makeData.call(this);
		config.flashes = this.flashes;
		return config;
	};

	var bbs_nf_Configmanager_applyData = ConfigManager.applyData;
	ConfigManager.applyData = function(config) {
		bbs_nf_Configmanager_applyData.call(this, config);
		this.flashes = this.readConfigFlashes(config, 'flashes');
	};

	ConfigManager.readConfigFlashes = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return value;
		} else {
			return getDefaultFlashOption();
		}
	};

	//=============================================================================
	// Game_Interpreter
	//=============================================================================
	// Flash Screen
	var bbs_nf_Game_Interpreter_command224 = Game_Interpreter.prototype.command224;
	Game_Interpreter.prototype.command224 = function() {
		if(ConfigManager.flashes === true) {
			bbs_nf_Game_Interpreter_command224.call(this);
		}

		return true;
	};
	
	//=============================================================================
	// Game_Screen
	//=============================================================================
	// Combat flashes are NOT handled using command224.
	var bbs_nf_Game_Screen_startFlash = Game_Screen.prototype.startFlash;
	Game_Screen.prototype.startFlash = function(color, duration) {
		if(ConfigManager.flashes === true) {
			bbs_nf_Game_Screen_startFlash.call(this, color, duration);
		}
	};
		
})(BBS.FlashOption);
//=============================================================================
// End of File
//=============================================================================
