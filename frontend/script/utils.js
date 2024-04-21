class Duck {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 1000;
        this.direction = 0;
        this.size = 250;

        this.level = 1;
        this.maxExp = 100;
        this.exp = 0;

        this.MaxHp = 100;
        this.Hp = 100;
        this.Speed = 1000;
        this.Dmg = 20;
    }

    ///////////////////////////////////////////

    UpHp(){
        this.MaxHp = this.MaxHp +10;
    }

    UpSpeed(){
        this.Speed = this.Speed + 500;
    }

    UpAtk(){
        this.Dmg = this.Dmg + 5;
    }

    LevelUp(){
        this.exp = 0;
        this.maxExp = this.maxExp + 50;
        this.level++;
    }

    /////////////////////////////////////////////

    setHp(hp){
        this.Hp = Math.min(this.MaxHp,Math.max(0,hp));
    }

    setX(x) {
        this.x = x;
        return this;
    }

    setY(y) {
        this.y = y;
        return this;
    }
};

let duck = (new Duck()).setX(100).setY(100);
let timer = 0;

function init() {
    let canvas = document.getElementById("canvas");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}

function render() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let image = new Image();
    image.src = "./source/img/ped-top-view.PNG";

    image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FF0000";
        ctx.save();
        ctx.translate(duck.x + duck.size / 2, duck.y + duck.size / 2);
        ctx.rotate(duck.direction + Math.PI / 2);
        ctx.drawImage(image, -duck.size / 2, -duck.size / 2, duck.size, duck.size);
        ctx.restore();
    }
}

function updateDuctPosition() {
    duck.x += duck.speed * Math.cos(duck.direction) * 1/60.0 * timer;
    duck.y += duck.speed * Math.sin(duck.direction) * 1/60.0 * timer;
    render();
}

function turnDuck(isLeft) {
    duck.direction += (isLeft ? -5 : 5) * 1/60.0;
    render();
}

addEventListener("load", () => {
    init();
    render();
});

addEventListener("keypress", (e) => {
    switch (e.key) {
        case "q" || "Q":
            turnDuck(true);
            break;
        case "e" || "E":
            turnDuck(false);
            break;
        case "w" || "W":
            updateDuctPosition();
            break;
        default:
            break;
    }
    timer += 2/60.0;
});

addEventListener("keyup", () => {
    console.log("Timer: " + timer);
    timer = 0;
});

addEventListener("resize", () => {
    init();
    render();
})