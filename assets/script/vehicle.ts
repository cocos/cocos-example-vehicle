import { _decorator, Component, Node, Quat, 
    RigidBody, Vec3, input, Input, EventKeyboard, 
    KeyCode, Camera, ConfigurableConstraint, physics,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Vehicle')
export class Vehicle extends Component {

    @property({ type: Node })
    public car: Node = null!;
    
    @property({ type: Vec3 })
    public offset = new Vec3(0, 0, 0);

    public frontLeftWheel: Node = null!;
    public frontRightWheel: Node = null!;
    public rearLeftWheel: Node = null!;
    public rearRightWheel: Node = null!;

    public frontLeftHub: Node = null!;
    public frontRightHub: Node = null!;
    public carBody: Node = null!;
    public mainCamera: Camera = null!;

    private _maxPower = 100000;
    private _currentGear = 0;
    private _gears = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    private _speedLevel = 0;
    private _speedLevels = [-20, 0, 20, 40, 60, 90, 120, 160, 200, 240, 280, 320];
    private _strengthLevels = [5000, 0, 5000, 2500, 1666, 1111, 833, 625, 500, 416, 357, 312];
    private _currentSpeed = 0;
    private _currentStrength = 0;

    private _onAcceleration = false;

    private _steeringBuffer = new Array<number>(60).fill(0);
    private _bufferIndex = 0;

    start() {
        this.carBody = this.car.getChildByName('body')!;
        this.frontLeftWheel = this.car.getChildByName('Wheel-000')!;
        this.frontRightWheel = this.car.getChildByName('Wheel-001')!;
        this.rearLeftWheel = this.car.getChildByName('Wheel-010')!;
        this.rearRightWheel = this.car.getChildByName('Wheel-011')!;

        this.frontLeftHub = this.car.getChildByName('hub-000')!;
        this.frontRightHub = this.car.getChildByName('hub-001')!;

        this.mainCamera = this.node.getChildByName('vehicle-camera')!.getComponent(Camera)!;

        // monitor input events, wasd
        const com0 = this.frontLeftHub.getComponent(physics.ConfigurableConstraint);
        if (com0) {
            com0.angularDriverSettings.twistDrive = 1;
        }
        const com1 = this.frontRightHub.getComponent(physics.ConfigurableConstraint);
        if (com1) {
            com1.angularDriverSettings.twistDrive = 1;
        }
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyRelease, this);
    }

    onKeyDown(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.KEY_W:
                this.setDrivingSpeed(this._currentSpeed);
                this.setDrivingForce(this._currentStrength);
                this._onAcceleration = true;
                break;
            case KeyCode.KEY_A:
                this.setSteeringAngle(30);
                break;
            case KeyCode.KEY_D:
                this.setSteeringAngle(-30);
                break;
            case KeyCode.KEY_Q:
                this.changeGear('-');
                break;
            case KeyCode.KEY_E:
                this.changeGear('+');
                break;
            case KeyCode.KEY_R:
                this.reset();
                break;
            default: break;
        }
    }

    onKeyRelease(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.KEY_W:
                this.setDrivingForce(0);
                this.setDrivingSpeed(0);
                this._onAcceleration = false;
                break;
            case KeyCode.KEY_A:
                this.setSteeringAngle(0);
                break;
            case KeyCode.KEY_D:
                this.setSteeringAngle(0);
                break;
            default: break;
        }
    }

    changeGear(event: '+' | '-') {
        if (event === '-') {
            this._currentGear--;
        } else {
            this._currentGear++;
        }
        if (this._currentGear < this._gears[0]) {
            this._currentGear = this._gears[0];
        }
        if (this._currentGear > this._gears[this._gears.length - 1]) {
            this._currentGear = this._gears[this._gears.length - 1];
        }
        this.setGear(this._currentGear);
    }

    setGear (gear: number) {
        this._currentGear = gear;
        const index = this._gears.indexOf(gear);
        this._speedLevel = index;
        this._currentStrength = this._strengthLevels[index];
        this._currentSpeed = this._speedLevels[index];
        
        if (this._onAcceleration) {
            this.setDrivingSpeed(this._currentSpeed);
            this.setDrivingForce(this._currentStrength);
        }
        console.log('current gear: ', this._currentGear);
    }

    update(deltaTime: number) {
        // update camera position
        const position = new Vec3();
        Vec3.transformQuat(position, this.offset, this.car.getWorldRotation());
        this.mainCamera.node.setWorldPosition(position.add(this.car.getWorldPosition()));
        this.mainCamera.node.setWorldRotation(this.car.getWorldRotation());
    }

    reset () {
        this.resetTo(new Vec3(0, 10, 0), new Quat());
    }

    resetTo(position: Vec3, orientation: Quat) {
        this.setGear(0);
        
        this.resetRigidBody(this.car.getChildByName('framework')!);
        this.resetRigidBody(this.car.getChildByName('body')!);
        this.resetRigidBody(this.car.getChildByName('Wheel-000')!);
        this.resetRigidBody(this.car.getChildByName('Wheel-001')!);
        this.resetRigidBody(this.car.getChildByName('Wheel-010')!);
        this.resetRigidBody(this.car.getChildByName('Wheel-011')!);
        this.resetRigidBody(this.car.getChildByName('hub-000')!);
        this.resetRigidBody(this.car.getChildByName('hub-001')!);
        this.resetRigidBody(this.car.getChildByName('hub-010')!);
        this.resetRigidBody(this.car.getChildByName('hub-011')!);
        this.car.setWorldPosition(position);
        this.car.setWorldRotation(orientation);
        const framework = this.car.getChildByName('framework')!;
        framework.setWorldPosition(position);
        framework.setWorldRotation(orientation);
        this.carBody.setWorldPosition(position);
        this.carBody.setWorldRotation(orientation);
    }

    resetRigidBody(body: Node) {
        const rigid = body.getComponent(RigidBody);
        if (rigid) {
            rigid.clearState();
            rigid.setLinearVelocity(new Vec3());
            rigid.setAngularVelocity(new Vec3());
        }
    }

    setDrivingForce(strength: number) {
        let com = this.frontLeftWheel.getComponent(ConfigurableConstraint);
        if (com) {
            console.log('setDrivingForce: ', strength);
            com.angularDriverSettings.strength = strength;
        }
        com = this.frontRightWheel.getComponent(ConfigurableConstraint);
        if (com) {
            com.angularDriverSettings.strength = strength;
        }
        com = this.rearLeftWheel.getComponent(ConfigurableConstraint);
        if (com) {
            com.angularDriverSettings.strength = strength;
        }
        com = this.rearRightWheel.getComponent(ConfigurableConstraint);
        if (com) {
            com.angularDriverSettings.strength = strength;
        }
    }

    setDrivingSpeed(speed: number) {
        speed = - speed * 10; 
        let com = this.frontLeftWheel.getComponent(ConfigurableConstraint);
        if (com) {
            console.log('setDrivingSpeed: ', speed);
            com.angularDriverSettings.targetVelocity.x = speed;
            com.angularDriverSettings.targetVelocity = com.angularDriverSettings.targetVelocity;
        }
        com = this.frontRightWheel.getComponent(ConfigurableConstraint);
        if (com) {
            com.angularDriverSettings.targetVelocity.x = speed;
            com.angularDriverSettings.targetVelocity = com.angularDriverSettings.targetVelocity;
        }
        com = this.rearLeftWheel.getComponent(ConfigurableConstraint);
        if (com) {
            com.angularDriverSettings.targetVelocity.x = speed;
            com.angularDriverSettings.targetVelocity = com.angularDriverSettings.targetVelocity;
        }
        com = this.rearRightWheel.getComponent(ConfigurableConstraint);
        if (com) {
            com.angularDriverSettings.targetVelocity.x = speed;
            com.angularDriverSettings.targetVelocity = com.angularDriverSettings.targetVelocity;
        }
    }

    setSteeringAngle(angle: number) {
        const com0 = this.frontLeftHub.getComponent(physics.ConfigurableConstraint);
        if (com0) {
            com0.angularDriverSettings.targetOrientation.x = angle;
            com0.angularDriverSettings.targetOrientation = com0.angularDriverSettings.targetOrientation;
            console.log('setSteeringAngle', angle);
        }
        const com1 = this.frontRightHub.getComponent(physics.ConfigurableConstraint);
        if (com1) {
            com1.angularDriverSettings.targetOrientation.x = angle;
            com1.angularDriverSettings.targetOrientation = com1.angularDriverSettings.targetOrientation;
            console.log('setSteeringAngle', angle);
        }
    }

    setBrakingForce(force: number) {
        console.log('setBrakingForce', force);
    }

    getSpeedKmHour() { return 0; }
}