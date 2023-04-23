import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menu_ctl')
export class menu_ctl extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onStartClicked () {
        director.loadScene(
            'free-travel',
            ()=>{}, ()=>{}
        );
    }

    onContinueClicked () {
        director.loadScene(
            'free-travel',
            ()=>{}, ()=>{}
        );
    }

    onChapterClicked () {
        console.log(`Chapter`);

    }

    onSettingsClicked () {
        console.log(`Settings`);
    }
}


