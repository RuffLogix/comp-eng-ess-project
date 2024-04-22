class Duck {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 0; // Start with zero speed
        this.maxSpeed = 800; // Maximum speed of the duck boat
        this.acceleration = 200; // Acceleration of the duck boat
        this.drag = 10; // Drag force to simulate water resistance
        this.turnspeed = 0.05; // Adjusted turning speed for smoother turning
        this.direction = 0;
        this.size = 250;

        this.level = 1;
        this.MAXEXP = 1000;
        this.distance = 0;
        this.skillpoint = 0;
        this.status = true;

        this.MAXHP = 1000;
        this.hp = 100;
        this.dmg = 20;
    }

    // Accelerate the duck boat forward
    pedal() {
        // Increase speed up to the maximum speed
        this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    }

    // Slow down the duck boat
    brake() {
        // Apply drag force to reduce speed
        this.speed = Math.max(this.speed - this.drag, 0);
    }
    
    levelUp() {
        if (this.distance >= this.MAXEXP) {
            this.level++;
            this.skillpoint++;
            this.distance = 0;
            this.MAXEXP = this.MAXEXP + 500;
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
                this.maxSpeed += 100;
                this.acceleration += 25;
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
}

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

    // Update duck's position based on speed and direction
    duck.x += duck.speed * Math.cos(duck.direction) * deltaTime;
    duck.y += duck.speed * Math.sin(duck.direction) * deltaTime;

    // Update distance and apply drag force to slow down the duck boat
    duck.distance += duck.speed * deltaTime;
    duck.brake(); // Apply drag force

    lastUpdateTime = currentTime; // Update last update time
    camera.update(duck);
}


let lastUpdateTime = performance.now(); // Track the time of the last update

let turningDirection = 0; // Variable to store the turning direction

function turnDuck(isLeft) {
    turningDirection = isLeft ? -1 : 1; // Simplify turning direction
}
let turningSpeed = 0.5;
let interval = 0;
var Rotate_acc = 0.5;
var deceleraion = false;
const MAX_TURNING_SPEED = 2;
function updateDuckDirection() {
    if(!deceleraion){
        turningSpeed = Math.min(MAX_TURNING_SPEED,turningSpeed + 0.8*Rotate_acc *interval)
        duck.direction += turningDirection * turningSpeed * Math.PI / 180; // Adjust turning speed as needed
    }else if(turningSpeed != 0){
        turningSpeed = Math.max(0,turningSpeed - 0.5*Rotate_acc *interval)
        duck.direction += turningDirection * turningSpeed * Math.PI / 180; // Adjust turning speed as needed
    }else{
        deceleraion = false;
        turningSpeed = 0; //reset turningSpeedq
        turningDirection = 0; //reset turning Direction
        interval = 0; //reset interval
    }
}

function updateUI() {
    let level = document.getElementById("level");
    let distance = document.getElementById("distance");
    let skillPoint = document.getElementById("skill-point");

    let remainDistance = document.getElementById("remain-distance");
    let doneDistance = document.getElementById("done-distance");
    doneDistance.style.width = `${(duck.distance / duck.MAXEXP) * 100}%`;
    level.innerHTML = `Level: ${duck.level}`;
    distance.innerHTML = `${Math.round(duck.distance, 2)}/${duck.MAXEXP} m`;
    skillPoint.innerHTML = `Skill Points: ${duck.skillpoint}`;
}
//Preload Duck Image
const image = new Image();
image.src = "./source/img/myPed.svg";
image.onload = () => {
    // Start the game loop only after the image is loaded
    gameLoop();
};
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
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(duck.direction + Math.PI / 2);
    ctx.drawImage(image, -duck.size / 2, 1.23*-duck.size / 2, duck.size, 1.23*duck.size);
    ctx.restore();
    updateUI();
    duck.levelUp();
}

function gameLoop() {
    updateDuckPosition(); // Update duck's position
    updateDuckDirection(); // Update duck's direction
    render(); // Render the game
    requestAnimationFrame(gameLoop); // Request the next frame of the game loop
}
// Initialize the animation and start the game loop when the page loads
addEventListener("load", () => {
    init(); // Initialize the game
});
// Event listener for keydown events
addEventListener("keydown", (e) => {
    interval = Math.min(0.8,(interval+0.01));
    console.log(e.key);
    switch (e.key) {
        case "ArrowLeft":
        case "q":
        case "Q":
            turnDuck(true); // Turn the boat left
            duck.pedal();
            break;
        case "ArrowRight":
        case "e":
        case "E":
            turnDuck(false); // Turn the boat right
            duck.pedal();
            break;
        case "ArrowDown":
        case "s":
        case "S":
            duck.brake(); // Slow down the boat
            break;
        default:
            break;
    }
});

// Event listener for keyup events
addEventListener("keyup", (e) => {
    deceleraion = true; // reset turningDirection when no key is pressed
});
addEventListener("resize", () => {
    init(); // Re-initialize the game on window resize
});
