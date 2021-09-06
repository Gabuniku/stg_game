/**
 * 敵クラス
 */

import * as util from "./stg_util.js"
import { Entity } from "./entity.js"

const ENEMY_SHOT_INTERVAL = [60];

export class Enemy extends Entity {
    constructor(x, y, type, gun_type, speed = 10, hp = 10) {
        super(new util.Pos(x, y), 0, speed);
        this.gun_type = gun_type;
        this.type = type;
        this.hp = hp;
        this.last_shot_frame = 0;
        this.frame_cnt = 0;
        this.killed  = false;
        this.shot_interval = ENEMY_SHOT_INTERVAL[type];
    }
    update() {
        this.get_hits();
        if(this.hp < 0){
            this.destroy();
            this.killed = true;
        }
        super.update();
     }

    move() {
        switch (this.type) {
            case 0: // まっすぐ下へ
                this.pos.y += this.speed;
                break;
        }
    }
    get_hits(not_damage = false) {
        let bullets = util.getHitBullet(this.pos, this.size, false);
        if (!not_damage) { // ダメージカウント
            for (let index = 0; index < bullets.length; index++) {
                bullets[index].destroy();
                this.hp-=bullets[index].damage;
            }
        }
    }
}
