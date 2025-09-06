// Scene_Flood.js
// Τρίτο act: Πλημμύρα

Game.addToManifest({
    flood_sound: "sounds/flood_sound.mp3"
});

function Scene_Flood() {
    var self = this;
    Scene.call(self);

     // play flood sound
    var flood_sound = Game.sounds.flood_sound;
    flood_sound.loop(true);
    flood_sound.volume(1);
    flood_sound.play();

    // Graphics container (single instance)
    self.graphics = new PIXI.Container();
    Game.stage.addChild(self.graphics);

    // background: flood
    self.world = new World(self, {bg: "flood"}); 

    // Layer 
    var floodOverlay = new PIXI.Graphics();
    self.graphics.addChild(floodOverlay);

    // Animation state
    var floodProgress = 0; // 0 (ξηρά) -> 1 (πλημμυρισμένο)
    var flooding = true;
  
    var wavePoints = [
        {x: Game.width * 0.2, y: Game.height * 0.8},
        {x: Game.width * 0.5, y: Game.height * 0.85},
        {x: Game.width * 0.8, y: Game.height * 0.82}
    ];
   
    var waveSprites = [];
    for (var i = 0; i < wavePoints.length; i++) {
        var sprite = new PIXI.Sprite(PIXI.Texture.fromImage('sprites/flood_wave.png'));
        sprite.anchor.set(0.5);
        self.graphics.addChild(sprite);
        waveSprites.push(sprite);
    }

    // Κείμενο 
    var titleText = new PIXI.Text(textStrings["wmwww_flood"], {font: "36px Cairo", fill: "#fff", align: "center"});
    titleText.x = Game.width/2 - titleText.width/2;
    titleText.y = 40;
    self.graphics.addChild(titleText);

    // Camera, TV, Director
    self.camera = new Camera(self);
    self.tv = new TV(self);
    self.director = new Director(self);
    self.graphics.addChild(self.tv.graphics);

    // Animation loop
    self.update = function() {
        if (flooding && floodProgress < 1) {
            floodProgress += 0.002;
        }
        drawFloodOverlay(floodProgress);
        if (self.camera && self.camera.update) self.camera.update();
    };

    function drawFloodOverlay(progress) {
        floodOverlay.clear();
        // Εφέ νερού/κύματος
        floodOverlay.beginFill(0x3399ff, 0.18 * progress);
        floodOverlay.drawRect(0, Game.height - 220 * progress, Game.width, 220 * progress);
        floodOverlay.endFill();
        // Waves 
        var t = performance.now() / 1000;
        for (var i = 0; i < wavePoints.length; i++) {
            var px = wavePoints[i];
            var sprite = waveSprites[i];
            // Jitter 
            var jitterX = (Math.sin(t * 1.2 + i) * 18) * progress;
            var jitterY = (Math.cos(t * 1.5 + i) * 10) * progress;
            sprite.x = px.x + jitterX;
            sprite.y = px.y + jitterY;
            sprite.width = sprite.height = 180 + 120 * progress;
            sprite.alpha = 0.93;
        }
    }

    // Director animation/callbacks: show photo on TV, then go to next scene
    self.director.callbacks = {
        takePhoto: function(d) {
            self.tv.placePhoto({
                photo: d.photoTexture,
                text: textStrings["wmwww_feed_caption_flood"]
            });
        },
        movePhoto: function(d) {
            d.audience_movePhoto();
        },
        cutToTV: function(d) {
            d.audience_cutToTV();
            setTimeout(function() {
                if (Game.sceneManager) {
                    Game.sceneManager.gotoScene('Quake'); 
                }
                Game.sounds.flood_sound.stop();
            }, 1000);
        }
    };

    // Όταν τραβηχτεί φωτογραφία από την Camera
    self.camera.onPhoto = function(photoTexture) {
        flooding = false;
        if (window.addToFeed) {
            window.addToFeed({
                image: 'flood',
                caption: textStrings["wmwww_feed_caption_flood"]
            });
        }
        self.director.takePhoto(self.camera);
    };

    
    self.kill = function() {
        Game.stage.removeChildren();
    };
}
