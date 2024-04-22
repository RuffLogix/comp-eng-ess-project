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

        this.maxHp = 100;
        // this.hp = this.maxHp;
        this.hp=100;
        this.dmg = 20;
        this.regenHpRate = 5;

        this.MAXLEVEL = 10;
        this.speedLevel=1;
        this.dmgLevel=1;
        this.hpLevel=1;

        this.isDragon = false;
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

    regenHp(){
        let deltaTime =(performance.now() - lastUpdateTime )/1000;
        this.setHp(this.hp+this.regenHpRate*deltaTime);
    }

    setHp(hp) {
        this.hp = Math.min(this.maxHp, Math.max(0, hp)); // Fix typo here
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
                this.speedLevel++;
                break;
            case "dmg":
                this.dmg += 10;
                this.dmgLevel++;
                break;
            case "hp":
                this.maxHp += 100;
                this.regenHpRate +=5;
                this.hpLevel++;
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
    duck.regenHp();

    lastUpdateTime = currentTime; // Update last update time
    camera.update(duck);
}


let lastUpdateTime = performance.now(); // Track the time of the last update

let turningDirection = 0; // Variable to store the turning direction
let turningSpeed = 0.5; // Initial turning speed
let isTurning = false; // Flag to indicate if turning keys are pressed
const MAX_TURNING_SPEED = 2;

function turnDuck(isLeft) {
    turningDirection = isLeft ? -1 : 1; // Set turning direction
    isTurning = true; // Set turning flag
}

function updateDuckDirection() {
    if (!isTurning) {
        // If not turning, reset the turning speed to default
        console.log("not turning")
        turningSpeed = 0.5;
        if(turningDirection >0){
            turningDirection = Math.max(0,turningDirection-0.01);
        }else{
            turningDirection = Math.min(0,turningDirection+0.01);
        }
        duck.direction += turningDirection * turningSpeed * Math.PI / 180; // Adjust turning speed as needed
    } else {
        // If turning, gradually increase the turning speed up to the maximum
        turningSpeed = Math.min(MAX_TURNING_SPEED, turningSpeed + 0.05);
        duck.direction += turningDirection * turningSpeed * Math.PI / 180; // Adjust turning speed as needed
    }
    console.log(turningDirection,turningSpeed)
}


function setMaxSkillBar(elememt){
    elememt.children[0].style.setProperty("background-color",`#FD5353`);
    elememt.children[0].style.width = `100%`;
    elememt.children[1].style.width = `0%`;
    elememt.children[0].style.setProperty("border-right-width",`0rem`);
    let plusButton = elememt.parentElement.children[2];
    plusButton.style.setProperty("border-width",`0rem`);
    plusButton.style.setProperty("background-color",`rgba(255, 255, 255, 0)`);
    plusButton.style.height = `100%`;
    plusButton.style.width = `100%`;
    plusButton.textContent = "MAX";
    plusButton.disabled = true;
}

function updateUI() {
    let level = document.getElementById("level");
    let distance = document.getElementById("distance");
    let skillPoint = document.getElementById("skill-point");

    let remainDistance = document.getElementById("remain-distance");
    let doneDistance = document.getElementById("done-distance");
    doneDistance.style.width = `${(duck.distance / duck.MAXEXP) * 100}%`;
    remainDistance.style.width = `${((duck.MAXEXP-duck.distance) / duck.MAXEXP) * 100}%`;
    level.innerHTML = `Level: ${duck.level}`;
    distance.innerHTML = `${Math.round(duck.distance, 2)}/${duck.MAXEXP} m`;
    skillPoint.innerHTML = `Skill Points: ${duck.skillpoint}`;

    let playerHp = document.getElementById("player-hp");
    playerHp.children[0].style.width = `${(duck.hp / duck.maxHp) * 100}%`;
    playerHp.children[1].style.width = `${((duck.maxHp-duck.hp) / duck.maxHp) * 100}%`;
    if (duck.hp>=duck.maxHp){
        playerHp.children[0].style.setProperty("border-right-width",`0rem`);
    }
    else{
        playerHp.children[0].style.setProperty("border-right-width",`0.17rem`);
    }
    let playerHpText = document.getElementById("player-hp-text");
    playerHpText.textContent = `HP: ${Math.round(duck.hp)}/${duck.maxHp}`;

    let speedBar = document.getElementById("speed-bar");
    let dmgBar = document.getElementById("Atk-bar");
    let hpBar = document.getElementById("Hp-bar");
    if (duck.speedLevel>=duck.MAXLEVEL){
        setMaxSkillBar(speedBar);
    }
    else{
        speedBar.children[0].style.width = `${(duck.speedLevel / duck.MAXLEVEL) * 100}%`;
        speedBar.children[1].style.width = `${((duck.MAXLEVEL-duck.speedLevel) / duck.MAXLEVEL) * 100}%`;
    }
    if (duck.dmgLevel>=duck.MAXLEVEL){
        setMaxSkillBar(dmgBar);
    }
    else{
        dmgBar.children[0].style.width = `${(duck.dmgLevel / duck.MAXLEVEL) * 100}%`;
        dmgBar.children[1].style.width = `${((duck.MAXLEVEL-duck.dmgLevel) / duck.MAXLEVEL) * 100}%`;
    }
    if (duck.hpLevel>=duck.MAXLEVEL){
        setMaxSkillBar(hpBar);
    }
    else{
        hpBar.children[0].style.width = `${(duck.hpLevel / duck.MAXLEVEL) * 100}%`;
        hpBar.children[1].style.width = `${((duck.MAXLEVEL-duck.hpLevel) / duck.MAXLEVEL) * 100}%`;
    }
}

//Preload Duck Image
const image = new Image();
// image.src = "./source/img/myPed.svg";
image.src = "./source/img/ped-top-view.PNG";
// image.src = "./source/img/dragon.PNG";

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
    ctx.fillStyle = "#96D3FF";
    ctx.beginPath();
    if (!duck.isDragon && duck.speedLevel == duck.MAXLEVEL && duck.dmgLevel == duck.MAXLEVEL && duck.hpLevel == duck.MAXLEVEL){
        image.src = "./source/img/dragon.PNG";
        duck.isDragon = true;
        duck.size *= 1.3;
    }
    ctx.arc(0,duck.size*0.075, duck.size*0.4, 0, 2 * Math.PI);
    ctx.fill();
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
// Initialize the animation and start the game loop when the page loads
addEventListener("load", () => {
    init(); // Initialize the game
});
// Event listener for keydown events
// Event listener for keydown events
addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
        case "q":
        case "Q":
            turnDuck(true); // Turn the duck left
            duck.pedal();
            break;
        case "ArrowRight":
        case "e":
        case "E":
            turnDuck(false); // Turn the duck right
            duck.pedal();
            break;
        case "ArrowDown":
        case "s":
        case "S":
            duck.brake(); // Slow down the duck
            break;
        default:
            break;
    }
});


// Event listener for keyup events
addEventListener("keyup", (e) => {
    // Reset turning flag when turning keys are released
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "q" || e.key === "Q" || e.key === "e" || e.key === "E") {
        isTurning = false;
    }
});
addEventListener("resize", () => {
    init(); // Re-initialize the game on window resize
});