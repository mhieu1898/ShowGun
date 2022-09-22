

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    homeMenu: cc.Node = null;

    @property(cc.Node)
    listGun: cc.Node[] = [];

    @property(cc.Button)
    shootBtn: cc.Button = null;

    @property(cc.Prefab)
    effectShootPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Node)
    bangDan: cc.Node = null;

    @property(cc.Node)
    khoabang: cc.Node = null;

    @property(cc.Node)
    gun: cc.Node = null;

    @property(cc.Node)
    chotAt: cc.Node = null;

    @property(cc.Node)
    khoaNong: cc.Node = null;

    @property(cc.Node)
    co: cc.Node = null;

    @property(cc.Node)
    smoke: cc.Node = null;

    @property(cc.Label)
    bulletNumLabel: cc.Label = null;

    @property(cc.Node)
    uiNode: cc.Node = null;

    @property(cc.Node)
    scene1: cc.Node = null;

    @property(cc.Node)
    hand: cc.Node = null;

    @property(cc.AudioClip)
    gunFire: cc.AudioClip = null;

    @property(cc.AudioClip)
    gun2FireSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    reloadSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    modeSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    nongSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    bgSound: cc.AudioClip = null;

    @property(cc.Button)
    reloadBtn: cc.Button = null;

    @property(cc.Button)
    modeBtn: cc.Button = null;

    @property(cc.Button)
    lockBtn: cc.Button = null;

    @property(cc.Button)
    reloadBtnGun2: cc.Button = null;

    @property(cc.Button)
    modeBtnGun2: cc.Button = null;

    @property(cc.Button)
    lockBtnGun2: cc.Button = null;


    gunNum: number = 0;

    gunSelected: any = null;

    bulletNum: number = 0;

    checkShoot = 0;

    checkReload = false;

    checkTouch = false;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.reloadBtnEvent();
        cc.audioEngine.play(this.bgSound, true, 0.35);
        this.moveHand(cc.v3(130, -220), cc.v3(130, -70));

    }
    moveHand(pos1, pos2) {
        cc.tween(this.hand).repeatForever(
            cc.tween(this.hand).set({ position: pos1 }).to(0.5, { position: pos2 }).delay(0.5).set({ position: pos1 })
        ).start();
    }
    reloadBtnEvent() {
        this.reloadBtn.node.on(cc.Node.EventType.TOUCH_MOVE, this.checkReloadFun, this);
        this.reloadBtn.node.on(cc.Node.EventType.TOUCH_END, this.endReloadEvent, this);
    }
    modeBtnEvent() {
    }
    lockBtnEvent() {
        this.lockBtn.node.on(cc.Node.EventType.TOUCH_MOVE, this.checkLockFun, this);
        this.lockBtn.node.on(cc.Node.EventType.TOUCH_END, this.endLockEvent, this);
    }
    checkReloadFun(event) {
        let startPoint = event.touch._startPoint;
        let prevPoint = event.touch._prevPoint;
        if (prevPoint.y - startPoint.y > 0 && Math.abs(prevPoint.x - startPoint.x) < 50) {
            this.checkTouch = true;
        }
    }
    endReloadEvent(event) {
        if (this.checkTouch) {
            this.checkTouch = false;
            this.reloadBtn.node.off(cc.Node.EventType.TOUCH_MOVE);
            this.reloadBtn.node.off(cc.Node.EventType.TOUCH_END);
            this.reloadBullet();

        }
    }
    checkModeFun(event) {
    }
    endModeEvent(event) {
    }
    checkLockFun(event) {
        let startPoint = event.touch._startPoint;
        let prevPoint = event.touch._prevPoint;
        if (startPoint.x - prevPoint.x > 0 && Math.abs(prevPoint.y - startPoint.y) < 50) {
            this.checkTouch = true;
        }
    }
    endLockEvent(event) {
        if (this.checkTouch) {
            this.checkTouch = false;
            this.lockBtn.node.off(cc.Node.EventType.TOUCH_MOVE);
            this.lockBtn.node.off(cc.Node.EventType.TOUCH_END);
            this.openLock2();
        }
    }
    chooseItem(event, customEventData) { // chon item

    }
    reloadBullet() {
        this.hand.stopAllActions();
        this.hand.active = false;
        this.bulletNum = 5;
        cc.tween(this.bangDan).to(0.25, { angle: 15 }).to(0.25, { position: cc.v3(-18, 25) }).to(0.25, { angle: 0 }).call(() => {
            this.bulletNumLabel.string = `${this.bulletNum}/30`;
            cc.audioEngine.play(this.reloadSound, false, 1);
        }).start();
        cc.tween(this.gun).delay(0.75).to(0.15, { angle: 1 }).to(0.15, { angle: 0 }).delay(0.1).call(() => {
            // this.openLock2();
            this.lockBtn.node.active = true;
            this.lockBtnEvent();
            this.hand.active = true;
            this.moveHand(cc.v3(80, 20), cc.v3(-60, 20));
        }).start();


    }
    openLock() {
        cc.audioEngine.play(this.modeSound, false, 1);
        cc.tween(this.chotAt).to(0.25, { angle: 40 }).call(() => {
            this.lockBtn.enabled = true;
            this.hand.active = true;
            this.moveHand(cc.v3(222, 82), cc.v3(112, 82));
            this.hand.setPosition(cc.v3(232, 82));

        }).start();

    }

    openLock2() {
        this.hand.stopAllActions();
        this.hand.active = false;
        cc.audioEngine.play(this.nongSound, false, 1);
        cc.tween(this.khoaNong).to(0.15, { x: -62 }).to(0.1, { x: 42 }).call(() => {
            this.shootBtn.node.active = true;
            this.hand.active = true;
            this.hand.getComponent(cc.Animation).play('hand');
            this.hand.setPosition(cc.v3(-25, -32));
        }).start();

    }

    shoot(gunNum: number) {
        this.hand.active = false;
        // if (this.checkShoot == 0) {
        if (this.bulletNum > 0) {
            cc.tween(this.gun)
                .call(() => {
                    this.shootBtn.node.active = false;
                    cc.tween(this.co).to(0.05, { angle: -20 }).to(0.05, { angle: 0 }).start();
                })
                .to(0.05, { x: -20, angle: 2 }).call(() => {
                    cc.audioEngine.play(this.gunFire, false, 1);
                    this.addShootEffect(this.gun, cc.v3(420, 33));
                    this.shootBullet(cc.v3(430, 33));
                    cc.tween(this.khoaNong).to(0.075, { x: -62 }).to(0.075, { x: 42 }).call(() => {
                        this.smoke.getComponent(cc.Animation).play('smoke_brown');
                        this.removeBullet(cc.v3(0, 46));
                    }).start();
                    this.bulletNum--;
                    this.bulletNumLabel.string = `${this.bulletNum}/5`
                    if (this.bulletNum == 0) {
                        this.checkShoot += 1;
                        this.showScene2();
                    }
                })
                .to(0.05, { x: 0, angle: 0 })
                .call(() => {
                    this.shootBtn.node.active = true;
                })
                .start();
        }
    }
    changeGun() {
        this.reloadBtnEvent();
        this.gun.active = false;
        this.hand.active = true;
        this.hand.setPosition(cc.v3(-18, -151));
        this.moveHand(cc.v3(-18, -181), cc.v3(-18, -51));
        this.bulletNum = 0;
        this.bulletNumLabel.string = `${this.bulletNum}/20`
        this.hand.getComponent(cc.Animation).stop('hand');
    }

    showScene2() {
        this.homeMenu.zIndex = 3;
        this.scene1.active = false;
        this.homeMenu.active = true;
        this.hand.active = true;
        this.hand.zIndex = 4;
        cc.tween(this.hand).repeatForever(
            cc.tween(this.hand).set({ position: cc.v3(-200, 0) }).delay(1).set({ position: cc.v3(400, 0) }).delay(1).set({ position: cc.v3(-200, -250) }).delay(1).set({ position: cc.v3(400, -250) }).delay(1).set({ position: cc.v3(-200, 0) })
        ).start();
    }

    addShootEffect(gun, pos) {
        let efffectShoot = cc.instantiate(this.effectShootPrefab)
        gun.addChild(efffectShoot);
        efffectShoot.setPosition(pos);
    }
    shootBullet(pos) {
        let bullet = cc.instantiate(this.bulletPrefab)
        this.node.addChild(bullet);
        bullet.setPosition(pos);
        bullet.zIndex = 1
        cc.tween(bullet).to(0.1, { x: pos.x + 1000 }).call(() => {
            bullet.destroy();
        }).start();
    }
    removeBullet(pos) {
        let bullet = cc.instantiate(this.bulletPrefab)
        this.node.addChild(bullet);
        bullet.setPosition(pos);
        bullet.getComponent(cc.Animation).play('bullet_down');
    }

}
