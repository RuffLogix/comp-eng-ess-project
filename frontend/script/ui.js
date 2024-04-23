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
const bgImgSize = 200;

image.src = "./source/img/ped-top-view.PNG";
bgImg.src = "./source/img/bg5.PNG";
fireballImg.src = "./source/img/fireball.PNG";
dummyImg.src = "./source/img/ped-top-view.PNG"

image.onload = () => {
    // Start the game loop only after the image is loaded
    gameLoop();
};
function render() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!duck.isDead){
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(duck.direction + Math.PI / 2);
        ctx.fillStyle = "#96D3FF";
        ctx.beginPath();
        ctx.arc(0,duck.size*0.075, duck.size*0.4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

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

    // Draw dummy section
    ctx.strokeStyle = "red"
    let tmp = 1+(duck.isDragon*0.3);
    OtherDucks.forEach(otherDuck => {
        ctx.save(); // Save the current transformation matrix
        ctx.translate(otherDuck.x - camera.x + canvas.width / 2, otherDuck.y - camera.y + canvas.height / 2);
        ctx.drawImage(dummyImg, -otherDuck.size / 2 * tmp, -otherDuck.size / 2 *tmp, otherDuck.size * tmp, otherDuck.size * tmp);
        ctx.restore(); // Restore the previous transformation matrix
    });
    // end of dummy seciton
    if (!duck.isDead){
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(duck.direction + Math.PI / 2);
        ctx.beginPath();
        if (!duck.isDragon && duck.speedLevel == duck.MAXLEVEL && duck.dmgLevel == duck.MAXLEVEL && duck.hpLevel == duck.MAXLEVEL){
            image.src = "./source/img/dragon.PNG";
            duck.isDragon = true;
        }
        ctx.drawImage(image, -duck.size / 2 * tmp, -duck.size / 2 *tmp, duck.size * tmp, duck.size * tmp);
        ctx.restore();
    }

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
        window.location.href = window.location.origin + "/frontend/index.html";
    });
})

