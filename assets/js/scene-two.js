var SceneTwo = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, {"key": "SceneTwo"});
    },
    //init function() { },
    preload: function () {
       this.load.image("tiles2", "../assets/image/pokemonCenter.png");
       this.load.tilemapTiledJSON("map2", "../assets/HEAL.json");
       this.load.spritesheet("player", "../assets/image/player.png", {
            frameWidth: 64,
            frameHeight: 64,
       });
       this.load.spritesheet("nurse", "../assets/image/nurse.png", {
           frameWidth: 68,
           frameHeight: 72,
       })
       this.load.audio("pokemonCenterMusic", "assets/audio/pokemonCenter.mp3");
    },
    create: function () {
        const map = this.make.tilemap({ key: "map2" });



        const tileset = map.addTilesetImage("pokemonCenter", "tiles2");



        const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
        worldLayer.setCollisionByProperty({ collides: true });

        pokemonCenterMusic = this.sound.add("pokemonCenterMusic", { loop: true });

        pokemonCenterMusic.play();

        const spawnPoint = map.findObject(
            "Objects",
            (obj) => obj.name === "Spawn Point"
        );

        player = this.physics.add
            .sprite(spawnPoint.x, spawnPoint.y, "player")
            .setScale(0.7)
            .setSize(5, 10)
            .setOffset(1, 3);

        this.physics.add.collider(player, worldLayer);

        nurse = this.physics.add
            .sprite(720, 680,"nurse")
            .setScale(0.7)
            .setSize(5, 10)
            .setOffset(1, 3);

        const anims = this.anims;
        movementKeys = ["right","left","front","back","right-walk","left-walk","back-walk","front-walk"];        starts = [4,8,0,12,8,4,12,0]
        ends = [4,8,0,12,11,7,15,3]
        for (let index = 0; index < movementKeys.length; index++) {
            anims.create({
                key: movementKeys[index],
                frames: anims.generateFrameNames("player", { start: starts[index], end: ends[index] }),
                frameRate: 10,
                repeat: -1,
            });
        }

        const camera = this.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setZoom(2.5);
        cursors = this.input.keyboard.createCursorKeys();
    }, 
    update: function () {
        const speed = 125;
        const prevVelocity = player.body.velocity.clone();

        player.body.setVelocity(0);

        if (cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.body.setVelocityX(-speed);
        } else if (cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.body.setVelocityX(speed);
        } else if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.body.setVelocityY(-speed);
        } else if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.body.setVelocityY(speed);
        }
        player.body.velocity.normalize().scale(speed);
    
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
            if (prevVelocity.x < 0) player.anims.play("right", true);
            else if (prevVelocity.x > 0) player.anims.play("left", true);
            else if (prevVelocity.y < 0) player.anims.play("back", true);
            else if (prevVelocity.y > 0) player.anims.play("front", true);
        }

        if(player.x > 690 && player.x < 735 && player.y > 1010 && player.y < 1040 && cursors.down.isDown){
            pokemonCenterMusic.stop();
            this.scene.stop('SceneTwo');
            this.scene.start('SceneOne');
        }

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R))) {
            this.scene.start('SceneOne');
        }
    }
});