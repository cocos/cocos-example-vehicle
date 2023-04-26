import { _decorator, Component, Node, Collider, ICollisionEvent, Vec3, RigidBody } from 'cc';
import { missile } from './missile'
const { ccclass, property } = _decorator;

@ccclass('traps_missile')
export class traps_missile extends Component {
    private activeTime: number = 0;
    private currentTime: number = 0;

    @property(Node)
    public missile: Node = null;

    start() {
        const collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onCollision, this);
    }

    update(deltaTime: number) {
        this.currentTime += deltaTime;
    }

    onCollision(event: ICollisionEvent) {
        if (this.currentTime - this.activeTime < 5) {
            return;
        }

        this.missile.getComponent(missile).launch = true;
    }
}


