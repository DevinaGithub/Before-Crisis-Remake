//=============================================================================
// KMS_SpiralEncount.js
//   Last update: 2016/12/23
//=============================================================================

/*
 * This plugin can be used in the environment which supports WebGL.
 */

/*:
 * @plugindesc
 * [v1.0.0] Applies spiral encounter effect.
 * 
 * @author TOMY (Kamesoft)
 *
 * @param Speed
 * @default 0.2
 * @desc Effect speed.
 *
 * @param Radius
 * @default 1.0
 * @desc Effect range. 1.0 is same as screen size.
 *
 * @param Show characters
 * @default 0
 * @desc
 * Show characters or not.
 * 0: hide, 1: show
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc
 * [v1.0.0] エンカウント時に画面を回転させるエフェクトを適用します。
 * 
 * @author TOMY (Kamesoft)
 *
 * @param Speed
 * @default 0.2
 * @desc 回転の速度です。
 *
 * @param Radius
 * @default 1.0
 * @desc エフェクトの適用半径です。1.0 で画面サイズ相当です。
 *
 * @param Show characters
 * @default 0
 * @desc
 * エフェクト時にキャラクターを表示するか指定します。
 * 0: 非表示, 1: 表示
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function()
{

if (!Graphics.hasWebGL())
{
    console.error("WebGL をサポートしていないため、フィルターを使用できません。");
    return;
}

var PixiVersion = PIXI.TwistFilter ? 2 : 4;

var pluginParams = PluginManager.parameters('KMS_SpiralEncount');
var Params = {};
Params.angleSpeed = Number(pluginParams['Speed']  || 0.2);
Params.radius     = Number(pluginParams['Radius'] || 1.5);
Params.showCharacters = Boolean(Number(pluginParams['Show characters'] || 0));

if (Params.showCharacters)
{
    Scene_Map.prototype.startEncounterEffect = function()
    {
        this._encounterEffectDuration = this.encounterEffectSpeed();
    };
}

// ================ From pixi-filters ================

if (PixiVersion > 2)
{

/**
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 *
 * pixi-filters : https://github.com/pixijs/pixi-filters
 */

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function TwistFilter()
{
    PIXI.Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n"
    );

    this.radius = 200;
    this.angle = 4;
    this.padding = 20;
}

TwistFilter.prototype = Object.create(PIXI.Filter.prototype);
TwistFilter.prototype.constructor = TwistFilter;
//module.exports = TwistFilter;

Object.defineProperties(TwistFilter.prototype, {
    /**
     * This point describes the the offset of the twist.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TwistFilter#
     */
    offset: {
        get: function()
        {
            return this.uniforms.offset;
        },
        set: function(value)
        {
            this.uniforms.offset = value;
        }
    },

    /**
     * This radius of the twist.
     *
     * @member {number}
     * @memberof PIXI.filters.TwistFilter#
     */
    radius: {
        get: function()
        {
            return this.uniforms.radius;
        },
        set: function(value)
        {
            this.uniforms.radius = value;
        }
    },

    /**
     * This angle of the twist.
     *
     * @member {number}
     * @memberof PIXI.filters.TwistFilter#
     */
    angle: {
        get: function()
        {
            return this.uniforms.angle;
        },
        set: function(value)
        {
            this.uniforms.angle = value;
        }
    }
});

}  // For Pixi v4

// ================================================

/*
 * 回転エンカウントエフェクトの適用
 */
Scene_Map.prototype.applySpiralEncounterEffect = function()
{
    if (PixiVersion == 2)
    {
        this._encounterFilter = new PIXI.TwistFilter();
        this._encounterFilter.angle  = 0;
        this._encounterFilter.radius = Params.radius;
    }
    else
    {
        // For Pixi v4
        this._encounterFilter = new TwistFilter();
        this._encounterFilter.angle  = 0;
        this._encounterFilter.radius =
            Math.max(Graphics.width, Graphics.height) * Params.radius / 2;
        this._encounterFilter.offset =
            new PIXI.Point(Graphics.width / 2, Graphics.height / 2);
    }

    if (this._spriteset.filters instanceof Array)
    {
        // filters に再代入しないとフィルターが変更されない
        var newFilters = this._spriteset.filters;
        newFilters.push(this._encounterFilter);
        this._spriteset.filters = newFilters;
    }
    else
    {
        this._spriteset.filters = [this._encounterFilter];
    }

    // フィルタの適用範囲 (指定しないとキャプチャできなくなる)
    var margin = 48;
    var width  = Graphics.width + margin;
    var height = Graphics.height + margin;
    this._spriteset.filterArea = new Rectangle(-margin, -margin, width, height);
};

var _KMS_SpiralEncount_Scene_Map_updateEncounterEffect = Scene_Map.prototype.updateEncounterEffect;
Scene_Map.prototype.updateEncounterEffect = function()
{
    var needEffectUpdate = this._encounterEffectDuration > 0;

    _KMS_SpiralEncount_Scene_Map_updateEncounterEffect.call(this);

    if (needEffectUpdate)
    {
        var speed = this.encounterEffectSpeed();
        var n = speed - this._encounterEffectDuration;
        if (n === 2 && Graphics.isWebGL())
        {
            this.applySpiralEncounterEffect();
        }

        if (this._encounterFilter)
        {
            this._encounterFilter.angle += Params.angleSpeed;
        }
    }
};

})();
