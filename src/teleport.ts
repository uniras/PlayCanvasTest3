import 'playcanvas';
import { Teleoptable } from './teleportable';

class Teleport extends pc.ScriptType
{
    public target! : pc.Entity;

    // initialize code called once per entity
    public initialize() {
        if (this.target) {
            // Subscribe to the triggerenter event of this entity's collision component.
            // This will be fired when a rigid body enters this collision volume.
            this.entity.collision!.on('triggerenter', this.onTriggerEnter, this);
        }
    }

    public onTriggerEnter(otherEntity : pc.Entity) {
        // it is not teleportable
        if (!otherEntity.script?.has('telepotable')) {
            return;
        }

        // teleport entity to the target entity
        (otherEntity.script.get("telepotable") as Teleoptable).teleport(this.entity, this.target);
    }
}

pc.registerScript(Teleport, 'teleport');

Teleport.attributes.add('target', {
    type: 'entity',
    title: 'Target Entity',
    description: 'The target entity where we are going to teleport'
});

