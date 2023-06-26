import { _decorator, Component, Node, Toggle, Sprite, Label, assetManager, SpriteFrame } from 'cc';
import { key_style } from './car_data';
const { ccclass, property } = _decorator;
import { key_mapping_selected, select_key_mapping } from './car_setting'

@ccclass('setting_ctl')
export class setting_ctl extends Component {

    private _musicSetting: boolean = true;
    private _debugSetting: boolean = false;
    private _normal_key: boolean = true;
    private _rally_key: boolean = false;

    private _normal_sprite: SpriteFrame = null!;
    private _rally_sprite: SpriteFrame = null!;
    
    @property({type: Label})
    public infoPanel: Label = null!;

    @property({type: Sprite})
    public key_mapping: Sprite = null!;

    onMusicSettingToggle() {
        this._musicSetting = !this._musicSetting;
        const str = `music: ${this._musicSetting? 'on': 'off'}`;
        this.infoPanel.string = str;
    }

    onDebugSettingToggle() {
        this._debugSetting = !this._debugSetting;
        const str = `debug setting: ${this._debugSetting ? 'enabled' : 'disabled'}`;
        this.infoPanel.string = str;
    }

    onNormalKeyToggle() {
        this._rally_key = false;
        this._normal_key = true;
        const str = `key setting: ${this._normal_key ? 'normal' : 'rally'}`;
        if (this._normal_key) {
            this.key_mapping.spriteFrame = key_mapping_selected[0];
            select_key_mapping(key_style.NORMAL);
            if (this._normal_sprite) {
                this.key_mapping.spriteFrame = this._normal_sprite;
            }
        }
        this.infoPanel.string = str;
    }

    onRallyKeyToggle() {
        this._rally_key = true;
        this._normal_key = false;
        const str = `key setting: ${this._rally_key ? 'rally' : 'normal'}`;
        if (this._rally_key) {
            select_key_mapping(key_style.RALLY);
            if (this._rally_sprite) {
                this.key_mapping.spriteFrame = this._rally_sprite;
            }
        }
        this.infoPanel.string = str;
    }
    
    start() {
        // load sprite frame from resources
        const bundle = assetManager.getBundle("resources");
        bundle.loadDir('texture/key_mapping', SpriteFrame, (err, assets) => {
            if (err) {
                console.log(`err: ${err}`);
                return;
            }
            const normal_sprite = assets.find((item) => item.name === 'NormalKeyMapping');
            if (normal_sprite) {
                this._normal_sprite = normal_sprite;
            }
            const rally_sprite = assets.find((item) => item.name === 'RallyKeyMapping');
            if (rally_sprite) {
                this._rally_sprite = rally_sprite;
            }
        });
    }
    update(deltaTime: number) {}
}


