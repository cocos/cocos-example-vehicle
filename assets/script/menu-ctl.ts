import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menu_ctl')
export class menu_ctl extends Component {

    @property({type: Node})
    public mainMenu: Node = null!;
    @property({type: Node})
    public garagePanel: Node = null!;
    @property({type: Node})
    public settingPanel: Node = null!;
    @property({type: Node})
    public chapterPanel: Node = null!;

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

    onGarageClicked () {
        console.log(`Garage`);
        this.mainMenu.active = false;
        this.garagePanel.active = true;
    }

    onGarageClosed() {
        console.log(`Garage Closed`);
        this.mainMenu.active = true;
        this.garagePanel.active = false;
    }

    onChapterClicked () {
        console.log(`Chapter`);
        this.mainMenu.active = false;
        this.chapterPanel.active = true;
    }

    onChapterClosed () {
        console.log(`Chapter Closed`);
        this.chapterPanel.active = false;
        this.mainMenu.active = true;
    }

    onSettingsClicked () {
        this.mainMenu.active = false;
        this.settingPanel.active = true;
        console.log(`Settings`);
    }

    onSettingsClosed () {
        this.settingPanel.active = false;
        this.mainMenu.active = true;
        console.log(`Settings Closed`);
    }
}