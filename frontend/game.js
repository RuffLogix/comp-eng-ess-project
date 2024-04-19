const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#CAECFA',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);


function preload() {
    this.load.image('ped', 'source/img/Ped.svg');
    this.load.image('ped-top-view', 'source/img/ped-top-view.PNG');
}

function create() {
    window.addEventListener('resize', resize);
    resize();
    // this.add.image(200,200,'ped-top-view');
    // console.log(game.canvas.style.height/2+' '+game.canvas.style.width/2)
    // graphics = this.add.graphics({fillStyle: { color: 0xCAECFA }});
}

function resize() {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    console.log(canvas.style.width+' '+canvas.style.height)
}

function update() {
    
}