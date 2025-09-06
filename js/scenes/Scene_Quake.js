// Scene_Quake.js
// Τέταρτο act: Σεισμός

Game.addToManifest({
    quake_sound: "sounds/quake_sound.mp3"
});

function Scene_Quake() {
    var self = this;
    Scene.call(self);

    // play quake sound
    var quake_sound = Game.sounds.quake_sound;
    quake_sound.loop(true);
    quake_sound.volume(1);
    quake_sound.play();

    // Graphics container (single instance)
    self.graphics = new PIXI.Container();
    Game.stage.addChild(self.graphics);

    // World (background: quake)
    self.world = new World(self, {bg: "quake"}); 

    // Layer 
    var quakeOverlay = new PIXI.Graphics();
    self.graphics.addChild(quakeOverlay);

    // Animation state
    var quakeProgress = 0; // 0 (ηρεμία) -> 1 (έντονος σεισμός)
    var quaking = true;

    var crackPoints = [
        {x: Game.width * 0.22, y: Game.height * 0.7},
        {x: Game.width * 0.5, y: Game.height * 0.75},
        {x: Game.width * 0.78, y: Game.height * 0.72}
    ];

    var crackSprites = [];
    for (var i = 0; i < crackPoints.length; i++) {
        var sprite = new PIXI.Sprite(PIXI.Texture.fromImage('sprites/quake_crack.png'));
        sprite.anchor.set(0.5);
        self.graphics.addChild(sprite);
        crackSprites.push(sprite);
    }

        var quakeSmoke = new PIXI.Sprite(PIXI.Texture.fromImage('sprites/brown_smoke.png'));
        quakeSmoke.anchor.set(0, 0);
        quakeSmoke.x = 0;
        quakeSmoke.y = 0;
        quakeSmoke.width = Game.width;
        quakeSmoke.height = Game.height;
        self.graphics.addChild(quakeSmoke);

    // Κείμενο
    var titleText = new PIXI.Text(textStrings["wmwww_feed_caption_quake"], {font: "36px Cairo", fill: "#fff", align: "center"});
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
        if (quaking && quakeProgress < 1) {
            quakeProgress += 0.002;
        }
        drawQuakeOverlay(quakeProgress);
        if (self.camera && self.camera.update) self.camera.update();
    };

    function drawQuakeOverlay(progress) {
        quakeOverlay.clear();
        // Εφέ δόνησης 
        var shakeX = Math.sin(performance.now() / 80) * 10 * progress;
        var shakeY = Math.cos(performance.now() / 100) * 8 * progress;
        self.graphics.x = shakeX;
        self.graphics.y = shakeY;
        // Cracks 
        var t = performance.now() / 1000;
        for (var i = 0; i < crackPoints.length; i++) {
            var px = crackPoints[i];
            var sprite = crackSprites[i];
            // Jitter
            var jitterX = (Math.random() - 0.5) * 18 * progress;
            var jitterY = (Math.random() - 0.5) * 18 * progress;
            // Animation
            var baseScale = 1 + 1.5 * progress;
            sprite.x = px.x + jitterX;
            sprite.y = px.y + jitterY;
            sprite.width = sprite.height = 120 * baseScale;
            sprite.alpha = 0.95;
        }
    }

    // Director animation/callbacks
    self.director.callbacks = {
        takePhoto: function(d) {
            self.tv.placePhoto({
                photo: d.photoTexture,
                text: textStrings["wmwww_feed_caption_quake"]
            });
        },
        movePhoto: function(d) {
            d.audience_movePhoto();
        },
        cutToTV: function(d) {
            d.audience_cutToTV();
            setTimeout(function() {
                if (Game.sceneManager) {
                    Game.sceneManager.gotoScene('PlasticOcean'); 
                }
                Game.sounds.quake_sound.stop();
            }, 1000);
        }
    };

    // Όταν τραβηχτεί φωτογραφία από την Camera
    self.camera.onPhoto = function(photoTexture) {
        quaking = false;
        if (window.addToFeed) {
            window.addToFeed({
                image: 'quake',
                caption: textStrings["wmwww_feed_caption_quake"]
            });
        }
        self.director.takePhoto(self.camera);
    };

    // Καθαρισμός
    self.kill = function() {
        self.graphics.x = 0;
        self.graphics.y = 0;
        Game.stage.removeChildren();
    };
}
