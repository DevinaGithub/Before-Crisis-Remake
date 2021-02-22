//===============================================================================
// master2015hp_yedSideviewBattlerPatch.js
// by master2015hp
// 2019.05.16
//===============================================================================
/*:
 * @plugindesc fix compatibility prob with Yanfly Animated Enemies
 * @author master2015hp
 *
 * @help
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░▒░░▒▒▒░░░▒▒░░░░▒▒▒▒░░▒▒▒░░▒░░░░░▒▒░░░░
░▒░▒▒░░░░░▒░▒░░░▒░░▒▒░░░▒▒░▒░░░░░▒░▒░░░
░▒░▒░░░░░▒▒░▒░░░▒░░░▒░░░░▒░▒░░░░▒▒░▒░░░
░▒░▒▒░░░░▒░░░▒░░▒░░▒▒░░░░▒░▒░░░░▒░░░▒░░
░▒░░▒▒░░░▒▒▒▒▒░░▒▒▒▒░░▒▒▒▒░▒░░░░▒▒▒▒▒░░
░▒░░░░▒░▒▒░░░▒░░▒░░▒▒░░░░▒░▒░░░▒▒░░░▒░░
░▒░░░░▒░▒░░░░▒▒░▒░░▒▒░░░░▒░▒░░░▒░░░░▒▒░
░▒░▒▒▒░░▒░░░░░▒░▒▒▒▒░░▒▒▒░░▒▒▒░▒░░░░░▒░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

 * -------------------------------------------------------------------------------
 * REQUIRE
 * ===============================================================================
 * YEP_X_AnimatedSVEnemies
 *
 * -------------------------------------------------------------------------------
 * INSTRUCTION
 * ===============================================================================
 * Just install this plugin somewhere below both YEP_X_AnimatedSVEnemies and
 * YED_SideviewBattler plugins
 *
 * -------------------------------------------------------------------------------
 * TERMS OF USE
 * ===============================================================================
 * - Free for both commercial & non-commercial projects
 * - Please credit zerobeat032 for this addon plugin
 *
 * DO NOT COPY, RESELL, REDISTRIBUTE, REPUBLISH OR CLAIM ANY PIECE OF
 * THIS SOFTWARE AS YOUR OWN!
 * Copyright (c) 2019, Isabella Ava
 * Contact me at gmail: master2015hp
 *
 * -------------------------------------------------------------------------------
 * Version History
 * ===============================================================================
 * 2019/05/16 v1.0.0 - Initial release
 *
 */

//alias updateFrame
var cke_se_uf = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
	if (this._enemy.isSideviewBattler() || this._svBattlerEnabled) {
		this.updateSVFrame();
		return;
	}
	cke_se_uf.call(this);
};

//re-write updatesvframe
Sprite_Enemy.prototype.updateSVFrame = function() {
	var bitmap = this._mainSprite.bitmap,
		motion = this.getCurrentMotion(),
		frameSizes = this.frameSizes();

	Sprite_Battler.prototype.updateFrame.call(this);

	if (bitmap.width <= 0) {
		return;
	}

	this._effectTarget = this._mainSprite;

	var motionIndex = motion.index;
	var pattern = this._pattern;
	var cw = frameSizes[0];
	var ch = frameSizes[1];
	console.log(cw + " - " + ch + " - ");
	var cx = pattern;
	var cy = motionIndex;
	var cdh = 0;

	if (this._effectType === 'bossCollapse') {
	  cdh = ch - this._effectDuration;
	}

	this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch - cdh);
	this.adjustMainBitmapSettings(bitmap);
	this.adjustSVShadowSettings();
};