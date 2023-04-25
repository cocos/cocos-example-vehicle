import { _decorator, Button, Color, Component, director, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chapter_item')
export class chapter_item extends Component {
    _name = "";

    onload() {
    }

    start() {
        // Your initialization goes here.
    }

    public loadScene() {
        return new Promise<void>((resovle, reject) => {
            director.loadScene(this._name, (error: any) => {
                error ? reject(error) : resovle();
            });
        });
    }

    public updateItem(idx: number, name: string) {
        this._name = name;
    }

    update(deltaTime: number) {
    }
}


