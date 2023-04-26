import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('return_ctl')
export class return_ctl extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onHomeButton () {
        director.loadScene(
            'start',
            ()=>{}, ()=>{}
        );
    }

    onReplayButton() {
        console.log(`Replay`);
        const scene = director.getScene();
        director.loadScene(scene.name);
    }
}


