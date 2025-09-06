Game.addToManifest({

	credits0007: "sprites/credits/credits0007.png", // and thank...
	credits0008: "sprites/credits/credits0008.png", // ...YOU!

});

function Scene_Credits(){

	
	var self = this;
	Scene.call(self);

	// Layers
	var cont = new PIXI.Container();
	Game.stage.addChild(cont);
	var c = {};
	for(var i=1; i<=8; i++){
        c[i] = new PIXI.Container();
        c[i].alpha = 0;
		cont.addChild(c[i]);
	}
    
    // add text
	var createdByText = new PIXI.Text(textStrings["createdBy"] + "\n", {font: "23px Cairo", fill:"#FFFFFF", align: "center"});
	createdByText.anchor.x = 0.5;
	createdByText.anchor.y = 0.5;
	createdByText.x = Game.width / 2;
	createdByText.y = Game.height / 2 - 41;
	c[1].addChild(createdByText);

	var authorText = new PIXI.Text(textStrings["NickyCase"], {font: "43px Cairo", fill:"#FFFFFF", align: "center"});
	authorText.anchor.x = 0.5;
	authorText.anchor.y = 0.5;
	authorText.x = Game.width / 2;
	authorText.y = createdByText.y + 38;
	c[1].addChild(authorText);

	var playtestersText = new PIXI.Text(textStrings["onecredit"] + "\n", {font: "22px Cairo", fill:"#FFFFFF", align: "center"});
	playtestersText.anchor.x = 0.5;
	playtestersText.anchor.y = 0.5;
	playtestersText.x = Game.width / 2;
	playtestersText.y = Game.height / 2 - 41;
	c[2].addChild(playtestersText);
    
   
    
	var supportersText1 = new PIXI.Text(textStrings["twocredit"] + "\n", {font: "20px Cairo", fill:"#FFFFFF", align: "center"});
	supportersText1.anchor.x = 0.5;
	supportersText1.x = Game.width / 2;
	supportersText1.y = 80;
	c[3].addChild(supportersText1);

	var supportersText2 = new PIXI.Text(textStrings["threecredit"] + "\n", {font: "20px Cairo", fill:"#FFFFFF", align: "center"});
	supportersText2.anchor.x = 0.5;
	supportersText2.x = Game.width / 2;
	supportersText2.y = 80;
	c[4].addChild(supportersText2);
    
    
   
	var thankYouText = new PIXI.Text(textStrings["thankYouForPlaying"] + "\n   ", {font: "27px Cairo", fill:"#FFFFFF", align: "center"});
	thankYouText.anchor.x = 0.5;
	thankYouText.anchor.y = 0.5;
	thankYouText.x = Game.width / 2;
	thankYouText.y = Game.height / 2 + 25;
	c[8].addChild(thankYouText);

    

    
	// Animation timing
	Tween_get(c[1]).wait(_s(BEAT*4)) // 0. Wait 4 beats before credits...
	.to({alpha:1}, _s(BEAT), Ease.quadInOut) // 1. CREATED BY!
	.wait(_s(BEAT*3))
	.to({alpha:0}, _s(BEAT), Ease.quadInOut)
	.call(function(){

		
		Tween_get(c[2])
		.to({alpha:1}, _s(BEAT), Ease.quadInOut)
		.wait(_s(BEAT*3))
		.to({alpha:0}, _s(BEAT), Ease.quadInOut)
		.call(function(){

			
			Tween_get(c[3])
			.to({alpha:1}, _s(BEAT), Ease.quadInOut)
			.wait(_s(BEAT*2))
			.call(function(){

				// CUT!
				c[3].alpha = 0;
				c[4].alpha = 1;

				Tween_get(c[4])
				.wait(_s(BEAT*2))
				.call(function(){

					// CUT!
					c[4].alpha = 0;
					c[5].alpha = 1;

					Tween_get(c[5])
					.wait(_s(BEAT*2))
					.call(function(){

						// CUT!
						c[5].alpha = 0;
						c[6].alpha = 1;

						Tween_get(c[6])
						.wait(_s(BEAT*2))
						.to({alpha:0}, _s(BEAT), Ease.quadInOut) // fade...
						.call(function(){

							// 4. And finally... thank YOU!
							Tween_get(c[7])
							.to({alpha:1}, _s(BEAT), Ease.quadInOut)
							.wait(_s(BEAT))
							.call(function(){
								Tween_get(c[8])
								.to({alpha:1}, _s(BEAT), Ease.quadInOut)
								.wait(_s(BEAT*3))
								.call(function(){
									
									// 5. Fade everything out, and NIGHTTIME SOUNDS
									Tween_get(cont)
									.wait(_s(BEAT))
									.to({alpha:0}, _s(BEAT), Ease.quadInOut);

									// Background Ambience
									var ambience = Game.sounds.bg_nighttime;
								   	ambience.loop(true);
								   	ambience.volume(0);
								   	ambience.play();
								   	ambience.fade(0, 1, 2000);

								});	
							});

						});
					});
				});
			});

		});

	});

}
