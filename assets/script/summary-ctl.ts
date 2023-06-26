import { _decorator, Component, Node, RichText, SpriteFrame, Texture2D, Sprite, Material, Collider } from 'cc';
import { game_time } from './game-time';
const { ccclass, property } = _decorator;

@ccclass('summary_ctl')
export class summary_ctl extends Component {

    @property({type: Node})
    private summaryPanel: Node = null!;

    @property({type: Node})
    private driver: Node;

    private _collider: Collider = null!;
    private _timer: game_time = null!;

    private _game_end = false;

    start() {
        this._collider = this.node.getComponent(Collider)!;
        this._timer = this.driver.getComponent(game_time)!;
        if (this._collider) {
            this._collider.on('onCollisionEnter', this.onCollide, this);
        }
    }

    update(deltaTime: number) {
    }

    onCollide() {
        if (!this._game_end) {
            const time = this._timer.time;
            const richText = this.summaryPanel.getChildByName('container').getChildByName('Label').getComponent(RichText);
            if (!richText) {
                console.error('not found');
            } else {
                richText.string = `<color=#00ff00>Time used</color> <color=#0fffff>${time}</color> <color=#00ff00>sec</color>`;
            }
            this.summaryPanel.active = true;
        }
        this._game_end = true;
    }
}