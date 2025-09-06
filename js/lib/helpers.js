/**************
RANDOM CRAP TO MAKE MY LIFE EASIER
***************/

Math.TAU = Math.PI*2;

// ANIMATION CRAP
var BEAT = 1;
var Tween_get = function(target, props){
	props = {} || props;
	props.useTicks = true;
	return Tween.get(target, props);
}
var _s = function(seconds){
	return Math.ceil(Ticker.framerate*seconds); // converts seconds to ticks
};

// IMAGE CRAP
var MakeSprite = function(textureName){
	return new PIXI.Sprite(PIXI.loader.resources[textureName].texture);
}

// MovieClips!
var MakeMovieClip = function(resourceName){

	// Use the image file directly
	var resources = PIXI.loader.resources;
	var resource = resources[resourceName];
	var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(resource.url));

	sprite.anchor.x = 0.5;
	sprite.anchor.y = 1.0;
	return sprite;

};