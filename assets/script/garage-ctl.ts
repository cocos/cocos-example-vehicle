import { _decorator, Component, Node, Prefab, PageView, instantiate, assetManager, SpriteFrame, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import { car_registed } from './car_data';

@ccclass('garage_ctl')
export class garage_ctl extends Component {

    @property({type: Prefab})
    public carItem: Prefab = null!;
    @property({type: PageView})
    public pageView: PageView = null!;

    start() {
        const cover_path = "texture/car_cover/";
        const bundle = assetManager.getBundle("resources");

        bundle.loadDir(cover_path, SpriteFrame, (err, assets) => {
            if (err) {
                console.log(`err: ${err}`);
                return;
            }
            console.log(`assets: ${assets.length}`);
            assets.forEach((item: SpriteFrame) => {
                console.log(`sprite frame: ${item.name}`);
            }
            );
        });

        for (let [key, value] of car_registed) {
            let carItem = instantiate(this.carItem);
            const sprite = carItem.getChildByName("Sprite").getComponent(Sprite);
            const label = carItem.getChildByName("Label").getComponent(Label);
            const carData = value;
            label.string = `car: ${carData.name}\ndescription: ${carData.description}`;
            bundle!.load(`${cover_path}${carData.cover}`, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.log(`err: ${err}`);
                    return;
                }
                sprite.spriteFrame = spriteFrame;
            });
            this.pageView.addPage(carItem);
        }
    }
    update(deltaTime: number) {
    }
}

