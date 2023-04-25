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
                description: "scene description",
                cover: "Level1",
            }
        ],
    ]
);