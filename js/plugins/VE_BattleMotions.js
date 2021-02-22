/*
 * ==============================================================================
 * ** Victor Engine MV - Battle Motions
 * ------------------------------------------------------------------------------
 *  VE_BattleMotions.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Battle Motions'] = '1.05';

var VictorEngine = VictorEngine || {};
VictorEngine.BattleMotions = VictorEngine.BattleMotions || {};

(function() {

    VictorEngine.BattleMotions.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.BattleMotions.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Basic Module', '1.21');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Battler Graphic Setup');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Active Time Battle');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Retaliation Damage');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Cooperation Skills');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Skip Battle Log');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - FollowUp Skills');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Charge Actions');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Damage Popup');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Motions', 'VE - Dual Wield');
    };

    VictorEngine.BattleMotions.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function(name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http:// victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else if (Imported.YEP_BattleEngineCore) {
            var msg = 'The plugin ' + name + " does not work together with the";
            msg += ' plugin YEP Battle Engine Core.';
            throw new Error(msg);
        } else {
            VictorEngine.BattleMotions.requiredPlugin.call(this, name, required, version);
        };
    };

})();

/*:
 * ==============================================================================
 * @plugindesc v1.05 - Setup motion sequences for actions.
 * @author Victor Sant
 *
 * @param Static Battler Move
 * @desc Set if static battlers will move to the target
 * Default: false
 * @default false
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 * 
 *  This plugin allows you to create more elaborated animations for actions by
 *  giving you a huge control over how they are executed. The actions animations
 *  are controlled by a sequence of motions that are set by you. With that you
 *  can control each step of the action motion.
 *
 * ==============================================================================
 *  Action Sequence Setup
 * ------------------------------------------------------------------------------
 *  Each action is composed by six basic action sequences motion:
 *
 *  1 - Prepare
 *  Prepare the battler to execute the action, this action sequence is played
 *  before the battler's movement. Can be used to display casting animations and
 *  execute any preparation for the action.
 *  
 *  2 - Movement
 *  This action sequence is used to move the action user before executing the 
 *  action. By default, the user will move to the targets for non-magical skills
 *  and attacks that don't use the weapon motion 'missile'. For Magical skills 
 *  and 'missile' actions the user will give a step forward.
 *  
 *  3 - Execute
 *  This the sequence that effectively executes the action. All motions done by
 *  the action user during the action is done here. This is also the action that
 *  calls the effect upon the action targets.
 *  
 *  4 - Effect
 *  This is the action sequence that display the effects on the action targets.
 *  It's the action that display battle animations, deals damage and apply any
 *  other effect on the target.
 *  
 *  5 - Return
 *  This is the action sequence played after the action sequence 'Execute' has
 *  ended. It is usually used to return the action user to the home position.
 *  
 *  6 - Finish
 *  The action sequence played after the action sequence 'Return', can be used
 *  if any kind of clean-up is needed after the action is done. For example,
 *  you can return the targets to their home position if they were moved
 *  during the action execution and effect.
 * ==============================================================================
 *
 * ==============================================================================
 *  Action Sequences notetags
 * ------------------------------------------------------------------------------
 *  Each action step can be edited with notetags. The notetag action sequence
 *  will replace the default action sequence for that action.
 *
 *  <action sequence: prepare>         <action sequence: movement>
 *   #action sequence                   #action sequence
 *  </action sequence>                 </action sequence>
 *
 *  <action sequence: execute>         <action sequence: effect>
 *   #action sequence                   #action sequence
 *  </action sequence>                 </action sequence>
 *
 *  <action sequence: return>          <action sequence: finish>
 *   #action sequence                   #action sequence
 *  </action sequence>                 </action sequence>
 *
 *  Those notetags can be placed on Skills, Items, Weapons, Classes, Actors and
 *  Enemies.
 * ==============================================================================
 *
 * ==============================================================================
 *                 IMPORTANT!  IMPORTANT!  IMPORTANT!  IMPORTANT    
 *  If you change the sequence 'Execute' with the <action sequence: execute>
 *  notetag, the action sequence 'Effect' will be not called automatically. You
 *  must add the motion 'action: all targets, effect' or call the motion 'effect'
 *  for the targets (for example, 'effect: all targets, 100%' on the action 
 *  'Execute' notetag (more details on the motions bellow). If you don't add the
 *  motion to call the effects on the 'Execute' action sequence, the action
 *  damage, states and buffs will be applied at the end of the execute, but no
 *  animation will be displayed on the target.
 * ==============================================================================
 *
 * ==============================================================================
 *  Non-active Action Sequences notetags
 * ------------------------------------------------------------------------------
 *  Besides the notetags for skills and items, there also notetags to control
 *  the motions for some 'non-active' actions. The Non-active actions are the
 *  actions that aren't the result of using an item or skill, such as victory, 
 *  escape, damage, evasion... The following notetags can be used to change them.
 *
 * ------------------------------------------------------------------------------
 *
 *  The following notetags can be placed on Actors and Classes:
 *
 *  <action sequence: inputing>        <action sequence: inputed>
 *   #action sequence                   #action sequence
 *  </action sequence>                 </action sequence>
 *
 *  <action sequence: escape sucess>   <action sequence: escape fail>
 *   #action sequence                   #action sequence
 *  </action sequence>                 </action sequence>
 *
 *    inputing : sequence played when the actor start the command selection.
 *    inputed  : sequence played when the actor ends the command selection.
 *    escape   : sequence played when the actors escape from battle.
 *
 * ------------------------------------------------------------------------------
 *
 *  The following notetags can be placed on Actors, Classes and Enemies:
 *
 *  <action sequence: entry>           <action sequence: victory>
 *   #action sequence                  #action sequence
 *  </action sequence>                 </action sequence>
 *
 *    entry   : sequence played at the battle start.
 *    victory : sequence played when the battler team wins the battle.
 *
 * ------------------------------------------------------------------------------
 *
 *  The following notetags can be placed on Actors, Classes, Enemies, Skills and
 *  Items (they will have effect on the targets of the actions):
 *
 *  <action sequence: collapse>        <action sequence: damage>
 *   #action sequence                   #action sequence
 *  </action sequence>                 </action sequence>
 *
 *  <action sequence: evasion>         <action sequence: magic evasion>
 *   #action sequence                   #action sequence
 *  </action sequence>                 </action sequence>
 *
 *    collapse : sequence played when the battler dies.
 *    damage   : sequence played when the battler takes damage.
 *    evasion  : sequence played when the battler evades a physical attack.
 *    magic evasion : sequence played when the battler evades a magical attack.
 *
 * ==============================================================================
 *
 * ==============================================================================
 *  Action Sequence notetags Priority
 * ------------------------------------------------------------------------------
 *  If an action or battler has more than one notetag with the same type from
 *  different sources only one of them will be used the follwing this priority.
 *    - Skill/Item notetag
 *    - Weapons notetag
 *    - Class notetag
 *    - Actor/Enemy notetag
 * 
 *  For example, if the skill has an '<action sequence: execute>' notetag and the weapon 
 *  also has an '<action sequence: execute>', the skill notetag will be used over the
 *  weapon note.
 * ==============================================================================
 *
 * ==============================================================================
 *  Action Sequence Motions:
 * ------------------------------------------------------------------------------
 * 
 *  The action sequences are a sequence of motions. Each motion is played in the
 *  order they are placed on the notetag. Each motion has a name and a set of
 *  values. All motions will follow a pattern similar to this:
 *  
 *    name: [values], [values];
 *
 *  Each motion value must be separated by a comma (,) at the end, you can add
 *  either a semicolon (;) or a line break to represent the end of this motion.
 *
 *  For example, the 'move' motion is defined by the following pattern:
 *
 *    move: [subjects], [type], [duration], [distance], [offset];
 *  
 *  The values on brackets should be replaced by a proper values, according to
 *  the motion description.
 * ==============================================================================
 *
 * ==============================================================================
 *                 IMPORTANT!  IMPORTANT!  IMPORTANT!  IMPORTANT    
 *  The brackets on each motion are there to represent that the value must be
 *  replaced by a proper value, but they shouldn't be added on the setup itself.
 * ==============================================================================
 *
 *  So please, understand:
 *  - This is WRONG >  move: [user], [to target], [30], [0], [0]
 *  - This is RIGHT >  move: user, to target, 30, 0, 0
 *
 * ------------------------------------------------------------------------------
 *
 *  Example:
 *  <action sequence: movement>
 *   direction: user, targets
 *   motion: user, walk
 *   move: user, to target, 12
 *   wait: user, move
 *   motion: user, reset
 *  </action sequence>
 *  
 *  This is an action sequence for the battler movement, let's follow the action
 *  sequence:
 *    - direction: user, targets
 *        This will make the user look toward the action targets.
 *    - motion: user, walk
 *        This will change the user motion to the walk motion.
 *    - move: user, to target, 12, front
 *        This will move the user to the front of the target.
 *    - wait: user, move
 *        This will make the motion wait until the user movement is finished.
 *    - motion: user, reset
 *        This will reset the user motion to the current idle motion.
 *
 * ==============================================================================
 *                 IMPORTANT!  IMPORTANT!  IMPORTANT!  IMPORTANT    
 *  The motion values must follow the patterns set for each motion, writting
 *  arbitrary text and expecting the battler to behave as is written won't work.
 *
 *  For example, writting on a motion 'animation: show skill on targets'
 *  will NOT show the skill animation on the targets.
 *  You must use the correct formating, the correct form to display the skill
 *  animation on targets is 'animation: all targets, action'
 *
 *  The motion setup can be very strict and will not work properly if it's not
 *  written correctly.
 * ==============================================================================
 *
 * ==============================================================================
 *  Motion Subjects:
 * ------------------------------------------------------------------------------
 * 
 *  Before going to the motion list, I will explain about a very important value
 *  that will be present on several of the motions: the [subjects]
 *  In most cases, it will be the first value, and will decide wich battlers will
 *  be the ones being affected by that motion. So, whenever an motion value
 *  refer to [subject], it must be one of the values listed here.
 *
 * ------------------------------------------------------------------------------
 *  Here are all possible [subjects] values:
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   user    : the user of the skill/item.
 *   subject : the battler that called the action sequence.
 *   target  : a specific target, see details bellow.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   all targets   : all the targets of the action.
 *   all actors    : all actors.
 *   all enemies   : all enemies.
 *   all battlers  : all battlers (both actors and enemies).
 *   all friends   : all battlers on the same team as the user.
 *   all opponents : all battlers on the opposing team of the user.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   alive targets   : all alive targets of the action.
 *   alive actors    : all alive actors.
 *   alive enemies   : all alive enemies.
 *   alive battlers  : all alive battlers (both actors and enemies).
 *   alive friends   : all alive battlers on the same team as the user.
 *   alive opponents : all alive battlers on the opposing team of the user.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   dead targets   : all dead targets of the action.
 *   dead actors    : all dead actors.
 *   dead enemies   : all dead enemies.
 *   dead battlers  : all dead battlers (both actors and enemies).
 *   dead friends   : all dead battlers on the same team as the user.
 *   dead opponents : all dead battlers on the opposing team of the user.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   active actors    : all active actors.
 *   active enemies   : all active enemies.
 *   active battlers  : all active battlers (both actors and enemies).
 *   active friends   : all active battlers on the same team as the user.
 *   active opponents : all active battlers on the opposing team of the user.
 *    NOTE.: an 'active battler' is a battler that is either the action user
 *           or a target of the action.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   inactive actors    : all inactive actors.
 *   inactive enemies   : all inactive enemies.
 *   inactive battlers  : all inactive battlers (both actors and enemies).
 *   inactive friends   : all inactive battlers on the same team as the user.
 *   inactive opponents : all inactive battlers on the opposing team of the user.
 *    **NOTE: an 'inactive battler' is a battler that is neither the action user
 *            or a target of the action.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   movable targets   : all movable targets of the action.
 *   movable actors    : all movable actors.
 *   movable enemies   : all movable enemies.
 *   movable battlers  : all movable battlers (both actors and enemies).
 *   movable friends   : all movable battlers on the same team as the user.
 *   movable opponents : all movable battlers on the opposing team of the user.
 *    **NOTE: a 'movable battler' is a battler that is not affected by a state
 *            with the restriction 'Cannot move'.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   moved targets   : all moved targets of the action.
 *   moved actors    : all moved actors.
 *   moved enemies   : all moved enemies.
 *   moved battlers  : all moved battlers (both actors and enemies).
 *   moved friends   : all moved battlers on the same team as the user.
 *   moved opponents : all moved battlers on the opposing team of the user.
 *    **NOTE: a 'moved battler' is a battler that is not in the home position.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   other targets   : all targets of the action except the user.
 *   other actors    : all actors except the user.
 *   other enemies   : all enemies except the user.
 *   other battlers  : all battlers except the user.
 *   other friends   : all battlers on the same team as the user except himself.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   random target   : a random target of the action.
 *   random actor    : a random actor.
 *   random enemie   : a random enemy.
 *   random battler  : a random battler (both actors and enemies).
 *   random friend   : a random battler on the same team as the user.
 *   random opponent : a random battler on the opposing team of the user.
 *    **NOTE: selecting random subjects can cause issues if not handled properly,
 *            see bellow for details.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   target X   : the Xth movable target of the action.
 *   actor X    : actor with the Id = X. (only if in battle)
 *   party X    : the Xth movable party member.
 *   enemy X    : the Xth movable enemy.
 *   friend X   : the Xth movable battler on the same team as the user.
 *   opponent X : the Xth movable battler on the opposing team of the user.
 *    **NOTE: this will select only blatters that aren't affected by a state
 *            with the restriction 'Cannot move'.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   other party X  : the Xth movable party member.
 *   other enemy X  : the Xth movable enemy.
 *   other friend X : the Xth movable battler on the same team as the user.
 *   other target X : the Xth movable target of the action.
 *    **NOTE: this will make the user itself not selectable. If the user is the
 *            one on the Xth position, it will select the next available battler.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  - Motion Subjects: User and Subject
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Those two subjects values are similar, and in most cases they behave in a
 *  similar way.
 *  But there is a essential difference between them: 
 *  - The user is the battler that is using the battle action (skill or item).
 *  - The subject is the battler that called the action sequence.
 *
 *  In most cases, those two are the same: the battler that uses the action is
 *  the one that starts the action sequence.
 *  But there are scenarios where those two are different: 
 *  - when an action is called from another action using the motion 
 *    'action: [subjects], [name]'. (see details bellow)
 *  - for the 'damage' action, where the damaged battler will be the one that
 *    calls the 'damage' action sequence.
 *
 *  Keep that in mind when making the damage action sequence or action sequences
 *  that will be called from another action, such the 'Effect' action sequence.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  - Motion Subjects: Target
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  By default, the subject value 'target' is null.
 *  To define it, you must use the motion 'target: [subjects]'. 
 *  (see details bellow)
 *
 *  When the 'target' is defined, you can use it as the subject value for the
 *  motion without issues.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  - Motion Subject: Random
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The random subjects are decided whenever a motion with the random value is
 *  called. This can cause a issue: different motions with random subjects might
 *  have different subjects.
 *  For example, you have the following motions:
 *
 *    move: random target, to target, 12
 *    wait: random target, move
 *
 *  If your intention is to have a random target to move, and then wait the
 *  movement of this same target, it will not work, as the random target
 *  decided for the first motion might be different from the random target for
 *  the second motion.
 *
 *  To solve that, you can use the motion 'target: [subjects]', to define a 
 *  random subject and then use this 'target' as the subject on the motions.
 *
 *  For example:
 *    target: random target
 *    move: target, to target, 12
 *    wait: target, move
 *    target: clear
 *
 *  This will make the random target to be decided, then the same target will
 *  be used on all motions you set it as the subject. 
 *  Don't forget to 'clear' the target after you're done with it's motions.
 * ==============================================================================
 *
 * ==============================================================================
 *  Motion List:
 * ------------------------------------------------------------------------------
 * 
 *  From now on, a list with all motions and their values will be provided.
 *  Don't forget that each motion has it's own unique format and will not work
 *  if not set up properly.
 *
 * ==============================================================================
 *
 * ==============================================================================
 *  Action
 * ------------------------------------------------------------------------------
 *  action: [subjects], [name]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Execute an action during another action. Used mainly for the 'Effect' action
 *  sequence, this can be used for any action. the [name] can be the name of
 *  any action sequence.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: action: all targets, effect
 *       action: all friends, special
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  NOTES:
 *  - You can create actions beside the default ones with custom names to 
 *    be used with this motion. Actions that has custom names will do
 *    nothing unless called with this motion.
 *  - When you call an action from another action, the subject that is calling
 *    that action is the [subject] of this motion. This may cause the battler
 *    that is calling the action different from the 'user' of the action. On this
 *    case, the value 'subject' will refer to the one that called the action
 *    sequence, and 'user' will refer to the one that used the skill or item.
 * ==============================================================================
 *
 * ==============================================================================
 *  Animation
 * ------------------------------------------------------------------------------
 *  animation: [subjects], [type]
 *  animation: [subjects], action
 *  animation: [subjects], weapon
 *  animation: [subjects], [id]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display an animation on it's subject. The animation [type]
 *  can be the [id] of an animation, 'action' or 'weapon'. The value 'action'
 *  will display the animation of the current action, the value 'weapon' will
 *  display the animation of the actor's weapon.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: animation: user, 52
 *       animation: all targets, weapon
 *       animation: all opponents, action
 * ==============================================================================
 *
 * ==============================================================================
 *  Balloon
 * ------------------------------------------------------------------------------
 *  balloon: [subjects], [id]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display a ballon animation on it's subject. Those balloon
 *  animations are the same available for events. The [id] is the position of
 *  the ballon graphic on the system folder.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: balloon: user, 1
 *       balloon: all targets, 2
 * ==============================================================================
 *
 * ==============================================================================
 *  Battleback
 * ------------------------------------------------------------------------------
 *  battleback: [battleback1], [battleback2]
 *  battleback: save
 *  battleback: restore
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display change the battleback graphic. The [battleback1] is
 *  the filename for the floor battleaback and the [battleback2] is the filename
 *  for the background battleaback. The value 'save' will save the battleback
 *  information, and the value 'restore' will restore the save battleback
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: battleback: Grassland, Grassland
 *       battleback: Ruins1, Ruins2
 *       battleback: save
 *       battleback: restore
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The [battleback2] can be ommited.
 * ==============================================================================
 *
 * ==============================================================================
 *  Battle Status
 * ------------------------------------------------------------------------------
 *  battlestatus: [type]
 *  battlestatus: show
 *  battlestatus: hide
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will change the visibility of the battle status window. The
 *  value [type] defines wich change will be made to the window.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: battlestatus: show
 *       battlestatus: hide
 * ==============================================================================
 *
 * ==============================================================================
 *  Battle Log
 * ------------------------------------------------------------------------------
 *  battlelog: [type]
 *  battlelog: text, [message]
 *  battlelog: show
 *  battlelog: hide
 *  battlelog: clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will clear the battle log window messages. The value [type]
 *  defines wich change will be made to the battlelog. The value 'clear' will
 *  clear all text on the battle log. With the value 'text', you will add
 *  the [message] text to the battle log window.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  battlelog: show
 *  battlelog: hide
 *  battlelog: clear
 *  battlelog: text, The monster is angry!
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The 'text' will not work if you're using the plugin 'VE - Skip Battle Log'
 *    and have the Plugin Parameter 'Skip All Text' is turned ON.
 * ==============================================================================
 *
 * ==============================================================================
 *  BGM
 * ------------------------------------------------------------------------------
 *  bgm: [type], [name], [volume], [ptich], [pan]
 *  bgm: play, [name], [volume], [ptich], [pan]
 *  bgm: fade in, [duration]
 *  bgm: fade out, [duration]
 *  bgm: stop
 *  bgm: save
 *  bgm: resume
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will control the BGM reproduction. The [type] will define what
 *  command will be given for the BGM. The value 'play' will allows you to play
 *  the BGM with filename equal the value [name]. The [volume], [pitch] and [pan]
 *  will control the BGM reproduction. The values [fade in] and [fade out] will
 *  add a fade effect to the BGM being played, the fade will take a time in
 *  frames equal the value [duration]. The value 'stop' will make the BGM stops
 *  immediately. The value 'save' will memorize the BGM being played, this saved
 *  BGM can be replayed calling the motion with the value 'resume'.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: bgm: play, Battle1
 *       bgm: play, Battle2, 90, 120, 0
 *       bgm: fade in, 30
 *       bgm: fade out, 60
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The values [volume], [pitch] and [pan] can be ommited. If so it will use
 *    the the values 90 for the volume, 100 for the pitch and 0 for the pan.
 *  - The value [volume] ranges from 0 to 100.
 *  - The value [pitch] ranges from 50 to 150.
 *  - The value [pan] ranges from -100 to 100.
 * ==============================================================================
 *
 * ==============================================================================
 *  BGS
 * ------------------------------------------------------------------------------
 *  bgs: [type], [name], [volume], [ptich], [pan]
 *  bgs: play, [name], [volume], [ptich], [pan]
 *  bgs: fade in, [duration]
 *  bgs: fade out, [duration]
 *  bgs: stop
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will control the BGS reproduction. The [type] will define
 *  what command will be given for the BGS. The value 'play' will allows you
 *  to play the BGS with filename equal the value [name]. The [volume], 
 *  [pitch] and [pan] will control the BGS reproduction. The values [fade in]
 *  and [fade out] will add a fade effect to the BGS being played, the fade
 *  will take a time in frames equal the value [duration]. The value 'stop'
 *  will make the BGS stops immediately.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: bgs: play, Drips
 *       bgs: play, Clock, 70, 100, 0
 *       bgs: fade in, 30
 *       bgs: fade out, 60
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The values [volume], [pitch] and [pan] can be ommited. If so it will use
 *    the the values 90 for the volume, 100 for the pitch and 0 for the pan.
 *  - The value [volume] ranges from 0 to 100.
 *  - The value [pitch] ranges from 50 to 150.
 *  - The value [pan] ranges from -100 to 100.
 * ==============================================================================
 *
 * ==============================================================================
 *  Buff
 * ------------------------------------------------------------------------------
 *  buff: [subjects], [type], [param], [turns], [show]
 *  buff: [subjects], increase, [param], [turns], [show]
 *  buff: [subjects], decrease, [param], [turns], [show]
 *  buff: [subjects], remove, [param], [show]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the subjects buffs according to the values. The value
 *  [type] can be 'increse', 'decrease' or 'remove'. The value 'increase' will 
 *  increase the buff level by 1, the 'decrease' will reduce it by 1, and the
 *  value 'rmeove' will set the buff level to 0. The [param] should be the name
 *  of the parameter to be changed. The [thurs] value is how many turns the buff
 *  change will last. If the [show] value is added, the Battle Log Window 
 *  message will be displayed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: buff: user, increase, atk, 5
 *       buff: all targets, decrease, def, 10, show
 *       buff: all battlers, remove, hp, show
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The names of the parameter should be abbreviated, those are the valid
 *    parameters names: hp, mp, atk, def, mat, mdf, agi, luk.
 *  - If using the plugin 'VE - Damage Popup', the value [show] will also
 *    display a popup for the buffs change.
 * ==============================================================================
 *
 * ==============================================================================
 *  Clear Targets
 * ------------------------------------------------------------------------------
 *  clear targets
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  By default, after the end of the 'execute' action sequence, if any of the
 *  action's targets wasn't affected yet by the action effect (damage, states,
 *  buffs...), the plugin will call the action effects for those targets. This
 *  might be a issue for some action sequences, specially those that uses the
 *  random targets motions. To solve that, you can call this motion to clear all
 *  the action's targets before the end of the execute action sequence.
 * ==============================================================================
 *
 * ==============================================================================
 *  Conditional Branches
 * ------------------------------------------------------------------------------
 *  if: [condtion]	
 *  else if: [condtion]
 *  else
 *  end
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  You can setup conditional branches during actions sequence on a way very
 *  smiliar to how it is done with events. The [condition] is a script code
 *  that is evaluated. All the motions inside the brach will be processed only
 *  if the contion is met.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: if: $gameSwitches.value(5)
 *         # action sequence
 *       else if: $gameVariables.value(2) > 10
 *         # action sequence
 *       else
 *         # action sequence
 *       end
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTE.: 
 *  - You can use 'user' to refer to the action users, 'target' to refer to the
 *    action target, 'v[x]' for variables, 'action' for the Game_Action object,
 *    and 'item' for the action item object.
 *  - The [condition] value is a script code that should return a true or false
 *    value.
 *  - Note that you can't do a nested conditional branch (a conditional branch
 *    inside anothe conditiona branch).
 * ==============================================================================
 *
 * ==============================================================================
 *  Direction
 * ------------------------------------------------------------------------------
 *  direction: [subjects], [direction]
 *  direction: [subjects], [position]
 *  direction: [subjects], left
 *  direction: [subjects], right
 *  direction: [subjects], behind
 *  direction: [subjects], targets
 *  direction: [subjects], opponents
 *  direction: [subjects], home
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will make the subject look toward a direction. The [direction]
 *  can be a X coordinate on the screen or the values 'left', 'right', 'back'
 *  'opponents' or 'home'.
 *  The value 'left' will make the subject look to the left.
 *  The value 'right' will make the subject look to the right.
 *  The value 'behind' will make the subject look behind. (toggle the direction)
 *  The value 'targets' will make the subject look toward the action targets.
 *  The value 'opponents' will make the subject look toward the oponents.
 *  The value 'home' will make the subject look toward the home position.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: direction: user, targets
 *       direction: all targets, behing
 *       direction: alive friends, opponents
 * ==============================================================================
 *
 * ==============================================================================
 *  Effect
 * ------------------------------------------------------------------------------
 *  effect: [subjects], [rate]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will apply the effects of the action (damage, states, buffs)
 *  on the subjects. The [rate] is a percent value that can be used to change
 *  the final damage dealt for that specific call of the motion.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: effect: all targets, 100%
 *       effect: user, 75%
 *       effect: opponents, $gameVariables.value(10)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - Each time this motion is called, it will deals the effects on the
 *    subjects. This can be used to make actions to have multiple hits.
 *    You can have each 'effect' motion to have different rate values.
 *  - The [rate] value can be a script code that returns a numeric value. 
 * ==============================================================================
 *
 * ==============================================================================
 *  Element
 * ------------------------------------------------------------------------------
 *  element: X [, X...]
 *  element: clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the elements for the damage of the current action. The
 *  value 'clear' will return the original 'elements for the current action.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: element: 1
 *       element: 2, 3, 4
 *       element: clear
 * ==============================================================================
 *
 * ==============================================================================
 *  Eval
 * ------------------------------------------------------------------------------
 *  eval: [code]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will process a script code.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: eval: $gameVariables.setValue(5, 10)
 *       eval: user.learnSkill(15)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES: 
 *  - You can use 'user' to refer to the action users, 'target' to refer to the
 *    action target, 'v[x]' for variables, and 'item' for the action item object.
 *  - The [code] value is a script code that is executed when this motion
 *    is called.
 * ==============================================================================
 *
 * ==============================================================================
 *  Event
 * ------------------------------------------------------------------------------
 *  event: [id]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion call a common event with it equal the value [id].
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: event: 10
 *       event: 5
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The event is processed immediatedely after being called.
 *  - The action sequences will pause while the event is being processed.
 * ==============================================================================
 *
 * ==============================================================================
 *  Fall
 * ------------------------------------------------------------------------------
 *  fall: [subjects], [height], [duration]
 *  fall: [subjects], [height], movement
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  If the subject is floating, this motion will make if falls. The [height]
 *  sets the height of the fall. The [duration] decides how fast the fall motion
 *  will be. The [height] value can be a numeric value. You can also use 
 *  'to ground' as the value for the height. This will make the subject fall
 *  until it hits the ground. The [duration] value can be a numeric value. Lower 
 *  values means faster fall. If you want the fall to follow a movement, you can
 *  call this motion right after a move motion, and use 'movement' as the
 *  duration for the fall.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: fall: user, 50, 60
 *       fall: all targets, 40, movement
 *       fall: all opponents, to ground, 40
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES: 
 *  - If you use the [duration] 'movement' on a fall that is not made after a
 *    movement, the duration will be considered 0 and the subjecs will instantly
 *    move to the top height.
 * ==============================================================================
 *
 * ==============================================================================
 *  Flash
 * ------------------------------------------------------------------------------
 *  flash: [red], [green], [blue], [alpha], [duration]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will flash the screen. You can set the flash color by entering
 *  the individual [red], [green], [blue] and [gray] values.  The [duration] is
 *  the duration for the flash effect.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: flash: 255, 255, 255, 160, 20
 *       flash: 0, 160, 160, 255, 15
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The [red], [green], [blue] and [alpha) values ranges from 0 to 255.
 * ==============================================================================
 *
 * ==============================================================================
 *  Float
 * ------------------------------------------------------------------------------
 *  float: [subjects], [height], [duration]
 *  float: [subjects], [height], movement
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will make the subject float in the air. The main difference from
 *  this to the 'leap' and 'fall' motions, is that this motion has a constant
 *  move speed, while the other motions have a gravity acceleration. The [height]
 *  value can be a numeric value. The [duration] value can be a numeric value.
 *  Lower values means faster float. If you want the float to follow a movement,
 *  you can call this motion right after a move motion, and use 'movement' as 
 *  the duration for the float.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: float: user, 50, 60
 *       float: all targets, 40, movement
 *       float: all opponents, -30, 40
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - If you use the [duration] 'movement' on a float that is not made after a
 *    movement, the duration will be considered 0 and the subject will instantly
 *    move to the top height.
 *  - If the target is floating, you can use negative values for the [height]
 *    value, this will bring the subject down.
 *  - The subject will stay floating until you use a motion to make it return to
 *    it's original height. This motion can be either the 
 *    'fall: [subjects], [height], [duration]' motion, or the motion
 *    'float: [subjects], [height], [duration]' with negative [height].
 * ==============================================================================
 *
 * ==============================================================================
 *  Formula
 * ------------------------------------------------------------------------------
 *  formula: [code]
 *  formula: clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the damage formula for the action. The value 'clear'
 *  will return the clear for the current action.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: formula: a.atk * 4 - b.def * 2
 *       formula: 50 + a.mat * 3 - b.mdf * 2
 *       formula: 50 + a.mat * 3 - b.mdf * 2
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The code works the same way as the damage formulas set on the database.
 * ==============================================================================
 *
 * ==============================================================================
 *  Home
 * ------------------------------------------------------------------------------
 *  home: [subjects], [X], [Y]
 *  home: [subjects], here
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will set the subjects current position as their home position.
 *  The home position is the battler initial position, where he returns, by
 *  default, after exeuction an action. If the value 'here' is used, the 
 *  the subject current position will be set as their new home position.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: home: user, 300, 400
 *       home: all targets, here
 * ==============================================================================
 *
 * ==============================================================================
 *  HP
 * ------------------------------------------------------------------------------
 *  hp: [subjects], [change], [show]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the subjects HP by an ammount equal the [change] value.
 *  If the [show] value is added, the damage popup and the Battle Log Window
 *  message will be displayed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: hp: user, -100
 *       hp: user, +500, show
 *       hp: all targets, +(user.level * 2), show
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The [change] value can be a script code that returns a numeric value.
 *    Notice that this code can't have a comma, since commas are used as 
 *    separators for the motion values.
 * ==============================================================================
 *
 * ==============================================================================
 *  Icon
 * ------------------------------------------------------------------------------
 *  icon: [subjects], [type], [index], [X], [Y], [OP], [AN], [SP], [above]
 *  icon: [subjects], icon [id], [index], [X], [Y], [OP], [AN], [SP], [above]
 *  icon: [subjects], equip [id], [index], [X], [Y], [OP], [AN], [SP], [above]
 *  icon: [subjects], shield, [index], [X], [Y], [OP], [AN], [SP], [above]
 *  icon: [subjects], action, [index], [X], [Y], [OP], [AN], [SP], [above]
 *  icon: [subjects], clear, [index]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display an icon on the subjects. The [type] defines the
 *  icon that will be displayed. The [index] is a identifier used to label
 *  different icons display. The [X] is a horizontal offset value. The [Y] is a
 *  vertical offset value. The [OP] is the icon opacity. The [AN] is the icon
 *  angle in degrees. The [SP] is the icon spin speed, and the [above] is a value
 *  that, if set, makes the icon be displayed above the subject.
 *  The value 'action' will display the current action icon.
 *  The value 'icon [id]' will display the icon with the Id = [id].
 *  The value 'equip [id]' will display the icon of the equip on the slot = [id].
 *  The value 'shield' will display the equiped shield icon.
 *  The value 'clear' will clear the icon display for that [index].
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: icon: user, action, 1, 0, -52, 255, 0, 0, above
 *       icon: user, equip 1, 2, above
 *       icon: all targets, icon 120, 3, 0, 48, 120
 *       icon: all friends, clear, 5
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - You can ommit any values after the [index].
 *  - The [above] value can be added at any point of the motion setup, as long
 *    it is the last value.
 *  - The [index] is used to identify different icons, if you call another icon
 *    motion using the same index, the new icon will replace the old icon with
 *    the same index. Icons with different indexes has no kind of interaction
 *    between them.
 *  - The icon will staty displayed until it's [index] is cleared using the value
 *   'clear' as the [type] of the motion.
 * ==============================================================================
 *
 * ==============================================================================
 *  Item
 * ------------------------------------------------------------------------------
 *  item: [type], [id], [ammount]
 *  item: item, [id], [ammount]
 *  item: armor, [id], [ammount]
 *  item: weapon, [id], [ammount]
 *  item: gold, [ammount]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will change the party items or gold. The value [type] define
 *  the kind of item that will be changed, it can be equal 'item', 'armor',
 *  'weapon' or 'gold'. For 'items', 'armors' and 'weapons', you can set the
 *  item [id], and the [ammount] of items gained. For the value 'gold' you need
 *  only to set [ammount] of gold gained.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: item: item, 1, +2
 *       item: armor, 3, -1
 *       item: weapon, 5, +1
 *       item: gold, -1000
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - If the [ammount] value is negative, the party will lose thar much items
 *    or gold instead of gaining
 * ==============================================================================
 *
 * ==============================================================================
 *  Jump
 * ------------------------------------------------------------------------------
 *  jump: [subjects], [height], [duration]
 *  jump: [subjects], [height], movement
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will make the subject jump, going up and down.  The [height] 
 *  is a numeric value that sets the height of the jump. The [duration] decides
 *  how fast the jump motion will be, it can be a numeric value. Lower values
 *  means faster jump. If you want the jump to follow a movement, you can call
 *  this motion right after a move motion, and use 'movement' as the duration
 *  for the jump.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: jump: user, 50, 60
 *       jump: all targets, 40, movement
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - If you use the [duration] 'movement' on a jump that is not made after a
 *    movement, the duration will be considered 0 and the subject will not jump.
 * ==============================================================================
 *
 * ==============================================================================
 *  Kill
 * ------------------------------------------------------------------------------
 *  kill: [subjects]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  By default, the targets of actions are considered immortal while the action
 *  sequence is playing. This motion will kill any subject that was dealt lethal
 *  damage or was inflicted with the death state, but wasn't dead yet.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: kill: all targets
 *       kill: opponents
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The enemies are made immortal, so they don't die during the action
 *    sequence execution, since this might break the sequence due to the lack
 *    of targets. Keep in mind that killing the targets before the action
 *    sequence ends might break some action sequences.
 * ==============================================================================
 *
 * ==============================================================================
 *  Leap
 * ------------------------------------------------------------------------------
 *  leap: [subjects], [height], [duration]
 *  leap: [subjects], [height], movement
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will make the subject jump, going up and staying floating at
 *  the top height. The [height] is a numeric value that sets the height of the
 *  leap. The [duration] decides how fast the leap motion will be, it can be a
 *  numeric value. Lower values means faster leap. If you want the leap to follow
 *  a movement, you can call this motion right after a move motion, and use
 *  'movement' as the duration for the leap.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: leap: user, 50, 60
 *       leap: all targets, 40, movement
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES: 
 *  - If you use the [duration] 'movement' on a leap that is not made after a
 *    movement, the duration will be considered 0 and the subject will instantly
 *    move to the top height.
 *  - The subject will stay floating until you use a motion to make it return to
 *    it's original height. This motion can be either the 
 *    'fall: [subjects], [height], [duration]' motion, or the motion
 *    'float: [subjects], [height], [duration]' with negative [height].
 * ==============================================================================
 *
 * ==============================================================================
 *  Motion
 * ------------------------------------------------------------------------------
 *  motion: [subjects], [motion]
 *  motion: [subjects], [index], [frames], [speed], [loop] **
 *  motion: [subjects], action
 *  motion: [subjects], attack
 *  motion: [subjects], move
 *  motion: [subjects], idle **
 *  motion: [subjects], walk
 *  motion: [subjects], wait
 *  motion: [subjects], chant
 *  motion: [subjects], gaurd
 *  motion: [subjects], damage
 *  motion: [subjects], evade
 *  motion: [subjects], thrust
 *  motion: [subjects], swing
 *  motion: [subjects], missile
 *  motion: [subjects], skill
 *  motion: [subjects], spell
 *  motion: [subjects], item
 *  motion: [subjects], escape
 *  motion: [subjects], return **
 *  motion: [subjects], victory
 *  motion: [subjects], dying
 *  motion: [subjects], abnormal
 *  motion: [subjects], sleep
 *  motion: [subjects], dead
 *  motion: [subjects], reset
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Executes one of the default battle motions. The [motion] must be the name
 *  of a valid battle motion, 'action', 'attack', 'move', 'reset'.  The 'attack'
 *  value will display the motion for the physical attack of the currently
 *  equiped weapon. The 'action' value will display the motion for the current
 *  action, based on it's type. The move value must be used only after a 'move'
 *  motion, and will change the motion to 'walk' or 'return' based on the 
 *  subject's target positon and it's current direction. The 'reset' value 
 *  will refresh the motion displayed, showing the battler current idle motion.
 *  You can also, instead of using a [motion], enter the [index] of a motion.
 *  This will make the battle motion on that index to be displayed. You can
 *  set the [speed], [frames] and [loop] for that motion. The [speed] a numeric
 *  value that is how fast the motion is displayed (lower value = faster). The
 *  [frames] shows how many frames for that motion will be displayed. And the
 *  value [loop], if added, will make the motion loop.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: motion: user, action
 *       motion: all targets, damage
 *       motion: user, 11, 3, 8, loop
 *       motion: alive friends, victory
 *       motion: all battlers, reset
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  NOTES:
 *  - The motions 'attack', 'thrust', 'swing', 'missile' and 'action' will
 *    display the weapon motion when it is applicable.
 *  - The motions 'return' and 'idle' are available only if you're using the
 *    plugin 'VE - Battler Graphic Setup'.
 *  - The values [speed] and [frames] are available only if you're using the
 *    plugin 'VE - Battler Graphic Setup'.
 *  - if you're using the plugin 'VE - Battler Graphic Setup', you can set the
 *    [loop] loop value equal 'once'.
 *  - The [loop] value can be added at any point of the motion setup, as long
 *    it is the last value.
 * ==============================================================================
 *                 IMPORTANT!  IMPORTANT!  IMPORTANT!  IMPORTANT    
 *  The 'battle motions' are a different from the 'action sequence motions'.
 *  The battle motions are the default motions used to display the movments of
 *  the sideview battlers, such as 'walk', 'swing', 'skill' and such.
 * ==============================================================================
 *
 * ==============================================================================
 *  Move
 * ------------------------------------------------------------------------------
 *  move: [subjects], [type], [duration], [distance], [offset]
 *  move: [subjects], to target, [duration], [distance], [offset]
 *  move: [subjects], to home, [duration], [distance], [offset]
 *  move: [subjects], forward, [duration], [distance], [offset]
 *  move: [subjects], backward, [duration], [distance], [offset]
 *  move: [subjects], to position, [duration], [X], [Y]
 *  move: [subjects], close to target, [duration], [distance]
 *  move: [subjects], close to position, [duration], [distance]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will move the subjects to another spot on the screen. The [type]
 *  will decide to where they will move, the [duration] decides how fast they
 *  will reach their destination. the [distance] sets the horizontal distance
 *  from the point target spot, and the [offset] is a vertical offset value.
 *  The value 'to target' will make the subjects move toward the action targets.
 *  The value 'to home' will make the subjects move toward the home position.
 *  The value 'forward' will make the subjects move forward a set distance.
 *  The value 'backward' will make the subjects move backward a set distance.
 *  The value 'to position' will make the subjects move to a specific coordinate.
 *  The value 'close to target' will make the subjects move toward the target
 *  stoping at a certain [distance] based on their relative positions.
 *  The value 'close to position' will make the subjects move toward a specific
 *  coordinat, stoping at a certain [distance] based on their relative positions.
 *  The value [duration] must be a numeric value. Lower values means faster
 *  movement, a value of 0 moves the subject instantly to the target spot.
 *  The value [distance] is a numeric value. But for the move type 'to target'
 *  you can use either 'front' or 'behind', to make the subjects stay at a 
 *  specific distance from it's target. When using the 'front' or 'behind'
 *  values, you can also add a numeric to the value setup.
 *  You can also use any [subjects] value as the [type] for the movement, this
 *  will make the subject move to the targets
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: move: user, to target, 20, front
 *       move: all targets, backward, 12, 40, 12
 *       move: all battlers, to home, 18
 *       move: user, to target, 20, front 80
 *       move: user, other party 1, 20
 *       move: user, random enemy, 20
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - When using the move type 'to target', the subject will move exactly to
 *    the same spot as the target, making the subject overlap with it. It's
 *    highly adivised to always set a [distance] value for the motion when 
 *    using the type 'to target', in most case the value 'front' will sufice.
 *  - When using the move type 'to target' and there is more than one target,
 *    the subjects will move to a position that is the average position of all
 *    target's positions.
 * ==============================================================================
 *
 * ==============================================================================
 *  Movie
 * ------------------------------------------------------------------------------
 *  movie: [name]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion reproduce reproduce a movie. The [name] is the movie filename.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: movie: Meteor
 *       movie: Tempest
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The action sequences will pause while the video is being played.
 * ==============================================================================
 *
 * ==============================================================================
 *  MP
 * ------------------------------------------------------------------------------
 *  mp: [subjects], [change], [show]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the subjects MP by an ammount equal the [change] value.
 *  If the [show] value is added, the damage popup and the Battle Log Window
 *  message will be displayed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: mp: user, -100
 *       mp: user, +500, show
 *       mp: all targets, +(user.level * 2), show
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The [change] value can be a script code that returns a numeric value. 
 *    Notice that this code can't have a comma, since commas are used as
 *    separators for the motion values.
 * ==============================================================================
 *
 * ==============================================================================
 *  Opacity
 * ------------------------------------------------------------------------------
 *  opacity: [subjects], [change], [duration]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will change the opacity of the subjects. The [change] value
 *  is the value for the new opacity. The [duration] value is how long it will
 *  take for the opacity to completely change. If you want the opacity change
 *  to follow a movement, you can call this motion right after a move motion,
 *  and use 'movement' as the duration for the opacity.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: opacity: user, 160, 20
 *       opacity: inactive battlers, 0, 60
 *       opacity: user, 255, 0
 *       opacity: user, 0, movement
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The value [change] ranges from 0 to 255.
 * ==============================================================================
 *
 * ==============================================================================
 *  Picture (Subjects)
 * ------------------------------------------------------------------------------
 *  picture: [subjects], [name], [index], [X], [Y], [OP], [AN], [SP], [above]
 *  picture: [subjects], clear, [index]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display a picture on the subjects. The picture will be
 *  locked on the subject and moves with it. The [name] can be the filename of
 *  the picture to be displayed, or the value 'clear'. The [index] is a
 *  identifier used to label different pictures display. The [X] is a horizontal
 *  offset value. The [Y] is a vertical offset value. The [OP] is the picture
 *  opacity. The [AN] is the picture angle in degrees. The [SP] is the picture
 *  spin speed. And the [above] is a value that, if set, makes the picture be
 *  displayed above the subject.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: picture: user, SwordPicture, 1, 0, -64, 255, 0, 0, above
 *       picture: all targets, AnotherPicture, 3, 32, 0, 120
 *       picture: all friends, clear, 5
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES: 
 *  - You can ommit any values after the [index].
 *  - The [above] value can be added at any point of the motion setup, as long
 *    it is the last value.
 *  - The [index] is used to identify different pictures, if you call another
 *    picture motion using the same index, the new picture will replace the old
 *    picture with the same index. Pictures with different indexes has no kind 
 *    of interaction between them.
 *  - The picture will staty displayed until it's [index] is cleared using the
 *    value 'clear' as the [type] of the motion.
 * ==============================================================================
 *
 * ==============================================================================
 *  Picture (Screen)
 * ------------------------------------------------------------------------------
 *  picture: screen, [name], [index], [X], [Y], [OP], [AN], [SP], [above]
 *  picture: screen, move, [index],  [X], [Y], [OP], [duration]
 *  picture: screen, clear, [index]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display a picture on the screen. The picture will locked
 *  to the screen rather than a subject. The [name] can be the filename of the
 *  picture to be displayed, or the values 'clear' or 'move'. If the value 'move'
 *  is used, some other values will have a different effect. The [index] is a
 *  identifier used to label different pictures display. The [X] is a horizontal
 *  offset value. The [Y] is a vertical offset value. The [OP] is the picture
 *  opacity. The [AN] is the picture angle in degrees. The [SP] is the picture
 *  spin speed. And the [above] is a value that, if set, makes the picture be
 *  displayed above the subject.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: picture: screen, ScreenPicture, 1, 128, 64, 255, 0, 0, above
 *       picture: screen, move, 1, 32, 260, 320, 60
 *       picture: screen, clear, 5
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The picture graphic must be placed on the folder '/img/pictures'.
 *  - You can ommit any values after the [index].
 *  - The [above] value can be added at any point of the motion setup, as long
 *    it is the last value.
 *  - The [index] is used to identify different pictures, if you call another
 *    picture motion using the same index, the new picture will replace the old
 *    picture with the same index. Pictures with different indexes has no kind
 *    of interaction between them.
 *  - Using the value 'move' as the [name] for the motion, will make the picture
 *    move to the new [X], [Y] and [OP] values, this change will take the time
 *    set by the [duration] (that replaces the [AN] value)
 *  - The picture will staty displayed until it's [index] is cleared using the value
 *    'clear' as the [type] of the motion.
 * ==============================================================================
 *
 * ==============================================================================
 *  Plane
 * ------------------------------------------------------------------------------
 *  plane: [name], [index], [X], [Y], [width], [height], [OP], [above]
 *  plane: name, [index], [X], [Y], [width], [height], [OP], [above]
 *  plane: move, [index], [X], [Y], [OP], [duration]
 *  plane: clear, [index]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display a plane picture on the screen. The plane picture
 *  repeats continously on the area set by the motion's [width] and [height].
 *  The [name] can be the filename of the plane to be displayed, or the values
 *  'clear' or 'move'. If the value 'move' is used, some other values will have
 *  a different effect. The [index]is a identifier used to label different plane
 *  display. The [X] is a horizontal offset value. The [Y] is a vertical offset
 *  value. The [width] is the width of the area covered by the plane. The
 *  [hieght] is the hieght of the area covered by the plane. The [OP] is the
 *  plane opacity. And the [above] is a value that, if set, makes the picture be
 *  displayed above the subject.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: plane: ScreenPlane, 1, 0, 0, 816, 624, 255, above
 *       plane: move, 3, 32, 0, 120
 *       plane: clear, 5
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The picture graphic must be placed on the folder '/img/pictures'.
 *  - You can ommit any values after the [index].
 *  - The [above] value can be added at any point of the motion setup, as long
 *    it is the last value.
 *  - The [index] is used to identify different planes, if you call another
 *    plane motion using the same index, the new plane will replace the old
 *    plane with the same index. Planes with different indexes has no kind of
 *    interaction between them.
 *  - Using the value 'move' as the [name] for the motion, will make the plane 
 *    start moving, the [X] and [Y] values are the movement speed. The [OP]
 *    value will change the opacity. The opacity change take the time set by the
 *    [duration] (that replaces the [AN] value)
 *  - The plane will staty displayed until it's [index] is cleared using the
 *    value 'clear' as the [type] of the motion.
 * ==============================================================================
 *
 * ==============================================================================
 *  Pose
 * ------------------------------------------------------------------------------
 *  pose: [subjects], [pose], [frame]
 *  pose: [subjects], [index], [frame]
 *  pose: [subjects], idle, [frame]
 *  pose: [subjects], walk, [frame]
 *  pose: [subjects], wait, [frame]
 *  pose: [subjects], chant, [frame]
 *  pose: [subjects], gaurd, [frame]
 *  pose: [subjects], damage, [frame]
 *  pose: [subjects], evade, [frame]
 *  pose: [subjects], thrust, [frame]
 *  pose: [subjects], swing, [frame]
 *  pose: [subjects], missile, [frame]
 *  pose: [subjects], skill, [frame]
 *  pose: [subjects], spell, [frame]
 *  pose: [subjects], item, [frame]
 *  pose: [subjects], escape, [frame]
 *  pose: [subjects], return, [frame]
 *  pose: [subjects], victory, [frame]
 *  pose: [subjects], dying, [frame]
 *  pose: [subjects], abnormal, [frame]
 *  pose: [subjects], sleep, [frame]
 *  pose: [subjects], dead, [frame]
 *  pose: [subjects], clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Displays a single frame from a specific battle motion. The battler will
 *  display the frame choosen until the 'clear' pose is called. The [pose] can
 *  be a numeric value that is the index of the motion on the battler sprite
 *  sheet, a valid battle motion or 'clear'. The [frame] must be a numeric value
 *  that will decide the frame being displayed.
 *  The 'clear' value will end the pose frame display. It's very important since
 *  the battler will be frozen on the same frame as long the clear is not called.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: pose: user, 2, 2
 *       pose: all targets, damage, 1
 *       pose: all opponents, clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The motions 'return' and 'idle' are available only if you're using the
 *    plugin 'VE - Battler Graphic Setup'.
 * ==============================================================================
 *
 * ==============================================================================
 *  SE
 * ------------------------------------------------------------------------------
 *  se: [type], [name], [volume], [ptich], [pan]
 *  se: play, [name], [volume], [ptich], [pan]
 *  se: play cursor
 *  se: play ok
 *  se: play cancel
 *  se: play buzzer
 *  se: play equip
 *  se: play save
 *  se: play load
 *  se: play battle start
 *  se: play escape
 *  se: play enemy attack
 *  se: play enemy damage
 *  se: play enemy collapse
 *  se: play boss bollapse 1
 *  se: play boss collapse 2
 *  se: play actor damage
 *  se: play actor collapse
 *  se: play recovery
 *  se: play miss
 *  se: play evasion
 *  se: play magic evasion
 *  se: play reflection
 *  se: play shop
 *  se: play use item
 *  se: play use skill
 *  se: stop
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion reproduce a SE. The [type] will define what SE will be played.
 *  If the value 'play' is used, you can input the SE [name], [volume], [ptich]
 *  and [pan]. You can also use the value 'stop' to stop the SE or use one of
 *  system sounds availables.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: se: play, Buzzer1
 *       se: play, Chest2, 90, 100, 0
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The values [volume], [pitch] and [pan] can be ommited. If so it will use
 *    the the values 90 for the volume, 100 for the pitch and 0 for the pan.
 *  - The value [volume] ranges from 0 to 100.
 *  - The value [pitch] ranges from 50 to 150.
 *  - The value [pan] ranges from -100 to 100.
 * ==============================================================================
 *
 * ==============================================================================
 *  Shake
 * ------------------------------------------------------------------------------
 *  shake: [power], [speed], [duration]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will call the screen shake effect. The [power] and [speed] 
 *  define the shake effect movement. The [duration] is the duration for the
 *  shake effect.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: shake: 5, 5, 30
 *       shake: 7, 5, 60
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The [power] and [speed] values ranges from 1 to 9.
 * ==============================================================================
 *
 * ==============================================================================
 *  State
 * ------------------------------------------------------------------------------
 *  state: [subjects], [type], [id], [show]
 *  state: [subjects], add, [id], [show]
 *  state: [subjects], remove, [id], [show]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the subjects state according to the values. The value
 *  [type] can be either 'add' or 'remove' and the state with Id equal the value
 *  [id] will be added or removed according to the type. If the [show] value is
 *  added, the Battle Log Window message will be displayed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: state: user, add, 3
 *       state: all targets, remove, 4, show
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTE.: If using the plugin 'VE - Damage Popup', the value [show] will also
 *         display a popup for the state change.
 * ==============================================================================
 *
 * ==============================================================================
 *  Switch
 * ------------------------------------------------------------------------------
 *  switch: [id], [type]
 *  switch: [id], on
 *  switch: [id], off
 *  switch: [id], toggle
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the state of the switch with it equal the value [id]. 
 *  The value [type] can be 'on', 'off or 'toggle' and the switch state will
 *  be set accordinally to it.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: switch: 2, on
 *       switch: 5, off
 *       switch: 10, toggle
 * ==============================================================================
 *
 * ==============================================================================
 *  Target
 * ------------------------------------------------------------------------------
 *  target: [subjects]
 *  target: clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Define a battle as the target of the action. This is done so you can use
 *  'target' as the subject of another motions.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: target: random target
 *       target: actor 2
 *       target: clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - While you can set the [subject] to be a list that returns more than one
 *    battler, such as 'all friends' or 'all opponents', only the first battler
 *    will be set as target.
 * ==============================================================================
 *
 * ==============================================================================
 *  Tint
 * ------------------------------------------------------------------------------
 *  tint: [subjects], [red], [green], [blue], [gray], [duration]
 *  tint: upper, [red], [green], [blue], [gray], [duration]
 *  tint: lower, [red], [green], [blue], [gray], [duration]
 *  tint: [subjects], black, [duration]
 *  tint: [subjects], dark, [duration]
 *  tint: [subjects], sepia, [duration]
 *  tint: [subjects], sunset, [duration]
 *  tint: [subjects], night, [duration]
 *  tint: [subjects], clear, [duration]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will tint the subjects or screen. The [subjects] decides wich 
 *  battlers or wich layer will have it's tone changed, it's value can be one of
 *  the subjects values or either 'lower' or 'upper'. If the value 'lower' is
 *  used, only the battleback will have it's tone changed, while the battlers
 *  aren't affected. If the value 'upper' is used, all layers will be affected.
 *  You can set the tone color by entering the individual [red], [green], [blue]
 *  and [gray] values, or using one of the pre-set values: 'black', 'dark', 
 *  'light', 'grayscale', 'sepia', 'sunset' or 'night'. The value 'clear' will
 *  clear the tone. The [duration] is the time that the tone change will take to
 *  be complete.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: tint: upper, 64, -32, 0, 96, 60
 *       tint: lower, -255, 0, -255, 255, 30
 *       tint: user, sepia, 40
 *       tint: all targets, night, 50
 *       tint: all friends, clear, 10
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The [red], [green] and [blue] values ranges from -255 to 255.
 *  - The [gray] value ranges from 0 to 255.
 *  - The tint effect from this motion uses a different layer than the tint from
 *    event commands. If using both as the same time, they will blend, so there
 *    is no issue in doing that.
 * ==============================================================================
 *
 * ==============================================================================
 *  TP
 * ------------------------------------------------------------------------------
 *  tp: [subjects], [change], [show]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the subjects TP by an ammount equal the [change] value.
 *  If the [show] value is added, the Battle Log Window message will be
 *  displayed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: tp: user, -100
 *       tp: user, +500, show
 *       tp: all targets, +(user.level * 2), show
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTEs:
 *  - The [change] value can be a script code that returns a numeric value. 
 *    Notice that this code can't have a comma, since commas are used as
 *    Separators for the motion values.
 *  - If using the plugin 'VE - Damage Popup', the value [show] will also
 *    display a popup for the TP change.
 * ==============================================================================
 *
 * ==============================================================================
 *  Variable
 * ------------------------------------------------------------------------------
 *  variable: [id], [change]
 *  variable: [id], = [change]
 *  variable: [id], + [change]
 *  variable: [id], - [change]
 *  variable: [id], * [change]
 *  variable: [id], / [change]
 *  variable: [id], % [change]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion change the value of the variable with it equal the value [id]
 *  by ammount equal the [change] value. The operation will depend on the sign
 *  used on the motion.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: variable: 2, = 100
 *       variable: 5, + 1
 *       variable: 10, - $gameVariables.value(5);
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The [change] value can be a script code that returns a numeric value. 
 *     Notice that this code can't have a comma, since commas are used as
 *         separators for the motion values.
 * ==============================================================================
 *
 * ==============================================================================
 *  Wait
 * ------------------------------------------------------------------------------
 *  wait: [subjects], [type]
 *  wait: [subjects], [time]
 *  wait: [subjects], move
 *  wait: [subjects], jump
 *  wait: [subjects], action
 *  wait: [subjects], motion
 *  wait: [subjects], popup
 *  wait: [subjects], animation
 *  wait: [subjects], effecting
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will make the action sequence to wait for a time or a specific
 *  condition before resuming. The [type] can be a specific number of frames,
 *  o a value between 'move', 'jump', 'action', 'motion', 'popup'.
 *  The value 'move' will wait until all subjects has ended any movement.
 *  The value 'jump' will wait until all subjects has ended any jumping motion.
 *  The value 'action' will wait until all subjects has ended the sequences.
 *  The value 'motion' will wait until all subjects has ended the battle motions.
 *  The value 'popup' will wait until all subjects has ended the damage popup.
 *  The value 'animation' will wait until all subjects has ended the animations.
 *  The value 'effecting' will wait until all subjects has ended the effecting.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: wait: user, 30
 *       wait: all targets, action
 *       wait: all battlers, move
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - When setting a numeric value, you should use either 'user' or 'target' as 
 *    the subject, since it will only consider the time of the subjects that are
 *    the ones executing the action sequence.
 *  - The wait [type] 'jump' serves for all float motions: 'jump', 'leap', 'fall'
 *   and 'float'.
 * ==============================================================================
 *
 * ==============================================================================
 *  Weapon
 * ------------------------------------------------------------------------------
 *  weapon: [subjects], [frame], [index], [X], [Y], [OP], [AN], [SP], [above]
 *  weapon: [subjects], clear, [index]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display a [frame] of the subject's equiped weapon. The
 *  [index] is a identifier used to label different weapon display. The [X] is a
 *  horizontal offset value. The [Y] is a vertical offset value. The [OP] is the
 *  weapon opacity. The [AN] is the weapon angle in degrees. The [SP] is the
 *  weapon spin speed. And the [above] is a value that, if set, makes the weapon
 *  be displayed above the subject. You can use the value 'clear' instead of the
 *  [frame] to clear the displaye for that [index].
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: weapon: user, 1, 1, 0, -52, 255, 0, 0, above
 *       weapon: user, 2, 1
 *       weapon: user, clear
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - You can ommit any values after the [index].
 *  - The [above] value can be added at any point of the motion setup, as long
 *    it is the last value.
 *  - The [index] is used to identify different weapon, if you call another
 *    weapon motion using the same index, the new weapon will replace the old
 *    weapon with the same index. Weapons with different indexes has no kind of
 *    interaction between them.
 *  - The weapon will staty displayed until it's [index] is cleared using the
 *    value 'clear' as the [type] of the motion.
 * ==============================================================================
 *
 * ==============================================================================
 *  Whiten
 * ------------------------------------------------------------------------------
 *  whiten: [subjects]
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This motion will display the whiten effect (a white flash) on the subjects.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: whiten: user
 *       whiten: all targets
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - This will work only for enemies, unless you're using the plugin
 *    'VE - Battle Graphic Setup'
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
 *  SkipBattleEntry
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This plugin command will make so battle entry motion is not displayed for
 *  the next battle.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  SkipBattleVictory
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This plugin command will make so battle victory motion is not displayed for
 *  the next battle.
 * ==============================================================================
 *
 * ==============================================================================
 *  Additional Information:
 * ------------------------------------------------------------------------------
 *  
 *  This plugin is very notetag heavy. To not clutter the small noteboxes with
 *  the long notetags from this plugin, it's recommended that you use the plugin
 *  'VE - Notes Text File', that allows you to add notetags on text files.
 *
 * ==============================================================================
 *
 * ==============================================================================
 *  Example Action Sequences:
 * ------------------------------------------------------------------------------
 *  Those are the notetags for all the default action sequence motions.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: prepare>
 *  </action sequence>
 *  (Yes, the prepare do nothing by default)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: movement>
 *   if: action.isStepForward()
 *     motion: user, walk
 *     move: user, forward, 30, 48
 *   else 
 *     direction: user, targets
 *     motion: user, walk
 *     move: user, to target, 12, front
 *   end
 *   wait: user, move
 *   motion: user, reset
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: execute>
 *   motion: user, action
 *   wait: user, 8
 *   action: all targets, effect
 *   wait: all targets, action
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: effect>
 *   animation: subject, action
 *   wait: subject, animation
 *   effect: subject, 100%
 *   wait: subject, popup
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: return>
 *   motion: user, return
 *   move: user, to home, 12
 *   wait: user, move
 *   motion: user, reset
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: finish>
 *   wait: all targets, action
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: inputing>
 *   wait: subject, move
 *   motion: subject, walk
 *   move: subject, forward, 30, 48
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: inputed>
 *   wait: subject, move
 *   motion: subject, return
 *   move: subject, to home, 30
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: evasion>
 *   motion: subject, evade
 *   wait: subject, 24
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: magic evasion>
 *   motion: subject, evade
 *   wait: subject, 24
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: damage>
 *   motion: subject, damage
 *   move: subject, backward, 30, 24
 *   wait: subject, move
 *   pose: subject, damage, 2
 *   wait: subject, 24
 *   pose: subject, clear
 *   motion: subject, walk
 *   move: subject, forward, 30, 24
 *   wait: subject, move
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: entry>
 *   move: subject, backward, 0, 300
 *   motion: subject, walk
 *   move: subject, to home, 12
 *   wait: subject, move
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: victory>
 *   wait: all battlers, move
 *   motion: subject, victory
 *  </action sequence> 
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  <action sequence: escape>
 *   wait: all battlers, move
 *   motion: subject, escape
 *   move: subject, backward, 12, 400
 *   battlestatus: hide
 *   wait: subject, move
 *  </action sequence> 
 *
 * ==============================================================================
 * 
 * ==============================================================================
 *  Compatibility:
 * ------------------------------------------------------------------------------
 *  To be used together with this plugin, the following plugins must be placed
 *  bellow this plugin:
 *     VE - Battler Graphic Setup
 *     VE - Active Time Battle
 *     VE - Retaliation Damage
 *     VE - Cooperation Skills
 *     VE - Skip Battle Log
 *     VE - FollowUp Skills
 *     VE - Charge Actions
 *     VE - Damage Popup
 *     VE - Dual Wield
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.05.31 > First release.
 *  v 1.01 - 2016.06.04 > Fixed issue with escape even if the escape fails.
 *                      > Added escape fail motion.
 *  v 1.02 - 2016.06.26 > Added tint motion for battlers.
 *                      > Compatibility with Active Time Battle.
 *                      > Fixed issue with equip icon display.
 *  v 1.03 - 2016.08.29 > Fixed issue with counter attacks.
 *                      > Fixed issue with events after evented battles.
 *  v 1.04 - 2017.05.28 > Added element and formula motions for action sequences.
 *                      > Fixed issue with performVictory for game troop.
 *                      > Compatibility with Cooperation Skills
 *  v 1.05 - 2017.07.20 > Fixed issue with changing party members on battle.
 * ==============================================================================
 */

(function() {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.BattleMotions = {};
        VictorEngine.Parameters.BattleMotions.StaticBattlerMove = eval(parameters["Static Battler Move"]);
    }

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.BattleMotions.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function(data, index) {
        VictorEngine.BattleMotions.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['actor', 'class', 'skill', 'item', 'weapon', 'enemy'])) {
            VictorEngine.BattleMotions.loadNotes(data);
        }
    };
	
    VictorEngine.BattleMotions.getAllElements = VictorEngine.getAllElements;
    VictorEngine.getAllElements = function(subject, action) {
		if (action.customActionElements()) {
			return action.customActionElements();
		} else {
			return VictorEngine.BattleMotions.getAllElements.call(this, subject, action);
		}
    };
	
    VictorEngine.BattleMotions.getDamageFormula = VictorEngine.getDamageFormula;
    VictorEngine.getDamageFormula = function(action) {
		if (action.customActionFormula()) {
			return action.customActionFormula();
		} else {
			return VictorEngine.BattleMotions.getDamageFormula.call(this, action);
		}
    };
	
    VictorEngine.BattleMotions.loadNotes = function(data) {
        data.battleMotions = data.battleMotions || {};
        this.processNotes(data);
    };

    VictorEngine.BattleMotions.processNotes = function(data) {
        var match;
        var part1 = 'action sequence';
        var regex = VictorEngine.getNotesValues(part1 + '[ ]*:[ ]*([\\w ]+\\w)', part1);
        while (match = regex.exec(data.note)) {
            this.processValues(data, match);
        };
    };

    VictorEngine.BattleMotions.processValues = function(data, match) {
        var type = match[1].toLowerCase().trim();
        var value = match[2].trim();
        data.battleMotions[type] = value ? value : 'wait: subject, 1;';
    };
	
    //=============================================================================
    // BattleManager
    //=============================================================================

    /* Overwritten function */
    BattleManager.invokeCounterAttack = function(subject, target) {
        if (!target.isCounterAttack()) {
            this._counterActions.push({
                subject: target,
                target: subject
            });
            target.startCounterAttack();
        };
    };

    VictorEngine.BattleMotions.updateStackAction = BattleManager.updateStackAction;
    BattleManager.updateStackAction = function(index, subject, target, rate) {
        subject.setDamageRate(rate);
        VictorEngine.BattleMotions.updateStackAction.call(this, index, subject, target, rate);
    };

    VictorEngine.BattleMotions.initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        VictorEngine.BattleMotions.initMembers.call(this);
        this._counterActions = [];
    };

    VictorEngine.BattleMotions.endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        if (this._counterActions.length > 0 && !this._counterSubject) {
            var counter = this._counterActions.shift();
            this.prepareCounterAction(counter.subject, counter.target, counter.action);
        } else if (this._counterSubject) {
            this.endCounterSubject();
        } else {
            VictorEngine.BattleMotions.endAction.call(this);
        }
    };

    VictorEngine.BattleMotions.processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function() {
        $gameTroop.performVictory();
        VictorEngine.BattleMotions.processDefeat.call(this);
    };

    VictorEngine.BattleMotions.endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        VictorEngine.BattleMotions.endBattle.call(this, result);
        $gameSystem.clearSkipBattleEntry();
        $gameSystem.clearSkipBattleVictory();
    };

    VictorEngine.BattleMotions.displayEscapeSuccessMessage = BattleManager.displayEscapeSuccessMessage;
    BattleManager.displayEscapeSuccessMessage = function() {
        VictorEngine.BattleMotions.displayEscapeSuccessMessage.call(this);
        $gameParty.performEscapeSuccess();
    };

    VictorEngine.BattleMotions.displayEscapeFailureMessage = BattleManager.displayEscapeFailureMessage;
    BattleManager.displayEscapeFailureMessage = function() {
        VictorEngine.BattleMotions.displayEscapeFailureMessage.call(this);
        $gameParty.performEscapeFail();
    };

    BattleManager.prepareCounterAction = function(subject, target) {
        var action = new Game_Action(subject);
        action.setAttack();
        this.startCounterAction(subject, target, action)
    };

    BattleManager.startCounterAction = function(subject, target, action) {
        var targets = action.counterActionTargets(target);
        if (targets.length > 0) {
            this._isCounterAttack = true;
            this._counterSubject = subject;
            this._counterTarget = target;
            this._subject = subject;
            action.setCounterActionTargets(targets);
            subject.addNewAction(action);
            this._phase = 'turn';
        }
    };

    BattleManager.endCounterSubject = function() {
        this._isCounterAttack = false;
        this._logWindow.endAction(this._counterSubject);
        this._counterSubject.endCounterAttack();
        this._subject = this._counterTarget;
        this._counterSubject = null;
        this._counterTarget = null;
    };

    BattleManager.isCounterAttack = function() {
        return this._isCounterAttack;
    };

    //=============================================================================
    // SceneManager
    //=============================================================================

    SceneManager.changeStatusWindow = function(change) {
        if (this._scene && this._scene._statusWindow && this._scene._statusWindow[change]) {
            this._scene._statusWindow[change]();
        }
    };

    SceneManager.sceneRefreshStatusWindow = function() {
        if (this._scene && this._scene._statusWindow && this._scene._statusWindow.refresh) {
            this._scene._statusWindow.refresh();
        }
    };

    //=============================================================================
    // Game_System
    //=============================================================================

    Game_System.prototype.skipBattleEntry = function() {
        return this._skipBattleEntry;
    };

    Game_System.prototype.setSkipBattleEntry = function() {
        this._skipBattleEntry = true;
    };

    Game_System.prototype.clearSkipBattleEntry = function() {
        this._skipBattleEntry = false;
    };

    Game_System.prototype.skipBattleVictory = function() {
        return this._skipBattleVictory;
    };

    Game_System.prototype.setSkipBattleVictory = function() {
        this._skipBattleVictory = true;
    };

    Game_System.prototype.clearSkipBattleVictory = function() {
        this._skipBattleVictory = false;
    };

    Game_System.prototype.memorizeBattleback = function(back1, back2) {
        this._memorizedBattleback = {
            back1: back1,
            back2: back2
        };
    };

    Game_System.prototype.restoreBattleback = function() {
        return this._memorizedBattleback || {
            back1: '',
            back2: ''
        };
    };

    //=============================================================================
    // Game_Screen
    //=============================================================================

    VictorEngine.BattleMotions.clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        VictorEngine.BattleMotions.clear.call(this);
        this.clarBattleTone();
    };

    VictorEngine.BattleMotions.updateGameScreen = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        VictorEngine.BattleMotions.updateGameScreen.call(this);
        this.updateLowerTone();
        this.updateUpperTone();
    };

    Game_Screen.prototype.clarBattleTone = function() {
        this._lowerTone = [0, 0, 0, 0];
        this._upperTone = [0, 0, 0, 0];
        this._targetLowerTone = [0, 0, 0, 0];
        this._targetUpperTone = [0, 0, 0, 0];
        this._lowerToneDuration = 0;
        this._upperToneDuration = 0;
    };

    Game_Screen.prototype.lowerTone = function() {
        return this._lowerTone;
    };

    Game_Screen.prototype.upperTone = function() {
        return this._upperTone;
    };

    Game_Screen.prototype.startLowerTint = function(tone, duration) {
        this._targetLowerTone = tone.clone();
        this._lowerToneDuration = duration || 1;
    };

    Game_Screen.prototype.startUpperTint = function(tone, duration) {
        this._targetUpperTone = tone.clone();
        this._upperToneDuration = duration || 1;
    };

    Game_Screen.prototype.updateLowerTone = function() {
        if (this._lowerToneDuration > 0) {
            var d = this._lowerToneDuration;
            var tone = this._lowerTone;
            var target = this._targetLowerTone;
            for (var i = 0; i < 4; i++) {
                tone[i] = (tone[i] * (d - 1) + target[i]) / d;
            }
            this._lowerToneDuration--;
        }
    };

    Game_Screen.prototype.updateUpperTone = function() {
        if (this._upperToneDuration > 0) {
            var d = this._upperToneDuration;
            var tone = this._upperTone;
            var target = this._targetUpperTone;
            for (var i = 0; i < 4; i++) {
                tone[i] = (tone[i] * (d - 1) + target[i]) / d;
            }
            this._upperToneDuration--;
        }
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    /* Overwritten function */
	Game_Action.prototype.evalDamageFormula = function(target) {
		try {
			var item = this.item();
			var a = this.subject();
			var b = target;
			var v = $gameVariables._data;
			var formula = VictorEngine.getDamageFormula(this);
			var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
			return (Math.max(eval(formula), 0) * sign) || 0;
		} catch (e) {
			return 0;
		}
	};
	
    /* Overwritten function */
    Game_Action.prototype.calcElementRate = function(target) {
        elements = VictorEngine.getAllElements(this.subject(), this);
        return this.elementsMaxRate(target, elements);
    };

    VictorEngine.BattleMotions.makeTargets = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function() {
        if (this._counterActionTargets) {
            return this._counterActionTargets;
        } else {
            return VictorEngine.BattleMotions.makeTargets.call(this)
        }
    };

    VictorEngine.BattleMotions.makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var result = VictorEngine.BattleMotions.makeDamageValue.call(this, target, critical);
        result *= this.subject().damageMotionRate();
        return Math.floor(result);
    };

    VictorEngine.BattleMotions.itemCnt = Game_Action.prototype.itemCnt;
    Game_Action.prototype.itemCnt = function(target) {
        if (BattleManager.isCounterAttack() || target === this.subject()) {
            return 0;
        } else {
            return VictorEngine.BattleMotions.itemCnt.call(this, target);
        };
    };
	
    Game_Action.prototype.isStepForward = function() {
        return this.isForFriend() || this.isForUser() || this.isMagical() || this.isRanged();
    };

    Game_Action.prototype.isRanged = function() {
        return (this.isPhysical() || this.isAttack()) && this.rangedWeapon();
    };

    Game_Action.prototype.rangedWeapon = function() {
        var subject = this.subject();
        if (subject.isActor() || Imported['VE - Battler Graphic Setup']) {
            return this.subject().isRangedWeapon();
        } else {
            return false;
        }
    };

    Game_Action.prototype.counterActionTargets = function(target) {
        var result = [];
        if (target.isActor()) {
            this._targetIndex = $gameParty.members().indexOf(target);
        } else {
            this._targetIndex = target.index();
        }
        if (this.isForUser() || (this.isForFriend() && this.isForOne())) {
            result = [this.subject()];
        } else if (this.isForFriend() && this.isForAll() && !this.isForDeadFriend()) {
            result = this.subject().friendsUnit().aliveMembers();
        } else if (this.isForFriend() && this.isForAll() && this.isForDeadFriend()) {
            result = this.subject().friendsUnit().deadCounterMembers();
        } else if (this.isForOpponent() && this.isForAll()) {
            result = this.subject().opponentsUnit().aliveMembers();
        } else if (this.isForOpponent() && target.isAlive()) {
            result = [target];
        };
        return this.repeatTargets(result);
    };

    Game_Action.prototype.setCounterActionTargets = function(targets) {
        this._counterActionTargets = targets.clone();
    };
	
    Game_Action.prototype.setActionElements = function(elements) {
        this._customActionElements = elements.map(function(id) {
			return Number(id);
		});
    };
	
    Game_Action.prototype.clearActionElements = function() {
        this._customActionElements = null 
    };

    Game_Action.prototype.setActionFormula = function(formula) {
        this._customActionFormula = formula;
    };
	
    Game_Action.prototype.clearActionFormula = function() {
        this._customActionFormula = null 
    };
	
    Game_Action.prototype.customActionElements = function() {
        return this._customActionElements;
    };
	
    Game_Action.prototype.customActionFormula = function() {
        return this._customActionFormula;
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    /* Overwritten function */
    Game_Battler.prototype.performActionStart = function(action) {
        this.setActionState('acting');
    };

    Game_Battler.prototype.performEscape = function() {};

    VictorEngine.BattleMotions.initMembersGameBattler = Game_Battler.prototype.initMembers;
    Game_Battler.prototype.initMembers = function() {
        VictorEngine.BattleMotions.initMembersGameBattler.call(this);
        this.clearBattleMotions();
    };

    VictorEngine.BattleMotions.addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        if (this.isStateAddable(stateId) && stateId === this.deathStateId() && this.isActionSubject()) {
            this._deathStateIsSet = true;
        } else {
            VictorEngine.BattleMotions.addState.call(this, stateId);
        }
    };

    VictorEngine.BattleMotions.performDamage = Game_Battler.prototype.performDamage;
    Game_Battler.prototype.performDamage = function() {
        VictorEngine.BattleMotions.performDamage.call(this);
        if ($gameParty.inBattle() && this.isSpriteVisible() && !this.isActionFlag('damage')) {
            this.addActionFlag('damage');
            this.requestActionMontion({
                name: 'damage'
            });
        }
    };

    VictorEngine.BattleMotions.performEvasion = Game_Battler.prototype.performEvasion;
    Game_Battler.prototype.performEvasion = function() {
        VictorEngine.BattleMotions.performEvasion.call(this);
        if ($gameParty.inBattle() && this.isSpriteVisible() && !this.isActionFlag('damage')) {
            this.addActionFlag('damage');
            this.requestActionMontion({
                name: 'evasion'
            });
        }
    };

    VictorEngine.BattleMotions.performCollapse = Game_Battler.prototype.performCollapse;
    Game_Battler.prototype.performCollapse = function() {
        VictorEngine.BattleMotions.performCollapse.call(this);
        if ($gameParty.inBattle() && this.isSpriteVisible()) {
            this.requestActionMontion({
                name: 'collapse'
            });
        }
    };

    VictorEngine.BattleMotions.performMagicEvasion = Game_Battler.prototype.performMagicEvasion;
    Game_Battler.prototype.performMagicEvasion = function() {
        VictorEngine.BattleMotions.performMagicEvasion.call(this);
        if ($gameParty.inBattle() && this.isSpriteVisible() && !this.isActionFlag('damage')) {
            this.addActionFlag('damage');
            this.requestActionMontion({
                name: 'magic evasion'
            });
        }
    };

    VictorEngine.BattleMotions.onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        VictorEngine.BattleMotions.onBattleEnd.call(this);
        this.clearBattleMotions();
    };

    Game_Battler.prototype.clearBattleMotions = function() {
        this._actionFlags = [];
        this._actionTargets = [];
        this._actionMotionRequest = [];
        this.inputStepBackward();
        this.deathStateRemove();
        this.endBattleMotion();
        this.clearMotionPose();
        this.clearMoveMotion();
        this.clearJumpMotion();
        this.clearLeapMotion();
        this.clearFallMotion();
        this.clearFloatMotion();
        this.clearOpacityMotion();
        this.clearIconMotion();
        this.clearWeaponMotion();
        this.clearPictureMotion();
        this.clearMovePictureMotion();
        this.clearPlaneMotion();
        this.clearMovePlaneMotion();
        this.clearBalloonMotion();
    };

    Game_Battler.prototype.performVictory = function() {
        if ($gameParty.inBattle() && this.canMove() && this.isSpriteVisible() && !$gameSystem.skipBattleVictory()) {
            this.requestActionMontion({
                name: 'victory'
            });
        }
    };

    Game_Battler.prototype.performEscapeSuccess = function() {
        if (this.canMove() && this.isSpriteVisible()) {
            this.requestActionMontion({
                name: 'escape success'
            });
        }
    };

    Game_Battler.prototype.performEscapeFail = function() {
        if (this.canMove() && this.isSpriteVisible()) {
            this.requestActionMontion({
                name: 'escape fail'
            });
        }
    };

    Game_Battler.prototype.requestMotionPose = function(pose, frame) {
        var match = pose.match(/\d+/gi);
        if (match) {
            this._motionPose = {
                index: Number(pose) - 1,
                frame: frame
            };
        } else {
            var index = this.battleSprite().getMotions(pose).index || 0;
            this._motionPose = {
                index: index,
                frame: frame
            };
        }
    };

    Game_Battler.prototype.requestMoveMotion = function(x, y, duration) {
        this._moveMotion = {
            x: x,
            y: y,
            duration: this.moveDuration(x, y, duration)
        };
    };

    Game_Battler.prototype.requestJumpMotion = function(height, duration, move) {
        var duration = move ? this.movementDuration() : duration;
        var distance = move ? Math.sqrt(Math.abs(this.targetOffsetX()) + 400) : 20;
        height = Math.floor(height * distance / 20);
        this._jumpMotion = {
            height: height,
            duration: Math.floor(duration)
        };
    };

    Game_Battler.prototype.requestLeapMotion = function(height, duration, move) {
        var duration = move ? this.movementDuration() : duration;
        var distance = move ? Math.sqrt(Math.abs(this.targetOffsetX()) + 400) : 20;
        height = Math.floor(height * distance / 20);
        this._leapMotion = {
            height: height,
            duration: Math.floor(duration)
        };
    };

    Game_Battler.prototype.requestFallMotion = function(height, duration, move, ground) {
        var duration = move ? this.movementDuration() : duration;
        var distance = move ? Math.sqrt(Math.abs(this.targetOffsetX()) + 400) : 20;
        height = ground ? this.battleSprite().floatHeight() + 8 : Math.floor(height * distance / 20);
        this._fallMotion = {
            height: height,
            duration: duration,
            ground: ground
        };
    };

    Game_Battler.prototype.requestFloatMotion = function(height, duration, move) {
        var duration = move ? this.movementDuration() : duration;
        this._floatMotion = {
            height: height,
            duration: Math.floor(duration)
        };
    };

    Game_Battler.prototype.requestMotionMove = function(index, speed, frames, loop) {
        if (this.notIinHomePosition()) {
            if ((this.isFacingRight() && this.targetOffsetX() < this.screenX()) ||
                (this.isFacingLeft() && this.targetOffsetX() > this.screenX())) {
                var motion = Imported['VE - Battler Graphic Setup'] ? 'return' : 'escape'
                this.requestMotion(motion);
            } else {
                this.requestMotion('walk');
            }
        }
    };

    Game_Battler.prototype.requestCustomMotion = function(index, speed, frames, loop) {
        frames = Math.max(frames, 1) || 3;
        speed = Math.max(speed, 1) || 1;
        loop = loop === 'loop' ? 'true' : loop === 'once' ? 'once' : '';
        this._customMotion = {
            index: index - 1,
            loop: loop,
            frames: frames,
            speed: speed
        };
    };

    Game_Battler.prototype.requestOpacityMotion = function(opacity, duration, move) {
        var duration = move ? this.movementDuration() : duration;
        this._opacityMotion = {
            opacity: opacity,
            duration: Math.floor(duration)
        };
    };

    Game_Battler.prototype.requestIconMotion = function(id, index, x, y, opacity, angle, spin, above) {
        this._iconMotion = {
            id: id,
            index: index,
            x: x,
            y: y,
            opacity: opacity,
            angle: angle,
            spin: spin,
            above: above
        };
    };

    Game_Battler.prototype.requestWeaponMotion = function(id, frame, index, x, y, opacity, angle, spin, above) {
        this._weaponMotion = {
            id: id,
            frame: frame,
            index: index,
            x: x,
            y: y,
            opacity: opacity,
            angle: angle,
            spin: spin,
            above: above
        };
    };

    Game_Battler.prototype.requestPictureMotion = function(type, name, index, x, y, opacity, angle, spin, above) {
        this._pictureMotion = {
            type: type,
            name: name,
            index: index,
            x: x,
            y: y,
            opacity: opacity,
            angle: angle,
            spin: spin,
            above: above
        };
    };

    Game_Battler.prototype.requestPlaneMotion = function(name, index, x, y, width, height, opacity, above) {
        this._planeMotion = {
            name: name,
            index: index,
            x: x,
            y: y,
            width: width,
            height: height,
            opacity: opacity,
            above: above
        };
    };

    Game_Battler.prototype.requestMovePictureMotion = function(index, x, y, opacity, duration) {
        this._movePictureMotion = {
            index: index,
            x: x,
            y: y,
            opacity: opacity,
            duration: duration
        };
    };

    Game_Battler.prototype.requestMovePlaneMotion = function(index, x, y, opacity, duration) {
        this._movePlaneMotion = {
            index: index,
            x: x,
            y: y,
            opacity: opacity,
            duration: duration
        };
    };

    Game_Battler.prototype.requestTintMotion = function(color, duration) {
        this._tintMotion = {
            color: color,
            duration: duration
        };
    };

    Game_Battler.prototype.requestBalloonMotion = function(index) {
        this._balloonMotion = index;
    };

    Game_Battler.prototype.customMotion = function() {
        return this._customMotion;
    };

    Game_Battler.prototype.motionPose = function() {
        return this._motionPose;
    };

    Game_Battler.prototype.moveMotion = function() {
        return this._moveMotion;
    };

    Game_Battler.prototype.jumpMotion = function() {
        return this._jumpMotion;
    };

    Game_Battler.prototype.leapMotion = function() {
        return this._leapMotion;
    };

    Game_Battler.prototype.fallMotion = function() {
        return this._fallMotion;
    };

    Game_Battler.prototype.floatMotion = function() {
        return this._floatMotion;
    };

    Game_Battler.prototype.opacityMotion = function() {
        return this._opacityMotion;
    };

    Game_Battler.prototype.iconMotion = function() {
        return this._iconMotion;
    };

    Game_Battler.prototype.weaponMotion = function() {
        return this._weaponMotion;
    };

    Game_Battler.prototype.pictureMotion = function() {
        return this._pictureMotion;
    };

    Game_Battler.prototype.planeMotion = function() {
        return this._planeMotion;
    };

    Game_Battler.prototype.movePictureMotion = function() {
        return this._movePictureMotion;
    };

    Game_Battler.prototype.movePlaneMotion = function() {
        return this._movePlaneMotion;
    };

    Game_Battler.prototype.tintMotion = function() {
        return this._tintMotion;
    };

    Game_Battler.prototype.balloonMotion = function() {
        return this._balloonMotion || 0;
    };

    Game_Battler.prototype.isCustomMotionRequested = function() {
        return !!this._customMotion;
    };

    Game_Battler.prototype.isMoveRequested = function() {
        return !!this._moveMotion;
    };

    Game_Battler.prototype.isJumpRequested = function() {
        return !!this._jumpMotion;
    };

    Game_Battler.prototype.isLeapRequested = function() {
        return !!this._leapMotion;
    };

    Game_Battler.prototype.isFallRequested = function() {
        return !!this._fallMotion;
    };

    Game_Battler.prototype.isFloatRequested = function() {
        return !!this._floatMotion;
    };

    Game_Battler.prototype.isOpacityRequested = function() {
        return !!this._opacityMotion;
    };

    Game_Battler.prototype.isIconRequested = function() {
        return !!this._iconMotion;
    };

    Game_Battler.prototype.isWeaponRequested = function() {
        return !!this._weaponMotion;
    };

    Game_Battler.prototype.isPictureRequested = function() {
        return !!this._pictureMotion;
    };

    Game_Battler.prototype.isMovePictureRequested = function() {
        return !!this._movePictureMotion;
    };

    Game_Battler.prototype.isPlaneRequested = function() {
        return !!this._planeMotion;
    };

    Game_Battler.prototype.isMovePlaneRequested = function() {
        return !!this._movePlaneMotion;
    };

    Game_Battler.prototype.isTintRequested = function() {
        return !!this._tintMotion;
    };

    Game_Battler.prototype.isBalloonRequested = function() {
        return !!this._balloonMotion;
    };

    Game_Battler.prototype.clearCustomMotion = function() {
        this._customMotion = null;
    };

    Game_Battler.prototype.clearMotionPose = function() {
        this._motionPose = null;
    };

    Game_Battler.prototype.clearMoveMotion = function() {
        this._moveMotion = null;
    };

    Game_Battler.prototype.clearJumpMotion = function() {
        this._jumpMotion = null;
    };

    Game_Battler.prototype.clearLeapMotion = function() {
        this._leapMotion = null;
    };

    Game_Battler.prototype.clearFallMotion = function() {
        this._fallMotion = null;
    };

    Game_Battler.prototype.clearFloatMotion = function() {
        this._floatMotion = null;
    };

    Game_Battler.prototype.clearOpacityMotion = function() {
        this._opacityMotion = null;
    };

    Game_Battler.prototype.clearIconMotion = function() {
        this._iconMotion = null;
    };

    Game_Battler.prototype.clearWeaponMotion = function() {
        this._weaponMotion = null;
    };

    Game_Battler.prototype.clearPictureMotion = function() {
        this._pictureMotion = null;
    };

    Game_Battler.prototype.clearMovePictureMotion = function() {
        this._movePictureMotion = null;
    };

    Game_Battler.prototype.clearPlaneMotion = function() {
        this._planeMotion = null;
    };

    Game_Battler.prototype.clearMovePlaneMotion = function() {
        this._movePlaneMotion = null;
    };

    Game_Battler.prototype.clearTintMotion = function() {
        this._tintMotion = null;
    };

    Game_Battler.prototype.clearBalloonMotion = function() {
        this._balloonMotion = null;
    };

    Game_Battler.prototype.moveDuration = function(x, y, duration) {
        var sprite = this.battleSprite();
        var positionX = x + this.homeX();
        var positionY = y + this.homeY();
        var distanceX = Math.abs(sprite.x - positionX);
        var distanceY = Math.abs(sprite.y - positionY);
        var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        return Math.floor(duration * distance / 120);
    };

    Game_Battler.prototype.isRangedWeapon = function() {
        var weapons = this.equips();
        var dualIndex = this._dualWieldSpriteIndex;
        if (dualIndex === 2 || (!weapons[0] && DataManager.isWeapon(weapons[1]))) {
            var index = (dualIndex - 1) || 0;
        } else {
            var index = 0;
        }
        var wtypeId = weapons[index] ? weapons[index].wtypeId : 0;
        var attackMotion = $dataSystem.attackMotions[wtypeId];
        return attackMotion && attackMotion.type === 2;
    };

    Game_Battler.prototype.setDamageRate = function(rate) {
        if (!rate && rate !== 0) {
            this._damageMotionRate = 1;
        } else {
            this._damageMotionRate = rate;
        }
    };

    Game_Battler.prototype.damageMotionRate = function() {
        var value = this._damageMotionRate || 1;
        this._damageMotionRate = 1;
        return value;
    };

    Game_Battler.prototype.isSpriteJumping = function() {
        return this.battleSprite() && this.battleSprite().isSpriteJumping();
    };

    Game_Battler.prototype.isSpriteMotion = function() {
        return this.battleSprite() && this.battleSprite().isMotion();
    };

    Game_Battler.prototype.isSpriteEffecting = function() {
        return this.battleSprite() && this.battleSprite().isEffecting();
    };

    Game_Battler.prototype.isSpritPopuping = function() {
        return this.battleSprite() && this.battleSprite().isDamagePopup();
    };

    Game_Battler.prototype.frameSize = function() {
        var sprite = this.battleSprite();
        return sprite ? sprite.spriteFrameSize() : {
            width: 0,
            height: 0
        };
    };

    Game_Battler.prototype.movementDuration = function() {
        return this.battleSprite() ? this.battleSprite().movementDuration() : 0;
    };

    Game_Battler.prototype.isBalloonPlaying = function() {
        return this.battleSprite() && this.battleSprite().isBalloonPlaying();
    };

    Game_Battler.prototype.targetOffsetX = function() {
        return this.battleSprite() ? this.battleSprite().targetOffsetX() : 0;
    };

    Game_Battler.prototype.targetOffsetY = function() {
        return this.battleSprite() ? this.battleSprite().targetOffsetY() : 0;
    };

    Game_Battler.prototype.startBattleMotion = function() {
        this._battleMotionActive = true
    };

    Game_Battler.prototype.endBattleMotion = function() {
        this._battleMotionActive = false;
    };

    Game_Battler.prototype.isBattleMotion = function() {
        return this._battleMotionActive;
    };

    Game_Battler.prototype.actionTargets = function() {
        return this._actionTargets;
    };

    Game_Battler.prototype.prepareAction = function(target) {
        if (!this._actionTargets.contains(target)) {
            this._actionTargets.push(target);
        }
    };

    Game_Battler.prototype.removeActionTarget = function(target) {
        for (var i = 0; i < this._actionTargets.length; i++) {
            if (this._actionTargets[i] === target) {
                this._actionTargets.splice(i, 1);
                i--;
            }
        }
    };

    Game_Battler.prototype.clearActionTargets = function() {
        this._actionTargets = [];
    };

    Game_Battler.prototype.isActionSubject = function() {
        var battlers = BattleManager.allBattleMembers();
        for (var i = 0; i < battlers.length; i++) {
            if (battlers[i].actionTargets().contains(VictorEngine.battlerIndex(this))) {
                return true;
            }
        }
        return false;
    };

    Game_Battler.prototype.noActionMovement = function() {
        var noMove = VictorEngine.Parameters.BattleMotions.StaticBattlerMove;
        return noMove && this.isStaticBattler();
    };

    Game_Battler.prototype.inputStep = function() {
        return this._inputStep;
    };

    Game_Battler.prototype.inputStepForward = function() {
        this._inputStep = true;
    };

    Game_Battler.prototype.inputStepBackward = function() {
        this._inputStep = false;
    };

    Game_Battler.prototype.deathStateIsSet = function() {
        return this._deathStateIsSet;
    };

    Game_Battler.prototype.deathStateRemove = function() {
        this._deathStateIsSet = false;
    };

    Game_Battler.prototype.requestActionMontion = function(action) {
        this._actionMotionRequest.push(action);
    };

    Game_Battler.prototype.actionMontionRequested = function() {
        return this._actionMotionRequest.length > 0;
    };

    Game_Battler.prototype.updateActionMontion = function() {
        return this._actionMotionRequest.shift();
    };

    Game_Battler.prototype.addActionFlag = function(flag) {
        if (!this._actionFlags.contains(flag)) {
            this._actionFlags.push(flag);
        }
    };

    Game_Battler.prototype.removeActionFlag = function(flag) {
        for (var i = 0; i < this._actionFlags.length; i++) {
            if (this._actionFlags[i] === flag) {
                this._actionFlags.splice(i, 1);
                i--;
            }
        }
    };

    Game_Battler.prototype.isActionFlag = function(flag) {
        return this._actionFlags.contains(flag);
    };

    Game_Battler.prototype.setNewHome = function(newX, newY) {
        var sprite = this.battleSprite()
        if (sprite) {
            var oldX = this.screenX();
            var oldY = this.screenY();
            sprite.setHome(newX, newY);
            sprite.fixHomePosition(oldX, oldY);
        }
    };

    Game_Battler.prototype.performAttack = function() {};

    //=============================================================================
    // Game_Actor
    //=============================================================================

    /* Overwritten function */
    Game_Actor.prototype.performVictory = function() {
        Game_Battler.prototype.performVictory.call(this);
    };

    /* Overwritten function */
    Game_Actor.prototype.performEscape = function() {};

    Game_Actor.prototype.battleMotions = function(name) {
        var result;
        var weapons = this.weapons();
        result = weapons[0] ? weapons[0].battleMotions[name] : null
        result = result || this.actor().battleMotions[name];
        result = result || this.currentClass().battleMotions[name];
        return result;
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================

    /* Overwritten function */
    Game_Enemy.prototype.performActionStart = function(action) {
        Game_Battler.prototype.performActionStart.call(this, action);
    };

    /* Overwritten function */
    Game_Enemy.prototype.screenX = function() {
        return Game_BattlerBase.prototype.screenX.call(this);
    };

    /* Overwritten function */
    Game_Enemy.prototype.screenY = function() {
        return Game_BattlerBase.prototype.screenY.call(this);
    };

    Game_Enemy.prototype.noActionMovement = function() {
        var noMove = VictorEngine.Parameters.BattleMotions.StaticBattlerMove;
        return noMove && this.isStaticBattler();
    };

    Game_Enemy.prototype.battleMotions = function(name) {
        return this.enemy().battleMotions[name];
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================

    Game_Party.prototype.performEscapeSuccess = function() {
        this.members().forEach(function(actor) {
            actor.performEscapeSuccess();
        });
    };

    Game_Party.prototype.performEscapeFail = function() {
        this.members().forEach(function(actor) {
            actor.performEscapeFail();
        });
    };

    //=============================================================================
    // Game_Troop
    //=============================================================================

    Game_Troop.prototype.performVictory = function() {
        this.members().forEach(function(enemy) {
            enemy.performVictory();
        });
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    VictorEngine.BattleMotions.pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        VictorEngine.BattleMotions.pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'skipbattleentry') {
            $gameSystem.setSkipBattleEntry();
        }
        if (command.toLowerCase() === 'skipbattlevictory') {
            $gameSystem.setSkipBattleVictory();
        }
    };
    //=============================================================================
    // Sprite_Battler
    //=============================================================================

    VictorEngine.BattleMotions.initMembersSpriteBattler = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        VictorEngine.BattleMotions.initMembersSpriteBattler.call(this)
        this._floatHeight = 0;
        this._jumpDuration = 0;
        this._leapDuration = 0;
        this._fallDuration = 0;
        this._toneDuration = 0;
        this._floatDuration = 0;
        this._baseOpacity = 255;
        this._opacityEffect = 255;
        this._opacityDuration = 0;
        this._motionIcons = [];
        this._motionPlanes = [];
        this._motionWeapons = [];
        this._motionPictures = [];
        this._toneColor = [0, 0, 0, 0];
    };

    Sprite_Battler.prototype.getMotions = function(motionType, state) {
        return Sprite_Actor.MOTIONS[motionType] || {};
    };

    VictorEngine.BattleMotions.updateMainSpriteBattler = Sprite_Battler.prototype.updateMain;
    Sprite_Battler.prototype.updateMain = function() {
        VictorEngine.BattleMotions.updateMainSpriteBattler.call(this);
        if (this._battler.isSpriteVisible()) {
            this.updateBattleMotion();
            this.updateOpacity();
            if (this._battler.motionPose()) {
                this.updateMotionPoseFrame();
            }
            if (this.isEnemy() && !this.isMoving()) {
                this.updateTargetPosition();
            }
        }
    };

    VictorEngine.BattleMotions.updatePosition = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        VictorEngine.BattleMotions.updatePosition.call(this)
        this.updateFloatHeight();
        this.updateJumpShadow();
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    };

    VictorEngine.BattleMotions.updateMove = Sprite_Battler.prototype.updateMove;
    Sprite_Battler.prototype.updateMove = function() {
        VictorEngine.BattleMotions.updateMove.call(this);
        this.updateJump();
        this.updateLeap();
        this.updateFall();
        this.updateFloat();
        this.updateIcons();
        this.updateWeapons();
        this.updatePictures();
        this.updatePlanes();
        this.updateBalloon();
        this.updateTone();
    };

    VictorEngine.BattleMotions.spriteZ = Sprite_Battler.prototype.spriteZ;
    Sprite_Battler.prototype.spriteZ = function() {
        var priority = this.isHighPriority() ? 2 : 0;
        return VictorEngine.BattleMotions.spriteZ.call(this) + priority;
    };

    VictorEngine.BattleMotions.noEntryMove = Sprite_Battler.prototype.noEntryMove;
    Sprite_Battler.prototype.noEntryMove = function() {
        return VictorEngine.BattleMotions.noEntryMove.call(this) || $gameSystem.skipBattleEntry();
    };

    Sprite_Battler.prototype.processEntryMotion = function() {
        this.startMove(0, 0, 0);
        this.updatePosition();
        if (this._battler && this._battler.canMove() && !this.noEntryMove()) {
            this._battler.requestActionMontion({
                name: 'entry'
            });
        } else if (this._battler) {
            this._battler.requestActionMontion({
                name: 'refresh'
            });
        }
    };

    Sprite_Battler.prototype.isHighPriority = function() {
        return this._battler && this._battler.isBattleMotion();
    };

    Sprite_Battler.prototype.spriteFrameSize = function() {
        if (this._mainSprite) {
            return {
                width: this._mainSprite.width,
                height: this._mainSprite.height
            };
        } else {
            return {
                width: this.width,
                height: this.height
            };
        }
    };

    Sprite_Battler.prototype.fixHomePosition = function(oldX, oldY) {
        this._offsetX = oldX - this._homeX;
        this._offsetY = oldY - this._homeY;
        this.updatePosition();
    };

    Sprite_Battler.prototype.startCustomMotion = function(newMotion) {
        var oldMotion = this._motion || {};
        if (oldMotion !== newMotion || this._playMotion) {
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = oldMotion.index !== newMotion.index ? 0 : this._pattern;
            this._playMotion = !newMotion.loop;
        }
    };

    Sprite_Battler.prototype.updateMotionPoseFrame = function() {
        if (this._mainSprite && this._mainSprite.bitmap) {
            var motion = this._battler.motionPose()
            var bitmap = this._mainSprite.bitmap;
            var effect = this._effectType === 'bossCollapse';
            var setup = this._frameSetup || {
                adjust: 0,
                poses: 18,
                columns: 3,
                frames: 3
            };
            var index = motion.index || 0;
            var pattern = motion.frame || 0;
            var ad = setup.adjust;
            var pc = setup.poses / setup.columns;
            var cw = bitmap.width / (setup.columns * setup.frames);
            var ch = bitmap.height / pc;
            var cx = Math.floor(index / pc) * setup.frames + pattern;
            var cy = index % Math.floor(pc);
            var cd = ch + ad
            var fh = effect ? cd * this._effectDuration / cd : cd
            this._mainSprite.setFrame(cx * cw, cy * ch, cw, fh);
            this._mainSprite.anchor.y = (1 - ad / fh) || 1;
        }
    };

    Sprite_Battler.prototype.startJump = function(height, duration) {
        this._jumpDuration = Math.max(Math.floor(duration / 2) * 2, 2);
        this._jumpStarting = Math.max(Math.floor(duration / 2) * 2, 2);
        this._jumpGravity = height;
    };

    Sprite_Battler.prototype.startLeap = function(height, duration) {
        this._leapDuration = Math.max(duration, 1);
        this._leapStarting = Math.max(duration, 1);
        this._leapGravity = height;
    };

    Sprite_Battler.prototype.startFall = function(height, duration, ground) {
        this._fallDuration = Math.max(duration, 1);
        this._fallStarting = Math.max(duration, 1);
        this._fallToGround = ground;
        this._fallGravity = height;
    };

    Sprite_Battler.prototype.startFloat = function(height, duration) {
        this._floatDuration = Math.max(duration, 1);
        this._floatStarting = Math.max(duration, 1);
        this._floatGravity = height;
    };

    Sprite_Battler.prototype.startOpacity = function(opacity, duration) {
        this._opacityDuration = Math.max(duration, 1);
        this._opacityTarget = opacity;
    };

    Sprite_Battler.prototype.displayBalloon = function(index) {
        if (!this._balloonSprite) {
            this._balloonSprite = new Sprite_Balloon();
        }
        this._balloonSprite.setup(index);
        this.addChild(this._balloonSprite);
    };

    Sprite_Battler.prototype.displayIcon = function(motion) {
        if (this._mainSprite) {
            var sprite = this._motionIcons[motion.index];
            if (motion.id === 0 && sprite) {
                this._lowerPictureContainer.removeChild(sprite);
                this._upperPictureContainer.removeChild(sprite);
                this._motionIcons[motion.index] = null;
            } else if (motion.id) {
                this._lowerPictureContainer.removeChild(sprite);
                this._upperPictureContainer.removeChild(sprite);
                this.createIconSprite(motion);
            }
        }
    };

    Sprite_Battler.prototype.displayWeapon = function(motion) {
        if (this._mainSprite) {
            var sprite = this._motionWeapons[motion.index];
            if (!motion.frame && sprite) {
                this._lowerPictureContainer.removeChild(sprite);
                this._upperPictureContainer.removeChild(sprite);
                this._motionWeapons[motion.index] = null;
            } else if (motion.frame) {
                this._lowerPictureContainer.removeChild(sprite);
                this._upperPictureContainer.removeChild(sprite);
                this.createWeaponMotionSprite(motion);
            }
        }
    };

    Sprite_Battler.prototype.displayPicture = function(motion) {
        if (motion.type === 'screen') {
            this.displayScreenPicture(motion);
        } else if (this._mainSprite) {
            this.displayBattlerPicture(motion);
        }
    };

    Sprite_Battler.prototype.displayPlane = function(motion) {
        var sprite = this._motionPlanes[motion.index];
        if (!motion.name && sprite) {
            var spriteset = SceneManager.sceneSpriteset();
            if (spriteset) {
                spriteset.removeScreenPlane(sprite);
            }
            this._motionPlanes[motion.index] = null;
        } else if (motion.name) {
            var spriteset = SceneManager.sceneSpriteset();
            if (spriteset) {
                spriteset.removeScreenPlane(sprite);
            }
            this.createPlaneSprite(motion);
        }
    };

    Sprite_Battler.prototype.displayScreenPicture = function(motion) {
        var sprite = this._motionPictures[motion.index];
        if (!motion.name && sprite) {
            var spriteset = SceneManager.sceneSpriteset();
            if (spriteset) {
                spriteset.removeScreenPicture(sprite);
            }
            this._motionPictures[motion.index] = null;
        } else if (motion.name) {
            var spriteset = SceneManager.sceneSpriteset();
            if (spriteset) {
                spriteset.removeScreenPicture(sprite);
            }
            this.createScreenPictureSprite(motion);
        }
    };

    Sprite_Battler.prototype.displayBattlerPicture = function(motion) {
        var sprite = this._motionPictures[motion.index];
        if (!motion.name && sprite) {
            this._lowerPictureContainer.removeChild(sprite);
            this._upperPictureContainer.removeChild(sprite);
            this._motionPictures[motion.index] = null;
        } else if (motion.name) {
            this._lowerPictureContainer.removeChild(sprite);
            this._upperPictureContainer.removeChild(sprite);
            this.createBattlerPictureSprite(motion);
        }
    };

    Sprite_Battler.prototype.createIconSprite = function(motion) {
        var sprite = new Sprite();
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = motion.id % 16 * pw;
        var sy = Math.floor(motion.id / 16) * ph;
        sprite.bitmap = ImageManager.loadSystem('IconSet');
        sprite.setFrame(sx, sy, pw, ph);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.x = motion.x;
        sprite.y = motion.y;
        sprite.rotation = (motion.angle * Math.PI / 180) || 0;
        sprite.iconSpin = motion.spin || 0;
        sprite.iconOpacity = motion.opacity;
        this._motionIcons[motion.index] = sprite;
        if (motion.above) {
            this._upperPictureContainer.addChild(sprite);
        } else {
            this._lowerPictureContainer.addChild(sprite);
        }
    };

    Sprite_Battler.prototype.createWeaponMotionSprite = function(motion) {
        var sprite = new Sprite();
        var index = (motion.id - 1) % 12;
        var pw = 96;
        var ph = 64;
        var sx = (Math.floor(index / 6) * 3 + motion.frame - 1) * pw;
        var sy = Math.floor(index % 6) * ph;
        var pageId = Math.floor((motion.id - 1) / 12) + 1;
        if (pageId >= 1) {
            sprite.bitmap = ImageManager.loadSystem('Weapons' + pageId);
        } else {
            sprite.bitmap = ImageManager.loadSystem('');
        }
        sprite.setFrame(sx, sy, pw, ph);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.x = motion.x;
        sprite.y = motion.y;
        sprite.rotation = (motion.angle * Math.PI / 180) || 0;
        sprite.weaponSpin = motion.spin || 0;
        sprite.weaponOpacity = motion.opacity;
        this._motionWeapons[motion.index] = sprite;
        if (motion.above) {
            this._upperPictureContainer.addChild(sprite);
        } else {
            this._lowerPictureContainer.addChild(sprite);
        }
    };

    Sprite_Battler.prototype.createScreenPictureSprite = function(motion) {
        var sprite = this.createPictureSprite(motion, false);
        this._motionPictures[motion.index] = sprite;
        var spriteset = SceneManager.sceneSpriteset();
        if (spriteset) {
            spriteset.addScreenPicture(motion.above, sprite);
        }
    };

    Sprite_Battler.prototype.createBattlerPictureSprite = function(motion) {
        var sprite = this.createPictureSprite(motion, true);
        this._motionPictures[motion.index] = sprite;
        if (motion.above) {
            this._upperPictureContainer.addChild(sprite);
        } else {
            this._lowerPictureContainer.addChild(sprite);
        }
    };

    Sprite_Battler.prototype.createPictureSprite = function(motion, battler) {
        var sprite = new Sprite();
        sprite.type = motion.type;
        sprite.bitmap = ImageManager.loadPicture(motion.name);
        sprite.bitmap.addLoadListener(this.setPictureSpriteFrame.bind(this, sprite));
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.x = motion.x;
        sprite.y = motion.y;
        sprite.pictureTargetX = sprite.x;
        sprite.pictureTargetY = sprite.y;
        sprite.pictureTargetOpacity = motion.opacity;
        sprite.rotation = (motion.angle * Math.PI / 180) || 0;
        sprite.pictureSpin = motion.spin || 0;
        sprite.pictureOpacity = motion.opacity;
        return sprite;
    };

    Sprite_Battler.prototype.createPlaneSprite = function(motion) {
        var sprite = new TilingSprite();
        var bitmap = ImageManager.loadPicture(motion.name)
        sprite.bitmap = new Bitmap();
        sprite.spriteId = sprite.spriteId || Sprite._counter++;
        bitmap.addLoadListener(this.setPlaneSpriteBitmap.bind(this, sprite, bitmap));
        sprite.move(motion.x, motion.y, motion.width, motion.height);
        sprite.panX = 0;
        sprite.panY = 0;
        sprite.opacity = motion.opacity;
        this._motionPlanes[motion.index] = sprite;
        var spriteset = SceneManager.sceneSpriteset();
        if (spriteset) {
            spriteset.addScreenPlane(motion.above, sprite);
        }
    };

    Sprite_Battler.prototype.setPictureSpriteFrame = function(sprite) {
        var bitmap = sprite.bitmap;
        sprite.setFrame(0, 0, bitmap.width, bitmap.height);
    };

    Sprite_Battler.prototype.setPlaneSpriteBitmap = function(sprite, bitmap) {
        sprite.bitmap = bitmap;
    };

    Sprite_Battler.prototype.movePicture = function(motion) {
        var sprite = this._motionPictures[motion.index];
        if (sprite && sprite.type === 'screen') {
            sprite.pictureTargetX = motion.x;
            sprite.pictureTargetY = motion.y;
            sprite.pictureTargetOpacity = motion.opacity;
            sprite.moveDuration = Math.floor(motion.duration);
        }
    };

    Sprite_Battler.prototype.movePlane = function(motion) {
        var sprite = this._motionPlanes[motion.index];
        if (sprite) {
            sprite.panX = motion.x;
            sprite.panY = motion.y;
            sprite.planeTargetOpacity = motion.opacity;
            sprite.moveDuration = Math.floor(motion.duration);
        }
    };

    Sprite_Battler.prototype.startTint = function(motion) {
        this._targetTone = motion.color.clone();
        this._toneDuration = motion.duration;
    };

    Sprite_Battler.prototype.updateTargetPosition = function() {
        var battler = this._battler;
        if (battler.isMoveRequested()) {
            var move = battler.moveMotion();
            this.startMove(move.x, move.y, move.duration || 1);
            battler.clearMoveMotion();
        } else if (battler.isInputting() && !battler.inputStep()) {
            battler.requestActionMontion({
                name: 'inputing',
                push: true
            });
            battler.inputStepForward();
        } else if (battler.inputStep() && !battler.isInputting()) {
            battler.requestActionMontion({
                name: 'inputed',
                push: true
            });
            battler.inputStepBackward();
        }
    };

    Sprite_Battler.prototype.updateBattleMotion = function() {
        if (!this.isJumping() && this._battler.isJumpRequested()) {
            var motion = this._battler.jumpMotion();
            this.startJump(motion.height, motion.duration);
            this._battler.clearJumpMotion();
        }
        if (!this.isLeaping() && this._battler.isLeapRequested()) {
            var motion = this._battler.leapMotion();
            this.startLeap(motion.height, motion.duration);
            this._battler.clearLeapMotion();
        }
        if (!this.isFalling() && this._battler.isFallRequested()) {
            var motion = this._battler.fallMotion();
            this.startFall(motion.height, motion.duration, motion.ground);
            this._battler.clearFallMotion();
        }
        if (!this.isFloating() && this._battler.isFloatRequested()) {
            var motion = this._battler.floatMotion();
            this.startFloat(motion.height, motion.duration);
            this._battler.clearFloatMotion();
        }
        if (!this.isOpacity() && this._battler.isOpacityRequested()) {
            var motion = this._battler.opacityMotion();
            this.startOpacity(motion.opacity, motion.duration);
            this._battler.clearOpacityMotion();
        }
        if (this._battler.isIconRequested()) {
            var motion = this._battler.iconMotion();
            this.displayIcon(motion);
            this._battler.clearIconMotion();
        }
        if (this._battler.isWeaponRequested()) {
            var motion = this._battler.weaponMotion();
            this.displayWeapon(motion);
            this._battler.clearWeaponMotion();
        }
        if (this._battler.isPictureRequested()) {
            var motion = this._battler.pictureMotion();
            this.displayPicture(motion);
            this._battler.clearPictureMotion();
        }
        if (this._battler.isMovePictureRequested()) {
            var motion = this._battler.movePictureMotion();
            this.movePicture(motion);
            this._battler.clearMovePictureMotion();
        }
        if (this._battler.isPlaneRequested()) {
            var motion = this._battler.planeMotion();
            this.displayPlane(motion);
            this._battler.clearPlaneMotion();
        }
        if (this._battler.isMovePlaneRequested()) {
            var motion = this._battler.movePlaneMotion();
            this.movePlane(motion);
            this._battler.clearMovePlaneMotion();
        }
        if (this._battler.isTintRequested()) {
            var motion = this._battler.tintMotion();
            this.startTint(motion);
            this._battler.clearTintMotion();
        }
        if (this._battler.isBalloonRequested()) {
            var motion = this._battler.balloonMotion();
            this.displayBalloon(motion);
            this._battler.clearBalloonMotion();
        }
        if (this._battler.isCustomMotionRequested()) {
            var motion = this._battler.customMotion();
            this.startCustomMotion(motion);
            this._battler.clearCustomMotion();
        }
    };

    Sprite_Battler.prototype.updateJump = function() {
        if (this.isJumping()) {
            var starting = this._jumpStarting / 2;
            var gravity = 2 * this._jumpGravity / starting;
            if (this._jumpDuration > starting) {
                var duration = this._jumpDuration - starting;
                this._floatHeight += gravity * duration / starting;
            } else {
                var duration = this._jumpDuration;
                this._floatHeight -= gravity * (starting - duration + 1) / starting;
            }
            this._jumpDuration--;
            if (this._floatHeight < 0) {
                this._floatHeight = 0;
            }
        }
    };

    Sprite_Battler.prototype.updateLeap = function() {
        if (this.isLeaping()) {
            var starting = this._leapStarting;
            var duration = this._leapDuration;
            var gravity = this._leapGravity / starting;
            this._floatHeight += gravity * duration / starting;
            this._leapDuration--;
            if (this._floatHeight < 0) {
                this._floatHeight = 0;
            }
        }
    };

    Sprite_Battler.prototype.updateFall = function() {
        if (this.isFalling()) {
            var starting = this._fallStarting;
            var duration = this._fallDuration;
            var gravity = 2 * this._fallGravity / starting;
            this._floatHeight -= gravity * (starting - duration + 1) / starting;
            this._fallDuration--;
            if (this._floatHeight < 0 || (!this.isFalling() && this._fallToGround)) {
                this._floatHeight = 0;
            }
        }
    };

    Sprite_Battler.prototype.updateFloat = function() {
        if (this.isFloating()) {
            var starting = this._floatStarting;
            var duration = this._floatDuration;
            var gravity = this._floatGravity / starting;
            this._floatHeight += gravity;
            this._floatDuration--;
            if (this._floatHeight < 0) {
                this._floatHeight = 0;
            }
        }
    };

    Sprite_Battler.prototype.updateOpacity = function() {
        if (this.isOpacity()) {
            var d = this._opacityDuration;
            this._opacityEffect = (this._opacityEffect * (d - 1) + this._opacityTarget) / d;
            this._opacityDuration--;
        }
        this.opacity = this._baseOpacity * this._opacityEffect / 255;
    };

    Sprite_Battler.prototype.updateFloatHeight = function() {
        if (this._mainSprite) {
            this._mainSprite.y = -Math.floor(this._floatHeight);
        } else {
            this.y -= Math.floor(this._floatHeight);
        }
    };

    Sprite_Battler.prototype.updateJumpShadow = function() {
        if (this._shadowSprite) {
            this._shadowSprite.scale.x = Math.max((100 - this._floatHeight / 2) / 100, 0);
            this._shadowSprite.scale.y = Math.max((100 - this._floatHeight / 2) / 100, 0);
            this._shadowSprite.opacity = Math.max(255 - this._floatHeight, 0);
        }
    };

    Sprite_Battler.prototype.updateIcons = function() {
        var sprites = this._motionIcons;
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite && this._battler) {
                sprite.rotation += sprite.iconSpin;
                sprite.opacity = sprite.iconOpacity * this.opacity / 255;
            }
        }
    };

    Sprite_Battler.prototype.updateWeapons = function() {
        var sprites = this._motionWeapons;
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite && this._battler) {
                sprite.rotation += sprite.weaponSpin;
                sprite.opacity = sprite.weaponOpacity * this.opacity / 255;
            }
        }
    };

    Sprite_Battler.prototype.updatePictures = function() {
        var sprites = this._motionPictures;
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite && this._battler) {
                if (sprite.type === 'screen') {
                    this.updateScreenPicture(sprite);
                } else {
                    this.updateBattlerPicture(sprite);
                }
            }
        }
    };

    Sprite_Battler.prototype.updatePlanes = function() {
        var sprites = this._motionPlanes;
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite) {
                sprite.origin.x += sprite.panX;
                sprite.origin.y += sprite.panY;
                if (sprite.moveDuration > 0) {
                    var d = sprite.moveDuration;
                    sprite.opacity = (sprite.opacity * (d - 1) + sprite.planeTargetOpacity) / d;
                    sprite.moveDuration--;
                }
            }
        }
    };

    Sprite_Battler.prototype.updateScreenPicture = function(sprite) {
        if (sprite.moveDuration > 0) {
            var d = sprite.moveDuration;
            sprite.x = (sprite.x * (d - 1) + sprite.pictureTargetX) / d;
            sprite.x = (sprite.x * (d - 1) + sprite.pictureTargetY) / d;
            sprite.opacity = (sprite.opacity * (d - 1) + sprite.pictureTargetOpacity) / d;
            sprite.moveDuration--;
        }
        sprite.rotation += sprite.pictureSpin;
        sprite.opacity = sprite.pictureOpacity * this.opacity / 255;
    };

    Sprite_Battler.prototype.updateBattlerPicture = function(sprite) {
        sprite.rotation += sprite.pictureSpin;
        sprite.opacity = sprite.pictureOpacity * this.opacity / 255;
    };

    Sprite_Battler.prototype.updateBalloon = function() {
        if (this._balloonSprite) {
            var height = this._mainSprite ? this._mainSprite.height : this.height
            this._balloonSprite.y = -height + (height / 4);
            if (!this._balloonSprite.isPlaying()) {
                this.removeChild(this._balloonSprite);
                this._balloonSprite = null;
            }
        }
    };

    Sprite_Battler.prototype.updateTone = function() {
        if (this._toneDuration > 0) {
            var d = this._toneDuration;
            var tone = this._toneColor;
            var target = this._targetTone;
            for (var i = 0; i < 4; i++) {
                tone[i] = (tone[i] * (d - 1) + target[i]) / d;
            }
            if (this._mainSprite) {
                this._mainSprite.setColorTone(tone.clone());
            } else {
                this.setColorTone(tone.clone());
            }
            this._toneDuration--;
        }
    };

    Sprite_Battler.prototype.isSpriteJumping = function() {
        return this.isJumping() || this.isLeaping() || this.isFalling() || this.isFloating();
    };

    Sprite_Battler.prototype.isBalloonPlaying = function() {
        return !!this._balloonSprite;
    };

    Sprite_Battler.prototype.floatHeight = function() {
        return this._floatHeight;
    };

    Sprite_Battler.prototype.movementDuration = function() {
        return this._movementDuration;
    };

    Sprite_Battler.prototype.targetOffsetX = function() {
        return this._targetOffsetX;
    };

    Sprite_Battler.prototype.targetOffsetY = function() {
        return this._targetOffsetY;
    };

    Sprite_Battler.prototype.isJumping = function() {
        return this._jumpDuration > 0;
    };

    Sprite_Battler.prototype.isLeaping = function() {
        return this._leapDuration > 0;
    };

    Sprite_Battler.prototype.isFalling = function() {
        return this._fallDuration > 0;
    };

    Sprite_Battler.prototype.isFloating = function() {
        return this._floatDuration > 0;
    };

    Sprite_Battler.prototype.isOpacity = function() {
        return this._opacityDuration > 0;
    };

    Sprite_Battler.prototype.refreshMotion = function() {};

    //=============================================================================
    // Sprite_Actor
    //=============================================================================

    /* Overwritten function */
    Sprite_Actor.prototype.updateTargetPosition = function() {
        Sprite_Battler.prototype.updateTargetPosition.call(this);
    };

    /* Overwritten function */
    Sprite_Actor.prototype.startEntryMotion = function() {
        Sprite_Battler.prototype.processEntryMotion.call(this);
    };
	
	VictorEngine.BattleMotions.updateFrame = Sprite_Actor.prototype.updateFrame;
    Sprite_Actor.prototype.updateFrame = function() {
        this.updateBattlerDirection();
        VictorEngine.BattleMotions.updateFrame.call(this);
    };
	
    VictorEngine.BattleMotions.createMainSprite = Sprite_Actor.prototype.createMainSprite;
    Sprite_Actor.prototype.createMainSprite = function() {
        this._lowerPictureContainer = new Sprite();
        this._upperPictureContainer = new Sprite();
        this.addChild(this._lowerPictureContainer);
        VictorEngine.BattleMotions.createMainSprite.call(this);
        this.addChild(this._upperPictureContainer);
    };

    Sprite_Actor.prototype.isMotion = function() {
        return this._motion && !this._motion.loop;
    };

    Sprite_Actor.prototype.revertToNormal = function() {
        VictorEngine.BattleMotions.revertToNormal.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Actor.prototype.updateWhiten = function() {
        Sprite_Actor.prototype.revertToNormal.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Actor.prototype.updateBlink = function() {
        Sprite_Actor.prototype.updateBlink.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Actor.prototype.updateAppear = function() {
        Sprite_Actor.prototype.updateAppear.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Actor.prototype.updateDisappear = function() {
        Sprite_Actor.prototype.updateDisappear.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Actor.prototype.updateCollapse = function() {
        Sprite_Actor.prototype.updateCollapse.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Actor.prototype.updateBossCollapse = function() {
        Sprite_Actor.prototype.updateBossCollapse.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Actor.prototype.updateInstantCollapse = function() {
        Sprite_Actor.prototype.updateInstantCollapse.call(this);
        this._baseOpacity = this.opacity;
    };

    //=============================================================================
    // Sprite_Enemy
    //=============================================================================

    VictorEngine.BattleMotions.setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        var changed = battler !== this._enemy;
        VictorEngine.BattleMotions.setBattler.call(this, battler);
        if (changed) {
            this.startEntryMotion();
        }
    };

    VictorEngine.BattleMotions.updateStateSprite = Sprite_Enemy.prototype.updateStateSprite;
    Sprite_Enemy.prototype.updateStateSprite = function() {
        VictorEngine.BattleMotions.updateStateSprite.call(this);
        this._stateIconSprite.y -= Math.floor(this._floatHeight);
    };

    VictorEngine.BattleMotions.revertToNormal = Sprite_Enemy.prototype.revertToNormal;
    Sprite_Enemy.prototype.revertToNormal = function() {
        VictorEngine.BattleMotions.revertToNormal.call(this);
        this._baseOpacity = this.opacity;
    };

    VictorEngine.BattleMotions.updateWhiten = Sprite_Enemy.prototype.updateWhiten;
    Sprite_Enemy.prototype.updateWhiten = function() {
        VictorEngine.BattleMotions.updateWhiten.call(this);
        this._baseOpacity = this.opacity;
    };

    VictorEngine.BattleMotions.updateBlink = Sprite_Enemy.prototype.updateBlink;
    Sprite_Enemy.prototype.updateBlink = function() {
        VictorEngine.BattleMotions.updateBlink.call(this);
        this._baseOpacity = this.opacity;
    };

    VictorEngine.BattleMotions.updateAppear = Sprite_Enemy.prototype.updateAppear;
    Sprite_Enemy.prototype.updateAppear = function() {
        VictorEngine.BattleMotions.updateAppear.call(this);
        this._baseOpacity = this.opacity;
    };

    VictorEngine.BattleMotions.updateDisappear = Sprite_Enemy.prototype.updateDisappear;
    Sprite_Enemy.prototype.updateDisappear = function() {
        VictorEngine.BattleMotions.updateDisappear.call(this);
        this._baseOpacity = this.opacity;
    };

    VictorEngine.BattleMotions.updateCollapse = Sprite_Enemy.prototype.updateCollapse;
    Sprite_Enemy.prototype.updateCollapse = function() {
        VictorEngine.BattleMotions.updateCollapse.call(this);
        this._baseOpacity = this.opacity;
    };

    VictorEngine.BattleMotions.updateBossCollapse = Sprite_Enemy.prototype.updateBossCollapse;
    Sprite_Enemy.prototype.updateBossCollapse = function() {
        VictorEngine.BattleMotions.updateBossCollapse.call(this);
        this._baseOpacity = this.opacity
    };

    VictorEngine.BattleMotions.updateInstantCollapse = Sprite_Enemy.prototype.updateInstantCollapse;
    Sprite_Enemy.prototype.updateInstantCollapse = function() {
        VictorEngine.BattleMotions.updateInstantCollapse.call(this);
        this._baseOpacity = this.opacity;
    };

    Sprite_Enemy.prototype.startEntryMotion = function() {
        Sprite_Battler.prototype.processEntryMotion.call(this);
    };

    Sprite_Enemy.prototype.isMotion = function() {
        return false;
    };

    //=============================================================================
    // Spriteset_Battle
    //=============================================================================

    VictorEngine.BattleMotions.updateSpritesetBattle = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        VictorEngine.BattleMotions.updateSpritesetBattle.call(this);
        this.sortBattleSprites();
    };

    // VictorEngine.BattleMotions.createBattleback = Spriteset_Battle.prototype.createBattleback;
    // Spriteset_Battle.prototype.createBattleback = function() {
        // VictorEngine.BattleMotions.createBattleback.call(this);
        // this.createPlaneContainers();
        // this.createPictureContainers();
    // };

    // VictorEngine.BattleMotions.createToneChanger = Spriteset_Battle.prototype.createToneChanger;
    // Spriteset_Battle.prototype.createToneChanger = function() {
        // VictorEngine.BattleMotions.createToneChanger.call(this);
        // this.createBattleToneChanger();
    // };

    // VictorEngine.BattleMotions.updateToneChanger = Spriteset_Battle.prototype.updateToneChanger;
    // Spriteset_Battle.prototype.updateToneChanger = function() {
        // VictorEngine.BattleMotions.updateToneChanger.call(this);
        // this.updateBattleTone();
    // };

    // Spriteset_Battle.prototype.createBattleToneChanger = function() {
        // $gameScreen.clarBattleTone();
        // this._lowerTone = [0, 0, 0, 0];
        // this._upperTone = [0, 0, 0, 0];
        // if (Graphics.isWebGL()) {
            // this.createLowerWebGLToneChanger();
            // this.createUpperWebGLToneChanger();
        // } else {
            // this.createLowerCanvasToneChanger();
            // this.createUpperCanvasToneChanger();
        // }
    // };

    // Spriteset_Battle.prototype.createLowerWebGLToneChanger = function() {
        // var margin = 48;
        // var width = Graphics.width + margin * 2;
        // var height = Graphics.height + margin * 2;
        // this._lowerToneFilter = new ToneFilter();
        // this._back1Sprite.filters = [this._lowerToneFilter];
        // this._back2Sprite.filters = [this._lowerToneFilter];
    // };

    // Spriteset_Battle.prototype.createLowerCanvasToneChanger = function() {
        // this._lowerToneSprite = new ToneSprite();
        // this._lowerToneSprite.spriteId = this._lowerToneSprite.spriteId || Sprite._counter++;
        // this._lowerToneSprite.z = 2;
        // this._battleField.addChild(this._lowerToneSprite);
    // };

    // Spriteset_Battle.prototype.createUpperWebGLToneChanger = function() {
        // var margin = 0;
        // var width = Graphics.width + margin * 2;
        // var height = Graphics.height + margin * 2;
        // this._upperToneFilter = new ToneFilter();
        // this.filters = [this._upperToneFilter];
        // this.filterArea = new Rectangle(-margin, -margin, width, height);
    // };

    // Spriteset_Battle.prototype.createUpperCanvasToneChanger = function() {
        // this._upperToneSprite = new ToneSprite();
        // this._upperToneSprite.spriteId = this._upperToneSprite.spriteId || Sprite._counter++;
        // this._upperToneSprite.z = 10;
        // this._battleField.addChild(this._upperToneSprite);
    // };

    // Spriteset_Battle.prototype.createPlaneContainers = function() {
        // this._lowerPlaneContainer = new Sprite();
        // this._upperPlaneContainer = new Sprite();
        // this._lowerPlaneContainer.z = 2;
        // this._upperPlaneContainer.z = 9;
        // this._battleField.addChild(this._lowerPlaneContainer);
        // this._battleField.addChild(this._upperPlaneContainer);
    // };

    // Spriteset_Battle.prototype.createPictureContainers = function() {
        // this._lowerPictureContainer = new Sprite();
        // this._upperPictureContainer = new Sprite();
        // this._lowerPictureContainer.z = 2;
        // this._upperPictureContainer.z = 9;
        // this._battleField.addChild(this._lowerPictureContainer);
        // this._battleField.addChild(this._upperPictureContainer);
    // };

    // Spriteset_Battle.prototype.updateBattleTone = function() {
        // this.updateLowerTone();
        // this.updateUpperTone();
    // };

    // Spriteset_Battle.prototype.updateLowerTone = function() {
        // var tone = $gameScreen.lowerTone();
        // if (!this._lowerTone.equals(tone)) {
            // this._lowerTone = tone.clone();
            // this.updateLowerToneChanger();
        // }
    // };

    // Spriteset_Battle.prototype.updateUpperTone = function() {
        // var tone = $gameScreen.upperTone();
        // if (!this._upperTone.equals(tone)) {
            // this._upperTone = tone.clone();
            // this.updateUpperToneChanger();
        // }
    // };

    // Spriteset_Battle.prototype.updateLowerToneChanger = function() {
        // if (Graphics.isWebGL()) {
            // this.updateLowerWebGLToneChanger();
        // } else {
            // this.updateLowerCanvasToneChanger();
        // }
    // };

    // Spriteset_Battle.prototype.updateLowerWebGLToneChanger = function() {
        // var tone = this._lowerTone;
        // this._lowerToneFilter.reset();
        // this._lowerToneFilter.adjustTone(tone[0], tone[1], tone[2]);
        // this._lowerToneFilter.adjustSaturation(-tone[3]);
    // };

    // Spriteset_Battle.prototype.updateLowerCanvasToneChanger = function() {
        // var tone = this._lowerTone;
        // this._lowerToneSprite.setTone(tone[0], tone[1], tone[2], tone[3]);
    // };

    // Spriteset_Battle.prototype.updateUpperToneChanger = function() {
        // if (Graphics.isWebGL()) {
            // this.updateUpperWebGLToneChanger();
        // } else {
            // this.updateUpperCanvasToneChanger();
        // }
    // };

    // Spriteset_Battle.prototype.updateUpperWebGLToneChanger = function() {
        // var tone = this._upperTone;
        // this._upperToneFilter.reset();
        // this._upperToneFilter.adjustTone(tone[0], tone[1], tone[2]);
        // this._upperToneFilter.adjustSaturation(-tone[3]);
    // };

    // Spriteset_Battle.prototype.updateUpperCanvasToneChanger = function() {
        // var tone = this._upperTone;
        // this._upperToneSprite.setTone(tone[0], tone[1], tone[2], tone[3]);
    // };

    // Spriteset_Battle.prototype.addScreenPicture = function(above, sprite) {
        // if (above) {
            // this._upperPictureContainer.addChild(sprite);
        // } else {
            // this._lowerPictureContainer.addChild(sprite);
        // }
    // };

    // Spriteset_Battle.prototype.removeScreenPicture = function(sprite) {
        // this._lowerPictureContainer.removeChild(sprite);
        // this._upperPictureContainer.removeChild(sprite);
    // };

    // Spriteset_Battle.prototype.addScreenPlane = function(above, sprite) {
        // if (above) {
            // this._upperPlaneContainer.addChild(sprite);
        // } else {
            // this._lowerPlaneContainer.addChild(sprite);
        // }
    // };

    // Spriteset_Battle.prototype.removeScreenPlane = function(sprite) {
        // this._lowerPlaneContainer.removeChild(sprite);
        // this._upperPlaneContainer.removeChild(sprite);
    // };

    // Spriteset_Battle.prototype.changeBattleback = function(back1, back2) {
        // this._back1Sprite.bitmap = ImageManager.loadBattleback1(back1);
        // this._back2Sprite.bitmap = ImageManager.loadBattleback2(back2);
        // this._back1Sprite.bitmap.addLoadListener(this.changeLocateBattleback.bind(this, 'battleback1'));
        // this._back2Sprite.bitmap.addLoadListener(this.changeLocateBattleback.bind(this, 'battleback2'));
    // };

    // Spriteset_Battle.prototype.changeLocateBattleback = function(change) {
        // if (change === 'battleback1') {
            // this._changeLocateBattleback1 = true;
        // }
        // if (change === 'battleback2') {
            // this._changeLocateBattleback2 = true;
        // }
        // if (this._changeLocateBattleback1 && this._changeLocateBattleback2) {
            // this._changeLocateBattleback1 = false;
            // this._changeLocateBattleback1 = false;
            // this.locateBattleback();
        // }
    // };

    // Spriteset_Battle.prototype.battleback1BitmapName = function() {
        // var url = this._back1Sprite.bitmap.url;
        // return url.substring(url.lastIndexOf('/') + 1, url.indexOf('.png'));
    // };

    // Spriteset_Battle.prototype.battleback2BitmapName = function() {
        // var url = this._back2Sprite.bitmap.url;
        // return url.substring(url.lastIndexOf('/') + 1, url.indexOf('.png'));
    // };

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    /* Overwritten function */
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        var index = VictorEngine.battlerIndex(subject);
		var item = action.item();
		this.setupCurrentAction(action, targets, index);
        var current = this.currentAction(index);
        this.push('performActionStart', subject, current.action);
        this.displayAction(subject, item);
        this.push('performAction', subject, current.action, current.targets);
    };

    /* Overwritten function */
    Window_BattleLog.prototype.performAction = function(subject, action, targets) {
        var index = VictorEngine.battlerIndex(subject);
        this.insert(index, 'performMotion', 'execute', subject, action, targets);
    };

    /* Overwritten function */
    Window_BattleLog.prototype.setupStartAction = function(subject, action, targets) {};
	
    VictorEngine.BattleMotions.initialize = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function() {
        this.initializeMethodsStack();
        VictorEngine.BattleMotions.initialize.call(this);
    };

    VictorEngine.BattleMotions.initializeMethodsStack = Window_BattleLog.prototype.initializeMethodsStack;
    Window_BattleLog.prototype.initializeMethodsStack = function() {
        VictorEngine.BattleMotions.initializeMethodsStack.call(this);
        this._skipUntilEnd = [];
        this._conditionMet = [];
        this._skipUntilElse = [];
		this._actionTargets = [];
		this._currentAction = [];
		this._stackWaitSubjects = [];
    };

    VictorEngine.BattleMotions.push = Window_BattleLog.prototype.push;
    Window_BattleLog.prototype.push = function(methodName) {
        if (this._stackIndex || this.methodStackActive()) {
            this.pushMethodsStack.apply(this, arguments);
        } else {
            VictorEngine.BattleMotions.push.apply(this, arguments);
        }
    };

    VictorEngine.BattleMotions.updateWindowBattleLog = Window_BattleLog.prototype.update;
    Window_BattleLog.prototype.update = function() {
        this.updateBattlerMotions();
        if (this.methodStackActive()) {
            this.updateMethodsStack();
        } else {
            VictorEngine.BattleMotions.updateWindowBattleLog.call(this);
        }
    };

    VictorEngine.BattleMotions.isBusy = Window_BattleLog.prototype.isBusy;
    Window_BattleLog.prototype.isBusy = function() {
        return VictorEngine.BattleMotions.isBusy.call(this) || this.methodStackActive();
    };

    VictorEngine.BattleMotions.updateWait = Window_BattleLog.prototype.updateWait;
    Window_BattleLog.prototype.updateWait = function() {
        return VictorEngine.BattleMotions.updateWait.call(this) || this.methodStackActive();
    };

    VictorEngine.BattleMotions.performActionStart = Window_BattleLog.prototype.performActionStart;
    Window_BattleLog.prototype.performActionStart = function(subject, action) {
        VictorEngine.BattleMotions.performActionStart.call(this, subject, action);
        var index = VictorEngine.battlerIndex(subject);
        var current = this.currentAction(index);
        this.insert(index, 'performMotion', 'movement', subject, action, current.targets);
        this.insert(index, 'performMotion', 'prepare', subject, action, current.targets);
    };

    VictorEngine.BattleMotions.performActionEnd = Window_BattleLog.prototype.performActionEnd;
    Window_BattleLog.prototype.performActionEnd = function(subject) {
        VictorEngine.BattleMotions.performActionEnd.call(this, subject);
        var index = VictorEngine.battlerIndex(subject);
        var current = this.currentAction(index);
		this.insert(index, 'performMotion', 'clear', subject, current.action, current.targets);
		this.insert(index, 'performMotion', 'return', subject, current.action, current.targets);
		this.insert(index, 'performMotion', 'finish', subject, current.action, current.targets);
    };

    VictorEngine.BattleMotions.updateStackWaitMode = Window_BattleLog.prototype.updateStackWaitMode;
    Window_BattleLog.prototype.updateStackWaitMode = function(index) {
        var waitMode = this._stackWaitMode[index] || [];
        var subjects = this.stackWaitSubjects(index, waitMode);
        if (this.isSpriteWaiting(index, waitMode, subjects)) {
            return true;
        } else {
            return VictorEngine.BattleMotions.updateStackWaitMode.call(this, index);
        }
    };

    VictorEngine.BattleMotions.startEscape = Window_BattleLog.prototype.startEscape;
    Window_BattleLog.prototype.startEscape = function(subject, action) {
        VictorEngine.BattleMotions.startEscape.call(this, subject, action)
		var index = VictorEngine.battlerIndex(subject);
        this.setupCurrentAction(action, [], index);
    };

	
    Window_BattleLog.prototype.currentAction = function(index) {
		return this._currentAction[index] || this._defaultAction;
    };
	
    Window_BattleLog.prototype.currentActionClear = function(index) {
		this._defaultAction = null;
		this._currentAction[index] = null;
    };
	
    Window_BattleLog.prototype.updateStackAction = function(index, subject, target, rate) {
        BattleManager.updateStackAction(index, subject, target, rate);
    };

    Window_BattleLog.prototype.updateBattlerMotions = function(subject, action, targets) {
        var battlers = BattleManager.allBattleMembers();
        for (var i = 0; i < battlers.length; i++) {
            var battler = battlers[i];
            if (battler.actionMontionRequested()) {
                this.processActionMotion(battler);
            }
        }
    };

    Window_BattleLog.prototype.processActionMotion = function(subject) {
        var motion = subject.updateActionMontion();
        if (motion) {
            var index = VictorEngine.battlerIndex(subject);
            var current = this.currentAction(index);
            var action = current ? current.action : null;
            this.performMotion(motion.name, subject, action, [], null, motion.push);
        }
    };

    Window_BattleLog.prototype.setupCurrentAction = function(action, targets, index) {
        var unique = this.uniqueTargets(targets);
        var targets = unique.map(function(object) {
            return object.target;
        });
		var current = {
            action: action,
            targets: targets,
            unique: unique
        };
		this._defaultAction = current;
        this._currentAction[index] = current;
    };

    Window_BattleLog.prototype.stackWaitSubjects = function(index, waitMode) {
        var subjects = this._stackWaitSubjects;
        return (subjects[index] && subjects[index][waitMode]) ? subjects[index][waitMode] : [];
    };

    Window_BattleLog.prototype.isSpriteWaiting = function(index, waitMode, subjects) {
        return (this.isWaiting(index, waitMode, subjects, 'movie', '') ||
            this.isWaiting(index, waitMode, subjects, 'event', '') ||
            this.isWaiting(index, waitMode, subjects, 'move', 'isSpriteMoving') ||
            this.isWaiting(index, waitMode, subjects, 'jump', 'isSpriteJumping') ||
            this.isWaiting(index, waitMode, subjects, 'action', 'isStackActive') ||
            this.isWaiting(index, waitMode, subjects, 'motion', 'isSpriteMotion') ||
            this.isWaiting(index, waitMode, subjects, 'popup', 'isSpritPopuping') ||
            this.isWaiting(index, waitMode, subjects, 'throw', 'isSpriteThrowing') ||
            this.isWaiting(index, waitMode, subjects, 'balloon', 'isBalloonPlaying') ||
            this.isWaiting(index, waitMode, subjects, 'home', 'notIinHomePosition') ||
            this.isWaiting(index, waitMode, subjects, 'animation', 'isSpriteAnimation') ||
            this.isWaiting(index, waitMode, subjects, 'effecting', 'isSpriteEffecting'));
    };

    Window_BattleLog.prototype.isWaiting = function(index, waitMode, subjects, type, method) {
        if (waitMode.contains(type)) {
            var waiting = false;
            if (type === 'movie') {
                waiting = Graphics.isVideoPlaying();
            } else if (type === 'event') {
                if (this._setupUpdateEventFrame !== Graphics.frameCount) {
                    waiting = BattleManager.updateEventMain();
                    this._setupUpdateEventFrame = Graphics.frameCount;
                } else {
                    waiting = true;
                }
            } else if (type === 'action') {
                waiting = subjects.targets.some(function(subject) {
                    return subject !== subjects.user && this[method](subject);
                }, this);
            } else if (method) {
                waiting = subjects.targets.some(function(subject) {
                    return subject[method] ? subject[method]() : false;
                }, this);
            }
            if (waiting) {
                return true;
            } else {
                this.removeWaitMode(index, type);
            }
        }
        return false
    };

    Window_BattleLog.prototype.isStackActive = function(subject) {

        var index = VictorEngine.battlerIndex(subject);
        return this._methodsStack[index] && this._methodsStack[index].length > 0;

    };

    VictorEngine.BattleMotions.setStackWaitMode = Window_BattleLog.prototype.setStackWaitMode;
    Window_BattleLog.prototype.setStackWaitMode = function(index, waitMode, subjects) {
        VictorEngine.BattleMotions.setStackWaitMode.call(this, index, waitMode)
        this._stackWaitSubjects[index] = this._stackWaitSubjects[index] || {};
        this._stackWaitSubjects[index][waitMode] = subjects;
    };

    VictorEngine.BattleMotions.removeWaitMode = Window_BattleLog.prototype.removeWaitMode;
    Window_BattleLog.prototype.removeWaitMode = function(index, waitMode) {
        VictorEngine.BattleMotions.removeWaitMode.call(this, index, waitMode)
        this._stackWaitSubjects[index] = this._stackWaitSubjects[index] || {};
        this._stackWaitSubjects[index][waitMode] = null;
    };

    Window_BattleLog.prototype.insert = function(index, methodName) {
        var methodArgs = Array.prototype.slice.call(arguments, 2);
        if (methodName === 'wait') {
            methodName = 'stackWait';
            methodArgs.unshift(index);
        } else if (methodName === 'waitForTime') {
            methodName = 'stackWaitForTime';
            methodArgs.unshift(index);
        } else if (methodName === 'waitForBattleAnimation') {
            methodName = 'stackWaitFoAnimation';
            methodArgs.unshift(index);
        } else if (methodName === 'updateWaitMode') {
            methodName = 'updateStackWaitMode';
            methodArgs.unshift(index);
        } else if (methodName === 'setWaitMode') {
            methodName = 'setStackWaitMode';
            methodArgs.unshift(index);
        }
        this._methodsStack[index] = this._methodsStack[index] || [];
        this._methodsStack[index].splice(0, 0, {
            name: methodName,
            params: methodArgs
        });
    };

    Window_BattleLog.prototype.performMotion = function(name, subject, action, targets, target, push) {
        var index;
        var length = $gameParty.maxBattleMembers() + $gameTroop.members().length;
        index = VictorEngine.battlerIndex(target || subject);
        index = ['damage', 'entry', 'escape'].contains(name) ? index + length : index;
        var motions = this.motionValues(name, subject, action, targets, push);
        this._stackIndex = index;
        for (var i = 0; i < motions.length; i++) {
            if (push) {
                this.push('processMotion', motions[i], index, subject, action, targets, target);
            } else {
                this.insert(index, 'processMotion', motions[i], index, subject, action, targets, target);
            }
        }
        this._stackIndex = 0;
    };

    Window_BattleLog.prototype.motionValues = function(name, subject, action, targets, push) {
        var motions = this.setMotionValues(name, subject, action);
        switch (name) {
            case 'prepare':
                motions = 'prepare action; wait: all targets, move;' + motions;
                break;
            case 'finish':
                motions = motions + '; finish action;';
                break;
            case 'clear':
                motions = 'clear action;' + motions;
                break;
            case 'return':
                motions = (subject.inHomePosition() || !subject.canMove()) ? '' : motions;
                break;
            case 'evasion':
            case 'magic evasion':
            case 'damage':
                motions = motions + '; flag: user, remove, damage;';
                break;
        }
        motions = motions + '; wait: subject, 1;';
        return this.setupMotion(motions, push);
    };

    Window_BattleLog.prototype.setupMotion = function(motions, push) {
        var match;
        var list = [];
        var regex = new RegExp('([\\w ]+\\w)(?:[ ]*:[ ]*([\\s\\S]*?)[ ]*(?:;|\n|\r|$))?', 'gi');
        while (match = regex.exec(motions)) {
            list.push({
                name: match[1].toLowerCase().trim(),
                value: match[2] || ''
            });
        };
        return push ? list : list.reverse();
    };

    Window_BattleLog.prototype.setMotionValues = function(name, subject, action) {
        var motion = '';
        if (name === 'action' && subject.isStaticBattler()) {
            motion += 'wait: user, 8;';
            motion += 'whiten: user;';
            motion += 'wait: user, effecting;';
        }
        if (name !== 'movement' || !subject.noActionMovement()) {
            motion += this.actionMotion(name, subject, action);
        }
        return motion;
    };

    Window_BattleLog.prototype.actionMotion = function(name, subject, action) {
        var motion = action && action.item() && action.item().battleMotions;
        var result = motion ? action.item().battleMotions[name] : '';
        result = result || subject.battleMotions(name);
        result = result || this.defaultMotion(name, subject, action);
        return result;
    };

    Window_BattleLog.prototype.defaultMotion = function(name, subject, action) {
        var name = VictorEngine.captalizeText(name).replace(/\s+/g, '');
        var process = this['defaultMotion' + name];
        return process ? process.call(this, subject, action) : '';
    };

    Window_BattleLog.prototype.defaultMotionMovement = function(subject, action) {
        var motion = '';
        if (action && !action.isGuard()) {
            if (action.isStepForward()) {
                motion += 'motion: user, walk;';
                motion += 'move: user, forward, 30, 48;';
            } else {
                motion += 'direction: user, targets;';
                motion += 'motion: user, walk;';
                motion += 'move: user, to target, 12, front;';
            }
            motion += 'wait: user, move;';
            motion += 'motion: user, reset;';
        }
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionExecute = function(subject, action) {
        var motion = '';
        motion += 'motion: user, action;';
        motion += 'wait: user, 8;';
        motion += 'action: all targets, effect;';
        motion += 'wait: all targets, action;';
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionEffect = function(subject, action) {
        var motion = '';
        motion += 'animation: subject, action;';
        motion += 'wait: subject, animation;';
        motion += 'effect: subject, 100%;';
        motion += 'wait: subject, popup;';
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionReturn = function(subject, action) {
        var motion = '';
        motion += 'motion: user, return;';
        motion += 'move: user, to home, 12;';
        motion += 'wait: user, move;';
        motion += 'motion: user, reset;';
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionFinish = function(subject, action) {
        return 'wait: all targets, action;';
    };

    Window_BattleLog.prototype.defaultMotionClear = function(subject, action) {
        return 'wait: all targets, action;';
    };

    Window_BattleLog.prototype.defaultMotionInputing = function(subject, action) {
        var motion = '';
        motion += 'wait: subject, move;';
        motion += 'motion: subject, walk;';
        motion += 'move: subject, forward, 30, 48;';
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionInputed = function(subject, action) {
        var motion = '';
        motion += 'wait: subject, move;';
        motion += 'motion: subject, return;';
        motion += 'move: subject, to home, 30;';
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionEvasion = function(subject, action) {
        var motion = '';
        if (!subject.isStaticBattler()) {
            motion += 'motion: subject, evade;';
            motion += 'wait: subject, 24;'
        }
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionMagicEvasion = function(subject, action) {
        var motion = '';
        if (!subject.isStaticBattler()) {
            motion += 'motion: subject, evade;';
            motion += 'wait: subject, 24;'
        }
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionDamage = function(subject, action) {
        var motion = '';
        if (!subject.isStaticBattler()) {
            motion += 'motion: subject, damage;';
            motion += 'move: subject, backward, 30, 24;'
            motion += 'wait: subject, move;';
            motion += 'pose: subject, damage, 2;';
            motion += 'wait: subject, 24;'
            motion += 'pose: subject, clear;'
            motion += 'motion: subject, walk;';
            motion += 'move: subject, forward, 30, 24;';
            motion += 'wait: subject, move;'
        }
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionEntry = function(subject, action) {
        var motion = '';
        if (!subject.isStaticBattler() && subject.isActor()) {
            motion += 'move: subject, backward, 0, 300;';
            motion += 'motion: subject, walk;';
            motion += 'move: subject, to home, 12;';
            motion += 'wait: subject, move;';
        } else {
            motion += 'motion: subject, reset;';
        }
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionVictory = function(subject, action) {
        var motion = '';
        if (!subject.isStaticBattler() && subject.isActor()) {
            motion += 'wait: all battlers, move;';
            motion += 'motion: subject, victory;';
        }
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionEscapeSuccess = function(subject, action) {
        var motion = '';
        motion += 'wait: all battlers, move;';
        motion += 'motion: subject, escape;';
        motion += 'move: subject, backward, 12, 600;';
        motion += 'battlestatus: hide;'
        motion += 'wait: subject, move;';
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionEscapeFail = function(subject, action) {
        var motion = '';
        motion += 'wait: all battlers, move;';
        motion += 'motion: subject, escape;';
        motion += 'wait: subject, 40;';
        return motion;
    };

    Window_BattleLog.prototype.defaultMotionRefresh = function(subject, action) {
        var motion = '';
        motion += 'motion: subject, reset;';
        return motion;
    };

    Window_BattleLog.prototype.processMotion = function(motion, index) {
        var motionArgs = [motion.value].concat(Array.prototype.slice.call(arguments, 1));
        if (this._conditionMet[index] && ['else', 'else if'].contains(motion.name)) {
            this._skipUntilEnd[index] = true;
            return;
        }
        if ((this._skipUntilElse[index] && !['else', 'else if', 'end'].contains(motion.name)) ||
            (this._skipUntilEnd[index] && motion.name !== 'end')) {
            return;
        }
        var name = VictorEngine.captalizeText(motion.name).replace(/\s+/g, '');
        var process = this['processMotion' + name];
        if (name && process) {
            process.apply(this, motionArgs);
        }
    };

    Window_BattleLog.prototype.processMotionPrepareAction = function(motion, index, user, action, targets, target) {
        user.startBattleMotion();
        [user].concat(targets).forEach(function(battler) {
            return user.prepareAction(VictorEngine.battlerIndex(battler));
        }, this);
    };

    Window_BattleLog.prototype.processMotionFinishAction = function(motion, index, user, action, targets, target) {
        user.clearActionTargets();
        BattleManager.allBattleMembers().forEach(function(subject) {
            this.processMotionDeath(subject);
        }, this);
    };

    Window_BattleLog.prototype.processMotionClearAction = function(motion, index, user, action, targets, target) {
        user.endBattleMotion();
        this.currentActionClear(index);
        this._actionTargets[index] = null;
    };

    Window_BattleLog.prototype.processMotionMotion = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var value = list[1] ? list[1].toLowerCase().trim() : '';
        var motion = value.match(/\d+/gi);
        var frames = Number(list[2]) || 0;
        var speed = Number(list[3]) || 0;
        var loop = list[list.length - 1].toLowerCase().trim();
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                if (value === 'action') {
                    subject.performAction(action);
                } else if (value === 'attack') {
                    subject.performAttack();
                } else if (value === 'reset') {
                    subject.requestMotionRefresh()
                } else if (value === 'move') {
                    subject.requestMotionMove()
                } else if (motion) {
                    subject.requestCustomMotion(motion, speed, frames, loop)
                } else {
                    subject.requestMotion(value);
                }
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionPose = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var value = list[1] ? list[1].toLowerCase().trim() : '';
        var frame = Math.max((Number(list[2]) - 1) || 0, 0);
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                if (value === 'clear') {
                    subject.clearMotionPose();
                } else {
                    subject.requestMotionPose(value, frame);
                }
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionTarget = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var subject = this.getMotionSubjects(list[0], user, targets, target, index)[0];
        this._actionTargets[index] = subject;
    };

    Window_BattleLog.prototype.processMotionEffect = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        if (list[1]) {
            var match = (/^(\d+)%?$/gi).exec(list[1].trim());
            if (match) {
                var value = Number(match[1]) / 100;
            } else {
                var code = Array.prototype.slice.call(list, 1).join(',');
                var value = Number(eval(code)) / 100;
            }
        } else {
            var value = 1;
        }
        var current = this.currentAction(index);
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            if (current) {
                var subject = subjects[i];
                var repeats = this.uniqueRepeats(current.unique, subject);
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                for (var j = 0; j < repeats; j++) {
                    this.insert(index, 'waitForTime', 1);
                    this.insert(stack, 'updateStackAction', stack, user, subject, value);
                }
            }
        };
    };

    Window_BattleLog.prototype.processMotionElement = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
		var current = this.currentAction(index);
		if (current && current.action) {
			var action = current.action;
			if (list[0].toLowerCase().trim() === 'clear') {
				action.clearActionElements();
			} else {
				action.setActionElements(list);
			}
		}
    };

    Window_BattleLog.prototype.processMotionFormula = function(motion, index, user, action, targets, target) {
		var current = this.currentAction(index);
		if (current && current.action) {
			var action = current.action;
			if (motion.trim().toLowerCase().trim() === 'clear') {
				action.clearActionFormula();
			} else {
				action.setActionFormula(motion);
			}
		}
    };

    Window_BattleLog.prototype.processMotionWait = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var value = list[1] ? list[1].toLowerCase().trim() : '';
        var match1 = value.match(/\d+/gi);
        var match2 = value.match(/\D+/gi);
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        if (match1) {
            this.insert(index, 'waitForTime', Number(value));
        }
        if (match2) {
            this.insert(index, 'setWaitMode', value, {
                user: target || user,
                targets: subjects.clone()
            });
        }
    };

    Window_BattleLog.prototype.processMotionMove = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var move = list[1] ? list[1].toLowerCase().trim() : '';
        var duration = Number(list[2]) || 0;
        var value1 = list[3] ? list[3].toLowerCase().trim() : '';
        var value2 = Number(list[4]) || 0;
        var value3 = Number(list[5]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                var name = VictorEngine.captalizeText(move).replace(/\s+/g, '');
                var process = this['processMove' + name];
                if (process) {
                    process.call(this, subject, targets, duration, value1, value2, value3);
                } else {
                    var moveTargets = this.getMotionSubjects(move, user, targets, target, index);
                    this.processMoveToTarget(subject, moveTargets, duration, value1, value2, value3);
                }
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionJump = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var move = list[2] && list[2].toLowerCase().trim() === 'movement';
        var height = Number(list[1]) || 0;
        var duration = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                subject.requestJumpMotion(height, duration, move);
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionLeap = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var move = list[2] && list[2].toLowerCase().trim() === 'movement';
        var height = Number(list[1]) || 0;
        var duration = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                subject.requestLeapMotion(height, duration, move);
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionFall = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var move = list[2] && list[2].toLowerCase().trim() === 'movement';
        var ground = list[1] && list[1].toLowerCase().trim() === 'to ground';
        var height = Number(list[1]) || 0;
        var duration = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                subject.requestFallMotion(height, duration, move, ground);
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionFloat = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var move = list[1] && list[2].toLowerCase().trim() === 'movement';
        var height = Number(list[1]) || 0;
        var duration = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                subject.requestFloatMotion(height, duration, move);
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionOpacity = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var move = list[1] && list[2].toLowerCase().trim() === 'movement';
        var opacity = Number(list[1]) || 0;
        var duration = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                subject.requestOpacityMotion(opacity, duration, move);
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionDirection = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var direction = list[1] ? list[1].toLowerCase().trim() : '';
        var positionX = Number(list[1]) || 0;
        var positionY = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.isSpriteVisible()) {
                switch (direction) {
                    case 'left':
                        subject.turnLeft();
                        break;
                    case 'right':
                        subject.turnRight();
                        break;
                    case 'behind':
                        subject.turnBack();
                        break;
                    case 'opponents':
                        subject.turnTowardOpponents();
                        break;
                    case 'home':
                        subject.turnTowardPosition(subject.homeX(), subject.homeY());
                        break;
                    case 'targets':
                        var positionX = targets.reduce(function(r, member) {
                            return r + member.screenX();
                        }, 0) / targets.length;
                        var positionY = targets.reduce(function(r, member) {
                            return r + member.screenX();
                        }, 0) / targets.length;
                        subject.turnTowardPosition(positionX, positionY);
                        break;
                }
                if (positionX || positionY) {
                    subject.turnTowardPosition(positionX, positionY);
                }
            }
        }
    };

    Window_BattleLog.prototype.processMotionAnimation = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[1] ? list[1].toLowerCase().trim() : '';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i]
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                if (type === 'action') {
                    var animationId = action.item().animationId;
                } else if (type === 'weapon') {
                    var animationId = -1;
                } else {
                    var match = type.match(/\d+/gi);
                    var animationId = match ? Number(match[0]) : 0;
                }
                if (animationId) {
                    this.showAnimation(user, [subject], animationId);
                }
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionAction = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var name = list[1] ? list[1].toLowerCase().trim() : '';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        this.insert(index, 'waitForTime', 1);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i]
            var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
            this.performMotion(name, user, action, targets, subject);
        }
    };

    Window_BattleLog.prototype.processMotionIcon = function(motion, index, user, action, targets, target) {
        var icon = 0;
        var list = motion.split(',');
        var type = list[1] ? list[1].toLowerCase().trim() : '';
        var id = Number(list[2]) || 0;
        var offsetX = Number(list[3]) || 0;
        var offsetY = Number(list[4]) || 0;
        var opacity = Number(list[5]) || (Number(list[5]) === 0 ? 0 : 255);
        var angle = Number(list[6]) || 0;
        var spin = Number(list[7]) || 0;
        var above = list[list.length - 1].toLowerCase().trim() === 'above';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i]
            if (subject.isSpriteVisible()) {
                var match1 = (/icon (\d+)/gi).exec(type);
                var match2 = (/equip (\d+)/gi).exec(type);
                var equip = subject.isActor() || Imported['VE - Battler Graphic Setup'];
                if (match1) {
                    icon = Number(match1[1]);
                }
                if (match2 && equip) {
                    var item = subject.equips()[Number(match2[1]) - 1]
                    icon = item ? item.iconIndex : 0;
                }
                if (type === 'shield' && equip) {
                    var item = subject.equips()[1];
                    icon = DataManager.isArmor(item) ? item.iconIndex : 0;
                }
                if (type === 'action') {
                    icon = action.item().iconIndex;
                }
                if (type === 'clear') {
                    icon = 0;
                }
                subject.requestIconMotion(icon, id, offsetX, offsetY, opacity, angle, spin, above);
            }
        }
    };

    Window_BattleLog.prototype.processMotionWeapon = function(motion, index, user, action, targets, target) {
        var weapon = 0;
        var list = motion.split(',');
        var frame = list[1] && list[1].toLowerCase().trim() === 'clear' ? 0 : (Number(list[1]) || 0);
        var id = Number(list[2]) || 0;
        var offsetX = Number(list[3]) || 0;
        var offsetY = Number(list[4]) || 0;
        var opacity = Number(list[5]) || (Number(list[5]) === 0 ? 0 : 255);
        var angle = Number(list[6]) || 0;
        var spin = Number(list[7]) || 0;
        var above = list[list.length - 1].toLowerCase().trim() === 'above';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i]
            if (subject.isSpriteVisible()) {
                var equip = subject.isActor() || Imported['VE - Battler Graphic Setup'];
                if (equip) {
                    var weapons = subject.equips();
                    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
                    var attackMotion = $dataSystem.attackMotions[wtypeId];
                    weapon = attackMotion ? attackMotion.weaponImageId : 0;
                }
                subject.requestWeaponMotion(weapon, frame, id, offsetX, offsetY, opacity, angle, spin, above);
            }
        }
    };

    Window_BattleLog.prototype.processMotionBalloon = function(motion, index, user, action, targets, target) {
        var weapon = 0;
        var list = motion.split(',');
        var id = Number(list[1]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i]
            if (subject.isSpriteVisible()) {
                subject.requestBalloonMotion(id);
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionPicture = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        var name = list[1] && list[1].toLowerCase().trim() === 'clear' ? '' : list[1].trim();
        var id = Number(list[2]) || 0;
        var offsetX = Number(list[3]) || 0;
        var offsetY = Number(list[4]) || 0;
        var opacity = Number(list[5]) || (Number(list[5]) === 0 ? 0 : 255);
        var angle = Number(list[6]) || 0;
        var spin = Number(list[7]) || 0;
        var above = list[list.length - 1].toLowerCase().trim() === 'above';
        if (type === 'screen') {
            if (list[1] && list[1].toLowerCase().trim() === 'move') {
                user.requestMovePictureMotion(id, offsetX, offsetY, opacity, angle);
            } else {
                user.requestPictureMotion(type, name, id, offsetX, offsetY, opacity, angle, spin, above);
            }
        } else {
            var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
            for (var i = 0; i < subjects.length; i++) {
                var subject = subjects[i];
                if (subject.isSpriteVisible()) {
                    subject.requestPictureMotion(type, name, id, offsetX, offsetY, opacity, angle, spin, above);
                }
            }
        }
    };

    Window_BattleLog.prototype.processMotionPlane = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        if (type === 'move') {
            var id = Number(list[1]) || 0;
            var panX = Number(list[2]) || 0;
            var panY = Number(list[3]) || 0;
            var opacity = Number(list[4]) || 0;
            var duration = Number(list[5]) || 0;
            user.requestMovePlaneMotion(id, panX, panY, opacity, duration);
        } else {
            var name = type === 'clear' ? '' : list[0].trim();
            var id = Number(list[1]) || 0;
            var offsetX = Number(list[2]) || 0;
            var offsetY = Number(list[3]) || 0;
            var width = Number(list[4]) || Graphics.width;
            var height = Number(list[5]) || Graphics.height;
            var opacity = Number(list[6]) || (Number(list[6]) === 0 ? 0 : 255);
            var above = list[list.length - 1].toLowerCase().trim() === 'above';
            user.requestPlaneMotion(name, id, offsetX, offsetY, width, height, opacity, above);
        }
    };

    Window_BattleLog.prototype.processMotionBattleback = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        var spriteset = SceneManager.sceneSpriteset();
        if (type === 'save') {
            var name1 = spriteset.battleback1BitmapName();
            var name2 = spriteset.battleback2BitmapName();
            $gameSystem.memorizeBattleback(name1, name2);
        } else if (type === 'restore') {
            var name = $gameSystem.restoreBattleback();
            spriteset.changeBattleback(name.back1, name.back2);
            this.insert(index, 'waitForTime', 1);
        } else if (list[0] && list[1]) {
            var back1 = list[0] ? list[0].toLowerCase().trim() : '';
            var back2 = list[1] ? list[1].toLowerCase().trim() : '';
            spriteset.changeBattleback(back1, back2);
            this.insert(index, 'waitForTime', 1);
        }
    };

    Window_BattleLog.prototype.processMotionTint = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        var mode = list[1] ? list[1].toLowerCase().trim() : '';
        if (mode === 'black') {
            var color = [-255, -255, -225, 0];
            var duration = Number(list[2]) || 0;
        } else if (mode === 'light') {
            var color = [68, 68, 68, 0];
            var duration = Number(list[2]) || 0;
        } else if (mode === 'grayscale') {
            var color = [0, 0, 0, 255];
            var duration = Number(list[2]) || 0;
        } else if (mode === 'dark') {
            var color = [-68, -68, -68, 0];
            var duration = Number(list[2]) || 0;
        } else if (mode === 'sepia') {
            var color = [34, -34, -68, 170];
            var duration = Number(list[2]) || 0;
        } else if (mode === 'sunset') {
            var color = [68, -34, -34, 0];
            var duration = Number(list[2]) || 0;
        } else if (mode === 'night') {
            var color = [-68, -68, 0, 68];
            var duration = Number(list[2]) || 0;
        } else if (mode === 'clear') {
            var color = [0, 0, 0, 0];
            var duration = Number(list[2]) || 0;
        } else {
            var r = Number(list[1]) || 0;
            var g = Number(list[2]) || 0;
            var b = Number(list[3]) || 0;
            var a = Number(list[4]) || 0;
            var color = [r, g, b, a];
            var duration = Number(list[5]) || 0;
        }
        if (type === 'upper') {
            $gameScreen.startUpperTint(color, duration);
        } else if (type === 'lower') {
            $gameScreen.startLowerTint(color, duration);
        } else {
            var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
            for (var i = 0; i < subjects.length; i++) {
                var subject = subjects[i];
                if (subject.isSpriteVisible()) {
                    subject.requestTintMotion(color, duration);
                }
            }
        }
        $gameScreen.update();
    };

    Window_BattleLog.prototype.processMotionFlash = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var r = Number(list[0]) || 0;
        var g = Number(list[1]) || 0;
        var b = Number(list[2]) || 0;
        var a = Number(list[3]) || 0;
        var duration = Number(list[4]) || 0;
        $gameScreen.startFlash([r, g, b, a], duration);
    };

    Window_BattleLog.prototype.processMotionShake = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var power = Number(list[0]) || 0;
        var speed = Number(list[1]) || 0;
        var duration = Number(list[2]) || 0;
        $gameScreen.startShake(power, speed, duration);
    };

    Window_BattleLog.prototype.processMotionBgm = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        switch (type) {
            case 'play':
                var name = list[1] ? list[1].trim() : '';
                var volume = Number(list[2]) || (Number(list[2]) === 0 ? 0 : 90);
                var pitch = Number(list[3]) || (Number(list[3]) === 0 ? 0 : 100);
                var pan = Number(list[4]) || 0;
                AudioManager.playBgm({
                    name: name,
                    volume: volume,
                    pitch: pitch,
                    pan: pan
                });
                break;
            case 'fade in':
                var fade = Number(list[1]) / 60 || 5;
                AudioManager.fadeInBgm(fade);
                break;
            case 'fade out':
                var fade = Number(list[1]) / 60 || 5;
                AudioManager.fadeOutBgm(fade);
                break;
            case 'stop':
                AudioManager.stopBgm();
                break;
            case 'save':
                $gameSystem.saveBgm();
                break;
            case 'resume':
                $gameSystem.replayBgm();
                break;
        }
    };

    Window_BattleLog.prototype.processMotionBgs = function(motion, index, usex, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        switch (type) {
            case 'play':
                var name = list[1].trim();
                var volume = Number(list[2]) || (Number(list[2]) === 0 ? 0 : 90);
                var pitch = Number(list[3]) || (Number(list[3]) === 0 ? 0 : 100);
                var pan = Number(list[4]) || 0;
                AudioManager.playBgs({
                    name: name,
                    volume: volume,
                    pitch: pitch,
                    pan: pan
                });
                break;
            case 'fade in':
                var fade = Number(list[1]) / 60 || 10;
                AudioManager.fadeInBgs(fade);
                break;
            case 'fade out':
                var fade = Number(list[1]) / 60 || 10;
                AudioManager.fadeOutBgs(fade);
                break;
            case 'stop':
                AudioManager.stopBgs();
                break;
        }
    };

    Window_BattleLog.prototype.processMotionMe = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        switch (type) {
            case 'play':
                var name = list[1].trim();
                var volume = Number(list[2]) || (Number(list[2]) === 0 ? 0 : 90);
                var pitch = Number(list[3]) || (Number(list[3]) === 0 ? 0 : 100);
                var pan = Number(list[4]) || 0;
                AudioManager.playMe({
                    name: name,
                    volume: volume,
                    pitch: pitch,
                    pan: pan
                });
                break;
            case 'fade out':
                var fade = Number(list[1]) / 60 || 10;
                AudioManager.fadeOutMe(fade);
                break;
            case 'stop':
                AudioManager.stopMe();
                break;
        }
    };

    Window_BattleLog.prototype.processMotionSe = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        switch (type) {
            case 'play':
                var name = list[1].trim();
                var volume = Number(list[2]) || (Number(list[2]) === 0 ? 0 : 90);
                var pitch = Number(list[3]) || (Number(list[3]) === 0 ? 0 : 100);
                var pan = Number(list[4]) || 0;
                AudioManager.playSe({
                    name: name,
                    volume: volume,
                    pitch: pitch,
                    pan: pan
                });
                break;
            case 'play cursor':
                SoundManager.playCursor();
                break;
            case 'play ok':
                SoundManager.playOk();
                break;
            case 'play cancel':
                SoundManager.playCancel();
                break;
            case 'play buzzer':
                SoundManager.playBuzzer();
                break;
            case 'play equip':
                SoundManager.playEquip();
                break;
            case 'play save':
                SoundManager.playSave();
                break;
            case 'play load':
                SoundManager.playLoad();
                break;
            case 'play battle start':
                SoundManager.playBattleStart();
                break;
            case 'play escape':
                SoundManager.playEscape();
                break;
            case 'play enemy attack':
                SoundManager.playEnemyAttack();
                break;
            case 'play enemy damage':
                SoundManager.playEnemyDamage();
                break;
            case 'play enemy collapse':
                SoundManager.playEnemyCollapse();
                break;
            case 'play boss bollapse 1':
                SoundManager.playBossBollapse1();
                break;
            case 'play boss collapse 2':
                SoundManager.playBossCollapse2();
                break;
            case 'play actor damage':
                SoundManager.playActorDamage();
                break;
            case 'play actor collapse':
                SoundManager.playActorCollapse();
                break;
            case 'play recovery':
                SoundManager.playRecovery();
                break;
            case 'play miss':
                SoundManager.playMiss();
                break;
            case 'play evasion':
                SoundManager.playEvasion();
                break;
            case 'play magic evasion':
                SoundManager.playMagicEvasion();
                break;
            case 'play reflection':
                SoundManager.playReflection();
                break;
            case 'play shop':
                SoundManager.playShop();
                break;
            case 'play use item':
                SoundManager.playUseItem();
                break;
            case 'play use skill':
                SoundManager.playUseSkill();
                break;
            case 'stop':
                AudioManager.stopSe();
                break;
        }
    };

    Window_BattleLog.prototype.processMotionMovie = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var name = list[0].trim();
        var ext = this.videoFileExt();
        Graphics.playVideo('movies/' + name + ext);
        var subjects = BattleManager.allBattleMembers();
        for (var i = 0; i < subjects.length; i++) {
            var stack = subjects[i] === user ? index : VictorEngine.battlerIndex(subjects[i]);
            this.insert(stack, 'setWaitMode', 'movie');
        }
    };

    Window_BattleLog.prototype.processMotionHp = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var show = list[list.length - 1].toLowerCase().trim() === 'show';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        this.insert(index, 'waitForTime', 1);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
            var value = eval(list[1].trim()) || 0;
            subject.gainHp(value);
            if (show) {
                this.processMotionHpDamage(stack, subject);
                subject.startDamagePopup();
            }
        }
        SceneManager.sceneRefreshStatusWindow();
    };

    Window_BattleLog.prototype.processMotionMp = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var show = list[list.length - 1].toLowerCase().trim() === 'show';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        this.insert(index, 'waitForTime', 1);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
            var value = eval(list[1].trim()) || 0;
            subject.gainMp(value);
            if (show) {
                this.processMotionMpDamage(stack, subject);
                subject.startDamagePopup();
            }
        }
        SceneManager.sceneRefreshStatusWindow();
    };

    Window_BattleLog.prototype.processMotionTp = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var show = list[list.length - 1].toLowerCase().trim() === 'show';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        this.insert(index, 'waitForTime', 1);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
            var value = eval(list[1].trim()) || 0;
            subject.gainTp(value);
            if (show) {
                this.processMotionTpDamage(stack, subject);
                subject.startDamagePopup();
            }
        }
        SceneManager.sceneRefreshStatusWindow();
    };

    Window_BattleLog.prototype.processMotionState = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[1] ? list[1].toLowerCase().trim() : '';
        var show = list[list.length - 1].toLowerCase().trim() === 'show';
        var id = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        this.insert(index, 'waitForTime', 1);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
            switch (type) {
                case 'add':
                    subject.addState(id);
                    break;
                case 'remove':
                    subject.removeState(id);
                    break;
            }
            if (show) {
                this.processMotionChangedStates(stack, subject);
                subject.startDamagePopup();
            }
        }
        SceneManager.sceneRefreshStatusWindow();
    };

    Window_BattleLog.prototype.processMotionBuff = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[1] ? list[1].toLowerCase().trim() : '';
        var name = list[2] ? list[2].toLowerCase().trim() : '';
        var id = VictorEngine.paramId(name);
        var turn = Number(list[3]) || 0;
        var show = list[list.length - 1].toLowerCase().trim() === 'show';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        this.insert(index, 'waitForTime', 1);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
            switch (type) {
                case 'increase':
                    subject.addBuff(id);
                    break;
                case 'decrease':
                    subject.addDebuff(id);
                    break;
                case 'remove':
                    subject.removeBuff(id);
                    break;
            }
            if (show) {
                this.processMotionChangedBuffs(stack, subject);
                subject.startDamagePopup();
            }
        }
        SceneManager.sceneRefreshStatusWindow();
    };

    Window_BattleLog.prototype.processMotionHome = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var home = list[1] && list[1].toLowerCase().trim() === 'here';
        var newX = Number(list[1]) || 0;
        var newY = Number(list[2]) || 0;
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (home) {
                subject.setNewHome(subject.screenX(), subject.screenY())
            } else {
                subject.setNewHome(newX, newY)
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionSwitch = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var id = Number(list[0]) || 0;
        var type = list[1] ? list[1].toLowerCase().trim() : '';
        switch (type) {
            case 'on':
                $gameSwitches.setValue(id, true);
                break;
            case 'off':
                $gameSwitches.setValue(id, false);
                break;
            case 'toggle':
                $gameSwitches.setValue(id, !$gameSwitches.value(id));
                break;
        }
    };

    Window_BattleLog.prototype.processMotionVariable = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var id = Number(list[0]) || 0;
        var code = Array.prototype.slice.call(list, 1).join(',');
        var match = (/([\=\+\-\*\/\%])[ ]*(\S+)/gi).exec(code);
        var oldValue = $gameVariables.value(id);
        var newValue = eval(match[2] || '') || 0;
        switch (match[1]) {
            case '=':
                $gameVariables.setValue(id, oldValue = newValue);
                break;
            case '+':
                $gameVariables.setValue(id, oldValue + newValue);
                break;
            case '-':
                $gameVariables.setValue(id, oldValue - newValue);
                break;
            case '*':
                $gameVariables.setValue(id, oldValue * newValue);
                break;
            case '/':
                $gameVariables.setValue(id, oldValue / newValue);
                break;
            case '%':
                $gameVariables.setValue(id, oldValue % newValue);
                break;
        }
    };

    Window_BattleLog.prototype.processMotionEvent = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var id = Number(list[0]) || 0;
        $gameTemp.reserveCommonEvent(id);
        this.insert(index, 'setWaitMode', 'event');
		this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionItem = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[0] ? list[0].toLowerCase().trim() : '';
        var id = eval(list[1] || '') || 0;
        var value = eval(list[2] || '') || 0;
        switch (type) {
            case 'item':
                $gameParty.gainItem($dataItems[id], value);
                break;
            case 'armor':
                $gameParty.gainItem($dataArmors[id], value);
                break;
            case 'weapon':
                $gameParty.gainItem($dataWeapons[id], value);
                break;
            case 'gold':
                $gameParty.gaingold(id);
                break;
        }
    };

    Window_BattleLog.prototype.processMotionBattlestatus = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        SceneManager.changeStatusWindow(list[0] ? list[0].toLowerCase().trim() : '')
    };

    Window_BattleLog.prototype.processMotionBattlelog = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        switch (list[0] ? list[0].toLowerCase().trim() : '') {
            case 'show':
                this.visible = true;
                break;
            case 'hide':
                this.visible = false;
                break;
            case 'text':
                var text = Array.prototype.slice.call(list, 1).join(',');
                this.insert(index, 'addText', text);
                break;
            case 'clear':
                this.insert(index, 'clear');
                break;
        }
    };

    Window_BattleLog.prototype.processMotionRefreshStatus = function(motion, index, user, action, targets, target) {
        SceneManager.sceneRefreshStatusWindow();
    };

    Window_BattleLog.prototype.processMotionWhiten = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i]
            if (subject.isSpriteVisible()) {
                var stack = subject === user ? index : VictorEngine.battlerIndex(subject);
                subject.requestEffect('whiten');
            }
        }
        this.insert(index, 'waitForTime', 1);
    };

    Window_BattleLog.prototype.processMotionKill = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            if (subject.deathStateIsSet()) {
                user.removeActionTarget(VictorEngine.battlerIndex(subject));
                this.processMotionDeath(subject);
            }
        }
    };

    Window_BattleLog.prototype.processMotionClearTargets = function(motion, index, user, action, targets, target) {
        BattleManager.clearActionTargets();
    };

    Window_BattleLog.prototype.processMotionIf = function(motion, index, user, action, targets, target) {
        var a = user;
        var b = target;
        var v = $gameVariables._data;
        var item = action ? action.item() : null;
        eval('var result = ' + motion);
        if (result) {
            this._conditionMet[index] = true;
        } else {
            this._skipUntilElse[index] = true;
        }
    };

    Window_BattleLog.prototype.processMotionElseIf = function(motion, index, user, action, targets, target) {
        this._skipUntilElse[index] = false;
        this._conditionMet[index] = false;
        this.processMotionIf(motion, index, user, action, targets, target);
    };

    Window_BattleLog.prototype.processMotionElse = function(motion, index) {
        this._skipUntilElse[index] = false;
    };

    Window_BattleLog.prototype.processMotionEnd = function(motion, index) {
        this._skipUntilElse[index] = false;
        this._skipUntilEnd[index] = false;
        this._conditionMet[index] = false;
    };

    Window_BattleLog.prototype.processMotionEval = function(motion, index, user, action, targets, target) {
        var a = user;
        var b = target;
        var v = $gameVariables._data;
        var item = action ? action.item() : null;
        var index = index;
        var subject = user;
        eval(motion);
    };

    Window_BattleLog.prototype.processMotionThrow = function(motion, index, user, action, targets, target) {
        if (Imported['VE - Throwable Objects']) {
            var list = motion.split(',');
            var type = list[1] ? list[1].toLowerCase().trim() : '';
            var battlers = list[0].split(/[ ]+to[ ]+/gi);
            var thowUsers = this.getMotionSubjects(battlers[0], user, targets, target, index);
            var thowTargets = this.getMotionSubjects(battlers[1], user, targets, target, index);
            for (var i = 0; i < thowUsers.length; i++) {
                var thowUser = thowUsers[i]
                var stack = thowUser === user ? index : VictorEngine.battlerIndex(thowUser);
                for (var j = 0; j < thowTargets.length; j++) {
                    var thowTarget = thowTargets[j];
                    this.insert(stack, "startThrow", thowUser, action, thowTarget, type);
                }
            }
            this.insert(index, 'waitForTime', 1);
        }
    };

    Window_BattleLog.prototype.processMotionFlag = function(motion, index, user, action, targets, target) {
        var list = motion.split(',');
        var type = list[1] ? list[1].toLowerCase().trim() : '';
        var flag = list[2] ? list[2].toLowerCase().trim() : '';
        var subjects = this.getMotionSubjects(list[0], user, targets, target, index);
        for (var i = 0; i < subjects.length; i++) {
            if (type === 'add') {
                subjects[i].addActionFlag(flag);
            } else {
                subjects[i].removeActionFlag(flag);
            }
        }
    };

    Window_BattleLog.prototype.getMotionSubjects = function(type, user, targets, target, index) {
        type = type.toLowerCase().trim();
        var battlers = BattleManager.allBattleMembers();
        var friends = user.isActor() ? $gameParty : $gameTroop;
        var opponets = user.isEnemy() ? $gameParty : $gameTroop;
        var active = [user].concat(targets);
        switch (type) {
            case 'user':
                return [user];
            case 'subject':
                return target ? [target] : [user];
            case 'target':
                var actionTarget = this._actionTargets[index];
                return actionTarget ? [actionTarget] : [];
            case 'all targets':
                return targets;
            case 'all actors':
                return $gameParty.members();
            case 'all enemies':
                return $gameTroop.members();
            case 'all battlers':
                return battlers;
            case 'all friends':
                return friends.members();
            case 'all opponents':
                return opponets.members();
            case 'alive actors':
                return $gameParty.aliveMembers();
            case 'alive enemies':
                return $gameTroop.aliveMembers();
            case 'alive battlers':
                return battlers.filter(function(battler) {
                    return battler.isAlive()
                });
            case 'alive friends':
                return friends.aliveMembers();
            case 'alive opponents':
                return opponets.aliveMembers();
            case 'alive targets':
                return targets.filter(function(battler) {
                    return battler.isAlive()
                });
            case 'dead actors':
                return $gameParty.deadMembers();
            case 'dead enemies':
                return $gameTroop.deadMembers();
            case 'dead battlers':
                return battlers.filter(function(battler) {
                    return battler.isDead()
                });
            case 'dead friends':
                return friends.deadMembers();
            case 'dead opponents':
                return opponets.deadMembers();
            case 'dead targets':
                return targets.filter(function(battler) {
                    return battler.isDead()
                });
            case 'active actors':
                return $gameParty.members().filter(function(battler) {
                    return active.contains(battler);
                });
            case 'active enemies':
                return $gameTroop.members().filter(function(battler) {
                    return active.contains(battler);
                });
            case 'active battlers':
                return battlers.filter(function(battler) {
                    return active.contains(battler);
                });
            case 'active friends':
                return friends.members().filter(function(battler) {
                    return active.contains(battler);
                });
            case 'active opponents':
                return opponets.members().filter(function(battler) {
                    return active.contains(battler);
                });
            case 'inactive actors':
                return $gameParty.members().filter(function(battler) {
                    return !active.contains(battler);
                });
            case 'inactive enemies':
                return $gameTroop.members().filter(function(battler) {
                    return !active.contains(battler);
                });
            case 'inactive battlers':
                return battlers.filter(function(battler) {
                    return !active.contains(battler);
                });
            case 'inactive friends':
                return friends.members().filter(function(battler) {
                    return !active.contains(battler);
                });
            case 'inactive opponents':
                return opponets.members().filter(function(battler) {
                    return !active.contains(battler);
                });
            case 'movable actors':
                return $gameParty.members().filter(function(battler) {
                    return battler.canMove();
                });
            case 'movable enemies':
                return $gameTroop.members().filter(function(battler) {
                    return battler.canMove();
                });
            case 'movable battlers':
                return battlers.filter(function(battler) {
                    return battler.canMove();
                });
            case 'movable friends':
                return friends.members().filter(function(battler) {
                    return battler.canMove();
                });
            case 'movable opponents':
                return opponets.members().filter(function(battler) {
                    return battler.canMove();
                });
            case 'movable targets':
                return targets.filter(function(battler) {
                    return battler.canMove();
                });
            case 'movable targets':
                return targets.filter(function(battler) {
                    return battler.canMove();
                });
            case 'moved user':
                return user.canMove() && !user.inHomePosition() ? [user] : [];
            case 'moved actors':
                return $gameParty.members().filter(function(battler) {
                    return battler.canMove() && !battler.inHomePosition();
                });
            case 'moved enemies':
                return $gameTroop.members().filter(function(battler) {
                    return battler.canMove() && !battler.inHomePosition();
                });
            case 'moved battlers':
                return battlers.filter(function(battler) {
                    return battler.canMove() && !battler.inHomePosition();
                });
            case 'moved friends':
                return friends.members().filter(function(battler) {
                    return battler.canMove() && !battler.inHomePosition();
                });
            case 'moved opponents':
                return opponets.members().filter(function(battler) {
                    return battler.canMove() && !battler.inHomePosition();
                });
            case 'moved targets':
                return targets.filter(function(battler) {
                    return battler.canMove() && !battler.inHomePosition();
                });
            case 'other actors':
                return $gameParty.members().filter(function(battler) {
                    return battler !== user;
                });
            case 'other enemies':
                return $gameTroop.members().filter(function(battler) {
                    return battler !== user;
                });
            case 'other battlers':
                return battlers.filter(function(battler) {
                    return battler !== user;
                });
            case 'other friends':
                return friends.members().filter(function(battler) {
                    return battler !== user;
                });
            case 'other targets':
                return targets.filter(function(battler) {
                    return battler !== user;
                });
            case 'random actor':
                return [$gameParty.members()[Math.randomInt($gameParty.members().length)]];
            case 'random enemie':
                return [$gameTroop.members()[Math.randomInt($gameTroop.members().length)]];
            case 'random battler':
                return [battlers[Math.randomInt(battlers.length)]];
            case 'random friend':
                return [friends.members()[Math.randomInt(friends.members().length)]];
            case 'random opponent':
                return [opponets.members()[Math.randomInt(opponets.members().length)]];
            case 'random target':
                return [targets[Math.randomInt(targets.length)]];
        }
        var match = (/(other)?[ ]*(actor|party|enemy|friend|opponent|target)[ ]*(\d+)/gi).exec(type);
        if (match) {
            var other = !!Number(match[1]);
            var index = Number(match[3]) - 1;
            switch (match[2].toLowerCase()) {
                case 'actor':
                    var actor = $gameActors.actor(index + 1)
                    var battler = $gameParty.members().contains(actor) ? actor : null;
                    break;
                case 'party':
                    var party = $gameParty.movableMembers();
                    var next = (index + 1) % party.length;
                    var battler = (other && party[index] === user) ? party[next] : party[index];
                    break;
                case 'enemy':
                    var enemy = $gameTroop.movableMembers();
                    var next = (index + 1) % enemy.length;
                    var battler = (other && enemy[index] === user) ? enemy[next] : enemy[index];
                    break;
                case 'friend':
                    var friend = friends.movableMembers();
                    var next = (index + 1) % friend.length;
                    var battler = (other && friend[index] === user) ? friend[next] : friend[index];
                    break;
                case 'opponent':

                    var battler = opponets.movableMembers()[index];
                    break;
                case 'target':
                    var target = targets.filter(function(battler) {
                        return battler.canMove();
                    });
                    var next = (index + 1) % target.length;
                    var battler = (other && target[index] === user) ? target[next] : target[index];
                    break;
            }
            return battler ? [battler] : [];
        }
        return [];
    }

    Window_BattleLog.prototype.uniqueRepeats = function(targets, subject) {
        var unique = targets.filter(function(unique) {
            return unique.target === subject
        })[0];
        return unique ? unique.repeat : 1;
    }

    Window_BattleLog.prototype.processMoveToTarget = function(subject, targets, duration, distance, offset) {
        if (targets.length > 0) {
            var x = 0;
            var y = 0;
            var homeX = subject.homeX();
            var homeY = subject.homeY();
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                var targetX = target.screenX() - homeX;
                var targety = target.screenY() - homeY;
                var adjust = this.getDistanceValue(subject, target, distance);
                if (subject.isFacingVertical()) {
                    x += targetX + offset;
                    y += targety + adjust;
                } else {
                    x += targetX + adjust;
                    y += targety + offset;
                }
            }
            x /= targets.length;
            y /= targets.length;
            subject.requestMoveMotion(x, y, duration);
        }
    };

    Window_BattleLog.prototype.processMoveToHome = function(subject, targets, duration, distance, offset) {
        subject.requestMoveMotion(0, 0, duration);
    };

    Window_BattleLog.prototype.processMoveForward = function(subject, targets, duration, distance, offset) {
        var x = subject.screenX() - subject.homeX();
        var y = subject.screenY() - subject.homeY();
        var adjust = Number(distance) || 0;
        if (subject.isFacingVertical()) {
            x += offset;
            y += subject.isFacingDown() ? adjust : -adjust;
        } else {
            x += subject.isFacingRight() ? adjust : -adjust;
            y += offset;
        }
        subject.requestMoveMotion(x, y, duration);
    };

    Window_BattleLog.prototype.processMoveBackward = function(subject, targets, duration, distance, offset) {
        var x = subject.screenX() - subject.homeX();
        var y = subject.screenY() - subject.homeY();
        var adjust = Number(distance) || 0;
        if (subject.isFacingVertical()) {
            x += offset;
            y += subject.isFacingDown() ? -adjust : adjust;
        } else {
            x += subject.isFacingRight() ? -adjust : adjust;
            y += offset;
        }
        subject.requestMoveMotion(x, y, duration);
    };

    Window_BattleLog.prototype.processMoveToPosition = function(subject, targets, duration, x, y) {
        x = Number(x) || 0;
        x = x - subject.homeX();
        y = y - subject.homeY();
        subject.requestMoveMotion(x, y, duration);
    };

    Window_BattleLog.prototype.processMoveCloseToTarget = function(subject, targets, duration, distance) {
        if (targets.length > 0) {
            var x = 0;
            var y = 0;
            var x2 = subject.screenX();
            var y2 = subject.screenY();
            var homeX = subject.homeX();
            var homeY = subject.homeY();
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                var x1 = target.screenX();
                var y1 = target.screenY();
                var value = this.processPointBetweenDistance(x1, y1, x2, y2, distance);
                x += value.x - homeX;
                y += value.y - homeY;
            }
            x /= targets.length;
            y /= targets.length;
            subject.requestMoveMotion(x, y, duration);
        }
    };

    Window_BattleLog.prototype.processMoveCloseToPosition = function(subject, targets, duration, x, y, distance) {
        var x1 = Number(x) || 0;
        var y1 = y;
        var x2 = subject.screenX();
        var y2 = subject.screenY();
        var value = this.processPointBetweenDistance(x1, y1, x2, y2, distance);
        x = value.x - subject.homeX();
        y = value.y - subject.homeY();
        subject.requestMoveMotion(x, y, duration);
    };

    Window_BattleLog.prototype.processPointBetweenDistance = function(x1, y1, x2, y2, distance) {
        var total = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        var x = (1 - distance / total) * x1 + distance / total * x2;
        var y = (1 - distance / total) * y1 + distance / total * y2;
        return {
            x: x,
            y: y
        }
    };

    Window_BattleLog.prototype.getDistanceValue = function(subject, target, distance) {
        var result = 0;
        var sw = subject.frameSize().width;
        var sh = subject.frameSize().height;
        var tw = target.frameSize().width;
        var th = target.frameSize().height;
        var front = distance.match(/front[ ]*([+-]?\d+)?/gi);
        var behind = distance.match(/behind[ ]*([+-]?\d+)?/gi);
        var number = (/([+-]?\d+)/gi).exec(distance);
        if (front) {
            if (subject.isFacingVertical()) {
                result += subject.isFacingDown() ? -th : sh;
            } else {
                var adjust = tw / 3 + sw / 3;
                result += subject.isFacingRight() ? -adjust : adjust;
            }
        }
        if (behind) {
            if (subject.isFacingVertical()) {
                result += subject.isFacingDown() ? sh : -th;
            } else {
                var adjust = tw / 3 + sw / 3;
                result += subject.isFacingRight() ? adjust : -adjust;
            }
        }
        if (number) {
            result += Number(number[1]) || 0;
        }
        return result;
    };

    Window_BattleLog.prototype.processMotionDeath = function(subject) {
        if (subject.deathStateIsSet() && !subject.isActionSubject()) {
            subject.deathStateRemove();
            if (!subject.isDeathStateAffected()) {
                subject.addNewState(subject.deathStateId());
                subject.performCollapse();
                var state = $dataStates[subject.deathStateId()];
                var index = VictorEngine.battlerIndex(subject);
                var text = subject.isActor() ? state.message1 : state.message2;
                if (text) {
                    this.insert(index, 'waitForEffect');
                    this.insert(index, 'addText', subject.name() + text);
                    this.insert(index, 'pushBaseLine');
                    this.insert(index, 'popBaseLine');
                }
            }
        }
    };

    Window_BattleLog.prototype.processMotionHpDamage = function(index, target) {
        if (target.result().hpAffected) {
            this.insert(index, 'addText', this.makeHpDamageText(target));
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.insert(index, 'performDamage', target);
            }
            if (target.result().hpDamage < 0) {
                this.insert(index, 'performRecovery', target);
            }
        }
    };

    Window_BattleLog.prototype.processMotionMpDamage = function(index, target) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            this.insert(index, 'addText', this.makeMpDamageText(target));
            if (target.result().mpDamage < 0) {
                this.insert(index, 'performRecovery', target);
            }
        }
    };

    Window_BattleLog.prototype.processMotionTpDamage = function(index, target) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            this.insert(index, 'addText', this.makeTpDamageText(target));
            if (target.result().tpDamage < 0) {
                this.insert(index, 'performRecovery', target);
            }
        }
    };

    Window_BattleLog.prototype.processMotionChangedStates = function(index, target) {
        target.result().removedStateObjects().forEach(function(state) {
            if (state.message4) {
                this.insert(index, 'addText', target.name() + state.message4);
                this.insert(index, 'pushBaseLine');
                this.insert(index, 'popBaseLine');
            }
        }, this);
        target.result().addedStateObjects().forEach(function(state) {
            var stateMsg = target.isActor() ? state.message1 : state.message2;
            if (stateMsg) {
                this.insert(index, 'addText', target.name() + stateMsg);
                this.insert(index, 'pushBaseLine');
                this.insert(index, 'popBaseLine');
            }
        }, this);
    };

    Window_BattleLog.prototype.processMotionChangedBuffs = function(index, target) {
        var result = target.result();
        this.processMotionBuffs(index, target, result.removedBuffs, TextManager.buffRemove);
        this.processMotionBuffs(index, target, result.addedDebuffs, TextManager.debuffAdd);
        this.processMotionBuffs(index, target, result.addedBuffs, TextManager.buffAdd);
    };

    Window_BattleLog.prototype.processMotionBuffs = function(index, target, buffs, fmt) {
        buffs.forEach(function(paramId) {
            this.insert(index, 'addText', fmt.format(target.name(), TextManager.param(paramId)));
            this.insert(index, 'pushBaseLine');
            this.insert(index, 'popBaseLine');
        }, this);
    };

    Window_BattleLog.prototype.videoFileExt = function() {
        if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
            return '.webm';
        } else {
            return '.mp4';
        }
    };

})()