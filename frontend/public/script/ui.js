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
    let gameoverPopup = document.getElementById("gameover-popup");
    let player = document.getElementById("playerContainer");
    if (duck.isDead){
        gameoverPopup.style.setProperty("visibility",`visible`);
        player.style.setProperty("visibility",`hidden`);
    }
    else {
        gameoverPopup.style.setProperty("visibility",`hidden`);
        player.style.setProperty("visibility",`visible`);
    }
}

//Preload Duck Image
const image = new Image();
const bgImg = new Image();
const dummyImg = new Image();
const fireballImg = new Image();
const dragonImg = new Image();
const bgImgSize = 200;
const tableSize = 1e5;
image.src = "./source/img/ped-top-view.PNG";
bgImg.src = "./source/img/bg5.PNG";
fireballImg.src = "./source/img/fireBall.PNG";
dummyImg.src = "./source/img/ped-top-view.PNG"
dragonImg.src= "./source/img/dragon.PNG"


image.onload = () => {
    // Start the game loop only after the image is loaded
    gameLoop();
};
function render() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => {
        ctx.beginPath();
        ctx.save();
        // ctx.translate(dummy.x - camera.x + canvas.width / 2, dummy.y - camera.y + canvas.height / 2);
        // ctx.drawImage(dummyImg, -duck.size / 2 * tmp, -duck.size / 2 *tmp, duck.size * tmp, duck.size * tmp);
        ctx.translate(-dot.x- camera.x + canvas.width / 2,-dot.y -camera.y + canvas.height / 2);
        ctx.rotate(dot.angle + Math.PI / 2);
        ctx.drawImage(dot.img, -dot.x/ 2, -dot.y / 2, dot.size,dot.size);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.restore();
    });

    duck.fireballs.forEach(fireball => {
        ctx.save(); // Save the current transformation matrix
        ctx.translate(fireball.x - camera.x + canvas.width / 2, fireball.y - camera.y + canvas.height / 2);
        ctx.rotate(fireball.initial_direction+ Math.PI / 2); // Rotate by 90 degrees
        ctx.drawImage(fireballImg, -fireball.radius, -fireball.radius, fireball.radius * 2, fireball.radius * 2);//Rotate fireballImg to sync with duck initial direction
        ctx.restore(); // Restore the previous transformation matrix
    });

    let tmp = 1+(duck.isDragon*0.3);
    if (!duck.isDead){
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(duck.direction + Math.PI / 2);
        ctx.beginPath();
        if (!duck.isDragon && duck.speedLevel == duck.MAXLEVEL && duck.dmgLevel == duck.MAXLEVEL && duck.hpLevel == duck.MAXLEVEL){
            console.log("im going to dragon");
            duck.isDragon = true;
        }
        if (duck.isDragon){
            ctx.drawImage(dragonImg, -duck.size / 2 * tmp, -duck.size / 2 *tmp, duck.size * tmp, duck.size * tmp);
        }else{
            ctx.drawImage(image, -duck.size / 2 * tmp, -duck.size / 2 *tmp, duck.size * tmp, duck.size * tmp);
            // image.src = "./source/img/ped-top-view.PNG";
        }

        ctx.restore();
    }

    Ducks.forEach(educk => {
        if (!educk.isDead) {
            ctx.save();
            ctx.translate(educk.x - camera.x + canvas.width / 2, educk.y - camera.y + canvas.height / 2);
            ctx.rotate(educk.direction + Math.PI / 2);
            ctx.beginPath();
            if (educk.isDragon){
                ctx.drawImage(dragonImg, -educk.size / 2 * tmp, -educk.size / 2 *tmp, educk.size * tmp, educk.size * tmp);
            }else{
                ctx.drawImage(image, -educk.size / 2 * tmp, -educk.size / 2 *tmp, educk.size * tmp, educk.size * tmp);
            }
        
            ctx.restore();
        }
    })

    ctx.beginPath();
    ctx.save();
    ctx.translate(-(tableSize/4)- camera.x + canvas.width / 2, -(tableSize/4) -camera.y + canvas.height / 2);
    ctx.fillStyle = "#FF0000";
    ctx.rect(-(tableSize/4),-(tableSize/4),(tableSize),(tableSize));
    ctx.stroke();
    ctx.restore();
    updateUI();
    duck.levelUp();

}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gameover-popup").addEventListener("mouseover", () => {
        let gameover = document.getElementById("gameover-text");
        gameover.innerHTML = "RETRY?";
        gameover.style.setProperty("letter-spacing",`0rem`);
    });
    
    document.getElementById("gameover-popup").addEventListener("mouseout", () => {
        let gameover = document.getElementById("gameover-text");
        gameover.innerHTML = "GAME<br>OVER";
        gameover.style.setProperty("letter-spacing",`1.7rem`);
    });
    
    document.getElementById("gameover-popup").addEventListener("click", () => {
        window.location.href = window.location.origin + "/index.html";
    });
})

function getScoreBoard() {
    fetch(`${backendUrl}/api/duck/scoreboard`, {
        method: "GET",
    }).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
        let scoreBoard = document.getElementById("scoreboard");
        scoreBoard.innerHTML = "";
        data.forEach((score, index) => {
            if (score.players.length < 2) return;
            let scoreElement = document.createElement("li");
            scoreElement.innerHTML = `${score.players[0].username} <br> ${score.players[1].username}`;
            scoreBoard.appendChild(scoreElement);
        });
    });
}

setInterval(getScoreBoard, 1000);