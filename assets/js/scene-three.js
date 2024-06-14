var SceneThree = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { "key": "SceneThree" });
    },

    preload: function () {
        this.load.image("tiles3", "../assets/image/house.png")
        this.load.tilemapTiledJSON("map3", "../assets/HOME.json")
        this.load.spritesheet("player", "../assets/image/player.png", {
            frameWidth: 64,
            frameHeight: 64,
       });
       this.load.audio("houseMusic", "assets/audio/house.mp3");
    },
    create: function () {
        const map = this.make.tilemap({ key: "map3"});

        const tileset = map.addTilesetImage("house", "tiles3");

        const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
        worldLayer.setCollisionByProperty({ collides: true });

        houseMusic = this.sound.add("houseMusic", { loop: true });
        houseMusic.play();

        const spawnPoint = map.findObject(
            "Objects",
            (obj) => obj.name === "Spawn Point"
        );


        player = this.physics.add
            .sprite(spawnPoint.x, spawnPoint.y, "player")
            .setScale(0.5)
            .setSize(5, 10)
            .setOffset(1, 3);


        this.physics.add.collider(player, worldLayer);

        const anims = this.anims;
        movementKeys = ["right","left","front","back","right-walk","left-walk","back-walk","front-walk"];
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

        const camera = this.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setZoom(3.5);
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
        if(player.x > 705 && player.x < 730 && player.y > 920 && player.y < 930 && cursors.down.isDown){
            houseMusic.stop();
            this.scene.stop('SceneThree');
            this.scene.start('SceneOne');
        }
    }
})