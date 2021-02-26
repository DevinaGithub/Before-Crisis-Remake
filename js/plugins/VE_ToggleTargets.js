/*
 * ==============================================================================
 * ** Victor Engine MV - Toggle Targets
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.02.20 > First release.
 *  v 1.01 - 2016.03.02 > Fixed issue with guard applying state on enemy.
 *                      > Fixed issue with healing spells on the menu.
 *                      > Fixed issue with Action Times+ trait targets.
 *  v 1.02 - 2016.03.12 > Added plugin parameters for default setup.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Toggle Targets'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.ToggleTargets = VictorEngine.ToggleTargets || {};

(function() {

	VictorEngine.ToggleTargets.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.ToggleTargets.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Toggle Targets', 'VE - Basic Module', '1.13');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Toggle Targets', 'VE - Materia System');
	};

	VictorEngine.ToggleTargets.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ToggleTargets.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.02 - Setup toggleable targeting for actions
 * @author Victor Sant
 *
 * @param Scope Toggle Keys
 * @desc Keys that can be used to toggle the scope of actions.
 * Default: shift  (you can add more than one key)
 * @default shift
 *
 * @param Target Toggle Keys
 * @desc Keys that can be used to toggle the target of actions.
 * Default: tab   (you can add more than one key)
 * @default tab
 *
 * @param Toggle All Damage
 * @desc Damage rate when a toggleable action this all targets.
 * 100 = normal damage	50 = half damage
 * @default 50
 *
 * @param Target Window Position
 * @desc Place both enemies and party target windows on the same
 * position.      true = ON      false = OFF
 * @default true
 *
 * @param Auto Toggle Targets
 * @desc This makes all actions have toggleable targets.
 * true = ON      false = OFF
 * @default false
 *
 * @param Auto Toggle Scope
 * @desc This makes all actions have toggleable scope.
 * true = ON      false = OFF
 * @default false
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 * Skills and Items Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <toggle scope>
 *   Actions with this tag can switch between single/all targers.
 *
 *  <toggle target>
 *   Actions with this tag can switch between allies/opponents.
 *
 *  <split damage>
 *   Actions with this tag will have it's damage divided by the number of
 *   targets.
 *
 *  <all rate: x%>
 *   Actions with this tag will have it's damage multiplied by x% when targeting
 *   all, valid only on actions with the tag <scope toggle>. This value replace
 *   the default damage rate set on the Plugin Parameter.
 *     x : damage rate
 *
 *  <scope validation>
 *   Valid only on actions with the tag <scope toggle>. Actions with this tag
 *   will be only allowed to have it's scope toggled if the user have the tag
 *   <scope validation>.
 *
 *  <target validation>
 *   Valid only on actions with the tag <target toggle>. Actions with this tag
 *   will be only allowed to have it's targets toggled if the user have the tag
 *   <target validation>.
 *
 * ------------------------------------------------------------------------------
 * Actors, Classes, States, Weapons and Armors Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <scope validation>
 *   This tag add a trait that allows the actor to toggle the scope of actions
 *   with the tage <scope validation>.
 *
 *  <target validation>
 *   This tag add a trait that allows the actor to toggle the targets of actions
 *   with the tage <scope validation>.
 *
 * ------------------------------------------------------------------------------
 *
 *  The tag <split damage> can be used on any actions with multiple targets, even
 *  the ones without the tag <scope toggle>. The tag takes into consideration the
 *  total number of targets, even if for some reason the same target is counted
 *  Twice. For example, an action with 3 random targets will be divided by 3,
 *  even if the same target is choosen more than once.
 *
 * ---------------
 *
 *  When the plugin parameters 'Auto Toggle Targets' and 'Auto Toggle Scope'
 *  are turned ON, you can use the <target validation> and <scope validation>
 *  tags to make some actions to not have toggleable targets or scope.
 *
 * ------------------------------------------------------------------------------
 *
 * Compatibility:
 * - When used together with the plugin 'VE - Materia System', place this
 *   plugin above it.
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
		VictorEngine.Parameters.ToggleTargets = {};
		VictorEngine.Parameters.ToggleTargets.ScopeToggleKeys  = String(parameters["Scope Toggle Keys"]).trim();
		VictorEngine.Parameters.ToggleTargets.TargetToggleKeys = String(parameters["Target Toggle Keys"]).trim();
		VictorEngine.Parameters.ToggleTargets.ToggleAllDamage  = Number(parameters["Toggle All Damage"]) || 0;
		VictorEngine.Parameters.ToggleTargets.TargetWindowPos  = eval(parameters["Target Window Position"]);
		VictorEngine.Parameters.ToggleTargets.ToggleTargets    = eval(parameters["Auto Toggle Targets"]);
		VictorEngine.Parameters.ToggleTargets.ToggleScope      = eval(parameters["Auto Toggle Scope"]);
	}
		
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.ToggleTargets.loadParameters = VictorEngine.loadParameters;
	VictorEngine.loadParameters = function() {
		VictorEngine.ToggleTargets.loadParameters.call(this);
		VictorEngine.ToggleTargets.processParameters();
	};
	
	VictorEngine.ToggleTargets.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.ToggleTargets.loadNotetagsValues.call(this, data, index);
		var list = ['skill', 'item'];
		if (this.objectSelection(index, list)) VictorEngine.ToggleTargets.loadNotes1(data);
		var list = ['actor', 'class', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.ToggleTargets.loadNotes2(data);
	};
	
	VictorEngine.ToggleTargets.processParameters = function() {
		if (this.loaded) return;
		this.loaded = true;
		var parameters = VictorEngine.Parameters.ToggleTargets;
		this.scopeToggleKeys  = parameters.ScopeToggleKeys.split(/\s*[, ]\s*/);
		this.targetToggleKeys = parameters.TargetToggleKeys.split(/\s*[, ]\s*/);
	};
	
	VictorEngine.ToggleTargets.loadNotes1 = function(data) {
		var match;
		var regex1 = new RegExp('<toggle scope>', 'gi');
		var regex2 = new RegExp('<toggle target>', 'gi');
		var regex3 = new RegExp('<split damage>', 'gi');
		var regex4 = new RegExp('<scope validation>', 'gi');
		var regex5 = new RegExp('<target validation>', 'gi');
		var regex6 = new RegExp('<all rate[ ]*:[ ]*(\\d+)(\\%)?>', 'gi');
		data.toggleScope  = !!data.note.match(regex1)
		data.toggleTarget = !!data.note.match(regex2)
		data.splitDamage  = !!data.note.match(regex3)
		data.scopeValidation  = !!data.note.match(regex4)
		data.targetValidation = !!data.note.match(regex5)
		while ((match = regex6.exec(data.note)) !== null) { data.allTargetsRate = Number(match[1]) };
	};
	
	VictorEngine.ToggleTargets.loadNotes2 = function(data) {
		var regex1 = new RegExp('<scope validation>', 'gi');
		var regex2 = new RegExp('<target validation>', 'gi');
		data.scopeValidation  = !!data.note.match(regex1)
		data.targetValidation = !!data.note.match(regex2)
	};
	
	//=============================================================================
	// Game_Action
	//=============================================================================
	
	/* Overwritten function */
	Game_Action.prototype.needsSelection = function() {
		return !!this.item().scope;
	};

	VictorEngine.ToggleTargets.setItemObject = Game_Action.prototype.setItemObject;
	Game_Action.prototype.setItemObject = function(object) {
		if (this.isOnMainMenu()) this.setScopeToggle(this.subject().scopeToggle());
		VictorEngine.ToggleTargets.setItemObject.call(this, object);
	};
	
	VictorEngine.ToggleTargets.isForOpponent = Game_Action.prototype.isForOpponent;
	Game_Action.prototype.isForOpponent = function() {
		if (this.targetToggle()) {
			return this.targetToggle() === 'for opponents';
		} else {
			return VictorEngine.ToggleTargets.isForOpponent.call(this);
		}
	};
	
	VictorEngine.ToggleTargets.isForFriend = Game_Action.prototype.isForFriend;
	Game_Action.prototype.isForFriend = function() {
		if (this.targetToggle()) {
			return this.targetToggle() === 'for friends';
		} else {
			return VictorEngine.ToggleTargets.isForFriend.call(this);
		}
	};
	
	VictorEngine.ToggleTargets.isForOne = Game_Action.prototype.isForOne;
	Game_Action.prototype.isForOne = function() {
		if (this.scopeToggle()) {
			return this.scopeToggle() !== 'for all';
		} else {
			return VictorEngine.ToggleTargets.isForOne.call(this);
		}
	};
	
	VictorEngine.ToggleTargets.isForUser = Game_Action.prototype.isForUser;
	Game_Action.prototype.isForUser = function() {
		var result = this.scopeToggle() ? this.scopeToggle() !== 'for all' : true;
		return VictorEngine.ToggleTargets.isForUser.call(this) && result;
	};
	
	VictorEngine.ToggleTargets.isForAll = Game_Action.prototype.isForAll;
	Game_Action.prototype.isForAll = function() {
		if (this.scopeToggle()) {
			return this.scopeToggle() === 'for all';
		} else {
			return VictorEngine.ToggleTargets.isForAll.call(this);
		}
	};
	
	VictorEngine.ToggleTargets.makeDamageValue = Game_Action.prototype.makeDamageValue;
	Game_Action.prototype.makeDamageValue = function(target, critical) {
		var value = VictorEngine.ToggleTargets.makeDamageValue.call(this, target, critical);
		if (this._splitDamageValue > 1) value *= this.makeAllDamageValue();
		if (this.item().splitDamage)    value /= this._splitDamageValue || 1;
		return Math.round(value);
	};
	
	VictorEngine.ToggleTargets.applyGlobal = Game_Action.prototype.applyGlobal;
	Game_Action.prototype.applyGlobal = function() {
		VictorEngine.ToggleTargets.applyGlobal.call(this);
		this._splitDamageValue = $gameParty.inBattle() ? BattleManager._targets.length : 1;
	};
	
	Game_Action.prototype.makeAllDamageValue = function() {
		if (this.isForAll() && this.toggleableScope()) {
			return (this.item().allTargetsRate || VictorEngine.Parameters.ToggleTargets.ToggleAllDamage) / 100;
		} else {
			return 1
		}
	};
	
	Game_Action.prototype.isOnMainMenu = function() {
		return SceneManager._scene instanceof Scene_Skill || SceneManager._scene instanceof Scene_Item;
	};
	
	Game_Action.prototype.toggleableScope = function() {
		return this.subject().canToggleScope(this.item()); 
	};
	
	Game_Action.prototype.targetToggle = function() {
		return this._targetToggle;
	};
	
	Game_Action.prototype.scopeToggle = function() {
		return this._scopeToggle;
	};
	
	Game_Action.prototype.setTargetToggle = function(type) {
		this._targetToggle = type;
	};
	
	Game_Action.prototype.setScopeToggle = function(type) {
		this._scopeToggle = type;
	};
	
	Game_Action.prototype.clearScopeTargetToggle = function() {
		this._targetToggle = '';
		this._scopeToggle  = '';
	};
	
	//=============================================================================
	// Game_Battler
	//=============================================================================
	
	Game_Battler.prototype.canToggleScope = function(item) {
		return false;
	};
	
	Game_Battler.prototype.canToggleTarget = function(item) {
		return false;
	};
	
	//=============================================================================
	// Game_Actor
	//=============================================================================
	
	Game_Actor.prototype.canToggleScope = function(item) {
		if (item && item.scopeValidation && !this.actor().scopeValidation) return false;
		if (item && [3, 4, 5, 6].contains(item.scope)) return false
		return (item && item.toggleScope) || VictorEngine.Parameters.ToggleTargets.ToggleScope;
	};
	
	Game_Actor.prototype.canToggleTarget = function(item) {
		if (item && item.targetValidation && !this.actor().targetValidation) return false;
		if (item && item.scope === 11) return false
		return (item && item.toggleTarget) || VictorEngine.Parameters.ToggleTargets.ToggleTargets;
	};

	Game_Actor.prototype.scopeToggle = function() {
		return this._scopeToggle;
	};
	
	Game_Actor.prototype.setScopeToggle = function(type) {
		this._scopeToggle = type;
	};
	
	//=============================================================================
	// Game_Unit
	//=============================================================================
	
	Game_Unit.prototype.selectAll = function() {
		this.members().forEach(function(member) { member.deselect() });
		SceneManager._scene._spriteset.updateSelectionEffect();
		this.members().forEach(function(member) { 
			if (member.battleSprite() && member.battleSprite().isVisible()) member.select();
		});
	};
	
	//=============================================================================
	// Window_BattleActor
	//=============================================================================
	
	VictorEngine.ToggleTargets.selectWindowBattleActor = Window_BattleActor.prototype.select;
	Window_BattleActor.prototype.select = function(index) {
		this.setCursorAll(false);
		if (!this._actionUser) {
			VictorEngine.ToggleTargets.selectWindowBattleActor.call(this, index);
		}
	};
	
	Window_BattleActor.prototype.selectAll = function() {
		this.setCursorAll(true);
		this.clearUser();
		Window_Selectable.prototype.select.call(this, 0);
		$gameParty.selectAll();
		this.refresh();
	};
	
	VictorEngine.ToggleTargets.maxItems = Window_BattleActor.prototype.maxItems;
	Window_BattleActor.prototype.maxItems = function() {
		if (this._actionUser) {
			return 1;
		} else {
			return VictorEngine.ToggleTargets.maxItems.call(this);
		}
	};
	
	VictorEngine.ToggleTargets.drawItem = Window_BattleActor.prototype.drawItem;
	Window_BattleActor.prototype.drawItem = function(index) {
		if (this._actionUser) {
			var actor = this._actionUser;
			this.drawBasicArea(this.basicAreaRect(index), actor);
			this.drawGaugeArea(this.gaugeAreaRect(index), actor);
		} else {
			VictorEngine.ToggleTargets.drawItem.call(this, index);
		}
	};

	Window_BattleActor.prototype.selectUser = function(user) {
		this._actionUser = user;
		$gameParty.select(user);
		this.refresh();
	};
	
	Window_BattleActor.prototype.clearUser = function() {
		this._actionUser = null;
	};
	
	/* Compatibility with VE - Unreachable Targets */
	VictorEngine.ToggleTargets.windowActor = Window_BattleActor.prototype.windowActor;
	Window_BattleActor.prototype.windowActor = function(index) {
		if (this._actionUser) {
			return this._actionUser;
		} else if (Imported['VE - Unreachable Targets']) {
			return VictorEngine.ToggleTargets.windowActor.call(this);
		} else {
			return $gameParty.battleMembers()[index];
		}
	};
	
	/* Compatibility with YEP_BattleStatusWindow */
	Window_BattleActor.prototype.drawStatusFace = function(index) {
		var actor = this.windowActor(index);
		var rect  = this.itemRect(index);
		var ww = Math.min(rect.width - 8, Window_Base._faceWidth);
		var wh = Math.min(rect.height - 8, Window_Base._faceHeight);
		var wx = rect.x + rect.width - ww - 6;
		var wy = rect.y + 4;
		this.drawActorFace(actor, wx, wy, ww, wh);
	};
	
	//=============================================================================
	// Window_BattleEnemy
	//=============================================================================
	
	VictorEngine.ToggleTargets.selectWindowBattleEnemy = Window_BattleEnemy.prototype.select;
	Window_BattleEnemy.prototype.select = function(index) {
		this.setCursorAll(false);
		VictorEngine.ToggleTargets.selectWindowBattleEnemy.call(this, index);
	};
	
	Window_BattleEnemy.prototype.selectAll = function() {
		this.setCursorAll(true);
		Window_Selectable.prototype.select.call(this, 0);
		$gameTroop.selectAll();
	};
	
	//=============================================================================
	// Spriteset_Battle
	//=============================================================================
	
	Spriteset_Battle.prototype.updateSelectionEffect = function() {
		return this.battlerSprites().forEach(function(sprite) {
			if (sprite._battler) sprite.updateSelectionEffect();
		});
	};
	
	//=============================================================================
	// Scene_Base
	//=============================================================================
	
	Scene_Base.prototype.isKeysTriggered = function(keys) {
		return VictorEngine.ToggleTargets[keys].some(function(key) { return Input.isTriggered(key) })
	};
	
	//=============================================================================
	// Scene_ItemBase
	//=============================================================================
	
	VictorEngine.ToggleTargets.updateSceneItemBase = Scene_ItemBase.prototype.update;
	Scene_ItemBase.prototype.update = function() {
		VictorEngine.ToggleTargets.updateSceneItemBase.call(this);
		this.updateTargetToggle();
	};
	
	VictorEngine.ToggleTargets.createSceneItemBase = Scene_ItemBase.prototype.create;
	Scene_ItemBase.prototype.create = function() {
		VictorEngine.ToggleTargets.createSceneItemBase.call(this);
		$gameParty.menuActor().setScopeToggle('');
	};

	Scene_ItemBase.prototype.updateTargetToggle = function() {
		if (this._itemWindow && this._actorWindow && this.toggleScope()) this.actorToggleScope();
	};
	
	Scene_ItemBase.prototype.toggleScope = function() {
		var actor = this.user();
		var item  = this.item();
		var keys  = 'scopeToggleKeys';
		return (actor && this.isKeysTriggered(keys) && this._actorWindow.isOpenAndActive() && actor.canToggleScope(item));
	};
	
	Scene_ItemBase.prototype.actorToggleScope = function() {
		if (this._actorWindow.cursorAll()) {
			this._actorWindow.select(this._actorWindow.index())
			$gameParty.menuActor().setScopeToggle('for one');
			this._actorWindow.selectForItem(this.item());
		} else {
			$gameParty.menuActor().setScopeToggle('for all');
			this._actorWindow.selectForItem(this.item());
		}
	};
	
	//=============================================================================
	// Scene_Item
	//=============================================================================
	
	VictorEngine.ToggleTargets.onItemCancelSceneItem = Scene_Item.prototype.onItemCancel;
	Scene_Item.prototype.onItemCancel = function() {
		$gameParty.menuActor().setScopeToggle('');
		this._itemWindow.refresh();
		VictorEngine.ToggleTargets.onItemCancelSceneItem.call(this);
	};
	
	//=============================================================================
	// Scene_Skill
	//=============================================================================
	
	VictorEngine.ToggleTargets.onItemCancelSceneSkill = Scene_Skill.prototype.onItemCancel;
	Scene_Skill.prototype.onItemCancel = function() {
		$gameParty.menuActor().setScopeToggle('');
		this._itemWindow.refresh();
		VictorEngine.ToggleTargets.onItemCancelSceneSkill.call(this);
	};
	
	//=============================================================================
	// Scene_Battle
	//=============================================================================
	
	VictorEngine.ToggleTargets.createEnemyWindow = Scene_Battle.prototype.createEnemyWindow;
	Scene_Battle.prototype.createEnemyWindow = function() {
		VictorEngine.ToggleTargets.createEnemyWindow.call(this);
		if (VictorEngine.Parameters.ToggleTargets.TargetWindowPos) {
			this._actorWindow.x = this._enemyWindow.x;
			this._actorWindow.y = this._enemyWindow.y;
		}
	};

	VictorEngine.ToggleTargets.updateSceneBattle = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		VictorEngine.ToggleTargets.updateSceneBattle.call(this);
		this.updateToggle();
	};
	
	VictorEngine.ToggleTargets.commandAttack = Scene_Battle.prototype.commandAttack;
	Scene_Battle.prototype.commandAttack = function() {
		var action = BattleManager.inputtingAction();
		if (action) action.clearScopeTargetToggle();
		VictorEngine.ToggleTargets.commandAttack.call(this);
	};

	VictorEngine.ToggleTargets.commandGuard = Scene_Battle.prototype.commandGuard;
	Scene_Battle.prototype.commandGuard = function() {
		var action = BattleManager.inputtingAction();
		if (action) action.clearScopeTargetToggle();
		VictorEngine.ToggleTargets.commandGuard.call(this);
	};
	
	VictorEngine.ToggleTargets.selectActorSelection = Scene_Battle.prototype.selectActorSelection;
	Scene_Battle.prototype.selectActorSelection = function() {
		VictorEngine.ToggleTargets.selectActorSelection.call(this)
		this._actorWindow.clearUser();
		var action = BattleManager.inputtingAction();
		if (action) {
			action.setTargetToggle('for friends')
			if (action.isForRandom() || action.isForAll()) this._actorWindow.selectAll();
			if (action.isForUser()) this._actorWindow.selectUser(BattleManager.actor());
			if (this._actorWindow.cursorAll()) action.setScopeToggle('for all');
		}
		
	};
	
	VictorEngine.ToggleTargets.onActorOk = Scene_Battle.prototype.onActorOk;
	Scene_Battle.prototype.onActorOk = function() {
		this._actorWindow.clearUser();
		VictorEngine.ToggleTargets.onActorOk.call(this);
	};

	VictorEngine.ToggleTargets.selectEnemySelection = Scene_Battle.prototype.selectEnemySelection;
	Scene_Battle.prototype.selectEnemySelection = function() {
		VictorEngine.ToggleTargets.selectEnemySelection.call(this)
		var action = BattleManager.inputtingAction();
		if (action) {
			action.setTargetToggle('for opponents')
			if (action.isForRandom() || action.isForAll()) this._enemyWindow.selectAll();
			if (this._actorWindow.cursorAll()) action.setScopeToggle('for all');
		}
	};
	
	VictorEngine.ToggleTargets.onSelectAction = Scene_Battle.prototype.onSelectAction;
	Scene_Battle.prototype.onSelectAction = function() {
		this._actorWindow.clearUser();
		var action = BattleManager.inputtingAction();
		if (action) action.clearScopeTargetToggle();
		VictorEngine.ToggleTargets.onSelectAction.call(this)
	};
	
	VictorEngine.ToggleTargets.onActorCancel = Scene_Battle.prototype.onActorCancel;
	Scene_Battle.prototype.onActorCancel = function() {
		VictorEngine.ToggleTargets.onActorCancel.call(this);
		var action = BattleManager.inputtingAction();
		if (action) action.clearScopeTargetToggle();
		this._actorWindow.clearUser();
	};
	
	VictorEngine.ToggleTargets.onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
	Scene_Battle.prototype.onEnemyCancel = function() {
		VictorEngine.ToggleTargets.onEnemyCancel.call(this);
		var action = BattleManager.inputtingAction();
		if (action) action.clearScopeTargetToggle();
		this._actorWindow.clearUser();
	};
	
	Scene_Battle.prototype.updateToggle = function() {
		if (this.targetWindowActive() && BattleManager.inputtingAction()) {
			if (this.isKeysTriggered('targetToggleKeys')) {
				this.updateTargetToggle();
			} else if (this.isKeysTriggered('scopeToggleKeys')) {
				this.updateScopeToggle();
			}
		}
	};
	
	Scene_Battle.prototype.updateTargetToggle = function() {
		if (this.toggleTarget()) {
			this.onToggleTarget();
		} else {
			SoundManager.playBuzzer();
		}
	};
	
	Scene_Battle.prototype.updateScopeToggle = function() {
		if (this.toggleScope()) {
			this.onToggleScope();
		} else {
			SoundManager.playBuzzer();
		}
	};
	
	Scene_Battle.prototype.toggleTarget = function() {
		var actor  = BattleManager.actor();
		var action = BattleManager.inputtingAction();
		return actor.canToggleTarget(action ? action.item() : null);
	};
	
	Scene_Battle.prototype.toggleScope = function() {
		var actor  = BattleManager.actor();
		var action = BattleManager.inputtingAction();
		return actor.canToggleScope(action ? action.item() : null);
	};
	
	Scene_Battle.prototype.targetWindowActive = function() {
		return this._actorWindow.isOpenAndActive() || this._enemyWindow.isOpenAndActive();
	};
	
	Scene_Battle.prototype.onToggleTarget = function() {
		SoundManager.playCursor();
		if (this._actorWindow.isOpenAndActive()) {
			this.actorToggleTarget();
		} else {
			this.enemyToggleTarget()
		}
	};	
	
	Scene_Battle.prototype.onToggleScope = function() {
		SoundManager.playCursor();
		if (this._actorWindow.isOpenAndActive()) {
			this.actorToggleScope();
		} else {
			this.enemyToggleScope()
		}
	};
	
	Scene_Battle.prototype.actorToggleTarget = function() {
		this.selectEnemySelection();
		this._actorWindow.hide();
		this._actorWindow.deactivate();
		$gameParty.select(null);
	};	
	
	Scene_Battle.prototype.enemyToggleTarget = function() {
		this.selectActorSelection();
		this._enemyWindow.hide();
		this._enemyWindow.deactivate();
		$gameTroop.select(null);
	};
	
	Scene_Battle.prototype.actorToggleScope = function() {
		var action = BattleManager.inputtingAction();
		if (this._actorWindow.cursorAll()) {
			this._actorWindow.select(this._actorWindow.index())
			action.setScopeToggle('for one');
			if (action.isForUser()) this._actorWindow.selectUser(BattleManager.actor())
		} else {
			this._actorWindow.selectAll()
			action.setScopeToggle('for all');
		}
	};	
	
	Scene_Battle.prototype.enemyToggleScope = function() {
		var action = BattleManager.inputtingAction();
		if (this._enemyWindow.cursorAll()) {
			this._enemyWindow.select(this._enemyWindowIndex || 0)
			action.setScopeToggle('for one');
		} else {
			this._enemyWindowIndex = this._enemyWindow.index()
			this._enemyWindow.selectAll()
			action.setScopeToggle('for all');
		}
	};	
	
})();