class Pokemon {
    constructor(name, sprite, hp, moves) {
        this.name = name;
        this.sprite = sprite;
        this.hp = hp;
        this.fullhp = hp;
        this.moves = moves;
    }
}

let pkmList = [
    ['Charizard', 'https://img.pokemondb.net/sprites/black-white/normal/charizard.png', 360, [
        ['Inferno', 'fire', 100, 0.50],
        ['Dragon Breath', 'dragon', 60, 1],
        ['Air Slash', 'fly', 75, 0.95],
        ['Slash', 'normal', 70, 1]
    ]],
    ['Blastoise', 'https://img.pokemondb.net/sprites/black-white/normal/blastoise.png', 362, [
        ['Aqua Tail', 'water', 90, 0.90],
        ['Rapid Spin', 'normal', 50, 1],
        ['Water Pulse', 'water', 60, 1],
        ['Flash Cannon', 'steel', 80, 1]
    ]],
    ['Venusaur', 'https://img.pokemondb.net/sprites/black-white/normal/venusaur-f.png', 364, [
        ['Petal Blizzard', 'grass', 90, 1],
        ['Seed Bomb', 'grass', 80, 1],
        ['Earthquake', 'ground', 100, 1],
        ['Take Down', 'normal', 90, 0.85]
    ]]
];

let typeMatch = {
    'Charizard': [['water', 'rock'], ['fire', 'grass', 'steel']],
    'Blastoise': [['grass'], ['fire', 'water']],
    'Venusaur': [['fire', 'fly', 'ice', 'steel'], ['grass', 'water']],
};

function spawn(bool) {
    let p = pkmList[Math.floor(Math.random() * pkmList.length)];
    let pkm = new Pokemon(p[0], p[1], p[2], p[3]);
    if (bool) {
        for (let i = 0; i < 4; i++) {
            document.getElementById('m' + i).value = pkm.moves[i][0];
        }
    }
    return pkm;
}

let pk1 = spawn(true);
let s1 = document.createElement('img');
s1.src = pk1.sprite;
document.getElementById('pk1').appendChild(s1);
document.getElementById('hp1').innerHTML = '<p>HP: ' + pk1.hp + '/' + pk1.fullhp + '</p>';

let pk2 = spawn(false);
let s2 = document.createElement('img');
s2.src = pk2.sprite;
document.getElementById('pk2').appendChild(s2);
document.getElementById('hp2').innerHTML = '<p>HP: ' + pk2.hp + '/' + pk2.fullhp + '</p>';

for (let i = 0; i < 4; i++) {
    let btn = document.getElementById('m' + i);
    let move = pk1.moves[i];
    btn.addEventListener('click', function () {
        attack(move, pk1, pk2, 'hp2', '');
        setTimeout(attack, 2000, pk2.moves[Math.floor(Math.random() * 4)], pk2, pk1, 'hp1', 'Foe ');
    });
}

function attack(move, attacker, receiver, hp, owner) {
    document.getElementById('comment').innerHTML = '<p>' + owner + attacker.name + ' used ' + move[0] + '!</p>';
    if (Math.random() < move[3]) {
        let power = move[2] + Math.floor(Math.random() * 10);
        let rtype = typeMatch[receiver.name];
        let mtype = move[1];
        let scale = 1;

        for (let i = 0; i < rtype.length; i++) {
            if (rtype[i].includes(mtype)) {
                switch (i) {
                    case 0:
                        scale = 2;
                        setTimeout(function () {
                            document.getElementById('comment').innerHTML = '<p>It was super effective!</p>';
                        }, 1000);
                        break;
                    case 1:
                        scale = 0.5;
                        setTimeout(function () {
                            document.getElementById('comment').innerHTML = '<p>It was not very effective!</p>';
                        }, 1000);
                        break;
                }
                break;
            }
        }
        power *= scale;
        receiver.hp -= Math.floor(power);
        document.getElementById(hp).innerHTML = '<p>HP: ' + receiver.hp + '/' + receiver.fullhp + '</p>';
    } else {
        setTimeout(function () {
            document.getElementById('comment').innerHTML = '<p>Attack missed!</p>';
        }, 1000);
    }
    checkWinner();
}

function checkWinner() {
    if (pk1.hp <= 0) {
        alert('GAME OVER: ' + pk1.name + ' fainted!');
        let frame = parent.document.getElementById("frame");
        frame.src = "movement.html";
    } else if (pk2.hp <= 0) {
        alert('YOU WIN: ' + pk2.name + ' fainted!');
        let frame = parent.document.getElementById("frame");
        frame.src = "movement.html";
    }
}
