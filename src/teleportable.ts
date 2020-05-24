import 'playcanvas';

export class Teleoptable extends pc.ScriptType
{
    public lastTeleportFrom! : pc.Entity | null;
    public lastTeleportTo! : pc.Entity | null;
    public lastTeleport! : number;
    public startPosition! : pc.Vec3;

    // initialize code called once per entity
    public initialize() {
        this.lastTeleportFrom = null;
        this.lastTeleportTo = null;
        this.lastTeleport = Date.now(); 
        this.startPosition = this.entity.getPosition().clone();       
    }

    // update code called every frame
    public update (dt : number) {
        // Make sure we don't fall over. If we do then
        // teleport to the last location
        var pos = this.entity.getPosition();
        if (pos.y < 0) {
            this.teleport(this.lastTeleportFrom, this.lastTeleportTo);
        }
    }

    public teleport(from : pc.Entity | null, to : pc.Entity | null) {
        // can't teleport too often (500ms)
        if (from && (Date.now() - this.lastTeleport) < 500) {
            return;
        }

        // set new teleport time
        this.lastTeleport = Date.now();

        // set last teleport targets
        this.lastTeleportFrom = from;
        this.lastTeleportTo = to;

        // position to teleport to
        var position : pc.Vec3;

        if (to) {
            // from target
            position = to.getPosition();
            // move a bit higher
            position.y += 0.5;
        } else {
            // to respawn location
            position = this.startPosition;
        }

        // move ball to that point
        (this.entity.rigidbody as any).teleport(position, pc.Vec3.ZERO);
        // need to reset angular and linear forces
        (this.entity.rigidbody as any).linearVelocity = pc.Vec3.ZERO;
        (this.entity.rigidbody as any).angularVelocity = pc.Vec3.ZERO;            
    }
}

pc.registerScript(Teleoptable, 'telepotable');
