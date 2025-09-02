// Scene_IceMelt.js
// Δεύτερο act: Πάγος που λιώνει

Game.addToManifest({
    ice_sound: "sounds/ice.mp3"
});


function Scene_IceMelt() {
    var self = this;
    Scene.call(self);

    // play ice sound
    var iceSound = Game.sounds.ice_sound;
    iceSound.loop(true);
    iceSound.volume(1);
    iceSound.play();

    // Graphics container (single instance)
    self.graphics = new PIXI.Container();
    Game.stage.addChild(self.graphics);

    // World (background: ice)
    self.world = new World(self, {bg: "ice"}); // Θα χρειαστεί να προσθέσεις sprites/ice.png ή .gif

    // Layer για νερό/λιώσιμο πάνω από το background
    var meltOverlay = new PIXI.Graphics();
    self.graphics.addChild(meltOverlay);

    // Animation state
    var meltProgress = 0; // 0 (πάγος) -> 1 (νερό)
    var melting = true;
    // Ice crack positions (ενδεικτικά σημεία)
    var crackPoints = [
        {x: Game.width * 0.25, y: Game.height * 0.35},
        {x: Game.width * 0.5, y: Game.height * 0.32},
        {x: Game.width * 0.75, y: Game.height * 0.37}
    ];
    // Δημιουργία crack sprites (αν έχεις ice_crack.png)
    var crackSprites = [];
    for (var i = 0; i < crackPoints.length; i++) {
        var sprite = new PIXI.Sprite(PIXI.Texture.fromImage('sprites/ice_crack.png'));
        sprite.anchor.set(0.5);
        self.graphics.addChild(sprite);
        crackSprites.push(sprite);
    }

    // Κείμενο τίτλου
    var titleText = new PIXI.Text(textStrings["wmwww_ice_melts"], {font: "36px Cairo", fill: "#fff", align: "center"});
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
        if (melting && meltProgress < 1) {
            meltProgress += 0.002;
        }
        drawMeltOverlay(meltProgress);
        if (self.camera && self.camera.update) self.camera.update();
    };

    function drawMeltOverlay(progress) {
        meltOverlay.clear();
        // Εφέ νερού/λιώσιμου
        meltOverlay.beginFill(0x66ccff, 0.12 * progress);
        meltOverlay.drawRect(0, Game.height - 180, Game.width, 180 * progress);
        meltOverlay.endFill();
        // Cracks (αν έχεις crack sprites)
        var t = performance.now() / 1000;
        for (var i = 0; i < crackPoints.length; i++) {
            var px = crackPoints[i];
            var sprite = crackSprites[i];
            // Jitter
            var jitterX = (Math.random() - 0.5) * 8;
            var jitterY = (Math.random() - 0.5) * 8;
            // "Αναπνοή"
            var baseRadius = 180 + 180 * progress;
            var pulse = Math.sin(t * 1.5 + i) * 16 * (1 - 0.5 * progress); // πιο αργό, πιο ομαλό
            var radius = baseRadius + pulse;
            // Animation: smooth fall down as ice melts
            var ease = 1 - Math.pow(1 - progress, 2); // ease-out
            var fallY = px.y + (Game.height - px.y - 80) * ease;
            sprite.x = px.x + jitterX;
            sprite.y = fallY + jitterY;
            sprite.width = sprite.height = radius * 1.18;
            sprite.alpha = 0.96;
        }
    }

    // Director animation/callbacks: show photo on TV, then go to next scene
    self.director.callbacks = {
        takePhoto: function(d) {
            self.tv.placePhoto({
                photo: d.photoTexture,
                text: textStrings["wmwww_feed_caption_ice"]
            });
        },
        movePhoto: function(d) {
            d.audience_movePhoto();
        },
        cutToTV: function(d) {
            d.audience_cutToTV();
            setTimeout(function() {
                if (Game.sceneManager) {
                    Game.sceneManager.gotoScene('Flood'); // επόμενο act
                }
                Game.sounds.ice_sound.stop();
            }, 1000);
        }
    };

    // Όταν τραβηχτεί φωτογραφία από την Camera
    self.camera.onPhoto = function(photoTexture) {
        melting = false;
        if (window.addToFeed) {
            window.addToFeed({
                image: 'ice_melt',
                caption: textStrings["wmwww_feed_caption_ice"]
            });
        }
        self.director.takePhoto(self.camera);
    };

    // Καθαρισμός
    self.kill = function() {
        Game.stage.removeChildren();
    };
}
