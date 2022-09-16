
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    destroyItem() {
        this.node.destroy()
    }

    // update (dt) {}
}
