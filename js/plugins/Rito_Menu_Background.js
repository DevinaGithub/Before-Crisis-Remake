//=============================================================================
// Rito_Menu_Background.js
//=============================================================================
var Imported = Imported || {};
Imported.Rito_GameEnd = true;
var Rito = Rito || {}; 

/*:
 * @plugindesc Version 1.00
 * Adds background for each menu and modified each opacity windows.
 * @author Rito
 *
 * @help Please credit me. Usage for commercial/free game.
 *
 * @param Help Opacity
 * @default 0
 *
 * @param
 * @param //Main Menu\\
 * @default ================
 * @desc Do not change that
 * @param Background MM
 * @default MainMenu_bg
 *
 * @param Command Opacity MM
 * @default 0
 *
 * @param Gold Opacity MM
 * @default 0
 *
 * @param Location Opacity MM
 * @default 0
 *
 * @param
 * @param //Item Menu\\
 * @default ================
 * @desc Do not change that
 * @param Background IM
 * @default ItemMenu_bg
 *
 * @param Category Opacity IM
 * @default 0
 *
 * @param Item Opacity IM
 * @default 0
 * @param
 * @param //Skill Menu\\
 * @default ================
 * @desc Do not change that
 * @param Background SM
 * @default SkillMenu_bg
 *
 * @param Skill Opacity SM
 * @default 0
 *
 * @param Status Opacity SM
 * @default 0
 *
 * @param Item Opacity IM
 * @default 0
 * @param
 * @param //Equip Menu\\
 * @default ================
 * @desc Do not change that
 * @param Background EM
 * @default EquipMenu_bg
 *
 * @param Status Opacity EM
 * @default 0
 *
 * @param Command Opacity EM
 * @default 0
 *
 * @param Slot Opacity EM
 * @default 0
 *
 * @param Item Opacity EM
 * @default 0
 * @param
 * @param //Status Menu\\
 * @default ================
 * @desc Do not change that
 * @param Background StatM
 * @default StatusMenu_bg
 *
 * @param Status Opacity StatM
 * @default 0
 * @param
 * @param //Options Menu\\
 * @default ================
 * @desc Do not change that
 * @param Background OM
 * @default OptionsMenu_bg
 *
 * @param Options Opacity OM
 * @default 0
 * @param
 * @param //Save Menu\\
 * @default ================
 * @desc Do not change that
 * @param Background SaveM
 * @default SaveMenu_bg
 *
 * @param Help Opacity SaveM
 * @default 0
 *
 * @param List Opacity SaveM
 * @default 0
 */
var parameters = PluginManager.parameters('Rito_Menu_Background');

Rito.Param = Rito.Param || {};

Rito.Param.helpWinOpacity = Number(parameters['Help Opacity'] || 0);

Rito.Param.MM_background = String(parameters['Background MM']);
Rito.Param.MM_comWin = Number(parameters['Command Opacity MM'] || 0);
Rito.Param.MM_goldWin = Number(parameters['Gold Opacity MM'] || 0);
Rito.Param.MM_statusWin = Number(parameters['Status Opacity MM'] || 0);
Rito.Param.MM_locationWin = Number(parameters['Location Opacity MM'] || 0);

Rito.Param.IM_background = String(parameters['Background IM']);
Rito.Param.IM_catWin = Number(parameters['Category Opacity IM'] || 0);
Rito.Param.IM_itemWin = Number(parameters['Item Opacity IM'] || 0);

Rito.Param.SM_background = String(parameters['Background SM']);
Rito.Param.SM_skillTypeWin = Number(parameters['Skill Opacity SM'] || 0);
Rito.Param.SM_statusWin = Number(parameters['Status Opacity SM'] || 0);
Rito.Param.SM_itemWin = Number(parameters['Item Opacity SM'] || 0);

Rito.Param.EM_background = String(parameters['Background EM']);
Rito.Param.EM_statusWin = Number(parameters['Status Opacity EM'] || 0);
Rito.Param.EM_commandWin = Number(parameters['Command Opacity EM'] || 0);
Rito.Param.EM_slotWin = Number(parameters['Slot Opacity EM'] || 0);
Rito.Param.EM_itemWin = Number(parameters['Item Opacity EM'] || 0);

Rito.Param.StatM_background = String(parameters['Background StatM']);
Rito.Param.StatM_statusWin = Number(parameters['Status Opacity StatM'] || 0);

Rito.Param.OM_background = String(parameters['Background OM']);
Rito.Param.OM_optionsWin = Number(parameters['Options Opacity OM'] || 0);

Rito.Param.SaveM_background = String(parameters['Background SaveM']);
Rito.Param.SaveM_helpWin = Number(parameters['Help Opacity SaveM'] || 0);
Rito.Param.SaveM_listWin = Number(parameters['List Opacity SaveM'] || 0);

ImageManager.loadMenuBackground = function(filename, hue) {
    return this.loadBitmap('img/menu_background/', filename, hue, true);
};

// Help Window Opacity
var _alias_Scene_MenuBase_createHelpWindow = Scene_MenuBase.prototype.createHelpWindow;
Scene_MenuBase.prototype.createHelpWindow = function() {
	_alias_Scene_MenuBase_createHelpWindow.call(this);
	this._helpWindow.opacity = Rito.Param.helpWinOpacity;
};


// ===========Main Menu=============
// Opacity Main Menu Window
var _alias_SceneMenu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _alias_SceneMenu_createCommandWindow.call(this);
    this._commandWindow.opacity = Rito.Param.MM_comWin;
};

var _alias_SceneMenu_createGoldWindow = Scene_Menu.prototype.createGoldWindow;
Scene_Menu.prototype.createGoldWindow = function() {
    _alias_SceneMenu_createGoldWindow.call(this);
    this._goldWindow.opacity = Rito.Param.MM_goldWin;
};

var _alias_SceneMenu_createStatusWindow = Scene_Menu.prototype.createStatusWindow;
Scene_Menu.prototype.createStatusWindow = function() {
    _alias_SceneMenu_createStatusWindow.call(this);
    this._statusWindow.opacity = Rito.Param.MM_statusWin;
};

if (Imported.ModMenu) {
	var _alias_SceneMenu_locationWindow = Scene_Menu.prototype.createLocationWindow;
	Scene_Menu.prototype.createLocationWindow = function() {
		_alias_SceneMenu_locationWindow.call(this)
		this._locationWindow.opacity = Rito.Param.MM_locationWin;
	}; }


// Create Background in Main Menu
var _alias_SceneMenu_create = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function() {
	this.createBackground();
	_alias_SceneMenu_create.call(this);
};

Scene_Menu.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
	if (Rito.Param.MM_background == "") { this._backgroundSprite.bitmap = SceneManager.backgroundBitmap(); } 
	else {this._backgroundSprite.bitmap = ImageManager.loadMenuBackground(Rito.Param.MM_background);}
    this.addChild(this._backgroundSprite);
	if (Imported.Soul_Menu_Particles){ this.create_particles(); }
};

// ===========Item Menu=============
// Opacity Item Menu Window
var _alias_SceneItem_createCategoryWindow = Scene_Item.prototype.createCategoryWindow;
Scene_Item.prototype.createCategoryWindow = function() {
    _alias_SceneItem_createCategoryWindow.call(this);
    this._categoryWindow.opacity = Rito.Param.IM_catWin;
};

var _alias_SceneItem_createItemWindow = Scene_Item.prototype.createItemWindow;
Scene_Item.prototype.createItemWindow = function() {
    _alias_SceneItem_createItemWindow.call(this);
    this._itemWindow.opacity = Rito.Param.IM_itemWin;
};

// Create Background in Item Menu
var _alias_SceneItem_create = Scene_Item.prototype.create;
Scene_Item.prototype.create = function() {
	this.createBackground();
	_alias_SceneItem_create.call(this);
};

Scene_Item.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
	if (Rito.Param.IM_background == "") { this._backgroundSprite.bitmap = SceneManager.backgroundBitmap(); } 
	else {this._backgroundSprite.bitmap = ImageManager.loadMenuBackground(Rito.Param.IM_background);}
    this.addChild(this._backgroundSprite);
	if (Imported.Soul_Menu_Particles){ this.create_particles(); }
};

// ===========Skill Menu=============
// Opacity Skill Menu Window
var _alias_SceneSkill_createSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
Scene_Skill.prototype.createSkillTypeWindow = function() {
	_alias_SceneSkill_createSkillTypeWindow.call(this);
	this._skillTypeWindow.opacity = Rito.Param.SM_skillTypeWin;
};

var _alias_SceneSkill_createStatusWindow = Scene_Skill.prototype.createStatusWindow;
Scene_Skill.prototype.createStatusWindow = function() {
	_alias_SceneSkill_createStatusWindow.call(this);
	this._statusWindow.opacity = Rito.Param.SM_statusWin;
};

var _alias_SceneSkill_createItemWindow = Scene_Skill.prototype.createItemWindow;
Scene_Skill.prototype.createItemWindow = function() {
	_alias_SceneSkill_createItemWindow.call(this);
	this._itemWindow.opacity = Rito.Param.SM_itemWin;
};

// Create Background in Skill Menu
var _alias_SceneSkill_create = Scene_Skill.prototype.create;
Scene_Skill.prototype.create = function() {
	this.createBackground();
	_alias_SceneSkill_create.call(this);
};

Scene_Skill.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
	if (Rito.Param.SM_background == "") { this._backgroundSprite.bitmap = SceneManager.backgroundBitmap(); } 
	else {this._backgroundSprite.bitmap = ImageManager.loadMenuBackground(Rito.Param.SM_background);}
    this.addChild(this._backgroundSprite);
	if (Imported.Soul_Menu_Particles){ this.create_particles(); }
};

// ===========Equip Menu=============
// Opacity Equip Menu Window
var _alias_SceneEquip_createStatusWindow = Scene_Equip.prototype.createStatusWindow;
Scene_Equip.prototype.createStatusWindow = function() {
	_alias_SceneEquip_createStatusWindow.call(this);
	this._statusWindow.opacity = Rito.Param.EM_statusWin;
};

var _alias_SceneEquip_createCommandWindow = Scene_Equip.prototype.createCommandWindow;
Scene_Equip.prototype.createCommandWindow = function() {
	_alias_SceneEquip_createCommandWindow.call(this);
	this._commandWindow.opacity = Rito.Param.EM_commandWin;
};

var _alias_SceneEquip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
Scene_Equip.prototype.createSlotWindow = function() {
	_alias_SceneEquip_createSlotWindow.call(this);
	this._slotWindow.opacity = Rito.Param.EM_slotWin;
};

var _alias_SceneEquip_createItemWindow = Scene_Equip.prototype.createItemWindow;
Scene_Equip.prototype.createItemWindow = function() {
	_alias_SceneEquip_createItemWindow.call(this);
	this._itemWindow.opacity = Rito.Param.EM_itemWin;
};

// Create Background in Equip Menu
var _alias_SceneEquip_create = Scene_Equip.prototype.create;
Scene_Equip.prototype.create = function() {
	this.createBackground();
	_alias_SceneEquip_create.call(this);
};

Scene_Equip.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
	if (Rito.Param.EM_background == "") { this._backgroundSprite.bitmap = SceneManager.backgroundBitmap(); } 
	else {this._backgroundSprite.bitmap = ImageManager.loadMenuBackground(Rito.Param.EM_background);}
    this.addChild(this._backgroundSprite);
	if (Imported.Soul_Menu_Particles){ this.create_particles(); }
};

// ===========Status Menu=============
// Opacity window and Create Background Status Menu
var _alias_SceneStatus_create = Scene_Status.prototype.create;
Scene_Status.prototype.create = function() {
	this.createBackground();
	_alias_SceneStatus_create.call(this);
	this._statusWindow.opacity = Rito.Param.StatM_statusWin;
};

Scene_Status.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
	if (Rito.Param.StatM_background == "") { this._backgroundSprite.bitmap = SceneManager.backgroundBitmap(); } 
	else {this._backgroundSprite.bitmap = ImageManager.loadMenuBackground(Rito.Param.StatM_background);}
    this.addChild(this._backgroundSprite);
	if (Imported.Soul_Menu_Particles){ this.create_particles(); }
};

// ===========Options Menu=============
// Opacity Options Menu Window
var _alias_SceneOptions_createOptionsWindow = Scene_Options.prototype.createOptionsWindow;
Scene_Options.prototype.createOptionsWindow = function() {
	_alias_SceneOptions_createOptionsWindow.call(this);
	this._optionsWindow.opacity = Rito.Param.OM_optionsWin;
};

// Create Background in Options Menu
var _alias_SceneOptions_create = Scene_Options.prototype.create;
Scene_Options.prototype.create = function() {
	this.createBackground();
	_alias_SceneOptions_create.call(this);
};

Scene_Options.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
	if (Rito.Param.OM_background == "") { this._backgroundSprite.bitmap = SceneManager.backgroundBitmap(); } 
	else {this._backgroundSprite.bitmap = ImageManager.loadMenuBackground(Rito.Param.OM_background);}
    this.addChild(this._backgroundSprite);
	if (Imported.Soul_Menu_Particles){ this.create_particles(); }
};

// ===========Save Menu=============
// Opacity Save Menu Window
var _alias_SceneSave_createHelpWindow = Scene_Save.prototype.createHelpWindow;
Scene_Save.prototype.createHelpWindow = function() {
	_alias_SceneSave_createHelpWindow.call(this);
	this._helpWindow.opacity = Rito.Param.SaveM_helpWin;
};

var _alias_SceneSave_createListWindow = Scene_Save.prototype.createListWindow;
Scene_Save.prototype.createListWindow = function() {
	_alias_SceneSave_createListWindow.call(this);
	this._listWindow.opacity = Rito.Param.SaveM_listWin;
};

// Create Background in Save Menu
var _alias_SceneSave_create = Scene_Save.prototype.create;
Scene_Save.prototype.create = function() {
	this.createBackground();
	_alias_SceneSave_create.call(this);
};

Scene_Save.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
	if (Rito.Param.SaveM_background == "") { this._backgroundSprite.bitmap = SceneManager.backgroundBitmap(); } 
	else {this._backgroundSprite.bitmap = ImageManager.loadMenuBackground(Rito.Param.SaveM_background);}
    this.addChild(this._backgroundSprite);
	if (Imported.Soul_Menu_Particles){ this.create_particles(); }
};