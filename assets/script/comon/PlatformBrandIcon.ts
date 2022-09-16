const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformBrandIcon extends cc.Component {

    @property(cc.SpriteFrame)
    androidIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iosIcon: cc.SpriteFrame = null;

    start () {
        //this.getComponent(cc.Sprite).spriteFrame = this.iosIcon;
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            this.getComponent(cc.Sprite).spriteFrame = this.androidIcon;
        }
        else if(cc.sys.os == cc.sys.OS_IOS) {
            this.getComponent(cc.Sprite).spriteFrame = this.iosIcon;
        }
    }

    // update (dt) {}
}
