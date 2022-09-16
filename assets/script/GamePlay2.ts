

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
    listBullet: cc.Node = null;

    @property(cc.Node)
    bangDan: cc.Node = null;

    @property(cc.Node)
    bangDan2: cc.Node = null;

    @property(cc.Node)
    khoabang: cc.Node = null;

    @property(cc.Node)
    gun: cc.Node = null;

    @property(cc.Node)
    gun2: cc.Node = null;

    @property(cc.Node)
    chotAt: cc.Node = null;

    @property(cc.Node)
    khoaNong: cc.Node = null;

    @property(cc.Node)
    co: cc.Node = null;

    @property(cc.Node)
    chot2: cc.Node = null;

    @property(cc.Node)
    chotAtGun2: cc.Node = null;

    @property(cc.Node)
    khoaNongGun2: cc.Node = null;

    @property(cc.Node)
    coGun2: cc.Node = null;

    @property(cc.Node)
    chot2Gun2: cc.Node = null;


    @property(cc.Node)
    smoke: cc.Node = null;

    @property(cc.Node)
    smokeGun2: cc.Node = null;

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
        let posHopDan = cc.v3(14,-40);
        cc.audioEngine.play(this.bgSound, true, 0.35);
        this.reloadBullet();
        // this.moveHand(cc.v3(109, -277), cc.v3(109, -127));

    }
    moveHand(pos1, pos2) {
        cc.tween(this.hand).repeatForever(
            cc.tween(this.hand).set({ position: pos1 }).to(0.5, { position: pos2 }).delay(0.5).set({ position: pos1 })
        ).start();
    }
    reloadBtnEvent() {
    }
    modeBtnEvent() {
    }
    lockBtnEvent() {

    }
    checkReloadFun(event) {
    }
    endReloadEvent() {
    }
    checkModeFun(event) {
    }
    endModeEvent(event) {
    }
    checkLockFun(event) {
    }
    endLockEvent(event) {
    }
    chooseItem(event, customEventData) { // chon item

    }
    reloadBullet() {
        // if (this.checkShoot == 1) this.shootBtn.node.active = true;
        this.hand.stopAllActions();
        this.hand.active = false;
        // if (this.checkShoot == 0) {
            // this.reloadBtn.node.active = false;;
            this.bulletNum = 5;
            cc.tween(this.bangDan).to(0.25,{angle:15}).to(0.25, { position:cc.v3(-18,25) }).to(0.25,{angle:0}).call(() => {
                this.bulletNumLabel.string = `${this.bulletNum}/30`;
                cc.audioEngine.play(this.reloadSound, false, 1);
            }).start();
            cc.tween(this.gun).delay(0.75).to(0.15, { angle: 1 }).to(0.15, { angle: 0 }).delay(0.5).call(()=>{
                this.openLock2();
            }).start();
        //     cc.tween(this.khoabang).delay(0.25).to(0.2, { angle: -50 }).call(() => {
        //         if (this.checkShoot == 0) {
        //             this.modeBtnEvent();
        //             this.hand.active = true;
        //             this.moveHand(cc.v3(-115, 0), cc.v3(-115, -50));
        //             // this.hand.setPosition(cc.v3(-95, -40));
        //         }
        //     }).start();
        // }
        // else {
        //     // this.hand.active = false;
        //     this.reloadBtnGun2.node.active = false;
        //     this.bulletNum = 20;
        //     cc.tween(this.bangDan2).to(0.25, { position:cc.v3(-22,25) }).call(() => {
        //         this.bulletNumLabel.string = `${this.bulletNum}/20`;
        //         cc.audioEngine.play(this.reloadSound, false, 1);
        //     }).start();
        //     cc.tween(this.gun2).delay(0.26).to(0.15, { angle: 3 }).to(0.15, { angle: 0 }).call(() => {
        //         if (this.checkShoot == 1) {
        //             this.modeBtnGun2.enabled = true;
        //             this.hand.active = true;
        //             this.moveHand(cc.v3(-80, 30), cc.v3(-80, -15));
        //             // this.hand.setPosition(cc.v3(-110, 15));
        //         }
        //     }).start()
        // }


    }
    openLock() {
        // this.hand.stopAllActions();
        // this.hand.active = false;
        // if (this.checkShoot == 0) {
        //     this.modeBtn.node.active = false;
            cc.audioEngine.play(this.modeSound, false, 1);
            cc.tween(this.chotAt).to(0.25, { angle: 40 }).call(() => {
                this.lockBtn.enabled = true;
                this.hand.active = true;
                this.moveHand(cc.v3(222, 82), cc.v3(112, 82));
                this.hand.setPosition(cc.v3(232, 82));

            }).start();
        // }
        // else {
        //     this.hand.active = false;
        //     this.modeBtnGun2.node.active = false;
        //     cc.audioEngine.play(this.modeSound, false, 1);
        //     cc.tween(this.chotAtGun2).to(0.25, { angle: -15 }).call(() => {
        //         this.lockBtnEvent();
        //         this.hand.active = true;
        //         this.moveHand(cc.v3(50, 30), cc.v3(-50, 30));
        //         //this.hand.setPosition(cc.v3(0, 30));

        //     }).start();
        // }

    }

    openLock2() {
        // this.hand.stopAllActions();
        // this.hand.active = false;
        // if (this.checkShoot == 0) {
            // this.lockBtn.node.active = false;
            cc.audioEngine.play(this.nongSound, false, 1);
            cc.tween(this.khoaNong).to(0.15, { x: -62 }).to(0.1, { x: 42 }).call(() => {
                this.shootBtn.node.active = true;
                this.hand.active = true;
                this.hand.getComponent(cc.Animation).play('hand');
                this.hand.setPosition(cc.v3(-25, -32));
            }).start();
        // }
        // else {
        //     this.hand.active = false;
        //     this.lockBtnGun2.node.active = false;
        //     cc.audioEngine.play(this.nongSound, false, 1);
        //     cc.tween(this.chot2Gun2).to(0.1, { x: -80 }).to(0.1, { x: -2 }).call(() => {
        //         this.shootBtn.node.active = true;
        //         this.hand.active = true;
        //         this.hand.getComponent(cc.Animation).play('hand');
        //         this.hand.setPosition(cc.v3(-106, -34));
        //     }).start();
        // }

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
                        cc.tween(this.khoaNong).to(0.075, { x: -62 }).to(0.075, { x: 42 }).call(()=>{
                            this.smoke.getComponent(cc.Animation).play('smoke_brown');
                            this.removeBullet(cc.v3(0, 46));
                        }).start();
                        // cc.tween(this.chot2).delay(0.05).to(0.05, { x: 52 }).to(0.05, { x: -12 }).call(() => {
                            
                        // }).start();
                        this.bulletNum--;
                        this.bulletNumLabel.string = `${this.bulletNum}/5`
                        if (this.bulletNum == 0) {
                            this.checkShoot += 1;
                            // if (this.checkShoot == 0) {
                                this.showScene2();
                            // }
                            // else {
                            //     // cc.tween(this.bangDan).call(() => {
                            //     //     this.bangDan.getChildByName('dan').active = false;
                            //     //     cc.tween(this.khoabang).delay(0.25).to(0.2, { angle: -20 }).start();
                            //     // }).delay(0.25).to(0.25, { y: -600 }).call(() => {
                            //     //     this.bangDan.getChildByName('dan').active = true;
                            //     // }).to(0.25, { y: -200 }).call(() => {
                            //     //     this.shootBtn.node.active = false;
                            //     //     this.reloadBtn.enabled = true;
                            //     //     this.hand.active = true;
                            //     //     this.hand.setPosition(cc.v3(70, -88));
                            //     // }).start();
                            //     this.changeGun();
                            // }
                        }
                    })
                    .to(0.05, { x: 0, angle: 0 })
                    .call(() => {
                        this.shootBtn.node.active = true;
                    })
                    .start();
            }


        // }
        // else {
        //     if (this.bulletNum > 0) {
        //         cc.tween(this.gun2)
        //             .call(() => {
        //                 this.shootBtn.node.active = false;
        //                 cc.tween(this.coGun2).to(0.05, { angle: -12 }).to(0.05, { angle: 0 }).start();
        //             })
        //             .to(0.05, { x: -20, angle: 1 }).call(() => {
        //                 cc.audioEngine.play(this.gun2FireSound, false, 1);
        //                 this.addShootEffect(this.gun2, cc.v3(485, 40));
        //                 this.shootBullet(cc.v3(545, 45));
        //                 // cc.tween(this.khoaNong).to(0.075, { x: 83 }).to(0.075, { x: 173 }).start();
        //                 cc.tween(this.chot2Gun2).delay(0.05).to(0.05, { x: -85 }).to(0.05, { x: -2 }).call(() => {
        //                     this.smokeGun2.getComponent(cc.Animation).play('smoke_brown');
        //                     this.removeBullet(cc.v3(-120, 83));
        //                 }).start();
        //                 this.bulletNum--;
        //                 this.bulletNumLabel.string = `${this.bulletNum}/20`
        //                 if (this.bulletNum == 0) {
        //                     this.checkShoot += 1;
        //                     if (this.checkShoot == 2) {
        //                         this.showScene2();
        //                     }
        //                     else {
        //                         this.changeGun();
        //                     }
        //                 }
        //             })
        //             .to(0.05, { x: 0, angle: 0 })
        //             .call(() => {
        //                 this.shootBtn.node.active = true;
        //             })
        //             .start();
        //     }
        // }
    }
    changeGun() {
        this.reloadBtnEvent();
        this.gun.active = false;
        this.gun2.active = true;
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
    // reloadBullet() {
    //     if (this.checkReload) {
    //         this.scheduleOnce(() => {
    //             this.shootBtn.enabled = true;
    //             this.checkShoot = true;
    //             this.bulletNum = 5;
    //             this.checkReload = false;
    //             this.listBullet.children.forEach(bullet => {
    //                 bullet.active = true;
    //             });
    //         }, 0.5)
    //     }
    // }

}
