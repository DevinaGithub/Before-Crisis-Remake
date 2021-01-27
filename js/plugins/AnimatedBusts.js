//=============================================================================
// Animated busts
// by Astfgl
// Date: 05/06/2017
// Free for commercial and non commercial use, credits required: any of
// Astfgl/Astfgl (Pierre MATEO)/ Pierre MATEO.
// Edits and reposts allowed, as long as it it kept under the same terms of use.
// Do not remove this header, do not claim as your own.
// 03/06/2017 V2 -> Added the possibility to set a frozen image independently from
// the animation, and to remove it.
// 05/06/2017 V3 -> Small revisions, updated documentation.
// 05/06/2017 V4 -> Text codes \fa \ufa \da \sa added.
// 05/06/2017 V5 -> Text code \ca added.
// 06/06/2017 V6 -> Loop interval feature added, Loop number limit added,
// added compatibility to the \ca text code.
// 07/07/2017 V7 -> Compatibility with SRD Camera core, Set frame Rate command
// 05/09/2017 V8 -> Compatibility with slow text
// 26/10/2017 V9 -> "Fixed" saving and loading issue.
// 01/11/2017 V10 -> Fixed crash after erasing pictures.
// 24/01/2018 V11 -> Added set frozen and remove frozen animation features, compatibility with slow text broken
// 18/04/2019 V12 -> pictures should save correctly, even animated
// 19/04/2019 V13 -> added VN like commands
// 20/04/2019 V14 -> added fadein, and move picture relatively commands
// 21/04/2019 V15 -> fixed bitmap not updating when showing another picture
//=============================================================================
 

/*:
 * @plugindesc Allows animating pictures
 * @author Astfgl
 * @help 
 * ===================================================================
 * Animation setup:
 * ===================================================================
 * First, setup the pictures using the event commands.
 * Then use the following script call:
 * $gameScreen.picture(pictureId).setAnim([array],interval);
 * Replace array by the file names without the extension, surrounded by "" and
 * separated by ",".
 * Ex: ["mouth_closed","mouth_1","mouth_2","mouth_3"]
 * These will be, in order the pictures displayed for the animations.
 * The first picture will be used when the animation is paused.
 *
 * Then replace interval by a number, this will be the number of frames
 * between image changes.
 * Ex: 5
 *
 * Ex: $gameScreen.picture(2).setAnim(["mouth_closed","mouth_1","mouth_2","mouth_3"],5)
 * This will cause the picture to loop between the frames you set in the array
 * until told to stop.
 *
 * ===================================================================
 * Freezing an animation
 * ===================================================================
 * You can tell a picture to stop looping by using:
 * $gameScreen.picture(pictureId).freeze();
 * It will set the picture to the first image in the list and stop it from looping.
 * Notice: when synching the animation to a message, it will freeze and unfreeze the
 * animation automatically when the message pauses. So you have to remove the animation
 * if you don't want it synching with a message, not freeze it.
 * This command is for out of message use.
 *
 * You can tell a picture to begin looping again by using:
 * $gameScreen.picture(pictureId).unfreeze();
 * This will make the picture start looping again, starting at the first frame.
 * Again, same disclaimer as for the freeze command: intended for out of message use.
 *
 * ===================================================================
 * Synchronizing an animation with a message box
 * ===================================================================
 * In order to synch up a picture looping animation to a message window use:
 * $gameMessage.setAnim(pictureId)
 *
 * Ex: $gameMessage.setAnim(2)
 * This will cause the picture to synch up its looping animation with the message
 * window: it will loop while text is writing, stop for pauses and between windows.
 * Using fast forward will make it skip the animation altogether.
 *
 * If you want a picture to no longer synch up with the message window, use:
 * $gameMessage.removeAnim(pictureId)
 *
 * Ex: $gameMessage.removeAnim(2)
 *
 * ===================================================================
 * Frozen or message end picture outside of animation loop
 * ===================================================================
 * By default the plugin will use the first image in the array as the frozen or
 * message end picture. If you would like to define a frozen picture outside of
 * the loop you can use the following command:
 * $gameScreen.picture(pictureId).setFrozenBmp(filename);
 *
 * Ex: $gameScreen.picture(2).setFrozenBmp("mouth_closed")
 *
 * If you would like to remove a frozen picture and start using the first picture
 * of the loop again, use the following command:
 *
 * $gameScreen.picture(pictureId).removeFrozenBmp()
 *
 * Ex: $gameScreen.picture(2).removeFrozenBmp()
 * ===================================================================
 * Wait time in between animation loops:
 * ===================================================================
 * If you want to pause the picture in between loops, use the following:
 * $gameScreen.picture(pictureId).setLoopInterval(number)
 *
 * Ex: $gameScreen.picture(2).setLoopInterval(60)
 * This will make the picture wait 60 frames before each animation loop.
 *
 * If you want to remove the wait between loops, use:
 * $gameScreen.picture(pictureId).removeLoopInterval();
 *
 * Ex: $gameScreen.picture(2).removeLoopInterval();
 *
 * Both of these commands are intended for out of message use.
 *
 * ===================================================================
 * Run animation loop only X times:
 * ===================================================================
 * If you'd like the animation loop to only run on certain amount of
 * times, use:
 * $gameScreen.picture(pictureId).setLoopTimes(number)
 * 
 * Ex: $gameScreen.picture(2).setLoopTimes(5)
 * This will cause the picture to loop 5 times and them freeze itself,
 * until the loop times are removed or set again.
 *
 * If you want to remove the limitation, use:
 * $gameScreen.picture(pictureId).removeLoopTimes();
 *
 * Ex: $gameScreen.picture(2).removeLoopTimes();
 *
 * Both of these commands are intended for out of message use.
 *
 *
 * ===================================================================
 * Changing the frame Rate
 * ===================================================================
 * If you'd like to change the frame rate of the picture you can use the
 * following command:
 *
 * $gameScreen.picture(pictureId).setFrameRate(number)
 *
 * Ex: $gameScreen.picture(2).setFrameRate(10)
 * This will set picture 2 framerate to 10.
 *
 * ===================================================================
 * Text codes:
 * ===================================================================
 * This will also add several escape codes to use with message boxes:
 * \fa[pictureId] this will freeze the target picture animation. Again, if the animation
 * is synched it won't have any effect.
 *
 * \ufa[pictureId] this will unfreeze the target picture animation. Just as above,
 * if the animation is synched it won't have any effect.
 *
 * \da[pictureId] this will desynchronise the target picture animation with the 
 * message window and automatically freeze it. Unfreeze it after if you'd rather
 * it kept running.
 *
 * \sa[pictureId] this will synchronize the target picture animation with the
 * message window. 
 *
 * \ca[variableId] this will create an animation, you must have a picture already shown.
 * First you must setup a variable using the control variable: script command
 * the following way:
 * Control variables: script: [id,[spriteArray],interval,frozenBmp*,loopInterval*,loopTimes*].
 * Replace id by the picture id you want to animate.
 * Replace sprite array by the array of sprite names.
 * Replace interval by a number.
 * frozenBmp can be omitted, if it is present it will set the new animation to use
 * the file name you replace frozenBmp by as its frozen frame.
 * loopInterval can be omitted but you must provide a frozenBmp to be able to use it
 * it will set a wait time between loops, replace it with a number.
 * loopTimes can be omitted but you must provide a  frozenBmp and a loopInterval to
 * be able to use it. Replace it with a number, this will be the number of times the
 * animation will repeat. 
 *
 * Ex: Control variables: script:[1,["mouth_closed","mouth_1","mouth_2","mouth_3"],5,"mouth_frozen"];
 * Then in the message use \ca[variableId], replacing variableId by the id of the
 * variable you just used.
 * So if you used variable 1, use \ca[1].
 * This will start the animation on target picture (1 here) using the sprites in the array, 
 * and the interval there too, when the message reaches that point.
 * It will also synchronize it automatically.
 *
 * ===================================================================
 * Saving and loading animated pictures
 * ===================================================================
 * As of v12, there should no longer be a bug when saving pictures.
 * This is thanks to user kako05 on rpgmakerweb.com forums who commissionned
 * me for a fix.
 * ===================================================================
 * VN Commands
 * ===================================================================
 * As of V13, several VN like commands have been added to facilitate your life.
 *
 * -------------------------------------------------------------------
 * Light picture:
 * This will set the picture tone to (0,0,0,0), basically fully bright, over
 * the course of 30frames, acting like if the bust was selected.
 *
 * Script call:
 * $gameScreen.picture(id).light(duration)
 * duration is optionnal, if unspecified, will do it over 30 frames.
 * 
 * Text code:
 * \LP[pictureId]
 * You can't specifiy a duration if doing it via textcode.
 * -------------------------------------------------------------------
 * Dim picture:
 * This will set the picture tone to (0,0,0,255), basically fully grey, over
 * the course of 30frames, acting like if the bust was unselected.
 *
 * Script call:
 * $gameScreen.picture(id).dim(duration)
 * duration is optionnal, if unspecified, will do it over 30 frames.
 * 
 * Text code:
 * \DP[pictureId]
 * You can't specifiy a duration if doing it via textcode.
 * -------------------------------------------------------------------
 * Move picture home:
 * This will set  move the picture to its original coordinates over the
 * course of 30 frames.
 *
 * Script call:
 * $gameScreen.picture(id).moveHome(duration)
 * duration is optionnal, if unspecified, will do it over 30 frames.
 * 
 * Text code:
 * \MPH[pictureId]
 * You can't specifiy a duration if doing it via textcode.
 * -------------------------------------------------------------------
 * Fadeout picture:
 * This will move the picture back 20 pixels in either direction,
 * set its tone to grey, and change its opacity to 0 over the course of
 * 30 frames before deleting it, erasing the bust from the screen.
 *
 * Script call:
 * $gameScreen.picture(id).fadeout(duration,direction,distance)
 * duration is optionnal, if unspecified, will do it over 30 frames.
 * direction is optionnal as well, 1 will move the picture left, -1 right.
 * distance is optionnal and is to be given in pixels
 * If you want to specifiy a direction, you must specify a duration.
 * If you want to specify a distance you must specify both other parameters.
 * You can only specify a duration if you want to.
 * 
 * Text code:
 * \CPR[pictureId] this will fadeout the picture to the right
 * \CPL[pictureId] this will fadeout the picture to the left
 * You can't specifiy a duration if doing it via textcode.
 * -------------------------------------------------------------------
 * Fadein picture:
 * This will move the picture forward 20 pixels in either direction,
 * set its tone to bright, and change its opacity to 255 over the course of
 * 30 frames, acting as if the picture appeared.
 *
 * Script call:
 * $gameScreen.picture(id).fadein(duration,direction,distance)
 * duration is optionnal, if unspecified, will do it over 30 frames.
 * direction is optionnal as well, 1 will move the picture left, -1 right.
 * distance is optionnal and is to be given in pixels
 * If you want to specify a distance you must specify both other parameters.
 * If you want to specifiy a direction, you must specify a duration.
 * You can only specify a duration if you want to.
 * 
 * Text code:
 * \FPR[pictureId] this will fadeout the picture to the right
 * \FPL[pictureId] this will fadeout the picture to the left
 * You can't specifiy a duration if doing it via textcode.
 * -------------------------------------------------------------------
 * Move picture:
 * This will move the picture relatively to its current position.
 *
 * Script call:
 * $gameScreen.picture(id).movePictureRel(x,y,t)
 * x and y are the amount of pixels you want the picture to move
 * t is the duration in frames
 * y and t are optionnal, if omitted the picture won't move on the y
 * axis and the x movement will be done over 30 frames.
 * 
 * Text code:
 * \MPR[pictureId,x,y,t]
 */
 
 var Imported = Imported || {};
 (function(){
	Game_Message.prototype.setAnim = function(picId) {
		SceneManager._scene._messageWindow.setAnim(picId);
	}
	
	
	Window_Message.prototype.setAnim = function(picId) {
		this._anim = true;
		if (!this._picIds) {
			this._picIds = [];
		}
		if (!this._picIds.contains(picId)) {
			this._picIds.push(picId);
		}
	}
	
	Game_Message.prototype.removeAnim = function(picId) {
		SceneManager._scene._messageWindow.removeAnim(picId);
	}
	
	Window_Message.prototype.removeAnim = function(picId) {
		if (this._picIds) {
			for (var i = 0; i  < this._picIds.length; i++) {
				if (this._picIds[i] === picId) {
					this._picIds.splice(i,1);
				}
			}
		}
	}
	
	var _Astfgl_newWMU = Window_Message.prototype.update
	Window_Message.prototype.update = function() {
		_Astfgl_newWMU.call(this);
		if (this._anim) {
			 if (this._waitCount > 0 || this.pause || !this._textState) {
				this._picIds.forEach(function(num){
					$gameScreen.picture(num).freeze();
				})
			 } else {
				this._picIds.forEach(function(num){
					$gameScreen.picture(num).unfreeze();
				})
			 }
		}
	}
	
	var _Astfgl_newGPIB = Game_Picture.prototype.initBasic
	Game_Picture.prototype.initBasic = function() {
		this._animated = false;
		this._interval = 0;
		this._timer = 0;
		this._index = 0;
		this._frozen = false;
		this._bmpArray = [];
	}
	
	Game_Picture.prototype.setAnim = function(sprArray,interval) {
		if (!Imported["SumRndmDde Camera Core"]) {
			var spr = SceneManager._scene._spriteset._pictureContainer.children[this.id - 1];
		} else {
			var spr = SceneManager._scene._pictureContainer.children[this.id - 1];
		}
		spr._bmpArray = [];
		this._animated = true;
		this._interval = interval;
		this._bmpArraySave = []
		for (var i = 0; i < sprArray.length; i++) {
			spr._bmpArray.push(ImageManager.loadPicture(sprArray[i]))
			this._bmpArraySave.push(sprArray[i])
		}
	}
	
	Game_Picture.prototype.setFrozenAnim = function(sprArray,interval) {
		if (!Imported["SumRndmDde Camera Core"]) {
			var spr = SceneManager._scene._spriteset._pictureContainer.children[this.id - 1];
		} else {
			var spr = SceneManager._scene._pictureContainer.children[this.id - 1];
		}
		this._Fanimated = true;
		this._Finterval = interval;
		this._Ftimer = 0;
		this._Findex = 0;
		spr._FbmpArray = [];
		this._FbmpArraySave = [];
		for (var i = 0; i < sprArray.length; i++) {
			spr._FbmpArray.push(ImageManager.loadPicture(sprArray[i]))
			this._FbmpArraySave.push(sprArray[i])
		}
	}
	
	Game_Picture.prototype.removeFrozenAnim = function() {
		if (!Imported["SumRndmDde Camera Core"]) {
			var spr = SceneManager._scene._spriteset._pictureContainer.children[this.id - 1];
		} else {
			var spr = SceneManager._scene._pictureContainer.children[this.id - 1];
		}
		delete this._Fanimated
		delete this._Finterval
		delete this._Ftimer
		delete this._Findex
		delete spr._FbmpArray
	}
	
	Game_Picture.prototype.setFrozenBmp = function(path) {
		if (!Imported["SumRndmDde Camera Core"]) {
			var spr = SceneManager._scene._spriteset._pictureContainer.children[this.id - 1];
		} else {
			var spr = SceneManager._scene._pictureContainer.children[this.id - 1];
		}
		spr._frozenBmp = ImageManager.loadPicture(path);
		this._frozenBmpSave = path
	}
	
	Game_Picture.prototype.removeFrozenBmp = function() {
		if (!Imported["SumRndmDde Camera Core"]) {
			var spr = SceneManager._scene._spriteset._pictureContainer.children[this.id - 1];
		} else {
			var spr = SceneManager._scene._pictureContainer.children[this.id - 1];
		}
		delete spr._frozenBmp;
	}
	
	var _Astfgl_newGPU = Game_Picture.prototype.update
	Game_Picture.prototype.update = function() {
		_Astfgl_newGPU.call(this);
		if (this._animated) {
			this.updateAnim();
		}
	}
	
	Game_Picture.prototype.updateAnim = function() {
		if (!Imported["SumRndmDde Camera Core"]) {
			var spr = SceneManager._scene._spriteset._pictureContainer.children[this.id - 1];
		} else {
			var spr = SceneManager._scene._pictureContainer.children[this.id - 1];
		}
		if (this._bmpArraySave && !spr._bmpArray) {
			spr._bmpArray = [];
			for (var i = 0; i < this._bmpArraySave.length; i++) {
				spr._bmpArray.push(ImageManager.loadPicture(this._bmpArraySave[i]))
			}
		}
		if (this._frozenBmpSave && !spr._frozenBmp) {
			spr._frozenBmp = ImageManager.loadPicture(this._frozenBmpSave)
		}
		if (this._FbmpArraySave && !spr._FbmpArray) {
			spr._FbmpArray = [];
			for (var i = 0; i < this._FbmpArraySave.length; i++) {
				spr._FbmpArray.push(ImageManager.loadPicture(this._FbmpArraySave[i]))
			}
		}
		if (this._animated) {
			this._timer += 1;
			if (this._timer >= this._interval) {
				this._timer = 0;
				this._index += 1;
			}
			if (this._index >= spr._bmpArray.length) {
				this._index = 0;
				if (this._loopInterval) {
					this._loopTime = this._loopInterval;
				}
				if (this._loopLimit) {
					this._loopTimes -= 1;
				}
			}
			if (this._loopInterval) {
				if (this._loopTime > 0) {
					this._loopTime -= 1;
					this.freeze();
				}
				if (this._loopTime <= 0) {
					this.unfreeze();
				}
			}
			if (this._loopLimit && this._loopTimes <= 0) {
				this.freeze();
			}
			if (this._frozen) {
				this._index = 0;
				this._timer = 0;
			} else {
				this._Findex = 0;
				this._Ftimer = 0;
			}
			if (spr) {
				spr.updateBitmap(this);
			}
		}
	}
	
	var _Astfgl_aliasSPUB = Sprite_Picture.prototype.updateBitmap
	Sprite_Picture.prototype.updateBitmap = function() {
		if (this._bmpArray) {
			var pic = this.picture();
			if (!pic || !pic._animated) {_Astfgl_aliasSPUB.call(this); return}
			this.bitmap = this._bmpArray[pic._index]
			if (pic._frozen && this._frozenBmp) {
				this.bitmap = this._frozenBmp;
			} else if (pic._frozen && pic._Fanimated) {
				pic._Ftimer += 1;
				if (pic._Ftimer >= pic._Finterval) {
					pic._Ftimer = 0;
					pic._Findex += 1;
				}
				if (pic._Findex >= this._FbmpArray.length) {
					pic._Findex = 0;
				}
				this.bitmap = this._FbmpArray[this._Findex]
			}
			this.visible = true
		} else {
			_Astfgl_aliasSPUB.call(this)
		}
	}
	
	Game_Picture.prototype.freeze = function() {
		this._frozen = true;
	}
	
	Game_Picture.prototype.unfreeze = function() {
		this._frozen = false;
	}

	Game_Picture.prototype.setLoopInterval = function(num) {
		this._loopTime = 0;
		this._loopInterval = num;
	}
	
	Game_Picture.prototype.removeLoopInterval = function() {
		delete this._loopTime;
		delete this._loopInterval;
		this.unfreeze();
	}
	
	Game_Picture.prototype.setLoopTimes = function(num) {
		this._loopLimit = true;
		this._loopTimes = num;
	}
	
	Game_Picture.prototype.removeLoopTimes = function() {
		delete this._loopLimit;
		delete this._loopTimes;
	}
	
	var _Astfgl_newGSSP = Game_Screen.prototype.showPicture
	Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                             scaleX, scaleY, opacity, blendMode) {
		_Astfgl_newGSSP.call(this,pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
		var realPictureId = this.realPictureId(pictureId);
		this._pictures[realPictureId].id = realPictureId;
		this._pictures[realPictureId]._homeX = x;
		this._pictures[realPictureId]._homeY = y;
		if (!Imported["SumRndmDde Camera Core"]) {
			var spr = SceneManager._scene._spriteset._pictureContainer.children[pictureId - 1];
		} else {
			var spr = SceneManager._scene._pictureContainer.children[pictureId - 1];
		}
		spr.updateBitmap();
	}
	
	var _Astfgl_newGSEP = Game_Screen.prototype.erasePicture
	Game_Screen.prototype.erasePicture = function(id) {
		_Astfgl_newGSEP.call(this,id);
		if (SceneManager._scene._messageWindow) {
			if (SceneManager._scene._messageWindow._anim) {
				SceneManager._scene._messageWindow._anim = false;
				for (var i = 0; i < SceneManager._scene._messageWindow._picIds.length; i++) {
					if (SceneManager._scene._messageWindow._picIds[i] === id) {
						SceneManager._scene._messageWindow._picIds.splice(i,1);
					}
				}
			}
		}
	}
	
	var _Astfgl_newWBCEC = Window_Message.prototype.processEscapeCharacter
	Window_Message.prototype.processEscapeCharacter = function(code, textState) {
		_Astfgl_newWBCEC.call(this,code,textState);
		if (code === 'FA') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).freeze();
		} else if (code === 'UFA') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).unfreeze();
		} else if (code === 'DA') {
			var num = Number(this.obtainEscapeParam(textState));
			$gameScreen.picture(num).freeze();
			this.removeAnim(num);
		} else if (code === 'SA') {
			this.setAnim(Number(this.obtainEscapeParam(textState)));
		} else if (code === 'CA') {
			var array = $gameVariables.value(this.obtainEscapeParam(textState));
			var id = array[0];
			var arr = array[1];
			var num = array[2];
			$gameScreen.picture(id).setAnim(arr,num);
			this.setAnim(id);
			if (array[3]) {
				$gameScreen.picture(id).setFrozenBmp(array[3]);
			}
			if (array[4]) {
				$gameScreen.picture(id).setLoopInterval(array[4]);
			}
			if (array[5]) {
				$gameScreen.picture(id).setLoopTimes(array[5]);
			}
		} else if (code === 'LP') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).light();
		} else if (code === 'DP') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).dim();
		} else if (code === 'MPH') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).moveHome(30);
		} else if (code === 'CPR') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).fadeout(30,-1);
		} else if (code === 'CPL') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).fadeout(30,1);
		} else if (code === 'FPR') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).fadein(30,-1);
		} else if (code === 'FPL') {
			$gameScreen.picture(Number(this.obtainEscapeParam(textState))).fadein(30,1);
		} else if (code === 'MPR') {
			var ar = this.obtainEscapeParamArray(textState);
			$gameScreen.picture(Number(ar[0])).movePictureRel(Number(ar[1]),Number(ar[2]),Number(ar[3]))
		}
	}
	
	Game_Picture.prototype.setFrameRate = function(num) {
		this._interval = num;
	}
	
	Game_Picture.prototype.light = function(t) {
		var t = t || 30;
		this.tint([0,0,0,0],t);
	}
	
	Game_Picture.prototype.dim = function(t) {
		var t = t || 30;
		this.tint([0,0,0,255],t);
	}
	
	Game_Picture.prototype.moveHome = function (t) {
		var t = t || 30;
		this.move(this._origin, this._homeX, this._homeY, this._scaleX, this._scaleY, this._opacity, this._blendMode, t)
	}
	
	Game_Picture.prototype.fadeout = function(t, dir, dist) {
		var t = t || 30;
		var dir = dir || 1;
		var dist = dist || 20;
		this.move(this._origin, this._x - dist * dir, this._y, this._scaleX, this._scaleY, 0, this._blendMode, t)
		this.tint([0,0,0,255],t);
		this._toClear = true;
	}
	
	Game_Picture.prototype.fadein = function(t,dir, dist) {
		var t = t || 30
		var dir = dir || 1;
		var dist = dist || 20;
		this.move(this._origin, this._x - dist * dir, this._y, this._scaleX, this._scaleY, 255, this._blendMode, t)
		this.tint([0,0,0,0],t);
	}
	
	Game_Picture.prototype.movePictureRel = function(x,y,t) {
		var t = t || 30;
		var y = y || 0;
		this.move(this._origin, this._x + x, this._y + y, this._scaleX, this._scaleY, this._opacity, this._blendMode, t)
	}
	
	Window_Base.prototype.obtainEscapeParamArray = function(textState) {
		var arr = /^\[.+\]/.exec(textState.text.slice(textState.index));
		if (arr) {
			textState.index += arr[0].length;
			arr[0] = arr[0].substring(1,arr[0].length-1)
			var list = arr[0].split(",")
			return list;
		} else {
			return '';
		}
	};
	
	var _Astfgl_aliasNewGPUM = Game_Picture.prototype.updateMove
	Game_Picture.prototype.updateMove = function() {
		_Astfgl_aliasNewGPUM.call(this);
		if (this._duration === 0 && this._toClear) {
			$gameScreen.erasePicture(this.id)
		}
	}

 })()