import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('director')
export class director extends Component {

    private currentTime: number = 0;

    @property(Node)
    public timeLabel: Node = null;

    start() {

    }

    update(deltaTime: number) {
        this.processTimeLabel();

        this.currentTime += deltaTime;
    }

    processTimeLabel() {
        if (this.timeLabel != null) {
            this.timeLabel.getComponent(Label).string = this.currentTime.toFixed(1).toString();
        }
    }
}


