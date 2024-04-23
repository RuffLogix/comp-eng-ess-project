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
        this.hp=100;
        this.dmg = 20;
        this.regenHpRate = 5;

        this.MAXLEVEL = 10;
        this.speedLevel=1;
        this.dmgLevel=1;
        this.hpLevel=1;
        this.isDragon = false;
        this.isDead = false;
        this.Immunity = false;
        this.Immune_time = 0;

        //Hitbox for Ped
        this.radius = this.size/2;
        //fireball section
        this.fireballCooldown = 0;
        this.fireballInterval = 1000; // Fireball cooldown in milliseconds
        this.fireballs = []; // Array to store fireball instances
        Ducks.push(this);// Add to Objects array
    }

    attack(duck){
        duck.setHp(duck.hp-this.dmg);
        if(duck.hp < 1){
            duck.isDead = true;
        
        }
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
                this.maxSpeed += 250;
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