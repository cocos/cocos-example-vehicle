import { _decorator, Component, game, Node, assetManager, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Login')
export class Login extends Component {
    @property(Node)
    public ndCanvas: Node = null!;

    onEnable () {
    }

    onDisable () {
    }

    start () {
        let bundleRoot = ["resources"];
        let arr: any = []; 

        bundleRoot.forEach((item: string)=>{
            let p = new Promise((resolve, reject)=>{
                assetManager.loadBundle(item, function (err, bundle) {
                    if (err) {
                      return reject(err);
                    }
          
                    resolve(bundle);
                });
            })
            arr.push(p);
        });

        arr.push(new Promise<void>((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 3000);
        }));

        Promise.all(arr).then(()=>{
            director.loadScene(
                "start", 
                ()=>{
                    console.log("login");
                },
                ()=>{
                    console.log("unloading");
                })
        })
    }
}
