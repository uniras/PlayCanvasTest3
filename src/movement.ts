import 'playcanvas';

class Movement extends pc.ScriptType {
    public force! : pc.Vec3;
    public entity! : pc.Entity;
    public speed! : number;

    public initialize() {
        this.force = new pc.Vec3();
    }

    public update(dt : Number) {
        var forceX = 0;
        var forceZ = 0;
    
        // calculate force based on pressed keys
        if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
            forceX = -this.speed;
        } 
    
        if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
            forceX += this.speed;
        }
    
        if (this.app.keyboard.isPressed(pc.KEY_UP)) {
            forceZ = -this.speed;
        } 
    
        if (this.app.keyboard.isPressed(pc.KEY_DOWN)) {
            forceZ += this.speed;
        }
    
        this.force.x = forceX;
        this.force.z = forceZ;
    
        // if we have some non-zero force
        if (this.force.length()) {
    
            // calculate force vector
            var rX = Math.cos(-Math.PI * 0.25);
            var rY = Math.sin(-Math.PI * 0.25);
            this.force.set(this.force.x * rX - this.force.z * rY, 0, this.force.z * rX + this.force.x * rY);
    
            // clamp force to the speed
            if (this.force.length() > this.speed) {
                this.force.normalize().scale(this.speed);
            }
        }
    
        // apply impulse to move the entity
        (this as any).entity.rigidbody.applyImpulse(this.force);
    }
}

pc.registerScript(Movement, "movement");

Movement.attributes.add('speed', {
    type: 'number',    
    default: 0.1,
    min: 0.05,
    max: 5.5,
    precision: 2,
    description: 'Controls the movement speed'
});
