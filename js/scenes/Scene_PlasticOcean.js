// Scene_PlasticOcean.js
// Πέμπτο act: Πλαστική Θάλασσα

function Scene_PlasticOcean() {
    var self = this;
    Scene.call(self);

    // Graphics container (single instance)
    self.graphics = new PIXI.Container();
    Game.stage.addChild(self.graphics);

    // Wbackground: plastic ocean
    self.world = new World(self, {bg: "plastic_ocean"}); // Θα χρειαστεί να προσθέσεις sprites/plastic_ocean.png ή .gif

    // Layer για σκουπίδια/πλαστικά πάνω από το background
    var plasticOverlay = new PIXI.Graphics();
    self.graphics.addChild(plasticOverlay);

    // Animation state
    var plasticProgress = 0; // 0 (καθαρή) -> 1 (γεμάτη πλαστικά)
    var polluting = true;
  
    var plasticPoints = [
        {x: Game.width * 0.18, y: Game.height * 0.45},
        {x: Game.width * 0.42, y: Game.height * 0.48},
        {x: Game.width * 0.65, y: Game.height * 0.43},
        {x: Game.width * 0.82, y: Game.height * 0.40}
    ];

    var plasticSprites = [];
    for (var i = 0; i < plasticPoints.length; i++) {
        var sprite = new PIXI.Sprite(PIXI.Texture.fromImage('sprites/plastic_bottle.png'));
        sprite.anchor.set(0.5);
        self.graphics.addChild(sprite);
        plasticSprites.push(sprite);
    }

    // Κείμενο
    var titleText = new PIXI.Text(textStrings["wmwww_plastic_ocean"], {font: "36px Cairo", fill: "#fff", align: "center"});
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
        if (polluting && plasticProgress < 1) {
            plasticProgress += 0.002;
        }
        drawPlasticOverlay(plasticProgress);
        if (self.camera && self.camera.update) self.camera.update();
    };

    function drawPlasticOverlay(progress) {
        plasticOverlay.clear();
        // Εφέ πλαστικών
        plasticOverlay.beginFill(0x99ccff, 0.12 * progress);
        plasticOverlay.drawRect(0, Game.height - 180, Game.width, 180 * progress);
        plasticOverlay.endFill();
        // Plastics
        var t = performance.now() / 1000;
        for (var i = 0; i < plasticPoints.length; i++) {
            var px = plasticPoints[i];
            var sprite = plasticSprites[i];
            // Jitter + floating effect
            var jitterX = (Math.sin(t * 1.2 + i) * 16) * progress;
            var jitterY = (Math.cos(t * 1.5 + i) * 12) * progress;
            sprite.x = px.x + jitterX;
            sprite.y = px.y + jitterY;
            sprite.width = sprite.height = 90 + 80 * progress;
            sprite.alpha = 0.92;
        }
    }

    // Director animation/callbacks: show photo on TV, then go to next scene
    self.director.callbacks = {
        takePhoto: function(d) {
            self.tv.placePhoto({
                photo: d.photoTexture,
                text: textStrings["wmwww_feed_caption_plastic_ocean"]
            });
        },
        movePhoto: function(d) {
            d.audience_movePhoto();
        },
        cutToTV: function(d) {
            d.audience_cutToTV();
            setTimeout(function() {
                if (Game.sceneManager) {
                    Game.sceneManager.gotoScene('EndPrototype'); 
                }
            }, 1000);
        }
    };

    // Όταν τραβηχτεί φωτογραφία από την Camera
    self.camera.onPhoto = function(photoTexture) {
        polluting = false;
        if (window.addToFeed) {
            window.addToFeed({
                image: 'plastic_ocean',
                caption: textStrings["wmwww_feed_caption_plastic_ocean"]
            });
        }
        self.director.takePhoto(self.camera);
    };

    
    self.kill = function() {
        Game.stage.removeChildren();
    };
}
