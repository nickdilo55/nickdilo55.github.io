var SceneOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { "key": "SceneOne" }); // Initialize the scene with a key
    },
    //init: function () { },
    preload: function () {
        // Load images, tilemap, spritesheets, and audio files
        this.load.image("tiles", "../assets/image/pokemonWorld.png");
        this.load.tilemapTiledJSON("map", "../assets/BEACH.json")
        this.load.spritesheet("player", "../assets/image/player.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.audio("roadMusic", "assets/audio/town.mp3");
        this.load.audio("pokemonEncounterMusic", "assets/audio/encounter.mp3");
    },
    create: function () {
        // Create the tilemap and tileset
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("pokemonWorld", "tiles");

        // Create layers
        const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
        worldLayer.setCollisionByProperty({ collides: true }); // Set collision property for the world layer


        if (this.sound.get('roadMusic')) {
            this.sound.stopByKey('roadMusic');
        }
        
        // Add and play background music
        roadMusic = this.sound.add("roadMusic", { loop: true });
        pokemonEncounterMusic = this.sound.add("pokemonEncounterMusic", { loop: false });
        roadMusic.play();

        // Find the spawn point and create the player sprite
        const spawnPoint = map.findObject("Objects", (obj) => obj.name === "Spawn Point");
        player = this.physics.add
            .sprite(spawnPoint.x, spawnPoint.y, "player")
            .setScale(0.5)
            .setSize(5, 10)
            .setOffset(1, 3);

        // Add collision between player and world layer
        this.physics.add.collider(player, worldLayer);

        // Create animations
        const anims = this.anims;
        movementKeys = ["right","left","front","back","right-walk","left-walk","back-walk","front-walk"]
        starts = [4,8,0,12,8,4,12,0]
        ends = [4,8,0,12,11,7,15,3]
        for (let index = 0; index < movementKeys.length; index++) {
            anims.create({
                key: movementKeys[index],
                frames: anims.generateFrameNames("player", { start: starts[index], end: ends[index] }),
                frameRate: 10,
                repeat: -1,
            });
        }

        // Set up the camera to follow the player
        const camera = this.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setZoom(3.5);

        // Set encounter chance and input keys
        this.pokemonEncounterChance = 900;
        this.enterKey = this.input.keyboard.addKey('ENTER');
        cursors = this.input.keyboard.createCursorKeys();
    },
    update: function () {
        const speed = 125;
        const prevVelocity = player.body.velocity.clone();

        player.body.setVelocity(0); // Reset player's velocity

        // Handle player movement
        if (cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.body.setVelocityX(-speed);
        } else if (cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.body.setVelocityX(speed);
        } else if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.body.setVelocityY(-speed);
        } else if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.body.setVelocityY(speed);
        }

        player.body.velocity.normalize().scale(speed); // Normalize and scale velocity

        // Update player animations based on movement
        if (cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.anims.play("left-walk", true);
        } else if (cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.anims.play("right-walk", true);
        } else if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.anims.play("back-walk", true);
        } else if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.anims.play("front-walk", true);
        } else {
            player.anims.stop();

            // Play idle animation based on previous movement
            if (prevVelocity.x < 0) player.anims.play("right", true);
            else if (prevVelocity.x > 0) player.anims.play("left", true);
            else if (prevVelocity.y < 0) player.anims.play("back", true);
            else if (prevVelocity.y > 0) player.anims.play("front", true);
        }
        
        // Enter Pokemon Center
        if(player.x > 755 && player.x < 770 && player.y > 455 && player.y < 470 && cursors.up.isDown){
            roadMusic.stop();
            this.scene.stop('SceneOne');
            this.scene.run('SceneTwo');
        }

        // House top left
        if(player.x > 620 && player.x < 635 && player.y > 695 && player.y < 710 && cursors.up.isDown){
            roadMusic.stop();
            this.scene.stop('SceneOne');
            this.scene.run('SceneThree');
        }

        // Handle Pokemon encounter
        if(player.x < 700 && player.x > 600 && player.y > 500 && player.y < 600){
            var isEncounter =  Math.random() * 1000;
            if(isEncounter > this.pokemonEncounterChance){
                roadMusic.stop();
                pokemonEncounterMusic.play();
                frame = parent.document.getElementById("frame");
                console.log(frame)
                alert("Fight !");
                frame.src = "pokemon.html";
            }
        } else if(player.x < 990 && player.x > 870 && player.y > 500 && player.y < 600){
            var isEncounter =  Math.random() * 1000;
            if(isEncounter > this.pokemonEncounterChance){
                roadMusic.stop();
                pokemonEncounterMusic.play();
                frame = parent.document.getElementById("frame");
                console.log(frame)
                alert("Fight !");
                frame.src = "pokemon.html";
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.restart();
        }
    }
});