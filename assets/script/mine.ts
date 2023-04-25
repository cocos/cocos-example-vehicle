import { _decorator, Collider, Component, ICollisionEvent, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('mine')
export class mine extends Component {
    start() {
        const collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onCollision, this);

    }

    update(deltaTime: number) {
        
    }

    onCollision(event: ICollisionEvent) {
        const rigidbody = event.otherCollider.node.getComponent(RigidBody);
        let impulse = new Vec3(0, 100, 0);
        rigidbody?.applyImpulse(impulse);
    }
}


