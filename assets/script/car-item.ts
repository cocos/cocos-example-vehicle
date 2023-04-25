import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { car_registed, car_selected, select_car } from './car_data';

@ccclass('car_item')
export class car_item extends Component {
    _name = "";

    updateItem(idx: number, name: string) {
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


