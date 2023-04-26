import { key_style } from "./car_data";

export let key_mapping = key_style.NORMAL;
export let camera_blendingFactor: 0.1;
export let steering_blendingFactor: 0.1;

export let car_selected = "car_selected";
export function select_car (car: string) {
    car_selected = car;
}