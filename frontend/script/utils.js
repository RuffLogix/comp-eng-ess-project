//TODO implement duck healthbar & player name & smoother movement
class Duck {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 1000;
        this.direction = 0;
        this.size = 250;

        this.level = 1;
        this.MAXEXP = 100;
        this.distance = 0;
        this.skillpoint = 0;
        this.status = true;

        this.MAXHP = 1000;
        this.hp = 100;
        this.dmg = 20;
    }

    levelUp() {
        if (this.distance >= this.MAXEXP) {
            this.level++;
            this.skillpoint++;
            this.distance = 0;
            this.MAXEXP = this.MAXEXP + 50;
        }
    }

    setHp(hp) {
        this.hp = Math.min(this.MAXHP, Math.max(0, hp)); // Fix typo here
        return this;
    }

    setX(x) {
        this.x = x;
        return this;
    }

    setY(y) {
        this.y = y;
        return this;
    }

    upSkillPoint(type) {
        if (this.skillpoint <= 0) return;
        switch (type) {
            case "speed":
                this.speed += 50;
                break;
            case "dmg":
                this.dmg += 10;
                break;
            case "hp":
                this.setHp(this.hp + 50);
                break;
            default:
                break;
        }
        this.skillpoint--;
    }
};

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    update(duck) {
        this.x = duck.x;
        this.y = duck.y;
    }
}

let duck = new Duck().setX(100).setY(100); // Simplified instantiation
let camera = new Camera();
let dots = [];
let timer = 0;

function init() {
    let canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    generateRandomDots(10000);
}

function upSkillPoint(type) {
    duck.upSkillPoint(type);
    render();
}

function generateRandomDots(numDots) {
    for (let i = 0; i < numDots; i++) {
        dots.push({
            x: Math.random() * 1e4,
            y: Math.random() * 1e4,
            radius: 3
        });
    }
}

function updateDuckPosition() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastUpdateTime) / 1000; // Convert milliseconds to seconds

    // Update duck's position using interpolation
    duck.x += duck.speed * Math.cos(duck.direction) * deltaTime;
    duck.y += duck.speed * Math.sin(duck.direction) * deltaTime;
    duck.distance += (duck.speed / 10) * deltaTime;
    lastUpdateTime = currentTime; // Update last update time

}

let lastUpdateTime = performance.now(); // Track the time of the last update

function turnDuck(isLeft) {
    duck.direction += (isLeft ? -3 : 3) * 1 / 60.0;
    updateDuckPosition();
    camera.update(duck);
    render();
}

function updateUI() {
    let level = document.getElementById("level");
    let distance = document.getElementById("distance");
    let skillPoint = document.getElementById("skill-point");

    let remainDistance = document.getElementById("remain-distance");
    let doneDistance = document.getElementById("done-distance");
    remainDistance.style.width = `${Math.max(0, 100 - (duck.distance / duck.MAXEXP) * 100)}%`;
    doneDistance.style.width = `${(duck.distance / duck.MAXEXP) * 100}%`;
    let doneDistanceWidth = parseInt(doneDistance.style.width.replace("%",""));
    console.log(doneDistanceWidth)
    if(doneDistanceWidth >= 100){
        doneDistance.classList.add("fully-done-distance");
        remainDistance.style.opacity = "0";
    }else{
        doneDistance.classList.remove("fully-done-distance");
        remainDistance.style.opacity = "1";
    }
    level.innerHTML = `Level: ${duck.level}`;
    distance.innerHTML = `${Math.round(duck.distance, 2)}/${duck.MAXEXP} m`;
    skillPoint.innerHTML = `Skill Points: ${duck.skillpoint}`;
}

function render() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FF0000";
    
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x - camera.x + canvas.width / 2, dot.y - camera.y + canvas.height / 2, dot.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    });

    let image = new Image();
    image.src = "./source/img/ped-top-view.PNG";

    image.onload = () => {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(duck.direction + Math.PI / 2);
        ctx.drawImage(image, -duck.size / 2, -duck.size / 2, duck.size, duck.size);
        ctx.restore();
    }

    updateUI();
    duck.levelUp();
}

// Initialize the animation when the page loads
addEventListener("load", () => {
    init();
    render();
});

// Event listener for keypress events
addEventListener("keypress", (e) => {
    switch (e.key) {
        case "q":
        case "Q":
            turnDuck(true);
            break;
        case "e":
        case "E":
            turnDuck(false);
            break;
        default:
            break;
    }
    timer += 2/60.0;
});

// Event listener for window resize
addEventListener("resize", () => {
    init();
    render();
});
