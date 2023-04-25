import { _decorator, Component, Node, CCString, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('scene_desc')
export class scene_desc extends Component {

    @property({type: SpriteFrame})
    public sprite: SpriteFrame = null!;
    @property({type: CCString})
    public title: string;
    @property({ type: CCString })
    public description: string;

    start() {
    }

    update(deltaTime: number) {
    }
}


