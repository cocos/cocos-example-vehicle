import { _decorator, Collider, Component, ICollisionEvent, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('mine')
export class mine extends Component {

    private activeTime: number = 0;
    private currentTime: number = 0;

    @property
    public recover: boolean = true;

    start() {
        const collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onCollision, this);

    }

    update(deltaTime: number) {
        this.currentTime += deltaTime;
    }

    onCollision(event: ICollisionEvent) {
        if ((this.currentTime - this.activeTime < 5) || (!this.recover && this.activeTime > 0)) {
            return;
        }

        const rigidbody = event.otherCollider.node.getComponent(RigidBody);
        let impulse = new Vec3(0, 100, 0);
        rigidbody?.applyImpulse(impulse);
        
        this.activeTime = this.currentTime;
    }
}


