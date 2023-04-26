import { key_style } from "./car_data";

export let camera_blendingFactor: 0.1;
export let steering_blendingFactor: 0.1;
export let car_selected = "car_selected";
export let key_mapping_selected = key_style.NORMAL;

export function select_key_mapping (key: key_style) {
    key_mapping_selected = key;
}
export function select_car (car: string) {
    car_selected = car;
}