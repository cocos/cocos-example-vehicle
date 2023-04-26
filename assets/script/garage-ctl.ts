import { _decorator, Component, Node, Prefab, PageView, instantiate, assetManager, SpriteFrame, Label, Sprite } from 'cc';
import { car_item } from './car-item';
const { ccclass, property } = _decorator;
import { car_registed } from './car_data';
import { car_selected, select_car } from './car_setting';

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

            for (let [key, value] of car_registed) {
                let carItem = instantiate(this.carItem);
                const carItemCtl = carItem.getComponent(car_item);
                carItemCtl.updateItem(this.pageView.getPages().length, key);

                const sprite = carItem.getChildByName("Sprite").getComponent(Sprite);
                const label = carItem.getChildByName("Label").getComponent(Label);
                const carData = value;
                label.string = `car: ${carData.name}\ndescription: ${carData.description}`;
                const spriteFrame = assets.find((item) => item.name === carData.cover);
                if (spriteFrame) {
                    sprite.spriteFrame = spriteFrame;
                }
                this.pageView.addPage(carItem);
            }
        });
    }
    update(deltaTime: number) {
    }
}

