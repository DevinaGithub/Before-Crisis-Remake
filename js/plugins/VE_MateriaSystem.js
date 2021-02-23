/*
 * ==============================================================================
 * ** Victor Engine MV - Materia System
 * ------------------------------------------------------------------------------
 *  VE_MateriaSystem.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Materia System'] = '1.07';

var VictorEngine = VictorEngine || {};
VictorEngine.MateriaSystem = VictorEngine.MateriaSystem || {};

(function() {

	VictorEngine.MateriaSystem.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.MateriaSystem.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Materia System', 'VE - Basic Module', '1.12');
	};

	VictorEngine.MateriaSystem.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.MateriaSystem.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ==============================================================================
 * @plugindesc v1.07 - Attach materias to actors for parameter bonus and skills.
 * @author Victor Sant
 *
 * @param Max Materia Number
 * @desc The max amount of materias that the player can keep
 * Default: 255
 * @default 255
 *
 * @param Max Slot Number
 * @desc Max number of materia slots.
 * Default: 8
 * @default 8
 *
 * @param Materia Display Type
 * @desc Change the display of the materia icons. 
 * 1 - bellow the name	2 - side ofthe name
 * @default 1
 *
 * @param Materia Breeding
 * @desc If ON, the player will gain a new level 1 materia when a 
 * materia reach the max level	true - ON	false - OFF
 * @default false
 *
 * @param Cursor High Priority
 * @desc Cursor is displayed above materia slot icons.
 * true - ON	false - OFF
 * @default true
 *
 * @param == Materia Icons ==
 *
 * @param Single Slot Icon
 * @desc Icon Id for materia normal slots.
 * @default 0
 *
 * @param Link Slot Left
 * @desc Icon Id for the left slot of a linked slot.
 * @default 0
 *
 * @param Link Slot Center
 * @desc Icon Id for the center slot of a linked slot.
 * @default 0
 *
 * @param Link Slot Right
 * @desc Icon Id for the right slot of a linked slot.
 * @default 0
 *
 * @param Materia Level Icon
 * @desc Icon Id for materia level.
 * @default 0
 *
 * @param == Materia Vocab ==
 *
 * @param Materia Menu Name
 * @desc Name for the materia option in the main menu.
 * @default Materia
 *
 * @param Materia Ap Name
 * @desc Name for the Ap (materia experience).
 * @default AP
 *
 * @param Materia Master Text
 * @desc Max level materia text.
 * @default Master
 *
 * @param Ap Received Text
 * @desc Message displayed for receiving Ap.
 * %1 = amount of ap received.
 * @default %1 AP received!
 *
 * @param Next Level Text
 * @desc Message for the Ap needed for the next level.
 * @default To next level
 *
 * @param Ability List Text
 * @desc Text show for the materia ability list.
 * @default Ability List
 *
 * @param Param List Text
 * @desc Text show for the materia param list.
 * @default Equip Effect
 *
 * @param Equiped Materia Text
 * @desc Text show on the shop window for equiped materias.
 * @default Equiped
 *
 * @param = Victory Aftermatch =
 * @desc Compatibility with YEP Victory Aftermatch
 * @default @@
 *
 * @param Aftermath Text
 * @desc Text used to describe how much AP is earned.
 * @default AP Earned
 *
 * @param Aftermath Format
 * @desc How the AP text format in the aftermath appears.
 * %1 - Value     %2 - Amount
 * @default +%1\c[4]%2\
 *
 * @param Aftermath AP Earned
 * @desc Describes how much AP is earned per actor.
 * @default AP Earned in Battle
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 *  Materia Slots (notetag for Actors, Classes and States)
 * ------------------------------------------------------------------------------
 *  <materia slots>
 *   Actor Slot: slots, type X, growth x, icons x[, x...]
 *   Actor Slot: slots, type x, growth x, icons x[, x...]
 *   Actor Slot: slots, type x, growth x, icons x[, x...]
 *   Equip 1: slots, type x, growth x, icons x[, x...]
 *   Equip 2: slots, type x, growth x, icons x[, x...]
 *   Equip 3: slots, type x, growth x, icons x[, x...]
 *  </materia slots>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This tag allows to assign wich types of slots will be available for the
 *  actor or class. 
 *  If it's not set, the actor will have no slot to equip materias.
 *  The slot can be assigned directly to the actor or to equipment.
 *  Even if the equipment have slots, you will be able to assign materias
 *  only on the equipment of the types listed here.
 *
 *  If the actor have more than one setup for materia slots (for example from
 *  class and states), all those slots will be added, no one will be replaced.
 *
 *  If a state have this tag, it will be NOT removed upon death or using the
 *  event command 'recover all', the state can be still removed by other means 
 *  (event commands or actions that removes states).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <materia slots>
 *        Head: 0:0:0:0
 *        Left Hand: 0=0:0=0
 *        Right Hand: 0=0=0
 *        Equip 4: 0:0
 *        Equip 5: 0:0
 *       </materia slots>
 *
 *       <materia slots>
 *        Equip 1:
 *        Equip 2:
 *       </materia slots>
 *
 *       <materia slots>
 *        Body: 0, type weapon, growth 2, icons 210
 *        Mind: 0=0, type armor, growth 1, icon 211, 212
 *        Soul: 0:0:0, type armor, growth 0.5, icon 213, 214, 215
 *       </materia slots>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Actor Slot:
 *  You can assign as many slots you want to the actor. You must assign it a
 *  name and the slots for the actor. Opitionally you can assign a 'growth'
 *  and custom icons for the slot.
 *    name   : slot name, it will be displayed on the menu.
 *    slots  : slots available. (See bellow)
 *    type x : slot type, can be weapon or armor. Opitional. (see bellow)
 *    growth x : growth rate for materias. Opitional. (see bellow)
 *    icons x[, x...] : custom icons. Opitional. (see bellow)
 *     Ex.: Head: 0:0:0:0
 *          Left Hand: 0=0:0=0, growth 2
 *          Soul: 0:0:0, type armor, growth 0.5, icon 213, 214, 215
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Equip Slots:
 *  The slots for equipment, this will show the slot for the current equip.
 *  Of the type you set. Opitionally, you can set a default slot and growth
 *  for when the actor don't have equiped items of that type.
 *    Equip x : equipment type.
 *    slots  : slots available. Opition. (See bellow)
 *    type x : slot type, can be weapon or armor. Opitional. (see bellow)
 *    growth x : growth rate for materias. Opitional. (see bellow)
 *    icons x[, x...] : custom icons. Opitional. (see bellow)
 *     Ex.: Equip 1:
 *          Equip 3: 0:0=0:0
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Slots Setup:
 *  The slots are set by using numbers and separators. The number define wich
 *  types of materias can be equiped on that slot. The separator defines if
 *  there will be a link between the slots.
 *    Slot number: it's the Id of armor type of the materias that can be
 *      equiped on that slot. It's based on the armor used to create the
 *      materia. If the value is 0, any materia can be equiped on that slot.
 *    Separator: must be either '=' or ':'. If '=', then the slot is linked.
 *      (see bellow for deails about linked slots).
 *     Ex.: 0=0     // one linked pair
 *          0:0     // two indepentent slots
 *          0=0=0   // one linked trio
 *          0:0:0:0 // four indepentent slots
 *          0=0:0=0 // two linked pairs
 *          0=0:0:0 // one linked pair and two independent slots
 *          1=2:1=2 // two linked pairs (equipable with differen types)
 *          1:2:3:4 // four indepentent slots (equipable with differen types)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Linked Slots:
 *  Slots can be liked, there are materias (from the type 'support', see bellow)
 *  That can grant benefits to materias that are adjacent to them if the slot is
 *  likned. The support materia gives bonus to any materia (except materias with
 *  the type 'independent') linked to them. So the same support materia can 
 *  benefit up to two other materias (one from the left and one from the right),
 *  or the same materia gains benefits from two different support materias (one
 *  from the left and one from the right). Only if a link exist the support
 *  materias will grant bonus. Being adjacent without a link grants no effect.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Slot Type:
 *  Some materias have different effects based if they are equiped on weapons or
 *  armors. You can assign a type to actor slots so they can also benefit those
 *  materias, even the actor don't being a weapon or armor himself.
 *  So if you assign the type 'weapon' to an actor slot, it will behave like if
 *  it was placed on a weapon. For Equipment slot, the slot type is valid only
 *  when not using any equipment for that slot.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Growth:
 *  The growth is a value with the Ap gained by the materias on the slot is
 *  multiplied. The growth can be decimal. If not set the growth is equan 1.
 *    Ex.: grwoth 2   // materias gains double ap
 *         grwoth 0.5 // materias gains half ap
 *         grwoth 0   // materias gains no ap
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Icons:
 *  Id for icons of this slot set. You must set one Id for each slot. If not set
 *  it uses the default Id for icons set on the Plugin Parameters
 *    Ex.: icons 100, 101, 102, 103
 *         icons 251, 252, 251, 252, 250, 250
 * ==============================================================================
 *
 * ==============================================================================
 *                 IMPORTANT!  IMPORTANT!  IMPORTANT!  IMPORTANT  
 *  The actors won't have any avaiable slot for materias initially, even when
 *  equiped with a equipment with slots. You need to enable those slots for the
 *  actor. This is done using the <materia slots> tag for actors and/or classes.
 * ==============================================================================
 *
 * ==============================================================================
 *  Materia Slots (notetag for Weapons and Non-Materia Armors)
 * ------------------------------------------------------------------------------
 *  <materia slots: slots, growth x, icons x[, x...]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Setup a slot set for the weapon or armor.
 *     slots  : the slots available. (See above for details)
 *     growth x : the growth rate for materias on that slots. The ap gained
 *                by materias on that slots is multiplied by the growth value.
 *                Can be decimal. Opitional.
 *     icons x[, x...]  : custom icons, you must add the Id for each slot.
 *               So, if it have 5 slots, you must add 5 values. Opitional.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <materia slots: 0=0:0:0>
 *       <materia slots: 0=0:0=0, growth 0, icons 245, 246, 245, 246>
 *       <materia slots: 1=2:1=2, icons 248, 249, 248, 248>
 * ==============================================================================
 *
 * ==============================================================================
 *  Materia (notetag for Materia Armors)
 * ------------------------------------------------------------------------------
 *  <materia>
 *   type: X
 *   ap: X[, X...].
 *   icon: X
 *   price: X
 *   elements: X[, X...]
 *   states: X[, X...]
 *   skills: X: Y[, X: Y...]
 *   text: 'X'
 *   limited
 *   no level
 *   locked
 *   effects: X +Y%[, Z]
 *   paired: X +Y%[, Z]
 *   enemy skill: X: Y[, X: Y...]
 *   learn type: X
 *   learn anim: X
 *  </materia>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This tag set the armor as being a Materia. All values are optional.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  E.: <materia>
 *       ap: 2000, 18000, 35000
 *       price: 42000
 *       elements: 2
 *       skills: 1:9, 2:11, 3:13
 *       limited
 *      </materia>
 *
 *      <materia>
 *       type: support
 *       ap: 10000, 30000, 60000, 120000
 *       price: 1400000
 *       paired: all
 *       limited
 *      </materia>
 *
 *      <materia>
 *       type: enemy skill
 *       price: 1
 *       enemy skill: 10: 100%, 11: 100%, 12: 100%, 13: 100%, 14: 100%, 15: 100%
 *                    16: 100%, 17: 100%, 18: 100%, 19: 100%, 20: 100%, 21: 100%
 *                    22: 100%, 23: 100%, 24: 100%, 25: 100%, 26: 100%, 27: 100%
 *       learn type: hit
 *       learn anim: 52
 *      </materia>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Type
 *  Type of the materia
 *    support     : Materia can grant bonus to adjacent linked materias.
 *    independent : Materia don't gain bonus from adjacent suppport materias.
 *    enemy skill : Special 'enemy skill' materia, Requires the plugin
 *                  'VE - Enemy Skill' v 1.01 or higher.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Ap
 *  Ap (materia experience) needed for the materia to level up. You can assign
 *  as many values you want. This also defines the mas level of the materia.
 *  (the max level of the materia is equal 1 + the number of values set)
 *    ap: x[, x...]
 *      x : ap needed for the next level.
 *       Ex.: ap: 200, 400  // 3 levels
 *            ap: 100, 200, 300, 400  // 5 levels
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Icon
 *  Materia level Icon displayed on the menus.
 *    icon: x
 *      x : icon Id.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Price
 *  Materia price when max level. If not set (or is 0) the materia price is the
 *  buy price / 2. The sell price changes as the materia gains ap.
 *    price: x
 *      x : price value.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Elements
 *  List of the elements of the materia, it's used with the 'elemental' effetct.
 *    elements: x[, x...]
 *      x : element Id. You can add how many you want.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - States
 *  List of the states of the materia, it's used with the 'added effect' effetct.
 *    states: x[, x...]
 *      x : state Id. You can add how many you want.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Skills
 *  List of the skills of the materia, the actor can use the skills as long the
 *  materia is equiped and it have enough levels for the skill.
 *    skills: x: y[, x: y...]
 *      x : level the materia the skill is learned.
 *      y : Id of the skill learned.
 *      You can add how many pairs of values you want
 *       Ex.: skills: 1: 8, 2: 9, 3: 10
 *            skills: 2: 15, 4: 20
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Text
 *  Replace the materia skills and parameter information on the Materia menu
 *  by an arbitrary text. This text must be always into quotations. You can
 *  use line breaks and escape codes on the text.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Limited
 *  This tag makes so that a skill learned through an materia can be used on
 *  battle the same number of times as the materia level. This also works for
 *  the 'All' paired support effect.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - No Level
 *  This tag makes so the level and Ap of the materia is not displayed.
 *  The materia still gains level and Ap, it just not displayed on menus.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Locked
 *  The materia can't be unnequiped. It will be still unnequiped if the slot
 *  it is is no longer available (maybe because it was on a equipment and
 *  the equipment was replaced by one with fewer slots).
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Effects
 *  Effects are varied effects that are based on the current materia level.
 *  For example, if setup 'effect: hp +10%' and the materia is at level 3, the
 *  actor will gain +30% HP. You can add as many tags for different effects. 
 *  Any numeric value can also be negative. You can add a text after the
 *  effect, this will make the text to be displayed instead of the effect name.
 *  You can use escape codes on the text. You can also let the text empity 
 *  (but adding the text setup) to make the effect information to be skiped.
 *    stat +x%         : Changes a param, sparam or xparam.
 *    damage +x%       : Changes the damage of the materia skills.
 *    elemental +x%    : Apply the materia elements to weapon or armor.
 *    added effect +x% : Apply the materia states to weapon or armor.
 *     Ex.: effect: damage +20%
 *          effect: cnt +10%, 'Counter Up'
 *          effect: hp +10%, '\i[32]'
 *          effect: mp cost +10%, ''  // this will be skiped
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Paired
 *  Only for 'support' type materias. Those effects are similar to the
 *  effect tag, but applies to the linked materias and their effect vary
 *  according to the support materia level. For example, if setup
 *  'paired: mp cost -10%' and the materia is at level 3, the the skills
 *  from the materia linked will cost 30% less MP. You can add as many tags
 *  for different pair effects.
 *    damage +x%       : Changes the damage of the paired materia skills.
 *    elemental +x%    : Apply the paired materia elements to weapon or armor.
 *    added effect +x% : Apply the paired materia states to weapon or armor.
 *    mp cost +x%      : Changes the MP cost of the paired materia skills.
 *    hp absorb +x%    : Absorb the damage of the paired materia skills.
 *    mp absorb +x%    : Absorb the damage of the paired materia skills.
 *    all +x%          : Changes the targets of the paired materia skills.
 *     Ex.: paired: damage +20%
 *          paired: mp cost -10%, 'Economize'
 *          paired: hp absorb +10%, '\i[71]'
 *          paired: elemental -10%, ''  // this will be skiped
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Stat effect
 *  This effects allows to add any param, sparam or xparam. The value is based
 *  on the materia level.  You can use flat values for the params, the xparams
 *  and sparams should be % values. The following values can be used:
 *    params  : hp, mp, atk, def, mat, mdf, agi, luk
 *    xparams : hit, eva, cri, cev, mev, mrf, cnt, hrg, mrg, trg
 *    sparams : tgr, grd, rec, pha, mcr, tcr, prd, mrd, frd, exr
 *     Ex.: effect: hp +100
 *          effect: atk +15%
 *          effect: mrd -20%
 *          effect: cnt +10%, 'Counter Up'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Damage effect/Pair
 *  If the materia (or paired materia) grant skills, those skills  will have 
 *  their damages changed by this effect. This will not have effect on skills
 *  that aren't granted by the materia.
 *     Ex.: effect: damage: +20%
 *          paired: damage: +15%
 *          paired: damage: +10%, 'Damage Plus'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Elemental effect/pair
 *  If the materia (or paired materia) have elements (set by the tag 'elements')
 *  and it is on a weapon slot, the element will be added to the weapon.
 *  if materia is on an armor slot, it will change the elemental resistance
 *  against the element. If the total resistance is over 100% the damage will
 *  be absorbed.
 *     Ex.: effect: elemental +20%
 *          paired: elemental -15%
 *          paired: elemental +10%, 'Elemental'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Added Effect effect/pair
 *  If the materia (or paired materia) have states (set by the tag 'states')
 *  and it is on on a weapon slot, the state will be added to the weapon.
 *  if materia is on an armor slot, it will change the state resistance against
 *  the state. 
 *     Ex.: effect: added effect +20%
 *          paired: added effect -15%
 *          paired: added effect +10%, 'State Effect'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - MP Cost pair
 *  If the paired materia grant skills, those skills  will have their mp cost
 *  changed by this effect. This will not have effect on skills that aren't 
 *  granted by the paired materia.
 *     Ex.: effect: mp cost +20%
 *          paired: mp cost -15%
 *          paired: mp cost -10%, 'Economize'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - HP/MP Absorb pair
 *  If the paired materia grant skills, those skills  will absorb part of the
 *  damage dealt and convert into hp or mp. This will not have effect on skills 
 *  that aren't granted by the paired materia.
 *     Ex.: paired: hp absorb +20%
 *          paired: mp absorb +15%
 *          paired: hp absorb +10%, 'Life Drain'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - All pair
 *  Requires the plugin 'VE - Toggle Targets'. If the paired materia grant
 *  skills, you will be able to switch the scope of those skills between 
 *  all/single. When targeting All, the damage of the skill is changed by the
 *  the rate set on the Plugin Parameter of the plugin 'VE - Toggle Targets'
 *  plus the rate value set on this effect. The rate value is optional. This
 *  will not have effect on skills that aren't granted by the paired materia. 
 *  The key used to toggle the scope is the one set on the 'VE - Toggle Targets'
 *  Plugin Parameters.
 *     Ex.: paired: all
 *          paired: all +10%
 *          paired: all +10%, 'All Targets'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Enemy Skills
 *  Only for 'enemy skill' type materias. List of the skills that can be learned
 *  of the materia, the actor can use the skills as long the materia is equiped
 *  and already learned the skill. The skills learned are keep on the materia
 *  not on the actor.
 *      x : Id of the skill.
 *      y : change of learning.
 *      You can add how many pairs of values you want and use line breaks to
 *      separate them.
 *       Ex.: enemy skill: 8: 100%, 9: 100%, 10: 100%, 11: 100%, 13: 80%, 
 *                         14: 80%, 15: 80%, 16: 60%, 17: 60%, 18: 50%
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Learn Type
 *  The way that the actor will learn the skill, one either values:
 *    hit     : learn the skill when is hit with it.
 *    observe : learn the skill when see the enemy using it.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Learn Anim
 *  Animation displayed when learn a new skill. The value is the Id of
 * ==============================================================================
 *
 * ==============================================================================
 *                 IMPORTANT!  IMPORTANT!  IMPORTANT!  IMPORTANT  
 *  To create a materia, you must add the <materia> tag into an armor. Besides
 *  the values that the tag grants, all values of the armor item is still valid.
 *  The parameter changes and traits are applied to the actor when he equips the
 *  materia. The armor type is also relevant. It decides if an actor can equip
 *  a materia or not. 
 *
 *  For example, if you set the armor type 'Magic Armor' for the materia, only
 *  actors that can equip 'Magic Armors' can equip the materia You can set the
 *  armor type as none to make it equipable by everyone.  The 'Equip Type' on 
 *  the other hand is irrelevant.
 *
 *  Remember that outside of the game, the materia is just a normal armor.
 *  To give a materia to the player, just use the event command 'Change Armors'
 *  and give the armor with the materia tag to the player. On the same vein, to
 *  put a materia in a shop, just put the armor with the materia tag to be sold.
 *  Any event that checks for the armor will look for the materia. For example
 *  the conditional branch that looks for equiped armors will look for the
 *  materia being equiped, if the armor is a materia.
 * 
 *  Also, VE plugins that works for armors being equiped will also work with
 *  materias (for example, the tags for 'Action Strengthen' plugin can be
 *  added to materias, and will work when the materia is equiped).
 *  I can't ensure that for other authors plugins, although there is a chance
 *  depending on how the developer checks for the equipment notetags.
 * ==============================================================================
 *
 * ==============================================================================
 *                 IMPORTANT!  IMPORTANT!  IMPORTANT!  IMPORTANT    
 *  When materia is created, it's data is saved on a new object. If you save your
 *  game and then makes some changes on the materias or slot setup. Some of those
 *  changes might not be reflected on the materias of the old save games. 
 * ==============================================================================
 *
 * ==============================================================================
 *  Materia Ap (notetag for Enemies)
 * ------------------------------------------------------------------------------
 *  <materia ap: x>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Amount of AP (materia experience) given by the enemy.
 *    x : AP value. Numeric
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <materia ap: 10>
 *       <materia ap: 75>
 * ==============================================================================
 *
 * ==============================================================================
 *  Custom Matria Ap (notetag for Enemies)
 * ------------------------------------------------------------------------------
 *  <custom materia ap>
 *   result = code
 *  </custom materia ap>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Amount of AP given by the enemy defined by a script code.
 *   code : code that will return the ap value.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <custom materia ap>
 *        result = $gameVariables.value(10);
 *       </custom materia ap>
 * ==============================================================================
 *
 * ==============================================================================
 *  Negate All (notetag for Skills)
 * ------------------------------------------------------------------------------
 *  <negate all>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The skill will ignore the 'All pair' materia effect.
 * ==============================================================================
 *
 * ==============================================================================
 *  Negate Cost (notetag for Skills)
 * ------------------------------------------------------------------------------
 *  <negate cost>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The skill will ignore the 'MP Cost pair' materia effect.
 * ==============================================================================
 *
 * ==============================================================================
 *  Negate Damage (notetag for Skills)
 * ------------------------------------------------------------------------------
 *  <negate damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The skill will ignore the 'Damage effect/Pair' materia effect.
 * ==============================================================================
 *
 * ==============================================================================
 *  Negate Absorb (notetag for Skills)
 * ------------------------------------------------------------------------------
 *  <negate absorb>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    The skill will ignore the 'HP/MP Absorb pair' materia effect.
 * ==============================================================================
 *
 * ============================================================================== 
 *  Plugin Commands
 * ------------------------------------------------------------------------------
 *
 *  You can use v[id] on the instead of a numeric value to get the value from 
 *  the variable with the id set. For example, v[3] will get the value from the
 *  variable id 3.
 *
 * ------------------------------------------------------------------------------
 *  MateriaMenuHide
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Remove the Materia command from the menu. While hidden it will also
 *  not be available in shops (you can't sell materias).
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  MateriaMenuShow
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  If the Materia menu command is hidden, it become visible again.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  MateriaMenuDisabled
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Disable the Materia command from the menu. It will be still visible
 *  but will be grayed out and won't be accessible.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  MateriaMenuEnabled
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  If the Materia menu command is disabled, it become enabled again.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  EquipMateria actor equip slot materia
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Equips a materia on an actor.
 *    actor   : actor Id.
 *    equip   : index of the slot set.
 *    slot    : id of the slot.
 *    materia : id of the materia.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: EquipMateria 1 1 2 15
 *       EquipMateria 4 3 4 16
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  Unequipmateria actor equip slot
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Removes a materia from an actor.
 *   actor : actor Id.
 *    equip : index of the slot set.
 *    slot  : id of the slot.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: Unequipmateria 1 1 2
 *       Unequipmateria 4 3 4
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  GainAp actor value
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Give ap to all materias equiped to an actor.
 *    actor : actor Id.
 *    value : ap gained.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: GainAp 1 1 10
 *       GainAp 4 3 50
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  GainAp all value
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Give ap to all materias equiped by each party member.
 *    value : ap gained.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: GainAp all 10
 *       GainAp all 50
 * ==============================================================================
 *
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.02.10 > First release.
 *  v 1.01 - 2016.02.15 > Added slots for states.
 *                      > Fixed issue with parameter added by materias.
 *  v 1.02 - 2016.02.19 > Fixed issue with param rate added by materias.
 *  v 1.03 - 2016.02.20 > Compatibility with Toggle Targets.
 *                      > 'All' materia effect now requires the Toggle Targets.
 *  v 1.04 - 2016.02.25 > Fixed issue with materia duplicates on equip change.
 *  v 1.05 - 2016.03.15 > Fixed issue with materia armor type higher than 9.
 *  v 1.06 - 2016.03.23 > Compatibility with YEP Victory Aftermatch.
 *  v 1.07 - 2016.06.26 > Fixed issue with number of uses of all materia.
 * ==============================================================================
 */

(function() {
	
	//=============================================================================
	// Parameters
	//=============================================================================
	
	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.MateriaSystem = {};
		VictorEngine.Parameters.MateriaSystem.MateriaNumber   = Number(parameters["Max Materia Number"]) || 0;
		VictorEngine.Parameters.MateriaSystem.MaxSlotNumber   = Number(parameters["Max Slot Number"]);
		VictorEngine.Parameters.MateriaSystem.SingleSlotIcon  = Number(parameters["Single Slot Icon"]) || 0;
		VictorEngine.Parameters.MateriaSystem.LinkSlotLeft    = Number(parameters["Link Slot Left"]) || 0;
		VictorEngine.Parameters.MateriaSystem.LinkSlotCenter  = Number(parameters["Link Slot Center"]) || 0;
		VictorEngine.Parameters.MateriaSystem.LinkSlotRight   = Number(parameters["Link Slot Right"]) || 0;
		VictorEngine.Parameters.MateriaSystem.MateriaLevel    = Number(parameters["Materia Level Icon"]) || 0;
		VictorEngine.Parameters.MateriaSystem.MateriaDisplay  = Number(parameters["Materia Display Type"]) || 1;
		VictorEngine.Parameters.MateriaSystem.MateriaMenu     = String(parameters["Materia Menu Name"]).trim();
		VictorEngine.Parameters.MateriaSystem.MateriaApName   = String(parameters["Materia Ap Name"]).trim();
		VictorEngine.Parameters.MateriaSystem.ApReceived      = String(parameters["Ap Received Text"]).trim();
		VictorEngine.Parameters.MateriaSystem.MasterText      = String(parameters["Materia Master Text"]).trim();
		VictorEngine.Parameters.MateriaSystem.NextLevelText   = String(parameters["Next Level Text"]).trim();
		VictorEngine.Parameters.MateriaSystem.AbilityListText = String(parameters["Ability List Text"]).trim();
		VictorEngine.Parameters.MateriaSystem.ParamListText   = String(parameters["Param List Text"]).trim();
		VictorEngine.Parameters.MateriaSystem.EquipedText     = String(parameters["Equiped Materia Text"]).trim();
		VictorEngine.Parameters.MateriaSystem.AftermathText   = String(parameters["Aftermath Text"]).trim();
		VictorEngine.Parameters.MateriaSystem.AftermathFormat = String(parameters["Aftermath Format"]).trim();
		VictorEngine.Parameters.MateriaSystem.AftermathAP     = String(parameters["Aftermath AP Earned"]).trim();
		VictorEngine.Parameters.MateriaSystem.MateriaBreeding = eval(parameters["Materia Breeding"]);
		VictorEngine.Parameters.MateriaSystem.CursorPriority  = eval(parameters["Cursor High Priority"]);
	}
		
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.MateriaSystem.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.MateriaSystem.loadNotetagsValues.call(this, data, index);
		if (this.objectSelection(index, ['weapon', 'armor'])) {
			VictorEngine.MateriaSystem.loadNotes1(data);
		}
		if (this.objectSelection(index, ['actor', 'class', 'state'])) {
			VictorEngine.MateriaSystem.loadNotes2(data);
		}
		if (this.objectSelection(index, ['skill'])) {
			VictorEngine.MateriaSystem.loadNotes3(data);
		}
		if (this.objectSelection(index, ['enemy'])) {
			VictorEngine.MateriaSystem.loadNotes4(data);
		}
		if (this.objectSelection(index, ['armor'])) {
			VictorEngine.MateriaSystem.loadNotes5(data);
		}
	};
	
	VictorEngine.MateriaSystem.loadNotes1 = function(data) {
		data.materiaSlots = data.materiaSlots || {};
		this.processNotes1(data);
	};
	
	VictorEngine.MateriaSystem.loadNotes2 = function(data) {
		data.materiaSlots = data.materiaSlots || [];
		this.processNotes2(data);
	};

	VictorEngine.MateriaSystem.loadNotes3 = function(data) {
		data.materiaNegate = data.materiaNegate || {};
		this.processNotes3(data);
	};
	
	VictorEngine.MateriaSystem.loadNotes4 = function(data) {
		data.materiaAp = data.materiaAp || {};
		this.processNotes4(data);
	};
	
	VictorEngine.MateriaSystem.loadNotes5 = function(data) {
		data.materiaValue = data.materiaValue || {};
		this.processNotes5(data);
	};
	
	VictorEngine.MateriaSystem.processNotes1 = function(data) {
		var match;
		var regex = new RegExp('<materia slots:[ ]*([\\d:=]+)([ ]*,[ ]*[\\w\\,\\. ]+)?[ ]*>', 'gi');
		while (match = regex.exec(data.note)) {
			this.processValues1(data, match)
		};
	};
	
	VictorEngine.MateriaSystem.processNotes2 = function(data) {
		var match;
		var regex = VictorEngine.getNotesValues('materia slots');
		while (match = regex.exec(data.note)) {
			this.processValues2(match, data)
		};
	};
	
	VictorEngine.MateriaSystem.processNotes3 = function(data) {
		var regex1 = new RegExp('<negate cost>', 'gi');
		var regex2 = new RegExp('<negate damage>', 'gi');
		var regex3 = new RegExp('<negate absorb>', 'gi');
		var regex4 = new RegExp('<negate all>', 'gi');
		data.materiaNegate.cost   = !!regex1.exec(data.note);
		data.materiaNegate.damage = !!regex2.exec(data.note);
		data.materiaNegate.absorb = !!regex3.exec(data.note);
		data.materiaNegate.all    = !!regex4.exec(data.note);
	};
	
	VictorEngine.MateriaSystem.processNotes4 = function(data) {
		var match;
		var regex1 = new RegExp("<materia ap[ ]*:[ ]*(\\d+)[ ]*>", 'gi');
		var regex2 = VictorEngine.getNotesValues('custom materia ap');
		while (match = regex1.exec(data.note)) {
			this.processValues4(match, data, false);
		};
		while (match = regex2.exec(data.note)) {
			this.processValues4(match, data, true);
		};
	};
	
	VictorEngine.MateriaSystem.processNotes5 = function(data) {
		var match;
		var regex = VictorEngine.getNotesValues('materia');
		while (match = regex.exec(data.note)) {
			this.processValues5(data, match);
		};
	};
	
	VictorEngine.MateriaSystem.processValues1 = function(data, match) {
		var max = VictorEngine.Parameters.MateriaSystem.MateriaNumber;
		result = {};
		result.id     = data.id;
		result.slots  = this.materiaSlots(match[1]);
		result.icons  = this.materiaIcons(match[2]);
		result.growth = this.materiaGrowth(match[2]);
		result.equip  = true;
		data.materiaSlots = result;
	};
	
	VictorEngine.MateriaSystem.processValues2 = function(match, data) {
		var value;
		var regex1 = new RegExp('([^\\n\\r:]+):[ ]*([\\d:=]+)?([ ]*,[ ]*[\\w\\,\\. ]+)?', 'gi');
		var regex2 = new RegExp('equip[ ]*(\\d+)', 'gi');
		while (value = regex1.exec(match[1])) {
			var result = value[1].match(regex2);
			var object = this.processValues3(value);
			if (result) {
				slot = Math.max(Number(result[0].match(/\d+/)), 0)
				object.equip = true;
				object.name  = $dataSystem.equipTypes[slot] || '';
				object.id    = slot - 1;
			}
			data.materiaSlots.push(object);
		};
	};
	
	VictorEngine.MateriaSystem.processValues3 = function(match) {
		var max = VictorEngine.Parameters.MateriaSystem.MateriaNumber;
		result  = {};
		result.name   = String(match[1]).trim();
		result.type   = this.materiaType(match[2] || '');
		result.slots  = this.materiaSlots(match[2] || '');
		result.icons  = this.materiaIcons(match[3] || '');
		result.growth = this.materiaGrowth(match[3] || '');
		return result;
	};
	
	VictorEngine.MateriaSystem.processValues4 = function(match, data, code) {
		result = {};
		result.flat = code ? 0 : Number(match[1]);
		result.code = code ? match[1].trim() : '';
		data.materiaAp = result
	};
	
	VictorEngine.MateriaSystem.processValues5 = function(data, match) {
		var result = {};
		var icon   = VictorEngine.Parameters.MateriaSystem.MateriaLevel;
		result.type     = VictorEngine.getStringValue(match, 'type', '');
		result.learn    = VictorEngine.getStringValue(match, 'learn type', '');
		result.anim     = VictorEngine.getNumberValue(match, 'learn anim', '');
		result.icon     = VictorEngine.getNumberValue(match, 'icon', icon);
		result.price    = VictorEngine.getNumberValue(match, 'price', 0);
		result.ap       = VictorEngine.getNumberValues(match, 'ap');
		result.states   = VictorEngine.getNumberValues(match, 'states');
		result.elements = VictorEngine.getNumberValues(match, 'elements');
		result.text     = VictorEngine.getAnyValue(match, 'text', '');
		result.effects  = this.getMateriaEffect(match, 'effect');
		result.paired   = this.getMateriaEffect(match, 'paired');
		result.skills   = this.getMateriaSkills(match, 'skills');
		result.enemy    = this.getMateriaSkills(match, 'enemy skill');
		result.limit    = !!match[1].match(/limited/i);
		result.noLevel  = !!match[1].match(/no[ ]*level[s]?/i);
		result.locked   = !!match[1].match(/locked/i);
		result.max      = result.ap.length + 1;
		data.isMateria    = true;
		data.materiaValue = result;
	};
	
	VictorEngine.MateriaSystem.getMateriaSkills = function(match, type) {
		var part1  = '((?:\\d+[ ]*:[ ]*\\d+\\%?\\s*,?\\s*)+)';
		var regex1 = new RegExp(type + '[ ]*:[ ]*' + part1, 'gi');
		var regex2 = new RegExp('(\\d+)[ ]*:[ ]*(\\d+)', 'gi');
		var values = regex1.exec(match[1]);
		var notes  = values ? values[1] : "";
		var result = {};
		while (value = regex2.exec(notes)) {
			result[Number(value[1])] = Number(value[2]);
		};
		return result;
	};
	
	VictorEngine.MateriaSystem.getMateriaEffect = function(match, type) {
		var result = {};
		var part1  = '[ ]*:[ ]*([\\w ]+)[ ]*([+-]?\\d+)?(\\%)?'
		var part2  = "(?:[ ]*,[ ]*('[^\']*'|\"[^\"]*\"))?";
		var regex  = new RegExp(type + part1 + part2, 'gi');
		while ((value = regex.exec(match[1])) !== null) {  
			var effect = value[1].toLowerCase().trim();
			result[effect] = result[effect] || {};
			if (value[3]) {
				result[effect].rate = Number(value[2]);
			} else if (value[2]) {
				result[effect].flat = Number(value[2]);
			}
			if (value[4]) {
				result[effect].text = value[4].slice(1, -1);
			}
		};
		return result
	};
	
	VictorEngine.MateriaSystem.materiaType = function(note) {
		var regex = new RegExp('type[ ]*(weapon|armor)', 'gi');
		var match = regex.exec(note);
		return match ? match[1].toLowerCase() : 'armor';
	};
	
	VictorEngine.MateriaSystem.materiaGrowth = function(note) {
		var regex = new RegExp('growth[ ]*([\\d\\.]+)', 'gi');
		var match = regex.exec(note);
		return match ? Number(match[1]) : 1;
	};
	
	VictorEngine.MateriaSystem.materiaIcons = function(note) {
		var regex  = new RegExp('icons[ ]*((?:\\d+[ ]*,?[ ]*)+)', 'gi');
		var value  = regex.exec(note)
		var result = value ? value[1].match(/\d+/gi) : []
		return result.map(function(id) { return Number(id) });
	};
			
	VictorEngine.MateriaSystem.materiaSlots = function(note) {
		var slots = note.split(/(\d+)/i).slice(1, -1);
		return slots.map(function(slot) {
			return (slot === '=' || slot === ':') ? slot : Number(slot) || 0;
		});
	};
	
	//=============================================================================
	// SceneManager
	//=============================================================================
	
	VictorEngine.MateriaSystem.makeRewards = BattleManager.makeRewards;
	BattleManager.makeRewards = function() {
		VictorEngine.MateriaSystem.makeRewards.call(this)
		this._rewards.materiaAp = $gameTroop.apTotal();
	};
	
	VictorEngine.MateriaSystem.displayExp = BattleManager.displayExp;
	BattleManager.displayExp = function() {
		VictorEngine.MateriaSystem.displayExp.call(this)
		this.displayMateriaAp();
	};
	
	VictorEngine.MateriaSystem.gainExp = BattleManager.gainExp;
	BattleManager.gainExp = function() {
		VictorEngine.MateriaSystem.gainExp.call(this)
		this.gainMateriaAp();
	};
	
	BattleManager.displayMateriaAp = function() {
		var ap = this._rewards.materiaAp;
		if (ap > 0) {
			var text = VictorEngine.Parameters.MateriaSystem.ApReceived.format(ap);
			$gameMessage.add('\\.' + text);
		}
	};
	
	BattleManager.gainMateriaAp = function() {
		var ap = this._rewards.materiaAp;
		$gameParty.allMembers().forEach(function(actor) {
			actor.gainAp(ap);
		});
	};

	//=============================================================================
	// SceneManager
	//=============================================================================

	SceneManager.isMateriaShop = function() {
		return this._scene._materiaShop;
	};
	
	//=============================================================================
	// Game_System
	//=============================================================================
		
	VictorEngine.MateriaSystem.initializeGameSystem = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		VictorEngine.MateriaSystem.initializeGameSystem.call(this)
		this._materiaDisplay = true;
		this._materiaEnabled = true;
	};
	
	Game_System.prototype.materiaDisplay = function() {
		return this._materiaDisplay;
	};
	
	Game_System.prototype.materiaEnabled = function() {
		return this._materiaEnabled;
	};
	
	//=============================================================================
	// Game_Action
	//=============================================================================
	
	VictorEngine.MateriaSystem.makeDamageValue = Game_Action.prototype.makeDamageValue;
	Game_Action.prototype.makeDamageValue = function(target, critical) {
		var value = VictorEngine.MateriaSystem.makeDamageValue.call(this, target, critical);
		if (this.isSkill() && !this.subject().isEnemy()) {
			value *= this.makeMateriaDamage();
		}
		return Math.round(value);
	};
		
	VictorEngine.MateriaSystem.executeDamage = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function(target, value) {
		if (this.isSkill() && !this.subject().isEnemy()) {
			this.materiaAbsorbDamage(target, value);
		}
		VictorEngine.MateriaSystem.executeDamage.call(this, target, value);
	};
	
	VictorEngine.MateriaSystem.applyGlobal = Game_Action.prototype.applyGlobal;
	Game_Action.prototype.applyGlobal = function() {
		VictorEngine.MateriaSystem.applyGlobal.call(this);
		if (this.isSkill() && this.isForAllMateria() && $gameParty.inBattle()) {
			this.subject().useAllMateria(this.item());
		}
		if (this.isSkill() && this.isLimitedUse() && $gameParty.inBattle()) {
			this.subject().useMateriaTimes(this.item());
		}
	};
	
	VictorEngine.MateriaSystem.makeAllDamageValue = Game_Action.prototype.makeAllDamageValue;
	Game_Action.prototype.makeAllDamageValue = function() {
		var result = VictorEngine.MateriaSystem.makeAllDamageValue.call(this)
		return result + this.makeMateriaAllDamage();
	};
	
	VictorEngine.MateriaSystem.toggleableScope = Game_Action.prototype.toggleableScope;
	Game_Action.prototype.toggleableScope = function() {
		return VictorEngine.MateriaSystem.toggleableScope.call(this) || this.isForAllMateria();
	};
	
	Game_Action.prototype.isLimitedUse = function() {
		return !this.subject().isEnemy() && this.subject().limitedUseMateria(this.item());
	};
	
	Game_Action.prototype.isForAllMateria = function() {
		return this._isForAllBattle;
	};
	
	Game_Action.prototype.setAllMateriaAction = function(item) {
		this._isForAllBattle = this.scopeToggle() === 'for all';
	};
	
	Game_Action.prototype.makeMateriaAllDamage = function() {
		if (this.isSkill() && !this.subject().isEnemy() && this.isForAllMateria()) {
			return this.subject().materiaForAllRate(this.item());
		} else {
			return 0;
		}
	};
	
	Game_Action.prototype.makeMateriaDamage = function() {
		var rate = 1;
		var item = this.item();
		rate += this.materiaDamagePlus(item.id);
		rate += this.materiaDamagePair(item.id);
		return rate;
	};
		
	Game_Action.prototype.materiaAbsorbDamage = function(target, value) {
		var item = this.item();
		if (value > 0) {
			this.pairAbsorb(target, value, item.id, 'hp');
			this.pairAbsorb(target, value, item.id, 'mp');
		}
	};
	
	Game_Action.prototype.materiaDamagePlus = function(skillId) {
		return this.subject().allMaterias().reduce(function(r, materia) {
			return r + (materia.isDamage(skillId) ? materia.effectRate('damage') : 0);
		}, 0);
	};
		
	Game_Action.prototype.materiaDamagePair = function(skillId) {
		var object = this;
		return this.subject().pairedMateria().reduce(function(r, pair) {
			var value = object.isMateriaDamage(pair, skillId, 'damage', 'hasSkill');
			var rate  = value ? pair.main.pairRate('damage') : 0
			return r + rate;
		}, 0)
	};

	Game_Action.prototype.pairAbsorb = function(target, value, skillId, type) {
		var effect = type === 'hp' ? 'hp absorb' : 'mp absorb';
		var result = Math.floor(value * this.pairAbsorbValue(skillId, effect, 'hasSkill'));
		if (result > 0) {
			if (type === 'hp') {
				this.subject().result().hpDamage = -result;
				this.subject().gainHp(result);
			} else {
				this.subject().result().mpDamage = -result;
				this.subject().gainMp(result);
			}
		}
	};
	
	Game_Action.prototype.pairAbsorbValue = function(skillId, effect, check) {
		var object = this;
		return this.subject().pairedMateria().reduce(function(r, pair) {
			var value = object.isMateriaAbsorb(pair, skillId, effect, check);
			var rate  = value ? pair.main.pairRate(effect) : 0
			return r + rate;
		}, 0);
	};
	
	Game_Action.prototype.isMateriaDamage = function(pair, skillId, effect, check) {
		return (this.subject().pairHasEffect(pair, skillId, effect, null, check) && 
			   !$dataSkills[skillId].materiaNegate.damage);
	};
	
	Game_Action.prototype.isMateriaAbsorb = function(pair, skillId, effect, check) {
		return (this.subject().pairHasEffect(pair, skillId, effect, null, check) && 
			   !$dataSkills[skillId].materiaNegate.absorb);
	};
	
	//=============================================================================
	// Game_ActionResult
	//=============================================================================

	VictorEngine.MateriaSystem.clear = Game_ActionResult.prototype.clear;
	Game_ActionResult.prototype.clear = function() {
		VictorEngine.MateriaSystem.clear.call(this)
		this.hpMateriaAbsorb = 0;
		this.mpMateriaAbsorb = 0;
	};

	//=============================================================================
	// Game_BattlerBase
	//=============================================================================

	VictorEngine.MateriaSystem.clearStates = Game_BattlerBase.prototype.clearStates;
	Game_BattlerBase.prototype.clearStates = function() {
		var materiaStates = this.stateMateriaSlots();
		VictorEngine.MateriaSystem.clearStates.call(this);
		materiaStates.forEach(function(state) { this.addNewState(state.id) }, this)
	};
	
	Game_BattlerBase.prototype.stateMateriaSlots = function() {
		if (!this._states) return [];
		return this.states().filter(function(state) {
			return state.materiaSlots && state.materiaSlots.length > 0;
		});
	};
	
	//=============================================================================
	// Game_Actor
	//=============================================================================

	VictorEngine.MateriaSystem.initMembers = Game_Actor.prototype.initMembers;
	Game_Actor.prototype.initMembers = function() {
		VictorEngine.MateriaSystem.initMembers.call(this);
		this._materiaSlots  = [];
		this._currentSlots  = [];
		this._materiaSkills = [];
		this._allMateriaEnabled = true;
	};

	VictorEngine.MateriaSystem.setup = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId) {
		VictorEngine.MateriaSystem.setup.call(this, actorId)
		this.setupMateriaSlots();
	};

	VictorEngine.MateriaSystem.refresh = Game_Actor.prototype.refresh;
	Game_Actor.prototype.refresh = function() {
		VictorEngine.MateriaSystem.refresh.call(this);
		this.refreshMaterias();
	};
	
	VictorEngine.MateriaSystem.paramPlus = Game_Actor.prototype.paramPlus;
	Game_Actor.prototype.paramPlus = function(paramId) {
		var result = VictorEngine.MateriaSystem.paramPlus.call(this, paramId);
		return result + this.materiaParamPlus(paramId);
	};
		
	VictorEngine.MateriaSystem.paramRate = Game_Actor.prototype.paramRate;
	Game_Actor.prototype.paramRate = function(paramId) {
		var result = VictorEngine.MateriaSystem.paramRate.call(this, paramId);
		return result * this.materiaParamRate(paramId);
	};
	
	VictorEngine.MateriaSystem.xparam = Game_Actor.prototype.xparam;
	Game_Actor.prototype.xparam = function(xparamId) {
		var result = VictorEngine.MateriaSystem.xparam.call(this, xparamId)
		return result + this.materiaXparam(xparamId);
	};
	
	VictorEngine.MateriaSystem.sparam = Game_Actor.prototype.sparam;
	Game_Actor.prototype.sparam = function(sparamId) {
		var result = VictorEngine.MateriaSystem.sparam.call(this, sparamId)
		return result * this.materiaSparam(sparamId);
	};
	
	VictorEngine.MateriaSystem.changeEquip = Game_Actor.prototype.changeEquip;
	Game_Actor.prototype.changeEquip = function(slotId, item) {
		VictorEngine.MateriaSystem.changeEquip.call(this, slotId, item);
		this.refreshMaterias()
	};
	
	VictorEngine.MateriaSystem.skills = Game_Actor.prototype.skills;
	Game_Actor.prototype.skills = function() {
		this.updateMateriaSkills();
		return VictorEngine.MateriaSystem.skills.call(this)
	};
	
	VictorEngine.MateriaSystem.meetsSkillConditions = Game_Actor.prototype.meetsSkillConditions;
	Game_Actor.prototype.meetsSkillConditions = function(skill) {
		return VictorEngine.MateriaSystem.meetsSkillConditions.call(this, skill) &&
			   this.limitedUsesOk(skill);
	};

	VictorEngine.MateriaSystem.skillMpCost = Game_Actor.prototype.skillMpCost;
	Game_Actor.prototype.skillMpCost = function(skill) {
		var cost = VictorEngine.MateriaSystem.skillMpCost.call(this, skill);
		return cost + this.costChangeMateria(skill.id, cost);
	};
	
	VictorEngine.MateriaSystem.attackElements = Game_Actor.prototype.attackElements;
	Game_Actor.prototype.attackElements = function() {
		var set = VictorEngine.MateriaSystem.attackElements.call(this)
		return this.materiaAttackElements(set);
	};
	
	VictorEngine.MateriaSystem.attackStates = Game_Actor.prototype.attackStates;
	Game_Actor.prototype.attackStates = function() {
		var set = VictorEngine.MateriaSystem.attackStates.call(this)
		return this.materiaAttackStates(set);
	};
	
	VictorEngine.MateriaSystem.attackStatesRate = Game_Actor.prototype.attackStatesRate;
	Game_Actor.prototype.attackStatesRate = function(stateId) {
		var result = VictorEngine.MateriaSystem.attackStatesRate.call(this, stateId)
		return result + this.materiaAttackStatesRate(stateId);
	};
	
	VictorEngine.MateriaSystem.elementRate = Game_Actor.prototype.elementRate;
	Game_Actor.prototype.elementRate = function(elementId) {
		var result = VictorEngine.MateriaSystem.elementRate.call(this, elementId)
		return result * this.materiaElementRate(elementId);
	};
	
	VictorEngine.MateriaSystem.stateRate = Game_Actor.prototype.stateRate;
	Game_Actor.prototype.stateRate = function(stateId) {
		var result = VictorEngine.MateriaSystem.stateRate.call(this, stateId)
		return result * this.materiaStateRate(stateId);
	};
	
	VictorEngine.MateriaSystem.traitObjects = Game_Actor.prototype.traitObjects;
	Game_Actor.prototype.traitObjects = function() {
		var objects = VictorEngine.MateriaSystem.traitObjects.call(this);
		return this.allMaterias().reduce(function(r, materia) {
			return r.concat(materia.item());
		}, objects);
	};
	
	VictorEngine.MateriaSystem.hasArmor = Game_Actor.prototype.hasArmor;
	Game_Actor.prototype.hasArmor = function(armor) {
		if (armor.isMateria) {
			return this.allMaterias().some(function(materia) {
				return materia.id() === armor.id;
			})
		} else {
			return VictorEngine.MateriaSystem.hasArmor.call(this, armor)
		}
	};
		
	VictorEngine.MateriaSystem.changeEquipById = Game_Actor.prototype.changeEquipById;
	Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
		if (this.equipSlots()[etypeId - 1] !== 1 && $dataArmors[itemId].isMateria) {
			this.changeMateriaById(itemId);
		} else {
			VictorEngine.MateriaSystem.changeEquipById.call(this, etypeId, itemId)
		}
	};
	
	VictorEngine.MateriaSystem.canToggleScope = Game_Actor.prototype.canToggleScope;
	Game_Actor.prototype.canToggleScope = function(item) {
		if (item && this.materiaForAll(item)) {
			return true;
		} else {
			return VictorEngine.MateriaSystem.canToggleScope.call(this, item);
		}
	};
	
	VictorEngine.MateriaSystem.forceChangeEquip = Game_Actor.prototype.forceChangeEquip;
	Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
		this._isEquipClone = true;
		VictorEngine.MateriaSystem.forceChangeEquip.call(this, slotId, item);
	};
	
	Game_Actor.prototype.allMaterias = function() {
		var list = this._materiaSlots.reduce(function(r, slots) {
			return r.concat(slots.materias);
		}, []);
		return list.filter(function(materia) { return !!materia });
	};
	
	Game_Actor.prototype.pairedMateria = function() {
		return this._pairedMateria;
	};
	
	Game_Actor.prototype.materiaSlots = function() {
		return this._materiaSlots;
	};

	Game_Actor.prototype.materiaEquipSlots = function() {
		var objects = [].concat(this.actor(), this.currentClass(), this.states());
		return objects.reduce(function(r, obj) {
			return r.concat(obj.materiaSlots || []);
		}, []);
	};
	
	Game_Actor.prototype.setupMateriaSlots = function() {
		this.materiaEquipSlots().forEach(function(slot, i) {
			this.setupEquipMateriaSlots(slot, i)
		}, this);
		this.setupCurrentSlots();
	};
		
	Game_Actor.prototype.setupEquipMateriaSlots = function(slot, i) {
		if (slot && slot.equip) {
			var item  = this.equips()[slot.id];
			var type  = DataManager.isWeapon(item) ? 'weapon' : 'armor';
			var slots = item ? item.materiaSlots : slot;
			this._materiaSlots[i] = this.setupSlots(slots, type);
		} else if (slot) {
			this._materiaSlots[i] = this.setupSlots(slot, slot.type);
		} else {
			this._materiaSlots[i] = this.setupSlots();
		}
	};
	
	Game_Actor.prototype.refreshMaterias = function() {
		this._currentSlots.forEach(function(slot, i) {
			this.refreshMateriaSlots(slot, i);
		}, this);
		this.setupCurrentSlots();
	};
	
	Game_Actor.prototype.setupSlots = function(data, type) {
		if (data && data.slots) {
			var slot  = {}
			slot.data = data;
			slot.type = type;
			slot.materias = new Array(Math.floor((data.slots.length + 1) /2))
			return slot;
		} else {
			return {data: {growth: 0, icons: [], slots: []}, materias: [], type: ''};
		}
	};

	Game_Actor.prototype.setupCurrentSlots = function() {
		this._currentSlots = this._materiaSlots.map(function(slot) { return slot });
		this.makePairedMateria();
		this.updateMateriaSkills();
	};
	
	Game_Actor.prototype.refreshMateriaSlots = function(slot, i) {
		var materias;
		var slots = this._materiaSlots[i];
		if (slots) {
			materias = slots.materias.map(function(materia) { return materia });
		}
		this.setupEquipMateriaSlots(this.materiaEquipSlots()[i], i);
		this.reEquipMaterias(this._materiaSlots[i], materias, i);
	};
	
	Game_Actor.prototype.reEquipMaterias = function(slots, materias, j) {
		materias.forEach(function(materia, i) {
			if (slots && slots.materias.length > i) {
				slots.materias[i] = materia;
			} else if (materia && !this._isEquipClone) {
				$gameParty.gainMateria(materia, 1);
			}
		}, this)
	};
	
	Game_Actor.prototype.gainAp = function(ap) {
		this.materiaEquipSlots().forEach(function(data, i) {
			var slot = this._materiaSlots[i]
			slot.materias.forEach(function(materia) {
				if (materia) {
					materia.gainAp(ap, slot.data.growth);
				}
			})
		}, this);
		this.makePairedMateria();
		this.updateMateriaSkills();
	};
	
	Game_Actor.prototype.updateMateriaSkills = function() {
		this.forgetMateriaSkills();
		this._materiaSkills = [];
		this.learnAllMateriaSkills();
	}; 
	
	Game_Actor.prototype.forgetMateriaSkills = function() {
		this._materiaSkills.forEach(function(skillId) {
			this.forgetSkill(skillId);
		}, this);
	};
	
	Game_Actor.prototype.learnAllMateriaSkills = function() {
		this.allMaterias().forEach(function(materia) {
			this.learnMateriaSkills(materia);
		}, this);
	};
	
	Game_Actor.prototype.learnMateriaSkills = function(materia) {
		if (materia.isEnemySkill()) {
			materia.learn().forEach(function(skillId) {
				if (this.validMateriaSkill(skillId)) {
					this.gainMateriaSkill(skillId);
				}
			}, this)
		} else {
			for (var i = 1; i < materia.level() + 1; i++) {
				var skillId = materia.skills()[i]
				if (this.validMateriaSkill(skillId)) {
					this.gainMateriaSkill(skillId);
				}
			}
		}
	};
	
	Game_Actor.prototype.gainMateriaSkill = function(skillId) {
		this.learnSkill(skillId)
		this._materiaSkills.push(skillId)
	};
	
	Game_Actor.prototype.validMateriaSkill = function(skillId) {
		return (skillId && !this.isLearnedSkill(skillId))
	};
	
	Game_Actor.prototype.materiaParamPlus = function(paramId) {
		return this.allMaterias().reduce(function(r, materia) {
			return r + materia.paramPlus(paramId) + materia.flatParam(paramId);
		}, 0)
	};
	
	Game_Actor.prototype.materiaParamRate = function(paramId) {
		return this.allMaterias().reduce(function(r, materia) {
			return r + materia.paramRate(paramId);
		}, 1)
	};
	
	Game_Actor.prototype.materiaXparam = function(xparamId) {
		return this.allMaterias().reduce(function(r, materia) {
			return r + materia.xparam(xparamId);
		}, 0)
	};
	
	Game_Actor.prototype.materiaSparam = function(sparamId) {
		return this.allMaterias().reduce(function(r, materia) {
			return r + materia.sparam(sparamId);
		}, 1)
	};

	Game_Actor.prototype.makePairedMateria = function() {
		var object = this;
		this._pairedMateria = this._materiaSlots.reduce(function(r, slots) {
			return r.concat(object.setupMateriaPairs(slots));
		}, []);
	};
	
	Game_Actor.prototype.setupMateriaPairs = function(slots) {
		var object = this;
		return slots.materias.reduce(function(r, materia, i) {
			if (materia && materia.isSupport()) {
				return r.concat(object.makeMateriaPairs(slots, i));
			} else {
				return r;
			}
		}, [])
	};
	
	Game_Actor.prototype.makeMateriaPairs = function(slot, i) {
		var slots = slot.data.slots;
		var pair  = [];
		var main  = slot.materias[i];
		var left  = slot.materias[i - 1];
		var right = slot.materias[i + 1];
		var obj   = {main: main};
		obj.type  = slot.type;
		if (slots[i * 2 - 1] === '=' && left  && left.isNormal())  {
			obj.left  = left;
		}
		if (slots[i * 2 + 1] === '=' && right && right.isNormal()) {
			obj.right = right;
		}
		if (obj.left || obj.right) {
			pair.push(obj);
		}
		return pair;
	};
	
	Game_Actor.prototype.costChangeMateria = function(skillId, cost) {
		var result = this.pairChageCost(skillId, cost);
		return Math.max(result, -cost);
	};
	
	Game_Actor.prototype.pairChageCost = function(skillId, cost) {
		var object = this;
		var result = this.pairedMateria().reduce(function(r, pair) {
			var value = object.materiaChangeCost(skillId, pair);
			return r + (value ? pair.main.pairRate('mp cost') : 0);
		}, 0);
		return Math.floor(cost * result) || 0;
	};
	
	Game_Actor.prototype.materiaChangeCost = function(skillId, pair) {
		return (pair.main.pair('mp cost') && this.pairHasSkill(pair, skillId) &&
				!$dataSkills[skillId].materiaNegate.cost);
	};
	
	Game_Actor.prototype.materiaAttackElements = function(set) {
		set = this.materiaEffectAttackElements(set);
		set = this.materiaPairedAttackElements(set);
		return set.filter(function(i, n, self) { return self.indexOf(i) === n });
	};
	
	Game_Actor.prototype.materiaElementRate = function(elementId) {
		var rate = 1
		rate -= this.materiaEffectElementRate(elementId);
		rate -= this.materiaPairedElementRate(elementId);
		return rate;
	};
	
	Game_Actor.prototype.materiaAttackStates = function(set) {
		set = this.materiaEffectAttackStates(set);
		set = this.materiaPairedAttackStates(set);
		return set.filter(function(i, n, self) { return self.indexOf(i) === n });
	};
	
	Game_Actor.prototype.materiaAttackStatesRate = function(stateId) {
		var rate = 0
		rate += this.materiaEffectAttackStatesRate(stateId);
		rate += this.materiaPairedAttackStatesRate(stateId);
		return rate;
	};
	
	Game_Actor.prototype.materiaStateRate = function(stateId) {
		var rate = 1
		rate -= this.materiaEffectStatesRate(stateId);
		rate -= this.materiaPairedStatesRate(stateId);
		return rate;
	};
	
	Game_Actor.prototype.materiaEffectAttackElements = function(set) {
		var object = this;
		return this._materiaSlots.reduce(function(r, slots) {
			var elements = object.getMateriasEffects(slots, 'elemental', 'weapon', 'elements');
			return r.concat(elements);
		}, set);
	};

	Game_Actor.prototype.materiaPairedAttackElements = function(set) {
		var object = this;
		return this.pairedMateria().reduce(function(r, pair) {
			var elements = object.getPairsEffects(pair, 'elemental', 'weapon', 'elements');
			return r.concat(elements || []);
		}, set);
	};
	
	Game_Actor.prototype.materiaEffectElementRate = function(stateId) {
		var object = this;
		return this._materiaSlots.reduce(function(r, slots) {
			var rate = object.materiaHasEffect(slots, stateId, 'elemental', 'armor', 'isElement');
			return r + rate;
		}, 0)
	};
	
	Game_Actor.prototype.materiaPairedElementRate = function(elementId) {
		var object = this;
		return this.pairedMateria().reduce(function(r, pair) {
			var value = object.pairHasEffect(pair, elementId, 'elemental', 'armor', 'isElement')
			var rate  = value ? pair.main.pairRate('elemental') : 0;
			return r + rate;
		}, 0)
	};
	
	Game_Actor.prototype.getMateriaCostChange = function(skillId) {
		var object = this;
		return this.pairedMateria().reduce(function(r, pair) {
			var value = object.materiaChangeCost(skillId, pair);
			return value ? r.concat(pair.main.pairRate('mp cost')) : r;
		}, []);
	};
	
	Game_Actor.prototype.materiaEffectAttackStates = function(set) {
		var object = this;
		return this._materiaSlots.reduce(function(r, slots) {
			var states = object.getMateriasEffects(slots, 'added effect', 'weapon', 'states');
			return r.concat(states);
		}, set);
	};

	Game_Actor.prototype.materiaPairedAttackStates = function(set) {
		var object = this;
		return this.pairedMateria().reduce(function(r, pair) {
			var states = object.getPairsEffects(pair, 'added effect', 'weapon', 'states');
			return r.concat(states);
		}, set);
	};
	
	Game_Actor.prototype.materiaEffectAttackStatesRate = function(stateId) {
		var object = this;
		return this._materiaSlots.reduce(function(r, slots) {
			var rate = object.materiaHasEffect(slots, stateId, 'added effect', 'weapon', 'isState');
			return r + rate;
		}, 0)
	};
	
	Game_Actor.prototype.materiaPairedAttackStatesRate = function(stateId) {
		var object = this;
		return this.pairedMateria().reduce(function(r, pair) {
			var value = object.pairHasEffect(pair, stateId, 'added effect', 'weapon', 'isState')
			var rate  = value ? pair.main.pairRate('added effect') : 0
			return r + rate;
		}, 0)
	};
	
	Game_Actor.prototype.materiaEffectStatesRate = function(stateId) {
		var object = this;
		return this._materiaSlots.reduce(function(r, slots) {
			var rate = object.materiaHasEffect(slots, stateId, 'added effect', 'armor', 'isState');
			return r + rate;
		}, 0)
	};
	
	Game_Actor.prototype.materiaPairedStatesRate = function(stateId) {
		var object = this;
		return this.pairedMateria().reduce(function(r, pair) {
			var value = object.pairHasEffect(pair, stateId, 'added effect', 'armor', 'isState')
			var rate  = value ? pair.main.pairRate('added effect') : 0
			return r + rate;
		}, 0)
	};
	
	Game_Actor.prototype.getMateriasEffects = function(slots, effect, type, object) {
		return slots.materias.reduce(function(r, materia) {
			var isOk = materia && materia.effect(effect) && slots.type === type;
			return isOk ? r.concat(materia[object]()) : r;
		}, []);
	};
	
	Game_Actor.prototype.getPairsEffects = function(pair, effect, type, object) {
		var isOk  = pair.main.pair(effect) && pair.type === type;
		var left  = pair.left  && isOk ? pair.left[object]()  : [];
		var right = pair.right && isOk ? pair.right[object]() : [];
		return left.concat(right);
	};
	
	Game_Actor.prototype.materiaHasEffect = function(slots, itemId, effect, type, check) {
		return slots.materias.reduce(function(r, materia) {
			var result = (materia && materia.effect(effect) && slots.type === type &&
						  materia[check](itemId));
			return r + (result ? materia.effectRate(effect) : 0)
		}, 0);
	};
	
	Game_Actor.prototype.pairHasEffect = function(pair, itemId, effect, type, check) {
		return (!!pair.main.pair(effect) && (!type || pair.type === type) &&
			   (pair.left  && pair.left[check](itemId) || 
				pair.right && pair.right[check](itemId)))
	};
	
	Game_Actor.prototype.equipMateria = function(slot, index, newMateria) {
		var materiaSlot = this._materiaSlots[slot];
		if (materiaSlot && materiaSlot.materias.length > index) {
			var oldMateria = materiaSlot.materias[index];
			if (oldMateria) {
				$gameParty.gainMateria(oldMateria, 1);
			}
			materiaSlot.materias[index] = newMateria;
			$gameParty.loseMateria(newMateria);
			this.makePairedMateria();
			this.updateMateriaSkills();
			this.refresh();
		}
	};
	
	Game_Actor.prototype.unequipMateria = function(slot, index) {
		var materiaSlot = this._materiaSlots[slot];
		if (materiaSlot && materiaSlot.materias.length > index) {
			var materia = materiaSlot.materias[index];
			if (materia) {
				$gameParty.gainMateria(materia, 1);
			}
			materiaSlot.materias[index] = null;
			this.makePairedMateria();
			this.updateMateriaSkills();
			this.refresh();
		}
	};
	
	Game_Actor.prototype.equipedMateria = function(item) {
		return this.allMaterias().filter(function(materia) { 
			return materia.id() === item.id
		}).length
	};
	
	Game_Actor.prototype.changeMateriaById = function(itemId) {
		var materia = new Game_Materia(itemId);
		var slots   = this._materiaSlots;
		for (var i = 0; i < slots.length; i++) {
			var slot = slots[i].materias
			for (var j = 0; j < slot.length; j++) {
				if (!slot[j]) {
					this.equipMateria(i, j, materia);
					return
				}
			}
		}
	};
	
	Game_Actor.prototype.materiaForAll = function(item) {
		return this.pairedMateria().some(function(pair) {
			return pair.main.isAll(item.id) && this.isAllMateriaSkill(pair, item.id);
		}, this);
	};
		
	Game_Actor.prototype.limitedUseMateria = function(item) {
		return this.allMaterias().some(function(materia) { 
			return materia.hasSkill(item.id) && materia.limit();
		})
	};
	
	Game_Actor.prototype.useAllMateria = function(item) {
		var pairs  = this.pairedMateria();
		for (var i = 0; i < pairs.length; i++) {
			var pair  = pairs[i];
			if (pair.main.isAll(item.id) && this.isAllMateriaSkill(pair, item.id)) {
				if (pair.main.limit()) {
					pair.main.useTimes(item.id);
				}
				return
			}
		}
	};
	
	Game_Actor.prototype.useMateriaTimes = function(item) {
		var materias = this.allMaterias();
		for (var i = 0; i < materias.length; i++) {
			var materia = materias[i]
			if (materia.isLimited(item.id)) {
				materia.useLimit(item.id);
				return
			}
		}
	};
	
	Game_Actor.prototype.limitedUsesOk = function(item) {
		if (!this._materiaSkills.contains(item.id)) {
			return true;
		}
		var hasLimit = this.allMaterias().some(function(materia) {
			return materia.limit() && materia.hasSkill(item.id);
		})
		if (!hasLimit) {
			return true;
		}
		var materias = this.allMaterias()
		for (var i = 0; i < materias.length; i++) {
			var materia = materias[i]
			if (materia.isLimited(item.id)) {
				return true;
			}
		}
		return false
	};
	
	Game_Actor.prototype.materiaForAllRate = function(item) {
		var pairs  = this.pairedMateria()
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			if (pair.main.pair('all') &&  this.isAllMateriaSkill(pair, item.id)) {
				return pair.main.allRate();
			}
		}
		return 1
	};
	
	Game_Actor.prototype.isAllMateriaSkill = function(pair, skillId) {
		return this.pairHasSkill(pair, skillId) && !$dataSkills[skillId].materiaNegate.all;
	};
	
	Game_Actor.prototype.resetAllMaterias = function() {
		this.allMaterias().forEach(function(materia) { materia.resetTimes() });
	};
	
	Game_Actor.prototype.pairHasSkill = function(pair, skillId) {
		return (pair.left  && pair.left.hasSkill(skillId)) || (pair.right && pair.right.hasSkill(skillId));
	};
	
	VictorEngine.MateriaSystem.checkLearnEnemySkill = Game_Actor.prototype.checkLearnEnemySkill
	Game_Actor.prototype.checkLearnEnemySkill = function(skillId, type) {
		VictorEngine.MateriaSystem.checkLearnEnemySkill.call(this, skillId, type)
		this.allMaterias().forEach(function(materia) {
			if (materia.learnType() === type && Math.random() < materia.enemySkillRate(skillId) &&
				materia.canLearnEnemySkill(skillId)) {
				this._learnEnemySkill = {id: skillId, anim: materia.learnAnim(), materia: materia};
			}
		}, this);
	};
	
	VictorEngine.MateriaSystem.processLearnEnemySkill = Game_Actor.prototype.processLearnEnemySkill
	Game_Actor.prototype.processLearnEnemySkill = function(skillId) {
		if (this.learnEnemySkill().materia) {
			this.processLearnMateiraEnemySkill(this.learnEnemySkill().materia, skillId)
		} else {
			VictorEngine.MateriaSystem.processLearnEnemySkill.call(this, skillId)
		}
	};
	
	Game_Actor.prototype.processLearnMateiraEnemySkill = function(materia, skillId) {
		materia.learnEnemySkill(skillId);
		this.updateMateriaSkills();
	};

	//=============================================================================
	// Game_Enemy
	//=============================================================================
	
	Game_Enemy.prototype.makeTotalAp = function() {
		var apValue = this.enemy().materiaAp || {};
		if (apValue.flat) {
			return apValue.flat;
		}
		if (apValue.code) {
			return this.apValueCode(apValue.code);
		}
		return 0
	};

	Game_Enemy.prototype.apValueCode = function(code) {
		try {
			var result = 0;
			var a = this;
			var v = $gameVariables._data;
			eval(code)
			return result || 0;
		} catch (e) {
			return 0;
		}
	};
	
	//=============================================================================
	// Game_Party
	//=============================================================================
	
	VictorEngine.MateriaSystem.initAllItems = Game_Party.prototype.initAllItems;
	Game_Party.prototype.initAllItems = function() {
		VictorEngine.MateriaSystem.initAllItems.call(this);
		this._materias = [];
	};
	
	VictorEngine.MateriaSystem.gainItem = Game_Party.prototype.gainItem;
	Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
		if (item && item.isMateria) {
			var value = amount > 0 ? 1 : amount < 0 ? -1 : 0;
			for (var i = 0; i < Math.abs(amount); i++) {
				this.gainMateria(new Game_Materia(item.id), value, includeEquip);
			}
		} else {
			VictorEngine.MateriaSystem.gainItem.call(this, item, amount, includeEquip);
		}
	};
	
	VictorEngine.MateriaSystem.hasMaxItems = Game_Party.prototype.hasMaxItems;
	Game_Party.prototype.hasMaxItems = function(item) {
		if (item.isMateria) {
			return this.maxMaterias();
		} else {
			return VictorEngine.MateriaSystem.hasMaxItems.call(this, item)
		}
	};
		
	VictorEngine.MateriaSystem.numItems = Game_Party.prototype.numItems;
	Game_Party.prototype.numItems = function(item) {
		if (item.isMateria) {
			return this._materias.filter(function(materia) { 
				return materia.id() === item.id
			}).length;
		} else {
			return VictorEngine.MateriaSystem.numItems.call(this, item)
		}
	};
	
	VictorEngine.MateriaSystem.isAnyMemberEquipped = Game_Party.prototype.isAnyMemberEquipped;
	Game_Party.prototype.isAnyMemberEquipped = function(item) {
		if (item.isMateria) {
			return this.members().some(function(actor) {
				return actor.hasArmor(item);
			});
		} else {
			return VictorEngine.MateriaSystem.isAnyMemberEquipped.call(this, item)
		}
	};
		
	VictorEngine.MateriaSystem.discardMembersEquip = Game_Party.prototype.discardMembersEquip;
	Game_Party.prototype.discardMembersEquip = function(item, amount) {
		if (item.isMateria) {
			this.removeActorMateria(item, amount);
		} else {
			VictorEngine.MateriaSystem.discardMembersEquip.call(this, item, amount)
		}
	};
	
	Game_Party.prototype.materias = function() {
		return this._materias;
	};
	
	Game_Party.prototype.gainMateria = function(item, amount, includeEquip) {
		if (amount > 0) {
			this.addMateria(item, amount)
		} else if (amount < 0) {
			this.removeMateria(item, Math.abs(amount), includeEquip)
		}
		$gameMap.requestRefresh();
	};
	
	Game_Party.prototype.addMateria = function(item, amount) {
		for (var i = 0; i < amount; i++) {
			if (!this.maxMaterias()) {
				this._materias.push(item);
			}
		}
		this.sortMaterias();
	};
	
	Game_Party.prototype.removeMateria = function(item, amount, includeEquip) {
		var amount = this.removePartyMateria(item, amount)
		if (includeEquip) {
			this.removeActorMateria(item, amount);
		}
		this.sortMaterias();
	};
	
	Game_Party.prototype.removePartyMateria = function(item, amount) {
		if (amount < 1) return 0;
		var materias = this._materias.reverse();
		for (var i = 0; i < materias.length; i++) {
			if (materias[i].id() === item.id()) {
				materias.splice(i, 1);
				amount--;
				if (amount < 1) {
					return 0;
				}
			}
		}
		return amount;
	};
		
	Game_Party.prototype.removeActorMateria = function(item, amount) {
		if (amount < 1) {
			return;
		}
		var members = this.members();
		for (var i = 0; i < members.length; i++) {
			var actor = members[i];
			var slots = actor._materiaSlots;
			for (var j = slots.length - 1; j >= 0; j--) {
				var slot = slots[j]
				for (var k = slot.materias.length; k >= 0; k--) {
					var materia = slot.materias[k];
					if (materia && materia.id() === item.id()) {
						slot.materias[k] = null;
						amount--;
						if (amount < 1) {
							return;
						}
					}
				}
			}
		}
	};
	
	Game_Party.prototype.loseMateria = function(materia) {
		var index = this._materias.indexOf(materia)
		this._materias.splice(index, 1);
		this.sortMaterias();
	};
	
	Game_Party.prototype.sortMaterias = function() {
		this._materias.sort(function(a, b) {
			if (a.id() === b.id() && b.level() !== a.level()) {
				return b.level() - a.level();
			} else if (a.id() === b.id() && b.level() === a.level()) {
				return b.ap() - a.ap();
			} else {
				return a.id() - b.id();
			}
		});
	};
		
	Game_Party.prototype.maxMaterias = function() {
		this._materias.length >= VictorEngine.Parameters.MateriaSystem.MateriaNumber;
	};

	Game_Party.prototype.equipedMateria = function(item) {
		return this.members().reduce(function(r, member) {
			return r + member.equipedMateria(item)
		}, 0)
	};
	
	//=============================================================================
	// Game_Troop
	//=============================================================================
	
	Game_Troop.prototype.apTotal = function() {
		return this.deadMembers().reduce(function(r, enemy) {
			return r + enemy.makeTotalAp();
		}, 0);
	};
	
	//=============================================================================
	// Game_Interpreter
	//=============================================================================
	
	VictorEngine.MateriaSystem.pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		VictorEngine.MateriaSystem.pluginCommand.call(this, command, args);
		if (command.toLowerCase() === 'materiamenushow') {	
			$gameSystem._materiaDisplay = true;
			$gameSystem._materiaEnabled = true;
		}
		if (command.toLowerCase() === 'materiamenuhide') {	
			$gameSystem._materiaDisplay = false;
			$gameSystem._materiaEnabled = false;
		}
		if (command.toLowerCase() === 'materiamenuenabled') {	
			$gameSystem._materiaEnabled = true;
		}
		if (command.toLowerCase() === 'materiamenudisabled') {	
			$gameSystem._materiaEnabled = false;
		}
		if (command.toLowerCase() === 'equipmateria') {	
			var v = $gameVariables._data;
			var actor = $gameActors.actor(Number(eval(args[0])) || 0);
			var equip = Number(eval(args[1]) - 1) || 0;
			var slot  = Number(eval(args[2]) - 1) || 0;
			var materia = new Game_Materia(Number(eval(args[3])) || 0);
			if (actor && materia) {
				actor.equipMateria(equip, slot, materia);
			}
		}
		if (command.toLowerCase() === 'unequipmateria') {	
			var v = $gameVariables._data;
			var actor = $gameActors.actor(Number(eval(args[0])) || 0);
			var equip = Number(eval(args[1]) - 1) || 0;
			var slot  = Number(eval(args[2]) - 1) || 0;
			if (actor) {
				actor.unequipMateria(equip, slot);
			}
		}
		if (command.toLowerCase() === 'gainap') {	
			var v = $gameVariables._data;
			if (args[0].toLowerCase() === 'all') {
				var value = Number(eval(args[1])) || 0;
				$gameParty.members().forEach(function(actor) { actor.gainAp(value) });
			} else {
				var actor = $gameActors.actor(Number(eval(args[0])) || 0);
				var value = Number(eval(args[1])) || 0;
				if (actor) {
					actor.gainAp(value);	
				}
			}
		}
	};
	
	//=============================================================================
	// Window_MenuCommand
	//=============================================================================
	
	VictorEngine.MateriaSystem.addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		VictorEngine.MateriaSystem.addOriginalCommands.call(this);
		this.addMateriaCommand();
	};
	
	Window_MenuCommand.prototype.addMateriaCommand = function() {
		var enabled = this.materiaCommandsEnabled();
		var name    = VictorEngine.Parameters.MateriaSystem.MateriaMenu;
		if (this.needsMateriaCommand()) {
			this.addCommand(name, 'materia', enabled);
		}
	};
	
	Window_MenuCommand.prototype.materiaCommandsEnabled = function() {
		return $gameSystem.materiaEnabled() && this.areMainCommandsEnabled();
	};
	
	Window_MenuCommand.prototype.needsMateriaCommand = function() {
		return $gameSystem.materiaDisplay();
	};

	//=============================================================================
	// Window_ShopStatus
	//=============================================================================

	VictorEngine.MateriaSystem.isEquipItem = Window_ShopStatus.prototype.isEquipItem;
	Window_ShopStatus.prototype.isEquipItem = function() {
		return VictorEngine.MateriaSystem.isEquipItem.call(this) && !this._item.isMateria;
	};
   
	VictorEngine.MateriaSystem.drawPossession = Window_ShopStatus.prototype.drawPossession;
	Window_ShopStatus.prototype.drawPossession = function(x, y) {
		VictorEngine.MateriaSystem.drawPossession.call(this, x, y)
		if (this._item.isMateria) {
			var width  = this.contents.width - this.textPadding() - x;
			var height = this.lineHeight() * 2;
			var possessionWidth = this.textWidth('0000');
			this.changeTextColor(this.systemColor());
			this.drawText(VictorEngine.Parameters.MateriaSystem.EquipedText, x, y + height, width - possessionWidth);
			this.resetTextColor();
			this.drawText($gameParty.equipedMateria(this._item), x, y + height, width, 'right');
		}
	};
	
	//=============================================================================
	// Window_ItemCategory
	//=============================================================================

	VictorEngine.MateriaSystem.maxCols = Window_ItemCategory.prototype.maxCols;
	Window_ItemCategory.prototype.maxCols = function() {
		return VictorEngine.MateriaSystem.maxCols.call(this) + (SceneManager.isMateriaShop() ? 1 : 0);
	};

	VictorEngine.MateriaSystem.makeCommandList = Window_ItemCategory.prototype.makeCommandList;
	Window_ItemCategory.prototype.makeCommandList = function() {
		VictorEngine.MateriaSystem.makeCommandList.call(this)
		if (SceneManager.isMateriaShop()) {
			this.addCommand(VictorEngine.Parameters.MateriaSystem.MateriaMenu, 'materia');
		}
	};
	
	//=============================================================================
	// Window_SkillList
	//=============================================================================
	
	VictorEngine.MateriaSystem.drawSkillCost = Window_SkillList.prototype.drawSkillCost;
	Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
		VictorEngine.MateriaSystem.drawSkillCost.call(this, skill, x, y, width);
		if (this._actor.materiaForAll(skill)) {
			this.changeTextColor(this.deathColor());
			var ax = x + this.textWidth(skill.name) + 48;
			this.drawText('>', ax, y) ;
			this.changeTextColor(this.normalColor());
		}
	};
	
	//=============================================================================
	// Scene_Base
	//=============================================================================

	Scene_Base.prototype.resetAllMaterias = function() {
		$gameParty.members().forEach(function(member) {
			member.resetAllMaterias();
		}, this)
	};
	
	//=============================================================================
	// Scene_Menu
	//=============================================================================

	VictorEngine.MateriaSystem.createCommandWindow = Scene_Menu.prototype.createCommandWindow
	Scene_Menu.prototype.createCommandWindow = function() {
		VictorEngine.MateriaSystem.createCommandWindow.call(this);
		this._commandWindow.setHandler('materia', this.commandPersonal.bind(this));
	};
	
	VictorEngine.MateriaSystem.onPersonalOk = Scene_Menu.prototype.onPersonalOk;
	Scene_Menu.prototype.onPersonalOk = function() {
		VictorEngine.MateriaSystem.onPersonalOk.call(this);
		if (this._commandWindow.currentSymbol() === 'materia') {
			SceneManager.push(Scene_MateriaEquip);
		}
	};
	
	//=============================================================================
	// Scene_Skill
	//=============================================================================
	
	VictorEngine.MateriaSystem.createSceneSkill = Scene_Skill.prototype.create;
	Scene_Skill.prototype.create = function() {
		VictorEngine.MateriaSystem.createSceneSkill.call(this);
		this.resetAllMaterias();
	};
	
	//=============================================================================
	// Scene_Battle
	//=============================================================================
	
	VictorEngine.MateriaSystem.start = Scene_Battle.prototype.start;
	Scene_Battle.prototype.start = function() {
		VictorEngine.MateriaSystem.start.call(this);
		this.resetAllMaterias();
	};
	
	VictorEngine.MateriaSystem.onActorOk = Scene_Battle.prototype.onActorOk;
	Scene_Battle.prototype.onActorOk = function() {
		if (this._actorCommandWindow.currentSymbol() === 'skill') {
			this.setAllMateriaAction();
		}
		VictorEngine.MateriaSystem.onActorOk.call(this);
	};
	
	VictorEngine.MateriaSystem.onEnemyOk = Scene_Battle.prototype.onEnemyOk;
	Scene_Battle.prototype.onEnemyOk = function() {
		if (this._actorCommandWindow.currentSymbol() === 'skill') {
			this.setAllMateriaAction();
		}
		VictorEngine.MateriaSystem.onEnemyOk.call(this);
	};
	
	Scene_Battle.prototype.setAllMateriaAction = function() {
		var skill = this._skillWindow.item();
		if (BattleManager.actor().materiaForAll(skill)) {
			var action = BattleManager.inputtingAction();
			action.setAllMateriaAction(skill)
		}
	};
	
	//=============================================================================
	// Scene_Shop
	//=============================================================================
	
	VictorEngine.MateriaSystem.prepare = Scene_Shop.prototype.prepare;
	Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
		VictorEngine.MateriaSystem.prepare.call(this, goods, purchaseOnly)
		this._materiaShop = $gameSystem.materiaDisplay();
	};
	
	VictorEngine.MateriaSystem.createSceneShop = Scene_Shop.prototype.create;
	Scene_Shop.prototype.create = function() {
		VictorEngine.MateriaSystem.createSceneShop.call(this);
		this.createMateriaWindow();
		this.createMateriaSellWindow();
	};
	
	VictorEngine.MateriaSystem.sellingPrice = Scene_Shop.prototype.sellingPrice;
	Scene_Shop.prototype.sellingPrice = function() {
		if (this.materiaSell()) {
			return this._item.price();
		} else {
			return VictorEngine.MateriaSystem.sellingPrice.call(this)
		}
	};
	
	VictorEngine.MateriaSystem.update = Scene_Shop.prototype.update;
	Scene_Shop.prototype.update = function() {
		VictorEngine.MateriaSystem.update.call(this);
		if (this._categoryWindow.active && this._currentSymbol !== this.currentSymbol()) {
			this._currentSymbol = this.currentSymbol();
			if (this.currentSymbol() === 'materia') {
				this.hideSellShowMateria();
			} else {
				this.showSellHideMateria();
			}		
		}
	};
	
	VictorEngine.MateriaSystem.onCategoryOk = Scene_Shop.prototype.onCategoryOk;
	Scene_Shop.prototype.onCategoryOk = function() {
		if (this.materiaSell()) {
			this._materiaSellWindow.refresh();
			this._materiaSellWindow.activate();
			this._materiaSellWindow.select(0);
		} else {
			VictorEngine.MateriaSystem.onCategoryOk.call(this);
		}
	};
	
	VictorEngine.MateriaSystem.doSell = Scene_Shop.prototype.doSell;
	Scene_Shop.prototype.doSell = function(number) {
		if (this.materiaSell()) {
			$gameParty.gainGold(this.sellingPrice());
			$gameParty.loseMateria(this._materiaSellWindow.materia());
		} else {
			VictorEngine.MateriaSystem.doSell.call(this, number);
		}
	};

	VictorEngine.MateriaSystem.activateSellWindow = Scene_Shop.prototype.activateSellWindow;
	Scene_Shop.prototype.activateSellWindow = function() {
		if (this.materiaSell()) {
			this._categoryWindow.show();
			this._materiaSellWindow.refresh();
			this._materiaSellWindow.show();
			this._materiaSellWindow.activate();
			this._materiaWindow.show();
			this._statusWindow.hide();
		} else {
			VictorEngine.MateriaSystem.activateSellWindow.call(this);
		}
	};
	
	VictorEngine.MateriaSystem.commandSell = Scene_Shop.prototype.commandSell;
	Scene_Shop.prototype.commandSell = function() {
		VictorEngine.MateriaSystem.commandSell.call(this);
		if (this.materiaSell()) {
			this.hideSellShowMateria();
		}
	};

	VictorEngine.MateriaSystem.onCategoryCancel = Scene_Shop.prototype.onCategoryCancel;
	Scene_Shop.prototype.onCategoryCancel = function() {
		VictorEngine.MateriaSystem.onCategoryCancel.call(this);
		this._materiaSellWindow.hide();
		this._materiaWindow.hide();
	};

	Scene_Shop.prototype.currentSymbol = function() {
		return this._categoryWindow.currentSymbol();
	};
	
	Scene_Shop.prototype.materiaSell = function() {
		return this._categoryWindow.currentSymbol() === 'materia';
	};
	
	Scene_Shop.prototype.hideSellShowMateria = function() {
		this._sellWindow.hide();
		this._materiaSellWindow.refresh();
		this._materiaSellWindow.show();
		this._materiaWindow.refresh();
		this._materiaWindow.show();
	};
	
	Scene_Shop.prototype.showSellHideMateria = function() {
		this._sellWindow.show();
		this._materiaSellWindow.hide();
		this._materiaWindow.hide();
	};
	
	Scene_Shop.prototype.createMateriaWindow = function() {
		var wx = 312;
		var wy = this._sellWindow.y;
		var ww = Graphics.boxWidth  - wx;
		var wh = Graphics.boxHeight - wy;
		this._materiaWindow = new Window_MateriaStatus(wx, wy, ww, wh, true);
		this._materiaWindow.hide();
		this.addWindow(this._materiaWindow);
	};
	
	Scene_Shop.prototype.createMateriaSellWindow = function() {
		var wx = 0;
		var wy = this._sellWindow.y;
		var ww = Graphics.boxWidth  - this._materiaWindow.width;
		var wh = Graphics.boxHeight - wy;
		this._materiaSellWindow = new Window_MateriaShop(wx, wy, ww, wh);
		this._materiaSellWindow.setHelpWindow(this._helpWindow);
		this._materiaSellWindow.setMateriaWindow(this._materiaWindow);
		this._materiaSellWindow.hide();
		this._materiaSellWindow.setHandler('ok',     this.onSellMateriaOk.bind(this));
		this._materiaSellWindow.setHandler('cancel', this.onSellMateriaCancel.bind(this));
		this.addWindow(this._materiaSellWindow);
	};

	Scene_Shop.prototype.onSellMateriaCancel = function() {
		this._materiaSellWindow.deselect();
		this._categoryWindow.activate();
		this._materiaWindow.setMateria(null);
		this._helpWindow.clear();
	};

	Scene_Shop.prototype.onSellMateriaOk = function() {
		this._item = this._materiaSellWindow.materia();
		this._categoryWindow.hide();
		this._materiaWindow.hide();
		this._materiaSellWindow.hide();
		this._numberWindow.setup(this._item.item(), 1, this.sellingPrice());
		this._numberWindow.setCurrencyUnit(this.currencyUnit());
		this._numberWindow.show();
		this._numberWindow.activate();
		this._statusWindow.setItem(this._item.item());
		this._statusWindow.show();
	};
	
})();

//=============================================================================
// Scene_MateriaEquip
//=============================================================================

function Scene_MateriaEquip() {
	this.initialize.apply(this, arguments);
}

Scene_MateriaEquip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MateriaEquip.prototype.constructor = Scene_MateriaEquip;
	
(function() {
	
	Scene_MateriaEquip.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};
	
	Scene_MateriaEquip.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createMateriaWindow();
		this.createEquipWindow();
		this.createItemWindow();
		this.refreshActor();
	};
	
	Scene_MateriaEquip.prototype.createHelpWindow = function() {
		Scene_MenuBase.prototype.createHelpWindow.call(this);
		var help = this._helpWindow;
		help.move(help.x, 180, help.width, help.height);
	};
	
	Scene_MateriaEquip.prototype.createMateriaWindow = function() {
		var wx = 0;
		var wy = 288;
		var ww = Graphics.boxWidth  - 312;
		var wh = Graphics.boxHeight - 288;
		this._statusWindow = new Window_MateriaStatus(wx, wy, ww, wh);
		this.addWindow(this._statusWindow);
	};

	Scene_MateriaEquip.prototype.createEquipWindow = function() {
		var ww = Graphics.boxWidth;
		var wh = 180;
		this._equipWindow = new Window_MateriaEquip(ww, wh);
		this._equipWindow.setHelpWindow(this._helpWindow);
		this._equipWindow.setMateriaWindow(this._statusWindow);
		this._equipWindow.setHandler('ok',       this.commandEquip.bind(this));
		this._equipWindow.setHandler('clear',    this.commandClear.bind(this));
		this._equipWindow.setHandler('cancel',   this.popScene.bind(this));
		this._equipWindow.setHandler('pagedown', this.nextActor.bind(this));
		this._equipWindow.setHandler('pageup',   this.previousActor.bind(this));
		this.addWindow(this._equipWindow);
	};
	
	Scene_MateriaEquip.prototype.createItemWindow = function() {
		var wx = Graphics.boxWidth - 312;
		var wy = 288;
		var ww = 312;
		var wh = Graphics.boxHeight - 288;
		this._itemWindow = new Window_MateriaItem(wx, wy, ww, wh);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setEquipWindow(this._equipWindow);
		this._itemWindow.setMateriaWindow(this._statusWindow);
		this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
		this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
		this.addWindow(this._itemWindow);
	};

	Scene_MateriaEquip.prototype.refreshActor = function() {
		var actor = this.actor();
		actor.refreshMaterias();
		this._equipWindow.setActor(actor);
		this._itemWindow.setActor(actor);
	};

	Scene_MateriaEquip.prototype.commandEquip = function() {
		this._itemWindow.activate();
		this._itemWindow.select(0);
	};
	
	Scene_MateriaEquip.prototype.commandClear = function() {
		var materia = this._equipWindow.materia();
		if (materia && !materia.locked()) {
			SoundManager.playEquip();
			var slot  = this._equipWindow.slotIndex();
			var index = this._equipWindow.materiaIndex();
			this.actor().unequipMateria(slot, index);
			this._itemWindow.refresh();
			this._equipWindow.refresh();
			this._statusWindow.refresh();
		} else if (materia && materia.locked()) {
			SoundManager.playBuzzer();
		}
		this._equipWindow.activate();
	};
	
	Scene_MateriaEquip.prototype.onItemOk = function() {
		SoundManager.playEquip();
		var materia = this._itemWindow.materia();
		var equip = this._equipWindow;
		var slot  = this._equipWindow.slotIndex();
		var index = this._equipWindow.materiaIndex();
		if (materia) {
			this.actor().equipMateria(slot, index, materia);
		} else {
			this.actor().unequipMateria(slot, index);
		}
		this._equipWindow.refresh();
		this._itemWindow.deselect();
		this._itemWindow.refresh();
		this._statusWindow.refresh();
		this._equipWindow.activate();
	};

	Scene_MateriaEquip.prototype.onItemCancel = function() {
		this._equipWindow.activate();
		this._itemWindow.deselect();
	};

	Scene_MateriaEquip.prototype.onActorChange = function() {
		this.refreshActor();
		this._equipWindow.activate();
	};
	
})();

//=============================================================================
// Window_MateriaStatus
//=============================================================================

function Window_MateriaStatus() {
	this.initialize.apply(this, arguments);
}

Window_MateriaStatus.prototype = Object.create(Window_Base.prototype);
Window_MateriaStatus.prototype.constructor = Window_MateriaStatus;
	
(function() {

	Window_MateriaStatus.prototype.initialize = function(x, y, width, height) {
		Window_Base.prototype.initialize.call(this, x, y, width, height);
	};
	
	Window_MateriaStatus.prototype.setMateria = function(materia) {
		this._materia = materia;
		this.refresh();
	};
	
	Window_MateriaStatus.prototype.materia = function() {
		return this._materia;
	};
	
	Window_MateriaStatus.prototype.level = function() {
		return this.materia().level();
	};
	
	Window_MateriaStatus.prototype.resetFontSettings = function() {
		this.contents.fontFace = this.standardFontFace();
		this.resetTextColor();
	};

	Window_MateriaStatus.prototype.refresh = function() {
		this.contents.clear();
		var materia = this.materia();
		if (materia) {
			this.resetFontSettings();
			this.contents.fontSize = this.standardFontSize();
			this.drawItemName(materia.item(), 0, 0);
			this.contents.fontSize = this.standardFontSize() - 8;
			if (materia.isEnemySkill()) {
				this.drawEnemySkillLevel();
				this.drawEnemySkillList();
			} else {
				this.drawMateriaElements();
				this.drawMateriaStates();
				this.drawMateriaLevel();
				this.drawMateriaAp();
				if (this.materia().text() === '') {
					this.drawMateriaSkills();
					this.drawMateriaAbilities();
					this.drawMateriaParams();
				} else {
					this.drawMateriaText();
				}
			}
		}
	};
	
	Window_MateriaStatus.prototype.drawMateriaElements = function() {
		 this.changeTextColor(this.crisisColor());
		 this.materia().elements().forEach(function(elementId, i) {
			var el = $dataSystem.elements[elementId]
			var fs = this.contents.fontSize + 2;
			var cl = this.columnNumber();
			var ww = Math.min(this.contents.width / 5, 128);
			var x  = i % cl * ww + Window_Base._iconWidth + 4;
			var y  = Math.floor(i / cl) * fs + this.lineHeight();
			this.drawText(el, x, y, this.width / 4);
		 }, this)
	};
	
	Window_MateriaStatus.prototype.drawMateriaStates = function() {
		this.changeTextColor(this.crisisColor());
		this.materia().states().forEach(function(stateId, i) {
			var st = $dataStates[stateId].name;
			var el = this.materia().elements().length + i;
			var fs = this.contents.fontSize + 2;
			var cl = this.columnNumber();
			var ww = Math.min(this.contents.width / 5, 128);
			var x  = el % cl * ww + Window_Base._iconWidth + 4;
			var y  = Math.floor(el / cl) * fs + this.lineHeight();
			this.drawText(st, x, y, this.width / 4);
		}, this)
	};
	
	Window_MateriaStatus.prototype.columnNumber = function() {
		return Math.max(Math.floor(this.contents.width / 142) - 1, 1);
	};
	
	Window_MateriaStatus.prototype.drawMateriaLevel = function() {
		if (!this.materia().noLevel()) {
			var icon = this.materia().icon();
			var max = this.materia().max();
			var now = this.level();
			var cw = this.contents.width;
			var iw = Window_Base._iconWidth;
			var wx = cw - Math.max(192, max * iw);
			for (var i = 0; i < max; i++) {
				this.changePaintOpacity(i < now)
				this.drawIcon(icon, iw * i + wx, 0)
			};
			this.changePaintOpacity(true)
		}
	};
	
	Window_MateriaStatus.prototype.drawMateriaAp = function() {
		if (!this.materia().noLevel()) {
			var materia = this.materia();
			var mt = VictorEngine.Parameters.MateriaSystem.MasterText;
			var w1 = this.contents.width - 16;
			var lh = this.lineHeight();
			var w2 = w1 - Math.max(96, this.textWidth(materia.ap()) + 8);
			var fs = this.contents.fontSize + 2;
			var ap = materia.isMaster() ? mt  : String(materia.ap())
			var nl = materia.isMaster() ? '0' : String(materia.nextAp())
			this.changeTextColor(this.systemColor());
			this.drawText(VictorEngine.Parameters.MateriaSystem.MateriaApName, 0, lh, w2, 'right')
			this.drawText(VictorEngine.Parameters.MateriaSystem.NextLevelText, 0, lh + fs, w2, 'right')
			this.changeTextColor(this.normalColor());
			this.drawText(ap, 0, lh, w1, 'right')
			this.drawText(nl, 0, lh + fs, w1, 'right')
		}
	};
	
	Window_MateriaStatus.prototype.linesNumber = function(y) {
		return Math.floor((this.contents.height - y) / (this.contents.fontSize + 2)) - 1;
	};
	
	Window_MateriaStatus.prototype.abilityWidth = function() {
		return Math.floor(this.contents.width / 4);
	};
		
	Window_MateriaStatus.prototype.abilityHeight = function() {
		return this.contents.fontSize + 2;
	};
	
	Window_MateriaStatus.prototype.drawMateriaSkills = function() {
		var y = this.contents.height / 3 + 8;
		this.changeTextColor(this.systemColor());
		this.drawText(VictorEngine.Parameters.MateriaSystem.AbilityListText, 4, y);
		this.changeTextColor(this.normalColor());
		var ln = this.linesNumber(y);
		var wd = this.abilityWidth();
		var ht = this.abilityHeight();
		var cl = this.columnNumber();
		this.materia().skillList().forEach(function(skill, i) {
			this.changePaintOpacity(skill.level <= this.level())
			var x1 = Math.floor(i / ln) * wd + this.standardPadding() + 4
			var y1 = y + ht + cl + i % ln * ht;
			this.drawText($dataSkills[skill.id].name, x1, y1)
		}, this);
		this.changePaintOpacity(true)
	};
	
	Window_MateriaStatus.prototype.drawMateriaAbilities = function() {
		var y  = this.contents.height / 3 + 8;
		var h1 = this.materia().skillList().length;
		var h2 = this.materia().effectList().length + h1;
		var ln = this.linesNumber(y);
		var wd = this.abilityWidth();
		var cl = this.columnNumber();
		var ht = this.abilityHeight();
		this.adj = 0;
		this.changeTextColor(this.normalColor());
		this.drawMateriaEffects(h1, y, ln, wd, ht, cl);
		this.drawMateriaPaireds(h2, y, ln, wd, ht, cl);
	};
		
	Window_MateriaStatus.prototype.drawMateriaParams = function() {
		var x = this.contents.width / 2 - 8;
		var y = this.contents.height / 3 + 8;
		this.changeTextColor(this.systemColor());
		this.drawText(VictorEngine.Parameters.MateriaSystem.ParamListText, x, y);
		this.changeTextColor(this.normalColor());
		var ln = this.linesNumber(y);
		var wd = this.abilityWidth();
		var ht = this.abilityHeight();
		var cl = this.columnNumber();
		var params = this.getParamValues();
		params.forEach(function(param, i) {
			var x1 = x + Math.floor(i / ln) * wd + this.standardPadding() + 4
			var y1 = y + ht + cl + i % ln * ht;
			this.drawEffectText(param, x1, y1, 0, 1, 2)
		}, this);
	};
			
	Window_MateriaStatus.prototype.drawMateriaText = function() {
		var x = this.standardPadding() + 4
		var y = this.contents.height / 3 + 8;
		this.drawTextEx(this.materia().text(), x, y);
	};

	Window_MateriaStatus.prototype.drawMateriaEffects = function(h, y, ln, wd, ht, cl) {
		this.materia().effectList().forEach(function(effect, i) {
			var z  = this.adj;
			var x1 = Math.floor((i + h) / ln) * wd + this.standardPadding() + 4
			var y1 = y + ht + cl + (i + h + z) % ln * ht;
			var y2 = y + ht + cl + (i + h + 1) % ln * ht;
			this.drawEffectText(effect, x1, y1, y2, this.level(), 3);
		}, this);
	};
	
	Window_MateriaStatus.prototype.drawMateriaPaireds = function(h, y, ln, wd, ht, cl) {
		this.materia().pairList().forEach(function(effect, i) {
			var z  = this.adj;
			var x1 = Math.floor((i + h + z) / ln) * wd + this.standardPadding() + 4
			var y1 = y + ht + cl + (i + h + z) % ln * ht;
			var y2 = y + ht + cl + (i + h + 1) % ln * ht;
			this.drawEffectText(effect, x1, y1, y2, this.level(), 3)
		}, this);
	};
	
	Window_MateriaStatus.prototype.drawEffectText = function(effect, x1, y1, y2, level, pad) {
		if (effect.text) {
			if (effect.text === '') this.adj--;
			this.drawTextEx(effect.text, x1, y1);
		} else if (effect.text === '') {
			this.adj--;
		} else if (effect.rate && !effect.flat) {
			this.drawEffectValue(effect, x1, y1, level, effect.rate, pad, true)
		} else if (effect.flat && !effect.rate) {
			this.drawEffectValue(effect, x1, y1, level, effect.flat, pad)
		} else if (effect.flat && effect.rate) {
			this.adj++;
			this.drawEffectValue(effect, x1, y1, level, effect.flat, pad)
			this.drawEffectValue(effect, x1, y2, level, effect.rate, pad, true)
		} else {
			var text = VictorEngine.paramText(effect.name);
			this.drawTextEx(text, x1, y1);
		}
	};
	
	Window_MateriaStatus.prototype.drawEffectValue = function(effect, x, y, level, value, pad, rate) {
		var name  = VictorEngine.paramText(effect.name);
		var sign  = value < 0 ? '-' : '+'
		var rate  = rate ? '%' : '';
		var color = effect.name === 'mp cost';
		var value = String(Math.abs(parseFloat(value.toPrecision(2)) * level)).padZero(pad);
		this.drawEffectInfo(name, value, x, y, sign, rate, pad, color);
	};
	
	Window_MateriaStatus.prototype.drawEffectInfo = function(name, value, x, y, sign, rate, pad, color) {
		var zero = '0';
		this.drawText(name, x, y);
		this.drawText(sign, x - this.textWidth(zero.padZero(pad)), y, 144, 'right');
		this.changeTextColor(sign === (color ? '+' : '-') ? this.deathColor() : this.crisisColor());
		this.drawText(value, x, y, 144, 'right');
		this.changeTextColor(this.normalColor());
		this.drawText(rate, x + this.textWidth(rate), y, 144, 'right');
	};
	
	Window_MateriaStatus.prototype.getParamValues = function() {
		var params = [];
		params = params.concat(this.getParamPlus());
		params = params.concat(this.getParamRate());
		return params;
	};
	
	Window_MateriaStatus.prototype.getParamPlus = function() {
		var params = [];
		for (var i = 0; i < 8; i++) {
			if (this.materia().flatParam(i) !== 0) {
				var name = this.materia().paramName(i);
				var flat = this.materia().flatParam(i);
				params.push({name: name, flat: flat});
			}			
		}
		return params;
	};
	
	Window_MateriaStatus.prototype.getParamRate = function() {
		var params = [];
		for (var i = 0; i < 8; i++) {
			if (this.materia().rateParam(i) !== 0) {
				var name = this.materia().paramName(i);
				var rate = this.materia().rateParam(i);
				params.push({name: name, rate: rate});
			}			
		}
		return params;
	};
	
	Window_MateriaStatus.prototype.drawEnemySkillLevel = function() {
		var icon = this.materia().icon();
		var max = this.materia().max();
		var now = this.level();
		var cw = this.contents.width;
		var iw = Window_Base._iconWidth;
		var ih = Window_Base._iconHeight;
		var cn = Math.floor(Math.min(max / 2, (cw - 128) / max));
		this.materia().skillList().forEach(function(skill, i) {
			var learned = this.materia().learnedEnemySkill(skill.id);
			this.changePaintOpacity(learned);
			var x = i % cn * iw + Math.floor(cw / 2 - iw * cn / 2) + 8;
			var y = Math.floor(i / cn) * ih + this.lineHeight() + 8;
			this.drawIcon(icon, x, y);
		}, this)
		this.changePaintOpacity(true);
	};

	Window_MateriaStatus.prototype.drawEnemySkillList = function() {
		var max = this.materia().max();
		var cw = this.contents.width;
		var lc = Math.floor(Math.min(max / 2, (cw - 128) / max))
		var lm = Math.floor((max - 1) / lc);
		var sy = this.lineHeight() * (lm + 2) + 8;
		var sh = this.contents.height - sy - 8;
		var cn = Math.floor(Math.min(3, (cw - 64) / 128));
		this.contents.fillRect(8, sy, cw - 16, sh, 'rgba(0, 0, 0, 0.4)');
		this.materia().skillList().forEach(function(skill, i) {
			if (this.materia().learnedEnemySkill(skill.id)) {
				var name = $dataSkills[skill.id].name;
				var fs = this.contents.fontSize + 2;
				var ww = Math.min((cw - 16) / cn, 160);
				var x  = i % cn * ww + 16;
				var y  = Math.floor(i / cn) * fs + sy + 8;
				this.drawText(name, x, y)
			}
		}, this)
	};

})();

//=============================================================================
// Window_MateriaEquip
//=============================================================================

function Window_MateriaEquip() {
	this.initialize.apply(this, arguments);
}

Window_MateriaEquip.prototype = Object.create(Window_Selectable.prototype);
Window_MateriaEquip.prototype.constructor = Window_MateriaEquip;
	
(function() {

	Window_MateriaEquip.prototype.initialize = function(width, height) {
		Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
		this._index = 0;
		this.activate()
	};
	
	Window_MateriaEquip.prototype.maxCols = function() {
		return VictorEngine.Parameters.MateriaSystem.MaxSlotNumber;
	};
	
	Window_MateriaEquip.prototype.displayType = function() {
		return VictorEngine.Parameters.MateriaSystem.MateriaDisplay === 1;
	};
	
	Window_MateriaEquip.prototype.materiaX = function() {
		return this.displayType() ? 404 : this.contents.width - this.slotWidth();
	};
	
	Window_MateriaEquip.prototype.maxItems = function() {
		return (this.maxCols() * this.slots().length) || 1;
	}; 
		
	Window_MateriaEquip.prototype.fixIndex = function() {
		this._index = this._index % this.maxItems() || 0;
	}; 
	
	Window_MateriaEquip.prototype.slots = function() {
		return this.actor() ? this.actor().materiaEquipSlots() : [];
	}; 
		
	Window_MateriaEquip.prototype.slotIndex = function() {
		return Math.floor(this.index() / this.maxCols());
	}; 
	
	Window_MateriaEquip.prototype.materiaIndex = function() {
		return this.index() % this.maxCols();
	};
	
	Window_MateriaEquip.prototype.contentsHeight = function() {
		var adj = this.displayType() ? 2 : 1;
		return Window_Base.prototype.contentsHeight.call(this) * adj;
	};
	
	Window_MateriaEquip.prototype.actor = function() {
		return this._actor;
	};
	
	Window_MateriaEquip.prototype.setActor = function(actor) {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
		}
	};
	
	Window_MateriaEquip.prototype.setMateriaWindow = function(materiaWindow) {
		this._materiaWindow = materiaWindow;
	};
	
	Window_MateriaEquip.prototype.materia = function() {
		var slots = this.actor() ? this.actor().materiaSlots()[this.slotIndex()] || {} : {};
		return slots.materias ? slots.materias[this.materiaIndex()] : null
	};
		
	Window_MateriaEquip.prototype.item = function() {
		return this.materia() ? this.materia().item() : null;
	};
	
	Window_MateriaEquip.prototype.slotWidth = function() {
		return this.maxCols() * Window_Base._iconWidth;
	};
	
	Window_MateriaEquip.prototype.refreshMateriaWindow = function() {
		if (this._materiaWindow) {
			this._materiaWindow.setMateria(this.materia());
			this._materiaWindow.refresh();
		}
	};
	
	Window_MateriaEquip.prototype.refresh = function() {
		Window_Selectable.prototype.refresh.call(this);
		this.fixIndex();
		this.createContents();
		if (this.contents && this._actor) {
			this.drawActor();
			this.drawEquips();
			this.drawMaterias();
			this.updateCursor();
			this.refreshMateriaWindow();
		}
	};
	
	Window_MateriaEquip.prototype.drawActor = function() {
		this.drawActorFace(this._actor, this.textPadding(), 0);
		this.drawActorName(this._actor, 160, 0);
		this.drawActorLevel(this._actor, 160, this.lineHeight() * 1);
		this.drawActorHp(this._actor, 160, this.lineHeight() * 2);
		this.drawActorMp(this._actor, 160, this.lineHeight() * 3);
	}
	
	Window_MateriaEquip.prototype.drawEquips = function() {
		this.slots().forEach(function(slot, i) {
			var adj = this.displayType() ? 2 : 1;
			var x = 372;
			var y = this.lineHeight() * i * adj - this._scrollY;
			if (slot.equip && this.actor().equips()[slot.id]) {
				var item = this.actor().equips()[slot.id]
				this.drawItemName(item, x, y);
			} else {
				this.drawTextEx(slot.name.trim(), x, y)
			}
		}, this)
	};
	
	Window_MateriaEquip.prototype.drawMaterias = function() {
		this.slots().forEach(function(slot, i) {
			var adj1 = this.displayType() ? 2 : 1;
			var adj2 = this.displayType() ? this.lineHeight() : 0;
			var x = this.materiaX();
			var y = this.lineHeight() * i * adj1 - this._scrollY + adj2;
			this.drawMateriaBg(slot, x, y)
			this.drawMateriaSlots(slot, x, y)
			this.drawMateriaIcons(slot, x, y, i)
		}, this)
	};
	
	Window_MateriaEquip.prototype.drawMateriaBg = function(slot, x, y) {
		var w = this.slotWidth();
		var h = Window_Base._iconHeight;
		this.contents.fillRect(x, y, w, h, 'rgba(0, 0, 0, 0.4)');
	};
	
	Window_MateriaEquip.prototype.drawMateriaSlots = function(slot, x, y) {
		var item  = slot.equip ? this.itemMateriaSlots(slot) : slot;
		if (item.slots) {
			var slots = item.slots.filter(function(i) { return i !== '=' && i !== ':'; })
			var width = Window_Base._iconWidth
			for (var i = 0; i < slots.length; i++) {
				icon = item.icons[i] || this.defaultSlotIcons(item.slots, i)
				this.drawIcon(icon, x + i * width, y)
			}	
		}
	};
	
	Window_MateriaEquip.prototype.defaultSlotIcons = function(slots, i) {
		if (slots[i * 2 - 1] === '=' && slots[i * 2 + 1] === '=') {
			return VictorEngine.Parameters.MateriaSystem.LinkSlotCenter;
		}
		if (slots[i * 2 - 1] === '=' && slots[i * 2 + 1] !== '=') {
			return VictorEngine.Parameters.MateriaSystem.LinkSlotRight;
		}
		if (slots[i * 2 - 1] !== '=' && slots[i * 2 + 1] === '=') {
			return VictorEngine.Parameters.MateriaSystem.LinkSlotLeft;
		}
		return VictorEngine.Parameters.MateriaSystem.SingleSlotIcon;
	}
	
	Window_MateriaEquip.prototype.drawMateriaIcons = function(slot, x, y, index) {
		var slots = this.actor().materiaSlots()[index] || {};
		var materias = slots.materias || [];
		materias.forEach(function(materia, i) {
			if (materia) {
				var icon = materia.item().iconIndex;
				this.drawIcon(icon, x + i * Window_Base._iconWidth, y);
			}
		}, this);
	};
	
	Window_MateriaEquip.prototype.itemMateriaSlots = function(slot) {
		var equip = this.actor().equips();
		var item  = slot.equip ? equip[slot.id] : null;
		return item ? item.materiaSlots : slot;
	};
	
	Window_MateriaEquip.prototype.itemWidth = function() {
		return Window_Base._iconWidth;
	};
	
	Window_MateriaEquip.prototype.itemHeight = function() {
		var adj = this.displayType() ? 2 : 1;
		return this.lineHeight() * adj;
	};
	
	Window_MateriaEquip.prototype.itemRect = function(index) {
		var adj  = this.displayType() ? this.lineHeight() : 0;
		var rect = new Rectangle();
		var maxCols = this.maxCols();
		rect.width  = Window_Base._iconWidth;
		rect.height = Window_Base._iconHeight;
		rect.x = this.materiaX() + index % maxCols * this.itemWidth() - this._scrollX;
		rect.y = Math.floor(index / maxCols) * this.itemHeight() - this._scrollY + adj;
		return rect;
	};
	
	Window_MateriaEquip.prototype.isCurrentItemEnabled = function() {
		if (this.materia() && this.materia().locked()) {
			return false;
		}
		var slots = this.actor().materiaSlots()[this.slotIndex()]
		return slots && slots.materias ? this.materiaIndex() < slots.materias.length : false;
	};
	
	Window_MateriaEquip.prototype.updateCursor = function() {
		Window_Selectable.prototype.updateCursor.call(this);
		if ((this.maxCols() * this.slots().length) === 0) {
			this.setCursorRect(0, 0, 0, 0);
		}
	};

	Window_MateriaEquip.prototype.processHandling = function() {
		if (this.isOpenAndActive() && this.handlerClear() && Input.isTriggered('shift')) {
			this.callHandler('clear');
		} else {
			Window_Selectable.prototype.processHandling.call(this);
		}
	};
	
	Window_MateriaEquip.prototype.handlerClear = function() {
		return this.isHandled('clear') && this.materia();
	};
		
	Window_MateriaEquip.prototype.updateHelp = function() {
		if (this._materiaWindow) {
			this._materiaWindow.setMateria(this.materia());
		}
		this.setHelpWindowItem(this.item());
	};

	Window_MateriaEquip.prototype._createAllParts = function() {
		Window.prototype._createAllParts.call(this);
		if (VictorEngine.Parameters.MateriaSystem.CursorPriority) {
			var index = this.children.indexOf(this._windowCursorSprite);
			this.children.splice(index, 1);
			this.children.splice(index + 1, 0, this._windowCursorSprite);
		}
	};

	Window_MateriaEquip.prototype.cursorDown = function() {
		var index    = this.index();
		var maxItems = this.maxItems();
		var maxCols  = this.maxCols();
		this.select((index + maxCols) % maxItems);
		this.refresh();
	};

	Window_MateriaEquip.prototype.cursorUp = function() {
		var index    = this.index();
		var maxItems = this.maxItems();
		var maxCols  = this.maxCols();
		this.select((index - maxCols + maxItems) % maxItems);
		this.refresh();
	};

	Window_MateriaEquip.prototype.cursorRight = function() {
		var index    = this.index();
		var maxItems = this.maxItems();
		var maxCols  = this.maxCols();
		this.select((Math.floor(index / maxCols) * maxCols + ((index + 1) % maxCols)) % maxItems);
		this.refresh();
	};

	Window_MateriaEquip.prototype.cursorLeft = function() {
		var index    = this.index();
		var maxItems = this.maxItems();
		var maxCols  = this.maxCols();
		this.select((Math.floor(index / maxCols) * maxCols + ((index - 1 + maxCols) % maxCols)) % maxItems);
		this.refresh();
	};
	
})();

//=============================================================================
// Window_MateriaList
//=============================================================================

function Window_MateriaList() {
	this.initialize.apply(this, arguments);
}

Window_MateriaList.prototype = Object.create(Window_Selectable.prototype);
Window_MateriaList.prototype.constructor = Window_MateriaList;
	
(function() {
	
	Window_MateriaList.prototype.initialize = function(x, y, width, height) {
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
	};
	
	Window_MateriaList.prototype.setMateriaWindow = function(materiaWindow) {
		this._materiaWindow = materiaWindow;
	};
	
	Window_MateriaList.prototype.maxItems = function() {
		return this._data ? this._data.length : 1;
	};
	
	Window_MateriaList.prototype.materia = function() {
		return this._data[this.index()];
	};
		
	Window_MateriaList.prototype.item = function() {
		return this.materia() ? this.materia().item() : null;
	};
	
	Window_MateriaList.prototype.drawItem = function(index) {
		var materia = this._data[index];
		if (materia) {
			var rect = this.itemRect(index);
			rect.width -= this.textPadding();
			this.changePaintOpacity(this.isEnabled(materia));
			this.drawItemName(materia.item(), rect.x, rect.y, rect.width);
			this.changePaintOpacity(true);
		}
	};
	
	Window_MateriaList.prototype.refresh = function() {
		this.makeItemList();
		this.createContents();
		this.drawAllItems();
	};

	Window_MateriaList.prototype.updateHelp = function() {
		if (this._materiaWindow) this._materiaWindow.setMateria(this.materia());
		this.setHelpWindowItem(this.item());
	};
	
})();

//=============================================================================
// Window_MateriaItem
//=============================================================================

function Window_MateriaItem() {
	this.initialize.apply(this, arguments);
}

Window_MateriaItem.prototype = Object.create(Window_MateriaList.prototype);
Window_MateriaItem.prototype.constructor = Window_MateriaItem;
	
(function() {
	
	Window_MateriaItem.prototype.initialize = function(x, y, width, height) {
		Window_MateriaList.prototype.initialize.call(this, x, y, width, height);
	};
		
	Window_MateriaItem.prototype.setEquipWindow = function(equipWindow) {
		this._equipWindow = equipWindow;
	};
	
	Window_MateriaItem.prototype.materiaIndex = function() {
		return this._equipWindow.materiaIndex();
	};
	
	Window_MateriaItem.prototype.slotIndex = function() {
		return this._equipWindow.slotIndex();
	};
	
	Window_MateriaItem.prototype.equipIndex = function() {
		return this._equipWindow.index();
	};
	
	Window_MateriaItem.prototype.slots = function(index) {
		var value = this.actor() ? this.actor().materiaSlots()[this.slotIndex()] : null;
		var slots = value && value.data ? value.data.slots : [];
		return slots.filter(function(i) { return i !== '=' && i !== ':'; })[index];
	};
	
	Window_MateriaItem.prototype.slot = function() {
		return this.slots(this.materiaIndex());
	};
	
	Window_MateriaItem.prototype.makeItemList = function() {
		this._data = $gameParty.materias().filter(function(materia) {
			return this.canEquipMateria(materia);
		}, this);
		this._data.push(null);
	};
	
	Window_MateriaItem.prototype.canEquipMateria = function(materia) {
		var item = materia.item() || {};
		return (item.atypeId === 0 || this.actor().canEquip(item)) && 
			(item.atypeId === this.slot() || this.slot() === 0);
	};
	
	Window_MateriaItem.prototype.actor = function() {
		return this._actor;
	};
	
	Window_MateriaItem.prototype.setActor = function(actor) {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
		}
	};
	
	Window_MateriaItem.prototype.update = function() {
		if (this._equipWindowIndex !== this.equipIndex()) {
			this.makeItemList();
			this.refresh();
			this._equipWindowIndex = this.equipIndex();
		}
		Window_MateriaList.prototype.update.call(this);
	};
	
	Window_MateriaItem.prototype.isEnabled = function(item) {
		return true;
	};
	
})();

//=============================================================================
// Window_MateriaShop
//=============================================================================

function Window_MateriaShop() {
	this.initialize.apply(this, arguments);
}

Window_MateriaShop.prototype = Object.create(Window_MateriaList.prototype);
Window_MateriaShop.prototype.constructor = Window_MateriaShop;
	
(function() {
	
	Window_MateriaShop.prototype.initialize = function(x, y, width, height) {
		Window_MateriaList.prototype.initialize.call(this, x, y, width, height);
	};
	
	Window_MateriaShop.prototype.isCurrentItemEnabled = function() {
		return this.isEnabled(this._data[this.index()]);
	};
	
	Window_MateriaShop.prototype.makeItemList = function() {
		this._data = $gameParty.materias().map(function(materia) {
			return materia;
		}, this);
	};
	
	Window_MateriaShop.prototype.isEnabled = function(item) {
		return item && item.price() > 0 && !$gameParty.maxMaterias();
	};

})();

//=============================================================================
// Game_Materia
//=============================================================================

function Game_Materia() {
	this.initialize.apply(this, arguments);
}

Game_Materia.prototype.constructor = Game_Materia;
	
(function() {

	Game_Materia.prototype.initialize = function(id) {
		this._id = id;
		this._ap = 0;
		this._level = 1;
		this._times = {};
		this._learn = [];
		this.resetTimes();
	};
		
	Game_Materia.prototype.values = function() {
		return $dataArmors[this._id].materiaValue;
	};
		
	Game_Materia.prototype.item = function() {
		return $dataArmors[this._id];
	};
	
	Game_Materia.prototype.id = function() {
		return this._id;
	};
	
	Game_Materia.prototype.ap = function() {
		return this._ap;
	};
	
	Game_Materia.prototype.learn = function() {
		return this._learn;
	};
		
	Game_Materia.prototype.name = function() {
		return this.item().name;
	};
	
	Game_Materia.prototype.level = function() {
		return (this.isEnemySkill()) ? this._learn.length : this._level;
	};
	
	Game_Materia.prototype.max = function() {
		return (this.isEnemySkill()) ? this.skillList().length : this.values().max;
	};
		
	Game_Materia.prototype.type = function() {
		return this.values().type.toLowerCase();
	};
	
	Game_Materia.prototype.icon = function() {
		return this.values().icon;
	};
		
	Game_Materia.prototype.text = function() {
		return this.values().text || '';
	};
	
	Game_Materia.prototype.skills = function() {
		return this.values().skills;
	};
		
	Game_Materia.prototype.limit = function() {
		return this.values().limit;
	};
	
	Game_Materia.prototype.elements = function() {
		return this.values().elements;
	};
	
	Game_Materia.prototype.states = function() {
		return this.values().states;
	};
	
	Game_Materia.prototype.effects = function() {
		return this.values().effects;
	};
	
	Game_Materia.prototype.paired = function() {
		return this.values().paired;
	};
	
	Game_Materia.prototype.noLevel = function() {
		return this.values().noLevel;
	};
		
	Game_Materia.prototype.locked = function() {
		return this.values().locked;
	};
	
	Game_Materia.prototype.enemySkills = function() {
		return this.values().enemy;
	};
	
	Game_Materia.prototype.learnType = function() {
		return this.values().learn;
	};

	Game_Materia.prototype.learnAnim = function() {
		return this.values().anim;
	};

	Game_Materia.prototype.isMaster = function() {
		return this.level() === this.max();
	};
	
	Game_Materia.prototype.isNormal = function() {
		return !this.isSupport() && !this.isIndependent();
	};
	
	Game_Materia.prototype.isSupport = function() {
		return this.type() === 'support';
	};
	
	Game_Materia.prototype.isIndependent = function() {
		return this.type() === 'independent';
	};
	
	Game_Materia.prototype.isEnemySkill = function() {
		return this.type() === 'enemy skill' || this.type() === 'enemyskill';
	};

	Game_Materia.prototype.isEffect = function(effect) {
		return !!this.effect(effect);
	};
	
	Game_Materia.prototype.isPaired = function(pair) {
		return !!this.pair(pair);
	};
	
	Game_Materia.prototype.isElement = function(elementId) {
		return this.elements().contains(elementId);
	};
	
	Game_Materia.prototype.isState = function(stateId) {
		return this.states().contains(stateId);
	};
	
	Game_Materia.prototype.isDamage = function(skillId) {
		return this.isEffect('damage') && this.hasSkill(skillId);
	};
	
	Game_Materia.prototype.effect = function(effect) {
		return this.effects()[effect];
	};
		
	Game_Materia.prototype.pair = function(pair) {
		return this.paired()[pair];
	};
	
	Game_Materia.prototype.onLimit = function(skillId) {
		return !this.limit || (this._limit[skillId] && this._limit[skillId] > 0);
	};
	
	Game_Materia.prototype.isAll = function(skillId) {
		this.times(skillId);
		return Imported['VE - Toggle Targets'] && !!this.pair('all') && this._times[skillId] > 0;
	};
	
	Game_Materia.prototype.isLimited = function(skillId) {
		return this.limit() && this._limit[skillId] > 0;
	};
	
	Game_Materia.prototype.allRate = function() {
		return this.pairRate('all') || 0;
	};
	
	Game_Materia.prototype.useTimes = function(skillId) {
		this.times(skillId);
		this._times[skillId]--;
	};
		
	Game_Materia.prototype.useLimit = function(skillId) {
		this._limit[skillId]--;
	};
	
	Game_Materia.prototype.times = function(skillId) {
		if (this._times[skillId] !== 0) {
			this._times[skillId] = this._times[skillId] || this.level();	
		}
	};
	
	Game_Materia.prototype.maxAp = function() {
		return this.values().ap.reduce(function(r, value) { return r + value }, 0) || 0;
	};
	
	Game_Materia.prototype.nextLevel = function() {
		var next = 0;
		for (var i = 0; i < this.level(); i++) {
			var value = this.values().ap[i];
			if (value) next += value;
		}
		return next;
	};
		
	Game_Materia.prototype.nextAp = function() {
		return this.nextLevel() - this.ap();
	};
	
	Game_Materia.prototype.gainAp = function(value, growth) {
		if (!this.isMaster() && !this.isEnemySkill()){
			var result = this._ap + Math.floor(value * growth)
			this._ap   = result.clamp(0, this.maxAp())
			while (this._ap >= this.nextLevel() && this._level < this.max()) {
				this.levelUp();
			}
		}
	};
		
	Game_Materia.prototype.levelUp = function() {
		this._level++;
		if (VictorEngine.Parameters.MateriaSystem.MateriaBreeding && this.level() === this.max()) {
			$gameParty.gainItem(this.item(), 1);
		}
	};
	
	Game_Materia.prototype.price = function() {
		var min  = this.minPrice();
		var max  = this.maxPrice();
		var rate = Math.min(this._ap * 100 / Math.max(this.maxAp(), 1), 100);
		return Math.floor(Math.max(((max - min) * rate / 100) + min, 0)) || 0;
	};
	
	Game_Materia.prototype.minPrice = function() {
		return this.item().price / 2;
	};
	
	Game_Materia.prototype.maxPrice = function() {
		return this.values().price || this.minPrice();
	};
	
	Game_Materia.prototype.resetTimes = function() {
		this.setupLimit();
		this.setupTimes();
	};
	
	Game_Materia.prototype.canLearnEnemySkill = function(skillId) {
		return this.isEnemySkill() && this.hasSkill(skillId) &&
			  !this.learnedEnemySkill(skillId);
	};
	
  	Game_Materia.prototype.learnEnemySkill = function(skillId) {
		if (this.canLearnEnemySkill(skillId)) {
			this._learn.push(skillId)
			this._learn.sort(function(a, b) { return a - b });
		}
	};
	
  	Game_Materia.prototype.learnedEnemySkill = function(skillId) {
		return this._learn.contains(skillId);
	};
	
	Game_Materia.prototype.setupLimit = function() {
		this._limit = {};
		this.skillList().forEach(function(skill) {
			this._limit[skill.id] = this.level();
		}, this);
	};
	
	Game_Materia.prototype.setupTimes = function() {
		return Object.keys(this._times).forEach(function (key) {
			this._times[key] = this.level();
		}, this)
	};
	
	Game_Materia.prototype.skillList = function() {
		if (this.isEnemySkill()) {
			return this.traitSkills().concat(this.enemySkillList());
		} else {
			return this.traitSkills().concat(this.normalSkillList());
		}
	};
	
	Game_Materia.prototype.traitSkills = function() {
		var code = Game_BattlerBase.TRAIT_SKILL_ADD;
		return this.item().traits.reduce(function(r, trait) {
			var skill = trait.code === code;
			return skill ? r.concat({id: trait.dataId, level: 0, rate: 0}) : r;
		}, []).sort(function(a, b) { return a.id - b.id });
	};
	
	Game_Materia.prototype.enemySkillList = function() {
		var skills = this.enemySkills();
		return Object.keys(skills).map(function (key) {
			return {id: Number(key), rate: Number(skills[key]), level: 0};
		}, this).sort(function(a, b) { return a.id - b.id });
	};
	
	Game_Materia.prototype.enemySkillRate = function(skillId) {
		var skill = this.skillList().filter(function(skill) { 
			return skill.id === skillId;
		})[0];
		return skill ? skill.rate / 100 : 0;
	};
	
	Game_Materia.prototype.normalSkillList = function() {
		var skills = this.skills();
		return Object.keys(skills).map(function (key) {
			return {level: Number(key), id: skills[key]};
		}, this).sort(function(a, b) { return a.level - b.level });
	};
	
	Game_Materia.prototype.effectList = function() {
		var effects = this.effects();
		return Object.keys(effects).map(function (key) {
			var effect = effects[key];
			return {name: key, flat: effect.flat, rate: effect.rate, text: effect.text};
		}, this);
	};
		
	Game_Materia.prototype.pairList = function() {
		var paired = this.paired();
		return Object.keys(paired).map(function (key) {
			var pair = paired[key]
			return {name: key, flat: pair.flat, rate: pair.rate, text: pair.text};
		}, this);
	};
	
	Game_Materia.prototype.hasSkill = function(skillId) {
		return this.skillList().some(function(skill) {
			return skillId === skill.id && skill.level <= this.level();
		}, this)
	};

	Game_Materia.prototype.pairRate = function(pair) {
		var pair = this.pair(pair) || {};
		return this.level() * pair.rate / 100 || 0;
	};
	
	Game_Materia.prototype.effectRate = function(effect) {
		var effect = this.effect(effect) || {};
		return this.level() * effect.rate / 100 || 0;
	};
		
	Game_Materia.prototype.effectFlat = function(effect) {
		var effect = this.effect(effect) || {};
		return this.level() * effect.flat || 0;
	};
	
	Game_Materia.prototype.flatParam = function(paramId) {
		return this.item().params[paramId] || 0;
	};
	
	Game_Materia.prototype.rateParam = function(paramId) {
		var code = Game_BattlerBase.TRAIT_PARAM;
		return this.item().traits.reduce(function(r, trait) {
			value = (trait.code === code && trait.dataId === paramId);
			return r + (value ? trait.value * 100 - 100 : 0);
		}, 0);
	};
	
	Game_Materia.prototype.paramName = function(paramId) {
		return VictorEngine.paramName(paramId);
	};
	
	Game_Materia.prototype.paramPlus = function(paramId) {
		return this.effectFlat(VictorEngine.paramName(paramId)) || 0;
	};
	
	Game_Materia.prototype.paramRate = function(paramId) {
		return this.effectRate(VictorEngine.paramName(paramId)) || 0;
	};
	
	Game_Materia.prototype.xparam = function(xparamId) {
		return this.effectRate(VictorEngine.xparamName(xparamId)) || 0;
	};
	
	Game_Materia.prototype.sparam = function(sparamId) {
		return this.effectRate(VictorEngine.sparamName(sparamId)) || 0;
	};
	
})();

//=============================================================================
// Window_VictoryAp
//=============================================================================

if (Imported.YEP_VictoryAftermath) {
	
	function Window_VictoryAp() {
		this.initialize.apply(this, arguments);
	}

	Window_VictoryAp.prototype = Object.create(Window_VictoryExp.prototype);
	Window_VictoryAp.prototype.constructor = Window_VictoryAp;

	Window_VictoryAp.prototype.drawActorGauge = function(actor, index) {
		this.clearGaugeRect(index);
		var rect = this.gaugeRect(index);
		this.changeTextColor(this.normalColor());
		this.drawActorName(actor, rect.x + 2, rect.y);
		this.drawLevel(actor, rect);
		this.drawApGained(actor, rect);
	};

	Window_VictoryAp.prototype.drawApGained = function(actor, rect) {
		var wy = rect.y + this.lineHeight() * 1;
		this.changeTextColor(this.systemColor());
		this.drawText(VictorEngine.Parameters.MateriaSystem.AftermathAP, rect.x + 2, wy, rect.width - 4,  'left');
		var bonusAp = 1.0 * BattleManager._rewards.materiaAp * this._tick / Yanfly.Param.VAGaugeTicks;
		var value = Yanfly.Util.toGroup(parseInt(bonusAp));
		var fmt = VictorEngine.Parameters.MateriaSystem.AftermathFormat;
		var ApText = fmt.format(value, VictorEngine.Parameters.MateriaSystem.MateriaApName);
		this.changeTextColor(this.normalColor());
		wx = rect.x + rect.width - this.textWidthEx(ApText);
		this.drawTextEx(ApText, wx, wy);
	};

	//=============================================================================
	// Scene_Battle
	//=============================================================================

	VictorEngine.MateriaSystem.addCustomVictorySteps = Scene_Battle.prototype.addCustomVictorySteps;
	Scene_Battle.prototype.addCustomVictorySteps = function(array) {
		array = VictorEngine.MateriaSystem.addCustomVictorySteps.call(this, array);
		if (!array.contains('AP')) {
			array.push('AP');
		}
		return array;
	};

	VictorEngine.MateriaSystem.updateVictorySteps = Scene_Battle.prototype.updateVictorySteps;
	Scene_Battle.prototype.updateVictorySteps = function() {
		VictorEngine.MateriaSystem.updateVictorySteps.call(this);
		if (this.isVictoryStep('AP')) {
			this.updateVictoryAp();
		}
	};

	Scene_Battle.prototype.updateVictoryAp = function() {
		if (!this._victoryApWindow) {
			this.createVictoryAp();
		} else if (this._victoryApWindow.isReady()) {
			if (this.victoryTriggerContinue()) {
				this.finishVictoryAp();
			}
		}
	};

	Scene_Battle.prototype.createVictoryAp = function() {
		this._victoryTitleWindow.refresh(VictorEngine.Parameters.MateriaSystem.AftermathText);
		this._victoryApWindow = new Window_VictoryAp();
		this.addWindow(this._victoryApWindow);
		this._victoryApWindow.open();
	};

	Scene_Battle.prototype.finishVictoryAp = function() {
		SoundManager.playOk();
		this._victoryApWindow.close();
		this.processNextVictoryStep();
	};

};