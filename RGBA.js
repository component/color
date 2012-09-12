
/**
 * Module dependencies.
 */

var HSLA = require('./HSLA');

/**
 * Expose `HSLA`.
 */

exports = module.exports = RGBA;

/**
 * Initialize a new `RGBA` with the given r,g,b,a component values.
 *
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 * @api public
 */

function RGBA(r,g,b,a){
  if (!(this instanceof RGBA)) return new RGBA(r,g,b,a);
  this.r = clamp(r);
  this.g = clamp(g);
  this.b = clamp(b);
  this.a = clampAlpha(a);
  this.rgba = this;
}

/**
 * Convert to RGBA (return self).
 *
 * @return {RGBA}
 * @api public
 */

RGBA.prototype.toRGBA = function(){
  return this;
};

/**
 * Convert to HSLA.
 *
 * @return {HSLA}
 * @api public
 */

RGBA.prototype.toHSLA = function(){
  return HSLA.fromRGBA(this);
};

/**
 * Return #nnnnnn, #nnn, or rgba(n,n,n,n) string representation of the color.
 *
 * @return {String}
 * @api public
 */

RGBA.prototype.toString = function(){
  if (1 == this.a) {
    var r = pad(this.r);
    var g = pad(this.g);
    var b = pad(this.b);

    // Compress
    if (r[0] == r[1] && g[0] == g[1] && b[0] == b[1]) {
      return '#' + r[0] + g[0] + b[0];
    } else {
      return '#' + r + g + b;
    }
  } else {
    return 'rgba('
      + this.r + ','
      + this.g + ','
      + this.b + ','
      + (+this.a.toFixed(3)) + ')';
  }
};

/**
 * Return a `RGBA` from the given `hsla`.
 *
 * @param {HSLA} hsla
 * @return {RGBA}
 * @api public
 */

exports.fromHSLA = function(hsla){
  var h = hsla.h / 360
    , s = hsla.s / 100
    , l = hsla.l / 100
    , a = hsla.a;

  var m2 = l <= .5 ? l * (s + 1) : l + s - l * s
    , m1 = l * 2 - m2;

  var r = hue(h + 1/3) * 0xff
    , g = hue(h) * 0xff
    , b = hue(h - 1/3) * 0xff;

  function hue(h) {
    if (h < 0) ++h;
    if (h > 1) --h;
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
    return m1;
  }
  
  return new RGBA(r,g,b,a);
};

/**
 * Clamp `n` >= 0 and <= 255.
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function clamp(n) {
  return Math.max(0, Math.min(n.toFixed(0), 255));
}

/**
 * Clamp alpha `n` >= 0 and <= 1.
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function clampAlpha(n) {
  return Math.max(0, Math.min(n, 1));
}

/**
 * Pad `n` hex representation.
 *
 * @param {Number} n
 * @return {String}
 * @api public
 */

function pad(n) {
  return n < 16
    ? '0' + n.toString(16)
    : n.toString(16);
}