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
                this.acceleration += 50;
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

function updateDuckDirection() {
    // Adjust turning based on turningDirection and turning speed
    duck.direction += turningDirection * duck.turnspeed;
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
//Preload Duck Image
const image = new Image();
image.src = "./source/img/ped-top-view.PNG";
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
    ctx.drawImage(image, -duck.size / 2, -duck.size / 2, duck.size, duck.size);
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

// Event listener for keydown events
addEventListener("keydown", (e) => {
    switch (e.key) {
        case "q":
        case "Q":
            turnDuck(true); // Turn the boat left
            duck.pedal();
            break;
        case "e":
        case "E":
            turnDuck(false); // Turn the boat right
            duck.pedal();
            break;
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
    // Reset turningDirection when no key is pressed
    turningDirection = 0;

    // Stop acceleration when no key is pressed
    duck.brake();
});

// Event listener for load event
addEventListener("load", () => {
    init(); // Initialize the game
});

// Event listener for resize event
addEventListener("resize", () => {
    init(); // Re-initialize the game on window resize
});
