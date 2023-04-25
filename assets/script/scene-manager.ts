import { _decorator, Component, Node, Prefab, ScrollView, assetManager, instantiate, SceneAsset, Scene, UITransform, Sprite, RichText, Label } from 'cc';
import { chapter_item } from './chapter-item';
import { scene_registed } from './scene_data';
const { ccclass, property } = _decorator;

@ccclass('scene_manager')
export class scene_manager extends Component {
    @property({ type: Prefab })
    itemPrefab: Prefab | null = null;
    @property({ type: ScrollView })
    scrollView: ScrollView = null!;

    private _sceneList: string[] = [];
    private _sceneItems: Node[] = [];

    onLoad() {
        const scene_dirs = ["resources"];
        console.log(`scene_dirs: ${scene_dirs}`);

        // if (this.itemPrefab === null) {
        //     console.log(`itemPrefab is null`);
        //     return;
        // }

        scene_dirs.forEach((item: string) => {
            console.log (`item: ${item}`);
            assetManager.loadBundle(item, (err, bundle) => {
                if (err) {
                    console.log(`err: ${err}`);
                    return;
                }

                // bundle.loadDir("prefab", SceneAsset, (err, assets) => {
                //     if (err) {
                //         console.log(`err: ${err}`);
                //         return;
                //     }

                //     console.log(`assets: ${assets.length}`);

                //     // assets.forEach((item: SceneAsset) => {
                //     //     // this._sceneList.push(item);
                //     //     console.log(`scene: ${item.name}`);
                //     // });
                // });
            });

        });
        assetManager.resources!.config.scenes.forEach((item: any) => {
            this._sceneList.push(item.url);
        });

        this._sceneList.forEach((item: string) => {
            const node = instantiate(this.itemPrefab);
            const chapter = node.getComponent(chapter_item);
            // only get the last part of the path
            node.name = item.split("/").pop()!.split(".")[0];
            chapter.updateItem(this._sceneItems.length, item);
            this.scrollView.content.addChild(node);
            this._sceneItems.push(node);
        });

        this._sceneItems.forEach((item: Node, index: number) => {
            // console.log(item);
            const itemTrans = item.getComponent(UITransform);
            const sprite = item.getChildByName("Sprite");
            const title = item.getChildByName("Title").getComponent(RichText);
            const desc = item.getChildByName("Detail").getComponent(Label);
            const sceneData = scene_registed.get(item.name);
            if (sceneData) {
                title.string = `<color=#ff0000>Chapter ${index} ${sceneData.title}</color>`;
                desc.string = sceneData.description;
            } else {
                title.string = `<color=#ff0000>Chapter ${index} ${item.name}</color>`;
            }
            this.node.addChild(item);
            item.setPosition(0, -itemTrans.height * index, 0);
        });

        // get the content container, resize it
        const contentTrans = this.scrollView.content.getComponent(UITransform);
        if (this._sceneItems.length > 0) {
            const itemTrans = this._sceneItems[0].getComponent(UITransform);
            contentTrans.height = itemTrans.height * this._sceneItems.length;
        }
    }

    start() {
    }

    update(deltaTime: number) {
        
    }
}


