/**
 * 敵クラス
 */

import * as util from "./stg_util.js"
import { Entity } from "./entity.js"
import { BULLETS, PLAYER } from "./game.js"
import { Bullet } from "./bullet.js"

const ENEMY_SHOT_INTERVAL = [200, 150, 150, 250];

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
        // 弾撃ち
        switch (this.gun_type) {
            case 0: // 一発撃つ 自機弾
                if (this.frame_cnt - this.last_shot_frame > this.shot_interval) {
                    let bullet = new Bullet(Object.create(this.pos), 10, util.getAngleToPos(this.pos, PLAYER.pos), 5, 10, 10);
                    BULLETS.push(bullet);
                    this.last_shot_frame = this.frame_cnt;
                }
                break;
            case 1: // 一発撃つ 外し弾 (+5°)
                if (this.frame_cnt - this.last_shot_frame > this.shot_interval) {
                    let bullet = new Bullet(Object.create(this.pos), 10, util.getAngleToPos(this.pos, PLAYER.pos) + 5, 5, 10, 10);
                    BULLETS.push(bullet);
                    this.last_shot_frame = this.frame_cnt;
                }
                break;
            case 2: // 一発撃つ 外し弾 (-5°)
                if (this.frame_cnt - this.last_shot_frame > this.shot_interval) {
                    let bullet = new Bullet(Object.create(this.pos), 10, util.getAngleToPos(this.pos, PLAYER.pos) - 5, 5, 10, 10);
                    BULLETS.push(bullet);
                    this.last_shot_frame = this.frame_cnt;
                }
                break;
            case 3: // 8方向
                if (this.frame_cnt - this.last_shot_frame > this.shot_interval) {
                    for (let r = 0; r < 360; r += 45) {
                        let bullet = new Bullet(Object.create(this.pos), 10, r, 5, 10, 10);
                        BULLETS.push(bullet);
                    }
                    this.last_shot_frame = this.frame_cnt;
                }
                break;
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
            case 3: // 上で居座ってから降りてくる
                if (this.frame_cnt < 20) {
                    this.go_forward();
                } else if (this.frame_cnt > 600) {
                    this.go_forward();
                }
                break;
        }
    }
}
