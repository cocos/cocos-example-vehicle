import { _decorator, Component, Graphics, Node, Label, Vec2, Vec3 } from 'cc';
import { Radar } from './radar';
const { ccclass, property } = _decorator;

@ccclass('radar_screen')
export class radar_screen extends Component {
    @property(Node)
    public radar: Node = null;

    @property(Node)
    public text: Node = null;

    public last: Vec3 = new Vec3();
    public frameNum: number = 0
    public dt: number = 0;

    private scale: number = 2;

    start() {
    }

    init() {
        if (this.radar == null) {
            this.node.scene.walk((node) => {
                if (node.name === 'radar') {
                    this.radar = node;
                }
            });
        }
        
        if (this.radar != null) {
            Vec3.copy(this.last, this.radar.worldPosition);
        }
    }

    update(deltaTime: number) {
        this.init();

        this.dt += deltaTime;
        if (this.frameNum % 20 === 0 && this.radar !== null) {
            const text = this.text.getComponent(Label);
            const speed = Vec3.subtract(new Vec3(), this.radar.worldPosition, this.last).length() / this.dt;
            text.string = speed.toFixed(0);
            Vec3.copy(this.last, this.radar.worldPosition);
            this.dt = 0;
        }
        ++this.frameNum;

        const g = this.getComponent(Graphics);
        g.clear();
        g.lineWidth = 8;
        g.strokeColor.fromHEX('#00ff00');
        g.circle(0, 0, 200);
        g.circle(0, 0, 160);
        g.circle(0, 0, 120);
        g.circle(0, 0, 80);
        g.circle(0, 0, 40);
        g.stroke();

        if (this.radar !== null) {
            const radarComp = this.radar.getComponent(Radar);
            g.strokeColor.fromHEX('#ff0000');
            g.fillColor.fromHEX('#ff0000');
            g.circle(radarComp.pos.x * this.scale, -radarComp.pos.y * this.scale, 10);
            g.stroke();
            g.fill();

            g.strokeColor.fromHEX('#00ff0055');
            g.fillColor.fromHEX('#00ff0055');
            g.arc(0, 0, 200, radarComp.curr1, radarComp.curr2, true);
            g.lineTo(0, 0);
            g.close();
            g.stroke();
        }
        g.fill();
    }
}


