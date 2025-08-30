// Scene_ForestBurn.js
// Πρώτο act: Δάσος που καίγεται



function Scene_ForestBurn() {
    var self = this;
    Scene.call(self);

    // Graphics container
    self.graphics = new PIXI.Container();
    Game.stage.addChild(self.graphics);

    // World (για background και resource loading)
    self.world = new World(self, {bg: "forest"});

    // Layer για φωτιά/καπνό πάνω από το background
    var fireOverlay = new PIXI.Graphics();
    self.graphics.addChild(fireOverlay);

    // Animation state
    var burnProgress = 0; // 0 (καθαρό) -> 1 (καμένο)
    var burning = true;
    // Fire pixel positions (3 σημεία στη βάση του δάσους)
    var firePixels = [
        {x: Game.width * 0.15, y: Game.height - 105},
        {x: Game.width * 0.35, y: Game.height - 85},
        {x: Game.width * 0.51, y: Game.height - 115}
    ];
    // Δημιουργία fire sprites (gif)
    var fireSprites = [];
    for (var i = 0; i < firePixels.length; i++) {
        var sprite = new PIXI.Sprite(PIXI.Texture.fromImage('sprites/fire_pixel.gif'));
        sprite.anchor.set(0.5);
        self.graphics.addChild(sprite);
        fireSprites.push(sprite);
    }

    // Κείμενο τίτλου
    var titleText = new PIXI.Text(textStrings["wmwww_forest_burns"], {font: "36px Cairo", fill: "#fff", align: "center"});
    titleText.x = Game.width/2 - titleText.width/2;
    titleText.y = 40;
    self.graphics.addChild(titleText);


    // Camera & TV
    self.graphics = new PIXI.Container();
    Game.stage.addChild(self.graphics);
    self.camera = new Camera(self);
    self.tv = new TV(self);
    // Προσθήκη TV στο stage
    self.graphics.addChild(self.tv.graphics);

    // Animation loop
    self.update = function() {
        if (burning && burnProgress < 1) {
            burnProgress += 0.002;
        }
        drawFireOverlay(burnProgress);
        if (self.camera && self.camera.update) self.camera.update();
    };

    function drawFireOverlay(progress) {
        fireOverlay.clear();
        // Καπνός
        fireOverlay.beginFill(0x333333, 0.08 * progress);
        fireOverlay.drawRect(0, 0, Game.width, 120 + 200 * progress);
        fireOverlay.endFill();
        // Fire pixels (gif + εφέ)
        var t = performance.now() / 1000;
        for (var i = 0; i < firePixels.length; i++) {
            var px = firePixels[i];
            var sprite = fireSprites[i];
            // Jitter
            var jitterX = (Math.random() - 0.5) * 8;
            var jitterY = (Math.random() - 0.5) * 8;
            // "Αναπνοή"
            var baseRadius = 18 + 80 * progress;
            var pulse = Math.sin(t * 3 + i) * 6;
            var radius = baseRadius + pulse;
            // Τοποθέτηση sprite
            sprite.x = px.x + jitterX;
            sprite.y = px.y + jitterY;
            sprite.width = sprite.height = radius * 1.2;
            sprite.alpha = 0.92;
            // Overlays γύρω από το gif
            fireOverlay.beginFill(0xFF3300, 0.25);
            fireOverlay.drawCircle(sprite.x, sprite.y, radius * 1.2);
            fireOverlay.endFill();
            fireOverlay.beginFill(0xFF6600, 0.18);
            fireOverlay.drawCircle(sprite.x, sprite.y, radius * 0.8);
            fireOverlay.endFill();
        }
    }


    // Όταν τραβηχτεί φωτογραφία από την Camera
    self.camera.onPhoto = function(photoTexture) {
        burning = false;
        // Εμφάνιση στην TV
        self.tv.placePhoto({
            photo: photoTexture,
            text: textStrings["wmwww_feed_caption_forest"]
        });
        // Προαιρετικά: Προσθήκη στο feed
        if (window.addToFeed) {
            window.addToFeed({
                image: 'forest_burn',
                caption: textStrings["wmwww_feed_caption_forest"]
            });
        }
        // Μετάβαση στην επόμενη σκηνή μετά από λίγο
        setTimeout(function() {
            if (Game.sceneManager) {
                Game.sceneManager.gotoScene('IceMelt');
            }
        }, 2000);
    };

    // Καθαρισμός
    self.kill = function() {
        Game.stage.removeChildren();
    };
}
