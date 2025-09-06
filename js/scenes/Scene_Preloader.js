Game.addToManifest({
	bg_preload: "sprites/bg_preload.png",
	bg_preload_2: "sprites/bg_preload_2.png",
	preload_play: "sprites/misc/preload_play.json",
	squeak: "sounds/squeak.mp3"
}, true);

function Scene_Preloader(){
	
	var self = this;
	Scene.call(self);

	// Background only (use loaded texture directly)
	var bgTexture = PIXI.loader.resources["bg_preload"].texture;
	var bg = new PIXI.Sprite(bgTexture);
	bg.x = 0;
	bg.y = 0;
	Game.stage.addChild(bg);

	// Always show pointer cursor on stage
	Game.stage.interactive = true;
	Game.stage.cursor = 'pointer';

	// Button
	var button = new PIXI.Text("Start", {font:"32px Cairo", fill:"#FFFFFF", align:"center"});
	button.anchor.x = 0.5;
	button.anchor.y = 0.5;
	button.x = Game.width / 2;
	button.y = Game.height / 2 + 100;
	button.interactive = true;
	button.buttonMode = true;
	button.cursor = 'pointer';
	button.on('pointertap', function(){
		Game.sceneManager.gotoScene("Quote");
	});
	Game.stage.addChild(button);

}
