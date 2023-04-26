import { Scene } from "cc";

class SceneData {
    public title: string;
    public description: string;
    public cover: string;
}

export const scene_registed: Map<string, SceneData> = new Map<string, SceneData>(
    [
        [
            "Level1", 
            { 
                title: "Level 1",
                description: "This game track is a challenging journey filled with numerous traps and hazards. The track surface is bumpy and uneven, with loose gravel and branches flying up and causing your car to bounce and swerve.",
                cover: "Level1",
            }
        ],
    ]
);