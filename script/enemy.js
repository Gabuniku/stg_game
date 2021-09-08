/**
 * 敵クラス
 */

import * as util from "./stg_util.js"
import { Entity } from "./entity.js"
import { BULLETS, PLAYER } from "./game.js"
import { Bullet } from "./bullet.js"

const ENEMY_SHOT_INTERVAL = [120, 100, 100];

export class Enemy extends Entity {
    constructor(x, y, type, gun_type, speed = 10, hp = 10) {
        super(new util.Pos(x, y), 0, speed);
        this.first_pos = new util.Pos(x, y);
        this.gun_type = gun_type;
        this.type = type;
        this.hp = hp;
        this.last_shot_frame = 0;
        this.shot_interval = ENEMY_SHOT_INTERVAL[type];
        this.frame_cnt = 0;
        this.killed = false;
        this.set_angle(90);
    }
    update() {
        this.get_hits();
        this.shot();
        if (this.hp < 0) {
            this.destroy();
            this.killed = true;
        }
        super.update();
    }
    shot() {
        if (this.frame_cnt - this.last_shot_frame > this.shot_interval) {
            let bullet = new Bullet(Object.create(this.pos), 10, util.getAngleToPos(this.pos, PLAYER.pos), 5, 10, 10);
            BULLETS.push(bullet);
            this.last_shot_frame = this.frame_cnt;
        }
    }
    get_hits(not_damage = false) {
        let bullets = util.getHitBullet(this.pos, this.size, false);
        if (!not_damage) { // ダメージカウント
            for (let index = 0; index < bullets.length; index++) {
                bullets[index].destroy();
                this.hp -= bullets[index].damage;
            }
        }
    }
    move() {
        switch (this.type) {
            case 0: // まっすぐ下へ
                this.pos.y += this.speed;
                break;
            case 1: // ステージ真ん中位で曲がっていく 右
                if (this.first_pos.y + 180 < this.pos.y && this.angle > 15) {
                    this.set_angle(this.angle - 2);
                }
                this.go_forward();
                break;
            case 2: // ステージ真ん中位で曲がっていく 左
                if (this.first_pos.y + 180 < this.pos.y && this.angle < 165) {
                    this.set_angle(this.angle + 2);
                }
                this.go_forward();
                break;
        }
    }
}
