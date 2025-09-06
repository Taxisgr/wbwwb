Game.addToManifest({
	bg_creepy: "sounds/bg_creepy.mp3"
}, true);

function Scene_EndPrototype(){
	// Μετάβαση στα Credits μετά το τέλος
	setTimeout(function() {
		if (Game.sceneManager) {
			Game.sceneManager.gotoScene('Credits');
		}
	}, 20000); // 20 seconds for cinematic ending

	var self = this;
	Scene.call(self);
	
	// stop background music if any
	if(Game.sounds && Game.sounds.background_music){
		Game.sounds.background_music.stop();
	}
	// Graphics container
	self.graphics = new PIXI.Container();
	Game.stage.addChild(self.graphics);

	// Cinematic dark fade-in
	var blackout = new PIXI.Graphics();
	blackout.beginFill(0x000000, 1);
	blackout.drawRect(0, 0, Game.width, Game.height);
	blackout.endFill();
	self.graphics.addChild(blackout);

	// Destroyed earth background
	var bg = new PIXI.Sprite(PIXI.Texture.fromImage('sprites/earth_destroyed.png'));
	bg.anchor.set(0.5);
	bg.x = Game.width/2;
	bg.y = Game.height/2;
	bg.width = Game.width;
	bg.height = Game.height;
	bg.alpha = 0;
	self.graphics.addChild(bg);

	// Final message text (movie ending style, animated)
	var finalText = new PIXI.Text(textStrings["wmwww_final_message"], {
		font: "bold 36px Cairo",
		fill: "#fff",
		align: "center",
		wordWrap: true,
		wordWrapWidth: Game.width - 120,
		dropShadow: true,
		dropShadowColor: "#222",
		dropShadowBlur: 10,
		dropShadowDistance: 2
	});
	finalText.x = Game.width/2 - finalText.width/2;
	finalText.y = Game.height/2 - finalText.height/2;
	finalText.alpha = 0;
	self.graphics.addChild(finalText);

	// Fade-in sequence: blackout -> bg -> text
	Tween_get(blackout)
		.to({alpha:0.7}, _s(1.5))
		.to({alpha:0.3}, _s(1.5))
		.to({alpha:0}, _s(1.5));
	Tween_get(bg)
		.wait(_s(1.5))
		.to({alpha:1}, _s(2));
	Tween_get(finalText)
		.wait(_s(3))
		.to({alpha:0.98}, _s(2));

	// Subtle ambient sound (if available)
	if (Game.sounds && Game.sounds.bg_creepy) {
		Game.sounds.bg_creepy.volume(0.5);
		Game.sounds.bg_creepy.loop(true);
		Game.sounds.bg_creepy.play();
	}

	
	self.kill = function() {
		Game.stage.removeChildren();
	};
}