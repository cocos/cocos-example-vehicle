import { _decorator, Collider, Component, Label, Node, ICollisionEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game_time')
export class game_time extends Component {

    @property(Label)
    private label: Label = null;

    public currentTime: number = 0;
    start() {

    }

    update(deltaTime: number) {
        if (this.label) {
            this.label.string = this.currentTime.toFixed(1).toString();
        }
        this.currentTime += deltaTime;
    }
}


