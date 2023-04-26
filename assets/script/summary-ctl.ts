import { _decorator, Component, Node, RichText, SpriteFrame, Texture2D, Sprite, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('summary_ctl')
export class summary_ctl extends Component {

    private _summaryLabel: RichText = null!;

    start() { }

    update(deltaTime: number) { }

    onSummaryOpen() {
    }
}