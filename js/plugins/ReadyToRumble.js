var Imported = Imported || {}; 
Imported.ReadyToRumble = true;

//==========================================================================
// ReadyToRumble.js
//==========================================================================

/*:
@plugindesc Add rumble mode to your RPG Maker projects
@author BreakerZero, with consultation from OS87, edit by YoraeRasante
@target MZ

* @param Rumble Control Option
* @desc Options menu's option name.
* @type text
* @default Rumble

@help
* ------------------------------------------------------------------------------
* Ready to Rumble by BereakerZero V2.1.0
* With consultation from OS87
* Edits by YoraeRasante/Waterguy to add to Options and use last used Gamepad
* Licensed per customer and not for redistrbution.
* ------------------------------------------------------------------------------
* Special installation requirement: Because the launcher that ships with MV does
 * not have the required functions that allow the plugin to work, the installer
 * version will patch a compatible version of NWJS over the MV defaults as a
 * precaution. Second, the default launcher package will be replaced with a
 * 64-bit runtime stack deprecating any environment versions prior to Windows 7.
 * (Don't worry about the prospect of problems, though - as long as your install
 * and project are 1.6.x or newer the official NWJS redistributable and the MV
 * launcher are completely interchangeable. But then again, you should at least
 * back up the default launcher files before installing.) You can also download
 * the plugin separately, if that's all you need.
*	
* Instructions for patching the NWJS redistributable:
* http://bit.ly/2Zaahxb
* Download the latest NWJS redistributable:
* http://bit.ly/2XNqNGu
* ------------------------------------------------------------------------------
* Using the plugin
* ------------------------------------------------------------------------------
* To activate the rumble feature in a given event or scene, use the following
* script call:
*
*  Rumble(strong,weak,time)
*     
* Strong: Maximum velocity of the effect's magnitude.
*         Default/maximum 1.0, minimum 0.2
* Weak:   Minimal velocity of the effect.
*         Default/maximum 1.0, minimum 0.2
* Time:   Defined in milliseconds, so 1000::1 and 5000 is 5 seconds.
*         Default 1000, maximum 5000.
*
* The values for weak and strong can also be reversed and still work properly.
*	
* For example:
*   Rumble(1,1,1000)
*   Rumble(0.4,0.2,500)
*   Rumble(0.3,0.6,5000)
* ------------------------------------------------------------------------------
* Building for Xbox
* ------------------------------------------------------------------------------
* NW.JS does not target console platforms, so special considerations will be
 * required for this use case. In the case of Xbox, the plugin uses a native
* JavaScript interface for connecting to a Universal Windows host project.
* For this to work, you must add a WinRT component project to your solution and 
 * replace its entire class file with the following code (assuming C#):
* 
* using Windows.Foundation.Metadata;
* using Windows.Gaming.Input;
* 
* namespace RumbleX
* {
*    [AllowForWeb]
*    public sealed class webBridge
*    {
*        public void doRumble(int strong, int weak, int time)
*        {
		     try {
*                Gamepad controlReader = Gamepad.Gamepads[0];
*                var rumbleParse = new GamepadVibration();
*                rumbleParse.LeftMotor = strong;
*                rumbleParse.RightMotor = weak;
*                controlReader.Vibration = rumbleParse;
*                for (int i = 1; i <= time; i++) {
*                }
*                rumbleParse.LeftMotor = 0;
*                rumbleParse.RightMotor = 0;
		     } catch {}
*        }
*    }
*}
*
* Then after that's done, replace the main project's entire MainPage.xaml.cs
* file's namespace contents with the following (again, this assumes C#):
*
* public sealed partial class MainPage : Page
* {
*   webBridge GameInterfacer = new webBridge();
*   public MainPage()
*   {
*     InitializeComponent();
*     Window.Current.CoreWindow.PointerCursor = null;
*     ContentViewport.NavigationStarting += ContentViewport_NavigationStarting;
*     ContentViewport.Navigate(new Uri("ms-appx-web:///index.html"));
*   }
*   private void ContentViewport_NavigationStarting(WebView sender,
*    WebViewNavigationStartingEventArgs args)
*   {
*    ContentViewport.AddWebAllowedObject("UWPConnect", GameInterfacer);
*   }
* }
*    
* Finally, in the MainPage.xaml you should change the entire page designer to
* use the following code (this DOESN'T assume C# as it's based on XML):
* <Page x:Name="gameName" // change this to your game's name
*    x:Class="Advent_Edition_X.MainPage"
*    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
*    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
*    xmlns:local="using:Advent_Edition_X"
*    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
*    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
*    mc:Ignorable="d"
*    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}"
*     HorizontalAlignment="Stretch" VerticalAlignment="Stretch"
*     HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch">
*
*    <Grid x:Name="MainViewport" HorizontalAlignment="Stretch" VerticalAlignment="Stretch">
*        <WebView x:Name="ContentViewport" Margin="0,0,0,0"
*         FocusVisualMargin="0,0,0,0" FocusVisualPrimaryThickness="0,0,0,0"
*         FocusVisualSecondaryThickness="0,0,0,0" />
*
*     </Grid>
* </Page>
*
* Finally, run a web browser export from RPG Maker, add a reference to your
* output directory in the main project's root, and set its content rule to use
* the Copy if Newer output type. Now you can build your solution, and everything
* should be good to go! You can add any code not related to the plugin (cloud
* sync, achievements etc.) once you have determined proper functionality.
* 
* ------------------------------------------------------------------------------
* Rumble Option
* ------------------------------------------------------------------------------
* Option was based on Yanfly's GamepadConfig and YEP_FpsSynchOption.
* If you are using YEP_OptionsCore.js, here's the code/parameter settings.
 *
 * ---------
 * Settings:
 * ---------
 * 
 * Name:
 * \i[83]Rumble
 *
 * Help Description:
 * Activate gamepad's Rumble effect.
 *
 * Symbol:
 * rumbleOption
 *
 * Show/Hide:
 * if (Imported.ReadyToRumble && Input.isControllerConnected()) {
 *   show = !Utils.isMobileDevice();
 * } else {
 *   show = false;
 * }
 *
 * Enable:
 * enabled = true;
 *
 * Ext:
 * ext = 0;
 *
 * ----------
 * Functions:
 * ----------
 * 
 * Make Option Code:
 * this.addCommand(name, symbol, enabled, ext);
 *
 * Draw Option Code:
 * var rect = this.itemRectForText(index);
 * var statusWidth = this.statusWidth();
 * var titleWidth = rect.width - statusWidth;
 * this.resetTextColor();
 * this.changePaintOpacity(this.isCommandEnabled(index));
 * this.drawOptionsName(index);
 * this.drawOptionsOnOff(index);
 *
 * Process OK Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, !value);
 *
 * Cursor Right Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, true);
 * 
 * Cursor Left Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, false);
 *
 * Default Config Code:
 * ConfigManager[symbol] = true;
 *
 * Save Config Code:
 * config[symbol] = ConfigManager[symbol];
 *
 * Load Config Code:
 * ConfigManager[symbol] = (config[symbol] !== undefined) ? config[symbol] : true
 *
* ------------------------------------------------------------------------------
* Q&A
* ------------------------------------------------------------------------------
* What's up with the automated patch tool?
*     Since the NW.JS package that ships with RPG Maker MV does not have the
 *     necessary updates that are required for the plugin to work properly, 
 *     the automated patch tool downloads a compatible version of the NW.JS and 
 *     updates your game files accordingly. This allows you to use the updated 
 *     package for both testing and distribution without having to do it later 
 *     on. Since they're basically the same thing, you can patch the files 
 *     without any effect to your testing and deployment provisions. (Obviously 
 *     you can also patch manually by downloading from the NW.JS website, and
 *     the patch must be installed first.) If you're primarily targeting Xbox
 *     or other consoles, then patching NW.JS may not be necessary.
* What reasoning does the NW.JS update provide as part of the install process?
*     If you're on 64-bit, you can take advantage of improved access to your 
 *     system resources beyond the 3GB combined access limit, making for 
 *     improved game performance. It is also required in order to use the
 *     plugin so that the complete availability of the gamepad servicing
 *     libraries for NW.JS are presnt in the launcher package.
* Why limit licensing to Windows platforms?
*    Unfortunately since OpenGL is not automatically installed on macOS anymore 
 *    it would be difficult to gauge compatibility. Furthermore, the Apple support 
 *    requirements in the October 2019 amendments to the official developer 
 *    agreements mandate all apps to be distributed in x64 packages (meaning that 
 *    legacy x86 code will not run at all on macOS Catalina, or any later versions 
 *    for that matter). In addition, Big Sur marks a switch to Apple-specific
 *    versions of ARM which are not compatible with other computer systems.
* Is RPG Maker MZ supported?
*    This is not yet covered, but will enter testing status in a future release.
* What should I say if my customers are complaining of rumble malfunctioning?
*    Provided the gamepad has a rumble feature there shouldn't be an issue. But in 
 *    rare cases, making a change to the rumble option while the gamepad is 
 *    connected may desync the rumble feature. If this occurs, simply unplug and 
 *    reconnect your gamepad to cycle access to the rumble interface.
* I have a console-targeted game project. Does the plugin support console rumble?
*    Not necessarily. For this use case you may need to add separate code to read
 *    the state of the rumble parameters or implement your own, with the exception
 *    of Xbox builds which are covered in the Building for Xbox help section.
 *    Additionally, this does not apply to mobile device builds which are covered
 *    by a specifically-targeted rumble call that's already included within the
 *    plugin code.
 * How do I resolve compiler and/or script errors or game crashes in UWP builds?
 *    The rumble event handlers for Universal Windows must be added to a WinRT 
 *    component project independently of the main app in order to work, however 
 *    the project can still be hosted in the same solution for as long as it is 
 *    referenced by the host app. You must also set both the host project and 
 *    the WinRT component project to require Windows 10 build 14393 as a minimum 
 *    release target. 
* ------------------------------------------------------------------------------
* Release history:
* ------------------------------------------------------------------------------
* v1.0: Initial RTM
* v1.1: Unanticipated bugfix
* v1.2: Added control switch assignment to change rumble mode status
* v1.3: Small change to accommodate the possibility of a crash when a gamepad
*       is disconnected. Also set the maximum supported values to eliminate
*       the possibility of the effect not working if set too high or too low.
* v1.4: Replaces control switch with option menu function, and directs the
*       effect to the most recenty-used gamepad. A very special thanks to 
*       YoraeRasante/Waterguy for this update. 
* v1.5: Added verification to detect the availability of a supported gamepad.
*       As of this update, the functions will not be available if gamepad
*       detection fails.
* v1.6: Community circulation revoked and user requirements changed. You must
*       have a license to use the plugin and can no longer freely dstribute
*       or modify its code. Note that this only applies starting with version
*       1.6 and does not affect existing users.
* v2.0: Added code and instructions for the Universal Windows interface, as well
*       as for mobile device rumble. Additionally, the license has been changed
 *       to a "pay your way" model; you can download without charge from any of
 *       my authorized storefronts, or pay as you believe the plugin is worth.
 *       An MZ-compatible release is also being planned; stay tuned for updates!
* v2.1: Changed the mobile device rumble call because of an unforeseen issue
*       with the detection method. Also updated with bugcheck detection for the
 *       Universal Windows instructions in the event that a gamepad is not
 *       detected by the system.
* ------------------------------------------------------------------------------
*/

var bZero = bZero || {};
 
//Setting the Options parameters
var parameters = PluginManager.parameters('ReadyToRumble');
bZero.rumbleOption = String(parameters['Rumble Control Option']);
ConfigManager.rumbleOption = true;
 
  //Detecting last gamepad used and saving the index
  bZero.rumble_Input_updateGamepad = Input._updateGamepadState;
  Input._updateGamepadState = function(gamepad) {
      bZero.rumble_Input_updateGamepad.call (this, gamepad);
      var buttons = gamepad.buttons;
      var axes = gamepad.axes;
      var threshold = 0.5;
      var used = buttons.some(function(button){
              if (button.pressed) return true;
              return false;
          });
      used = used || axes.some(function(axe){
              if (axe > threshold || axe < -threshold) return true;
              return false;
          });
      if (used) {
        this._lastGamepadUsed = gamepad.index;
      }
  }
 
  //The main rumble function
function Rumble(strong, weak, time) {
    // Code here is primarily for NW.JS, it doesn't affect other webview containers. 
    // Platform - specific code is documented separately.
    if (navigator.userAgent.indexOf("Edge") != -1) {
        // On Xbox, the following code is used with the copy/paste instructions to call
        // a function listed immediately after the main procedure.
        window.UWPConnect.doRumble(strong, weak, time);
    } else {
        // This code processes mobile device rumble. Note that it cannot read the strong/weak parameters.
        if (navigator.userAgent.indexOf('Android') != -1 || navigator.userAgent.indexOf('iPhone') != -1) {
            navigator.vibrate(time);
        } else {
            // The remainder of the rumble call is for NW.JS.
            if (ConfigManager.rumbleOption && Input._lastGamepadUsed || Input._lastGamepadUsed === 0) {
                // Checking if the option for Rumble is ON and if there is a gamepad saved as last used
                // Both checks for the gamepad are needed, first to see if a gamepad was detected, and 
                // second because it'd return false for first check if the value was 0
                // Yes, even though 0 is a valid index value. For 0 in boolean is false.
				
                if (!strong) { strong = 1.0 }
                if (strong > 1.0) { strong = 1.0 }
                if (strong <= 0.2) { strong = 0.2 }
                if (!weak) { weak = 1.0 }
                if (weak > 1.0) { weak = 1.0 }
                if (weak <= 0.2) { weak = 0.2 }
                if (!time) { time = 1000 }
                if (time >= 5000) { time = 5000 }
                var gamepad = navigator.getGamepads()[Input._lastGamepadUsed]; //This is the whole point of the previous section, to detect what gamepad to rumble on
                if (!!gamepad && !!gamepad.vibrationActuator) {
                    gamepad.vibrationActuator.playEffect("dual-rumble", {
                        duration: time,
                        strongMagnitude: strong,
                        weakMagnitude: weak
                    }
                    );
                }
            }
        }
    }
  }

  //Check if any gamepad is connected
  if (!Input.isControllerConnected) Input.isControllerConnected = function() {
    if (navigator.getGamepads) {
      var gamepads = navigator.getGamepads();
      if (gamepads) {
        for (var i = 0; i < gamepads.length; i++) {
          var gamepad = gamepads[i];
          if (gamepad && gamepad.connected) return true;
        }
      }
    }
    return false;
  };
 
  //Adding to Options
  bZero.rumble_Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    bZero.rumble_Window_Options_addGeneralOptions.call(this);
    if (!Imported.YEP_OptionsCore) this.addRumbleOptionCommand();
  };
 
  Window_Options.prototype.addRumbleOptionCommand = function() {
    if (Input.isControllerConnected()) {
      this.addCommand(bZero.rumbleOption, 'rumbleOption', true);
      this._addedController = true;
    }
  };
 
  bZero.rumble_Window_Options_update = Window_Options.prototype.update;
  Window_Options.prototype.update = function() {
    bZero.rumble_Window_Options_update.call(this);
    if (this._addedController && !Input.isControllerConnected()) {
      this.refresh();
      this.height = this.windowHeight();
      this.updatePlacement();
    }
  };