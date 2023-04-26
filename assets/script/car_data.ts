import { _decorator, Component, Node, Quat, 
    RigidBody, Vec3, input, Input, EventKeyboard, 
    KeyCode, Camera, ConfigurableConstraint, physics, math, Enum,
} from 'cc';

export class key_mapping {
    accelerate: KeyCode;
    brake: KeyCode;
    left: KeyCode;
    right: KeyCode;
    gearUp: KeyCode;
    gearDown: KeyCode;
    handbrake: KeyCode;
    reset: KeyCode;
    camera_inside: KeyCode;
    camera_back: KeyCode;
    camera_default: KeyCode;
};

export enum key_style {
    NORMAL,
    RALLY,
}
Enum(key_style);

export const normal_key_mapping_texture = "NormalKeyMapping";
export const key_mapping_normal = {
    accelerate: KeyCode.KEY_W,
    brake: KeyCode.KEY_S,
    left: KeyCode.KEY_A,
    right: KeyCode.KEY_D,
    gearUp: KeyCode.KEY_E,
    gearDown: KeyCode.KEY_Q,
    handbrake: KeyCode.SPACE,
    reset: KeyCode.KEY_R,
    camera_inside: KeyCode.KEY_C,
    camera_back: KeyCode.KEY_B,
    camera_default: KeyCode.KEY_V,
};

export const rally_key_mapping_texture = "RallyKeyMapping";
export const key_mapping_rally = {
    accelerate: KeyCode.KEY_A,
    brake: KeyCode.KEY_Z,
    left: KeyCode.COMMA,
    right: KeyCode.PERIOD,
    gearUp: KeyCode.KEY_S,
    gearDown: KeyCode.KEY_X,
    handbrake: KeyCode.SPACE,
    reset: KeyCode.KEY_R,
    camera_inside: KeyCode.KEY_C,
    camera_back: KeyCode.KEY_B,
    camera_default: KeyCode.KEY_V,
};

export class key_status {
    accelerate: boolean = false;
    brake: boolean = false;
    left: boolean = false;
    right: boolean = false;
    gearUp: boolean = false;
    gearDown: boolean = false;
    handbrake: boolean = false;
    reset: boolean = false;
    camera_inside: boolean = false;
    camera_back: boolean = false;
    camera_default: boolean = false;
};

export class camera_vision {
    position: Vec3;
    orientation: Quat;
}

export const camera_preset = {
    'default': {
        position: new Vec3(0, 2, 5),
        orientation: new Quat(-0.117, 0, 0, 0.993),
    },
    'back': {
        position: new Vec3(0, 2, -8),
        orientation: new Quat(0, 1, 0, 0),
    },
    'inside': {
        position: new Vec3(-0.2, 1.0, 0.6),
        orientation: new Quat(),
    },
};

export class car_config {
    maxSteeringAngle: number;
    maxSpeed: number;
    maxPower: number;
    maxBrake: number;
    smoothBufferLength: number;
};

export class car_info {
    name: string;
    description: string;
    cover: string;
    config: car_config;
    prefab: string;
}

export const car_registed: Map<string, car_info> = new Map<string, car_info>(
    [
        [
            "Huracan",
            {
                name: "Huracan",
                description: "Powerful V10 engine, a luxurious interior with advanced technology.",
                cover: "Huracan",
                config: {
                    maxSteeringAngle: 30,
                    maxSpeed: 100,
                    maxPower: 100,
                    maxBrake: 100,
                    smoothBufferLength: 10,
                },
                prefab: "Huracan",
            }
        ],
        [
            "Ferrari",
            {
                name: "Ferrari",
                description: "High-performance sports car with a powerful engine, sleek design, and luxurious interior.",
                cover: "Ferrari",
                config: {
                    maxSteeringAngle: 30,
                    maxSpeed: 100,
                    maxPower: 100,
                    maxBrake: 100,
                    smoothBufferLength: 10,
                },
                prefab: "Ferrari",
            }
        ],
        [
            'Porsche',
            {
                name: 'Porsche',
                description: 'Execellent engineering, sleek design, and impressive speed with advanced technology and high-quality materials.',
                cover: 'Porsche',
                config: {
                    maxSteeringAngle: 30,
                    maxSpeed: 100,
                    maxPower: 100,
                    maxBrake: 100,
                    smoothBufferLength: 10,
                },
                prefab: 'Porsche',
            }
        ],
        [
            'SUV',
            {
                name: 'SUV',
                description: 'Higher ground clearance with all-wheel drive.',
                cover: 'SUV',
                config: {
                    maxSteeringAngle: 30,
                    maxSpeed: 100,
                    maxPower: 100,
                    maxBrake: 100,
                    smoothBufferLength: 10,
                },
                prefab: 'SUV',
            }
        ],
        [
            'Jeep',
            {
                name: 'Jeep',
                description: 'Excellent off-road capabilities and distinctive design.',
                cover: 'Jeep',
                config: {
                    maxSteeringAngle: 30,
                    maxSpeed: 100,
                    maxPower: 100,
                    maxBrake: 100,
                    smoothBufferLength: 10,
                },
                prefab: 'Jeep',
            }
        ]
    ]
);