import { _decorator, Component, Node, Quat, 
    RigidBody, Vec3, input, Input, EventKeyboard, 
    KeyCode, Camera, ConfigurableConstraint, physics, math,
} from 'cc';

const { ccclass, property } = _decorator;

class camera_vision {
    position: Vec3;
    orientation: Quat;
}

const camera_preset = {
    'default': {
        position: new Vec3(0, 2, 8),
        orientation: new Quat(),
    },
    'back': {
        position: new Vec3(0, 2, -8),
        orientation: new Quat(0, 1, 0, 0),
    },
    'inside': {
        position: new Vec3(0, 1, 0),
        orientation: new Quat(),
    },
};

class car_config {
    maxSteeringAngle: number;
    maxSpeed: number;
    maxPower: number;
    maxBrake: number;
    smoothBufferLength: number;
    blendingFactor: number;
};

const car_preset: car_config = {
    maxSteeringAngle: 45,
    maxSpeed: 320,
    maxPower: 1000,
    maxBrake: 1000,
    smoothBufferLength: 10,
    blendingFactor: 0.2,
};

@ccclass('Vehicle')
export class Vehicle extends Component {

    @property({ type: Node })
    public car: Node = null!;

    public frontLeftWheel: Node = null!;
    public frontRightWheel: Node = null!;
    public rearLeftWheel: Node = null!;
    public rearRightWheel: Node = null!;

    public frontLeftHub: Node = null!;
    public frontRightHub: Node = null!;
    public carBody: Node = null!;
    public mainCamera: Camera = null!;

    public framework: Node = null!;

    private _maxPower = 1000;
    private _currentGear = 0;
    private _gears = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    private _speedLevel = 0;
    private _speedLevels = [-20, 0, 20, 40, 60, 90, 120, 160, 200, 240, 280, 320];
    private _strengthLevels = [50, 0, 50, 25, 16.66, 11.11, 8.33, 6.25, 5.00, 4.16, 3.57, 3.12];
    private _currentSpeed = 0;
    private _currentStrength = 0;

    private _currentVisionPreset: camera_vision = camera_preset['default'];
    private _persistentVision: camera_vision = camera_vision['default'];

    private _onAcceleration = false;
    private _steeringDelta = 0;
    
    private _bufferSize = car_preset.smoothBufferLength;
    private _bufferIndex = 0;
    
    private _smoothedSteeringAngle = 0;
    private _smoothedPosition = new Vec3(0, 0, 0);
    private _smoothedOrientation = new Quat(0, 0, 0, 0);
    
    private _smoothedVelocity = new Vec3(0, 0, 0);
    private _prevPosition = new Vec3(0, 0, 0);

    start() {
        this.carBody = this.car.getChildByName('body')!;
        this.framework = this.car.getChildByName('framework')!;
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
                this._steeringDelta = car_preset.maxSteeringAngle;
                break;
            case KeyCode.KEY_D:
                this._steeringDelta = -car_preset.maxSteeringAngle;
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
            case KeyCode.KEY_C:
                this._persistentVision = camera_preset['inside'];
                this._currentVisionPreset = this._persistentVision;
                break;
            case KeyCode.KEY_V:
                this._persistentVision = camera_preset['default'];
                this._currentVisionPreset = this._persistentVision;
                break;
            case KeyCode.KEY_B:
                this._currentVisionPreset = camera_preset['back'];
                break;
            case KeyCode.SPACE:
                this.setDrivingForce(0);
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
                this._steeringDelta = 0;
                break;
            case KeyCode.KEY_D:
                this._steeringDelta = 0;
                break;
            case KeyCode.KEY_C:
                this._currentVisionPreset = this._persistentVision;
                break;
            case KeyCode.KEY_V:
                this._currentVisionPreset = this._persistentVision;
                break;
            case KeyCode.KEY_B:
                this._currentVisionPreset = this._persistentVision;
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
        this._currentStrength = this._strengthLevels[index] / 50.0; // divide by factor to make it more realistic
        this._currentSpeed = this._speedLevels[index];
        
        if (this._onAcceleration) {
            this.setDrivingSpeed(this._currentSpeed);
            this.setDrivingForce(this._currentStrength);
        }
        console.log('current gear: ', this._currentGear);
    }

    update(deltaTime: number) {
        this._bufferIndex = (this._bufferIndex + 1) % this._bufferSize;
        this.updateVision(this._bufferIndex);
        this.updateSteering(this._bufferIndex);

        this.updateVelocity(deltaTime);
    }

    updateSteering(index: number) {
        this._smoothedSteeringAngle = math.lerp(this._smoothedSteeringAngle, this._steeringDelta, 0.08);
        this.setSteeringAngle(this._smoothedSteeringAngle);
    }

    updateVision (index: number) {
        // update camera position
        const vision = this._currentVisionPreset;
        const position = this.car.getWorldPosition();
        const rotation = this.car.getWorldRotation();
        const scale = this.car.getWorldScale();

        Vec3.lerp(this._smoothedPosition, this._smoothedPosition, position, 0.2);
        Quat.slerp(this._smoothedOrientation, this._smoothedOrientation, rotation, 0.2);

        const targetPosition = new Vec3();
        const targetRotation = new Quat();

        Vec3.transformQuat(targetPosition, vision.position, rotation);
        Vec3.multiply(targetPosition, targetPosition, scale);
        Vec3.add(targetPosition, targetPosition, position);
        Quat.multiply(targetRotation, this._smoothedOrientation, vision.orientation);
        this.mainCamera.node.setWorldPosition(targetPosition);
        this.mainCamera.node.setWorldRotation(targetRotation);
    }

    updateVelocity (deltaTime: number) {
        const position = this.car.getWorldPosition();
        const velocity = Vec3.subtract(new Vec3(), position, this._prevPosition);
        Vec3.multiplyScalar(velocity, velocity, 1 / deltaTime);
        this._prevPosition = position;
        Vec3.lerp(this._smoothedVelocity, this._smoothedVelocity, velocity, 0.1);
        const v = this._smoothedVelocity;
        // console.log(`velocity: (${v.x}, ${v.y}, ${v.z}})`);
        console.log(`speed: ${this.getSpeedKmHour()} km/h`);
    }

    reset () {
        this.resetTo(new Vec3(0, 0, 0), new Quat());
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
            // console.log('setSteeringAngle', angle);
        }
        const com1 = this.frontRightHub.getComponent(physics.ConfigurableConstraint);
        if (com1) {
            com1.angularDriverSettings.targetOrientation.x = angle;
            com1.angularDriverSettings.targetOrientation = com1.angularDriverSettings.targetOrientation;
            // console.log('setSteeringAngle', angle);
        }
    }

    setBrakingForce(force: number) {
        // console.log('setBrakingForce', force);
    }

    getSpeedKmHour() {
        return Vec3.len(this._smoothedVelocity) * 3.6;
    }
}