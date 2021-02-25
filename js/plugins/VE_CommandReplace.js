/*
 * ==============================================================================
 * ** Victor Engine MV - Command Replace
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.01.19 > First release.
 *  v 1.01 - 2016.02.02 > Compatibility with Mix Actions.
 *  v 1.02 - 2016.03.15 > Improved code for better handling script codes.
 *  v 1.03 - 2016.04.21 > Added remove and add command options.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Command Replace'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.CommandReplace = VictorEngine.CommandReplace || {};

(function() {

	VictorEngine.CommandReplace.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.CommandReplace.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Command Replace', 'VE - Basic Module', '1.18');
	};

	VictorEngine.CommandReplace.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.CommandReplace.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.03 - Replace actor commands with another under certain conditions.
 * @author Victor Sant
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 * Actors, Classes, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *  
 *  <command replace: 'replace', 'name'[, type]>
 *   result = code
 *  </command replace>
 *   This tag allows to replace the command with another command.
 *   This setting is divided on 4 parts:
 *     'replace' : name of the command to be replaced, always in quotations.
 *     'name' : name of the new command,always in quotations.
 *     type   : type of the command. (see bellow)
 *     code   : code that will enable or disable the replace.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "v[x]" for variable. The 'result' must return a true/false value.
 *
 * ---------------
 *
 *  - Command to Replace
 *  The name must be exactly the same as the command to be replaced, it is case
 *  sensitive and must be always in quotations. 
 *
 *  You can leave it blank (keep the quotations), if you do, the new command will
 *  be added, instead of replacing an old command.
 *
 * ---------------
 *
 *  - Command Name
 *  Name of the new command, must be always in quotations.
 *
 *  You can leave it blank (keep the quotations), if you do, you will remove the
 *  old command, without adding any new command.
 *
 * ---------------
 *
 *  - Command Type 
 *  The type of the command must be one of the follower values:
 *  attack, guard, skill, item, direct skill, direct item.
 *    attack : the new command is a physical attack.
 *    guard  : the new command is a guard action.
 *    skill type id : the new command is a skill list, id is the skill type Id.
 *    item type id  : the new command is a item list, id is the item type Id.
 *    skill id : the new command is a direct skill, id is the skill Id. *
 *    item id  : the new command is a direct item, id is the item Id. *
 *    mix action : the new command is a mix action. **
 *  *  The 'skill' and 'item' requres the plugin 'Direct Commands'.
 *  ** The 'mix action' requres the plugin 'Mix Actions'. The new mix command
 *     must be the same as the command name set here.
 *
 *  You can ommit the type, if you do, only the command name will be changed
 *  but it will keep the same function.
 * 
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <command replace: 'Attack', 'Limit', skill type 4>
 *   result = a.tp == 100;
 *  </command replace>
 *   Replace the 'Attack' command with the command 'Limit', wich allows to select
 *   skills from the skill type 4, when the actor tp is equal 100.
 *
 * ---------------
 *
 *  <command replace: 'Magic', 'Sorcery', skill type 3>
 *   result = a.isDying();
 *  </command replace>
 *   Replace the Magic command with the command 'Sorcery' wich allows to select
 *   skills from the skill type 3, while the actor have less than 1/4 of the HP.
 *
 * ---------------
 *
 *  <command replace: 'Steal', 'Mug', skill 100>
 *   result = true;
 *  </command replace>
 *   Replace the 'Steal' command with the command 'Mug' wich allows use the skill
 *   id 100 directly from the command menu (require plugin "Direct Commands").
 *   The result is always true so this command will replace the steal command
 *   whenever it is available.
 *
 * ---------------
 *
 *  <command replace: 'Item', 'Mix', mix action>
 *   if (a.actorId() === 1 || a.actorId() === 2) {
 *       result = true;
 *   } else {
 *       result = false;
 *   }
 *  </command replace>
 *   Replace the 'Item' command with the command 'Mix' wich allows use the mix
 *   command name 'Mix' menu (require plugin "Mix Actions"), if the actor id is
 *   equal 1 or 2.
 *
 * ---------------
 *
 *  <command replace: '', 'Meditate', skill type 5>
 *   result = a.mpRate() < 0.5;
 *  </command replace>
 *   Adds the command 'Meditate', wich allows to select skills from the skill
 *  type 5, when the actor mp is lower than 50%.
 *
 * ---------------
 *
 *  <command replace: 'Passive', ''>
 *   result = $gameParty.inBattle();
 *  </command replace>
 *   Remove the command 'Paasive' while on battle.
 *
 * ------------------------------------------------------------------------------
 */

(function() {
	
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.CommandReplace.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.CommandReplace.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.CommandReplace.loadNotes(data);
	};
	
	VictorEngine.CommandReplace.loadNotes = function(data) {
		data.commandReplace = data.commandReplace || [];
		this.processNotes(data);
	};
	
	VictorEngine.CommandReplace.processNotes = function(data) {
		var match;
		var part1  = "command replace"
		var part2 = "[ ]*:[ ]*('[^\']*'|\"[^\"]*\")[ ]*,[ ]*('[^\']*'|\"[^\"]*\")(?:[ ]*,[ ]*";
		var part3 = '(attack|guard|skill type|item type|skill|item|mix action)[ ]*(\\d+)?[ ]*)?';
		var regex = VictorEngine.getNotesValues(part1 + part2 + part3, part1);
		while ((match = regex.exec(data.note)) !== null) { this.processValues(data, match) };
	};
		
	VictorEngine.CommandReplace.processValues = function(data, match) {
		var value;
		var result = {};
		result.replace = match[1].slice(1, -1);
		result.name = match[2].slice(1, -1).trim();
		result.type = match[3] ? match[3].toLowerCase() : '';
		result.id   = Number(match[4]) || 0;
		result.code = match[5].trim();
		data.commandReplace.push(result);
	};
		
	//=============================================================================
	// Game_Actor
	//=============================================================================
	
	Game_Actor.prototype.getAllCommandReplace = function() {
		return this.traitObjects().reduce(function(r, data) {
			return r.concat(data.commandReplace);
		}, []);
	};
	
	//=============================================================================
	// Window_Command
	//=============================================================================
	
	Window_Command.prototype.replaceCommands = function() {
		var newCommands = this.newCommandsList();
		for (var i = 0; i < newCommands.length; i++) {
			var command = newCommands[i]
			if (command.replace === '') {
				this._list.splice(this._list.length - 1, 0, command);
			} else {
				this.replaceNewCommand(command);
			}
		};
	};
	
	Window_Command.prototype.newCommandsList = function() {
		var object   = this;
		return this._actor.getAllCommandReplace().reduce(function(r, command) {
			var condition = object.commandCondition(command);
			return condition ? r.concat(object.setupNewCommand(command)) : r;
		}, []).sort(function(a, b) { return b.priority - a.priority });
	};
	
	Window_Command.prototype.replaceNewCommand = function(newCommand) {
		for (var i = 0; i < this._list.length; i++) {
			var command = this._list[i];
			if (newCommand.replace === command.name) {
				if (newCommand.name === '') {
					this._list.splice(i, 1);
					i--;
				} else if (newCommand.type === '') {
					command.name = newCommand.name;
				} else {
					this._list.splice(i, 1, newCommand);
				}
			}
		}
	};
	
	Window_Command.prototype.commandCondition = function(command) {
		var result = false;
		var a = this._actor;
		var v = $gameVariables._data;
		eval(command.code);
		return result;
	};
	
	Window_Command.prototype.setupNewCommand = function(command) {
		var result = {}
		result.replace = command.replace;
		result.name    = command.name;
		result.ext     = command.id || command.name || 0;
		result.symbol  = this.setupCommandSymbol(command);
		result.enabled = this.setupUsableCommand(command);
		result.prioity = command.replace === '' ? 2 : command.name === '' ? 0 : 1;
		return result;
	};
		
	Window_Command.prototype.setupUsableCommand = function(command) {
		switch (command.type) {
		case 'attack':
			return this._actor.canAttack();
		case 'guard':
			return this._actor.canGuard();
		case 'skill':
			return this._actor.canUse($dataSkills[command.id]);
		case 'item':
			return this._actor.canUse($dataItems[command.id]);
		case 'item type': case 'skill type': case 'mix action':
			return true;
		default:
			return false;
		};
	};
		
	Window_Command.prototype.setupCommandSymbol = function(command) {
		switch (command.type) {
		case 'skill':
			return 'direct skill';
		case 'item':
			return 'direct item';
		case 'item type': 
			return 'item';
		case 'skill type':
			return 'skill';
		default:
			return command.type;
		};
	};
	//=============================================================================
	// Window_ActorCommand
	//=============================================================================
	
	VictorEngine.CommandReplace.makeCommandListActorCommand = Window_ActorCommand.prototype.makeCommandList;
	Window_ActorCommand.prototype.makeCommandList = function() {
		VictorEngine.CommandReplace.makeCommandListActorCommand.call(this);
		if (this._actor) this.replaceCommands();
	};
	
	//=============================================================================
	// Window_SkillType
	//=============================================================================
	
	VictorEngine.CommandReplace.makeCommandListSkillType = Window_SkillType.prototype.makeCommandList;
	Window_SkillType.prototype.makeCommandList = function() {
		VictorEngine.CommandReplace.makeCommandListSkillType.call(this);
		if (this._actor) this.replaceCommands();
	};
	
})();