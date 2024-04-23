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
        this.hp=0;
        this.dmg = 20;
        this.regenHpRate = 5;

        this.MAXLEVEL = 10;
        this.speedLevel=1;
        this.dmgLevel=1;
        this.hpLevel=1;
        this.isDragon = false;
        this.isDead = true;

        //Hitbox for Ped
        this.radius = 15;
        //fireball section
        this.fireballCooldown = 0;
        this.fireballInterval = 1000; // Fireball cooldown in milliseconds
        this.fireballs = []; // Array to store fireball instances
        Ducks.push(this);// Add to Objects array
    }

    attack(duck){
        duck.setHp(duck.hp-this.dmg);
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

    // for fireball
    fireFireball() {
        if (this.fireballCooldown <= 0) {
            // Create a new fireball instance and add it to the array
            this.fireballs.push(new Fireball(this.x + Math.cos(this.direction) * (this.size / 2), this.y + Math.sin(this.direction) * (this.size / 2), this.direction));
            // Reset the cooldown
            this.fireballCooldown = this.fireballInterval;
        }
    }

    updateFireballs() {
        // Update each fireball's position
        this.fireballs.forEach(fireball => {
            fireball.update();
        });
        // Decrease the cooldown
        this.fireballCooldown -= 5;
    }
}

class Fireball {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.speed = 10 + duck.speed/100;
        this.radius = 70;
        this.direction = direction;
        this.initial_direction = direction;
        this.dmg = 100;
        this.inactiveTime = 0; // Initialize inactive time to 0
    }

    

    hitT(x){
        x.setHp(x.hp-this.dmg);
    }
    

    update() {
        // Update fireball's position based on speed and direction
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
    }
    
}
// Function to check collision between two objects
function checkCollision(object1, object2) {
    let distance = Math.sqrt((object1.x - object2.x) ** 2 + (object1.y - object2.y) ** 2);
    if(distance <= object1.radius + object2.size / 2){
        console.log("Overlapping")
    }
    return distance <= object1.radius + object2.size / 2; // Assuming object2 is the dummy
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

var Ducks = [];
var OtherDucks = Ducks.slice();
let duck = new Duck().setX(0).setY(0); // Simplified instantiation
OtherDucks.pop(duck);
let camera = new Camera();
let dots = [];
let dummy = new Duck().setX(50).setY(50); // Simplified Dummy

function init() {
    let canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    generateRandomDots(5000);
}

function upSkillPoint(type) {
    duck.upSkillPoint(type);
    render();
}

function generateRandomDots(numDots) {
    for (let i = 0; i < numDots; i++) {
        dots.push({
            x: Math.random() * 5e4,
            y: Math.random() * 5e4,
            imgSrc: "./source/img/bg" + (Math.floor(Math.random()*4)+2) +".PNG",
            size: (Math.random() * 50) +150,
            angle: Math.random() * 360,
            img: new Image()
        });
    }
    dots.forEach(dot => {
        dot.img.src=dot.imgSrc;
    });
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
    // console.log(turningDirection,turningSpeed)
}

function gameLoop() {
    updateDuckPosition(); // Update duck's position
    updateDuckDirection(); // Update duck's direction
    if(duck.isDragon){
        duck.fireFireball();
    }
    duck.updateFireballs();

    checkFireballCollision(); // Check for collision with OtherDucks
    for(let i =0;i<Ducks.length;i++){
        let currentDuck = Ducks[i];
        // console.log(Ducks,currentDuck)
        for(let j=i+1 ; j<Ducks.length;j++){
            let  nextDuck = Ducks[j];
            checkCollision(currentDuck,nextDuck);
        }
    }
    removeDeadDucks();
    removeInactiveFireballs();
    
    render(); // Render the game
    requestAnimationFrame(gameLoop); // Request the next frame of the game loop
}

function removeInactiveFireballs() {
    duck.fireballs.forEach((fireball, index) => {
        // Check if the fireball has been inactive for 1 second
        if (fireball.inactiveTime >= 5000) {
            duck.fireballs.splice(index, 1); // Remove the fireball from the array
        } else {
            // Increment the inactive time of the fireball
            fireball.inactiveTime += 1000 / 60; // Assuming 60 frames per second
        }
    });
}

function removeDeadDucks() {
    for (let i = 0; i < OtherDucks.length; i++) {
        if (OtherDucks[i].hp <= 0) {
            console.log("Duck defeated!");
            // Remove the duck from the array
            OtherDucks.splice(i, 1);
            // Decrement the loop index to account for the removed duck
            i--;
        }
    }
}

function checkFireballCollision() {
    duck.fireballs.forEach((fireball, fireballIndex) => {
        OtherDucks.forEach(otherDuck => {
            if (checkCollision(fireball, otherDuck)) {
                console.log("Hit");
                // Handle hit logic here
                fireball.hitT(otherDuck); // Call hitT method of fireball
                duck.fireballs.splice(fireballIndex, 1); // Remove the fireball from the array
                console.log(otherDuck.hp); // Log updated HP of the other duck
            }
        });
    });
}


// Initialize the animation and start the game loop when the page loads
addEventListener("load", () => {
    init(); // Initialize the game
});
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
        case "f":
        case "F":
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