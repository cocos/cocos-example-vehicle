import { Scene } from "cc";

class SceneData {
    public title: string;
    public description: string;
    public cover: string;
}

export const scene_registed: Map<string, SceneData> = new Map<string, SceneData>(
    [
        [
            "car", 
            { 
                title: "car title",
                description: "car description",
                cover: "car cover",
            }
        ],
    ]
);