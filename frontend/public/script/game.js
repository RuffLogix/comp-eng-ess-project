// Function to check collision between two objects
function checkCollision(object1, object2) {
    let dx = object1.x - object2.x;
    let dy = object1.y - object2.y;
    let distance = dx*dx + dy*dy;
    return distance <= (object1.radius + object2.radius / 2) ** 2; // Assuming object2 is the dummy
}

let Ducks = [];
let duck = new Duck().setX(0).setY(0); // Simplified instantiation
let dummy = new Duck().setX(100).setY(100);
let dummy2 = new Duck().setX(100).setY(200);
let dummy3 = new Duck().setX(200).setY(200);
Ducks.push(dummy,dummy2,dummy3);
let camera = new Camera();
let dots = [];
let playerIndex = 0;
let moving = false;

function createDuck() {
    fetch(`${backendUrl}/api/duck/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: localStorage.getItem("roomId"),
            duck: duck,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "success") {
            data.players.forEach((player, i) => {
                if (player.username===localStorage.getItem("username")) {
                    playerIndex = i;
                }
            });
        } else if (data.status === "load") {
            data.players.forEach((player, i) => {
                if (player.username===localStorage.getItem("username")) {
                    playerIndex = i;
                }
            });
            duck.setParameters(data.duck);
        }
    })
}

function updatePlayerData() {
    fetch(`${backendUrl}/api/duck`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: localStorage.getItem("roomId"),
            duck: duck,
        }),
    });
}

function getDucks() {
    fetch(`${backendUrl}/api/duck`, {
        method: "GET",
    }).then((res) => {
        return res.json();
    }).then((data) => {
        // if (!moving) {
        //     data.forEach(d => {
        //         if (d.id === localStorage.getItem("roomId")) {
        //             duck.setParameters(d.data);
        //         }
        //     })
        // }
        Ducks = data.filter(duck => duck.id !== localStorage.getItem("roomId"));
    });
}

function init() {
    let canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    generateRandomDots(1000);
}

function upSkillPoint(type) {
    duck.upSkillPoint(type);
    render();
}

function generateRandomDots(numDots) {
    for (let i = 0; i < numDots; i++) {
        dots.push({
            x: Math.random()>0.5 ?  Math.random()*5e4 : Math.random()*-5e4 ,
            y: Math.random()>0.5 ?  Math.random()*5e4 : Math.random()*-5e4,
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
    let new_x = duck.x + (duck.speed * Math.cos(duck.direction) * deltaTime);
    let new_y = duck.y + (duck.speed * Math.sin(duck.direction) * deltaTime);
    // Update duck's position based on speed and direction
    if(Math.abs(new_x)<=5e4) duck.x = new_x;
    if(Math.abs(new_y)<=5e4) duck.y = new_y
    if(Math.abs(new_x)<=5e4&&Math.abs(new_y)<=5e4) duck.distance += duck.speed * deltaTime; //Update distance 
    // Apply drag force to slow down the duck boat
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

function DucksCollided(){ //TODO: Fix multiple collision at one time
        let currentDuck = duck;
        for(let j=0 ; j<Ducks.length;j++){
            let  nextDuck = Ducks[j];
            if(checkCollision(currentDuck,nextDuck)){
                console.log("Chon i sus 1111111");
                    if(!currentDuck.Immunity & !nextDuck.Immunity){
                        console.log("Chon i sus 222222");
                        currentDuck.attack(nextDuck);
                        nextDuck.attack(currentDuck);
                        currentDuck.Immunity = true;
                        nextDuck.Immunity = true;
                        currentDuck.Immune_time += 5000;
                        nextDuck.Immune_time += 5000;
                    }else{
                        if(currentDuck.Immune_time==0){
                            currentDuck.Immunity = false
                        }
                        if(nextDuck.Immune_time==0){
                            nextDuck.Immunity = false;
                        }
                    }
                
            }
            currentDuck.Immune_time =Math.max(0,(currentDuck.Immune_time-1000/60));
            nextDuck.Immune_time = Math.max(0,(nextDuck.Immune_time-1000/60));
            console.log(currentDuck.Immune_time,nextDuck.Immune_time);
        }
}

function gameLoop() {
    updateDuckPosition(); // Update duck's position
    updateDuckDirection(); // Update duck's direction
    if(duck.isDragon) duck.fireFireball();
    duck.updateFireballs();
    DucksCollided();
    checkFireballCollision(); // Check for collision with Fireballs
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
    for (let i = 0; i < Ducks.length; i++) {
        if (Ducks[i].hp <= 0) {//TODO online part need to fix this please
            console.log("Duck defeated!");
            // Remove the duck from the array
            Ducks.splice(i, 1);
            if(i!=0){
                OtherDucks.splice(i-1, 1);
            }
            // Decrement the loop index to account for the removed duck
            i--;
        }
    }
}

function checkFireballCollision() {
    duck.fireballs.forEach((fireball, fireballIndex) => {
        Ducks.forEach(otherDuck => {
            if (checkCollision(fireball, otherDuck)) {
                // console.log("Hit");
                // Handle hit logic here
                fireball.hitT(otherDuck); // Call hitT method of fireball
                duck.fireballs.splice(fireballIndex, 1); // Remove the fireball from the array
                // console.log(otherDuck.hp); // Log updated HP of the other duck
            }
        });
    });
}

setInterval(() => {
    getDucks();
    if (playerIndex==0) updatePlayerData(); 
}, 1000);

// Event listener for keydown events
addEventListener("keydown", (e) => {
    const { key } = e;
    if (key==" " || key=="q" || key=="Q") {
        turnDuck(true);
        duck.pedal();
    } else if (key=="Enter" || key=="e" || key=="E") {
        turnDuck(false);
        duck.pedal();
    } else if (key=="ArrowDown" || key=="s" || key=="S") {
        duck.brake();
    }

    // if (key === "Space" || key === " ") {
    //     turnDuck(playerIndex==0);
    //     duck.pedal();
    // }
});

// Event listener for keyup events
addEventListener("keyup", (e) => {
    // Reset turning flag when turning keys are released
    isTurning = false;
});

addEventListener("load", () => {
    init();
    createDuck();
    getDucks();
});

addEventListener("resize", init());