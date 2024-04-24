class Fireball {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.speed = 10 + duck.speed/50;
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