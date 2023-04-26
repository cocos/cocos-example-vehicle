import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;
import { car_registed } from './car_data';
import { select_car, car_selected } from './car_setting';

@ccclass('car_item')
export class car_item extends Component {
    _name = "";

    private _infoPanel: Label = null!;

    updateItem(idx: number, name: string, ) {
        this._name = name;
    }

    loadCar() {
        return new Promise<void>((resovle, reject) => {
            select_car(this._name);
            console.log(`select car: ${car_selected}`);
            resovle();
        });
    }

    start() {
    }

    update(deltaTime: number) {
    }
}


