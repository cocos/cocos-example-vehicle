import { _decorator, Component, Node, RigidBody, Quat, Vec3, Camera, CCBoolean, NodeSpace, quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('missile')
export class missile extends Component {
    @property(Node)
    public target: Node = null;

    @property(Camera)
    public missil: Camera = null;

    @property(Camera)
    public missi2: Camera = null;

    @property(Node)
    public main: Node = null;

    @property({
        type: [Node]
    })
    launchList: Node[] = [];

    @property
    public switchCamera: boolean = true;

    @property
    public launch: boolean = true;

    private acc = 5.0;
    private currentSpeed: number = 0.0;
    private maxSpeed: number = 10.0;
    private angularSpeed: number = 2;
    private launchIndex: number = 0;

    reset() {
        const quat = new Quat();
        Quat.fromEuler(quat, 0, 0, 90);

        const node = this.launchList[this.launchIndex];
        this.node.setWorldPosition(Vec3.copy(new Vec3(), node.worldPosition));
        this.node.setWorldRotation(Quat.copy(new Quat(), node.worldRotation));
        this.currentSpeed = 0;

        this.missil.node.active = false;
        this.missi2.node.active = false;
        if (this.main) {
            this.main.active = true;
        }
        this.launchIndex++;
        this.launchIndex = this.launchIndex % this.launchList.length;

        this.launch = false;
    }

    start() {
        this.reset();
    }

    update(deltaTime: number) {
        if (!this.launch) {
            return;
        }
        this.node.scene.walk((node)=> {
            if (node.name === 'vehicle-camera') {
                this.main = node;
            }
            if (node.name === 'body') {
                this.target = node;
            }
        });

        const pos = this.node.getWorldPosition();
        const rot = this.node.getWorldRotation();

        const targetPos = Vec3.copy(new Vec3(),this.target.getWorldPosition());
        const targetPos2 = Vec3.add(new Vec3(), targetPos, new Vec3(0, 20, 0));
    
        let heading = Vec3.transformQuat(new Vec3(), Vec3.UNIT_X, rot);
        heading.normalize();

        let targetDir1 = Vec3.subtract(new Vec3(), targetPos, pos);
        let targetDir2 = Vec3.subtract(new Vec3(), targetPos2, pos);
        let targetDir = targetDir1;

        if (targetDir.length() < 2) {
            this.reset();
            let impulse = Vec3.add(new Vec3(), targetDir, new Vec3(0, 0.5, 0));
            impulse.multiplyScalar(200);
            let rigidbody = this.target.getComponent(RigidBody);
            rigidbody.applyImpulse(impulse);
            return;
        } else if (targetDir.length() < 15 && this.switchCamera) {
            this.missil.node.active = true;
            this.missi2.node.active = false;
            this.main.active = false;
        } else if (targetDir.length() < 20 && this.switchCamera) {
            this.missil.node.active = false;
            this.missi2.node.active = true;
            this.main.active = false;
        } else {
            this.missil.node.active = false;
            this.missi2.node.active = false;
            this.main.active = true;
        }
        
        if (targetDir.length() > 30) {
            targetDir = targetDir2;
        }
        targetDir.normalize();

        const quat = Quat.rotationTo(new Quat(), heading, targetDir);
        let dot = Vec3.dot(heading, targetDir);
        const dotAngle = Math.acos(dot);
        const angularSpeed = Math.min(this.angularSpeed, this.currentSpeed * 0.2);
        const angle = Math.min(dotAngle, angularSpeed * deltaTime);

        this.currentSpeed += this.acc * deltaTime;
        if (this.currentSpeed >= this.maxSpeed) {
            this.currentSpeed = this.maxSpeed;
        }
        
        this.node.rotate(Quat.slerp(new Quat(), Quat.IDENTITY, quat, 1 - angle / dotAngle));
        this.node.translate(new Vec3(this.currentSpeed * deltaTime, 0, 0), NodeSpace.LOCAL);

        const position = this.node.getWorldPosition();
        if (position.x >= 200 || position.x <= -200 || position.y >= 200 || position.y <= -50 || position.z >= 200 || position.z <= -200) {
            this.reset();
            return;
        }
    }
}


