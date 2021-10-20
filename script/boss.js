/**
 * ボス
 */
import { Entity } from "./entity.js"
import * as util from "./stg_util.js"
import { addScore, BULLETS, PLAYER } from "./game.js";
import { Bullet } from "./bullet.js";

export class Boss extends Entity {
    constructor(stage_num) {
        super(new util.Pos(250, 120), 0, 10);
        this.stage_num = stage_num;
        this.hp = 1500 * stage_num;
        this.max_hp = this.hp;
        this.size = 30;
        this.action_cnt = 0;
        this.last_shot = 0;
        this.shot_angle = 0;
    }
    get_hits(not_damage = false) {
        let bullets = util.getHitBullet(this.pos, this.size, false);
        if (!not_damage) { // ダメージカウント
            for (let index = 0; index < bullets.length; index++) {
                bullets[index].destroy();
                this.hp -= bullets[index].damage;
                addScore(bullets[index].damage);
            }
        }
    }
    update() {
        if (this.hp < 0) {
            addScore(10000);
            this.destroy();
        }
        this.get_hits();
        super.update();
    }

    move() {
        this.action_cnt++;

        switch (this.stage_num) {
            case 0:
                if (this.action_cnt < 100) {
                    // 8方向

                    for (let r = 0; r <= 360; r += 30) {
                        let bullet = new Bullet(this.pos.copy(), 5, r, 10, 81, 10);
                        BULLETS.push(bullet);
                        let bullet2 = new Bullet(this.pos.copy(), 5, r, 10, 82, 10);
                        BULLETS.push(bullet2);
                    }
                } else if (util.between(this.action_cnt, 120, 220)) {
                    let r = Math.random() * (360 - 0);
                    let bullet = new Bullet(this.pos.copy(), 5, r, 5, 80, 10);
                    BULLETS.push(bullet);
                } else if (this.action_cnt == 221) {
                    this.shot_angle = util.getAngleToPos(this.pos, PLAYER.pos);
                }
                else if (util.between(this.action_cnt, 221, 250)) {
                    let bullet = new Bullet(this.pos.copy(), 10, this.shot_angle, 5, 83, 10);
                    BULLETS.push(bullet);
                    let bullet2 = new Bullet(this.pos.copy(), 10, this.shot_angle, 5, 84, 10);
                    BULLETS.push(bullet2);
                }
                if (this.action_cnt > 300) {
                    this.action_cnt = 0;
                }
                break;

            case 1:
                if (this.action_cnt < 100) {

                } else if (util.between(this.action_cnt, 100, 110)) {
                    let offset = [[10, 0], [5, 8.66], [-5, 8.66], [-10, 0], [-5, -8.66], [5, -8.66]];
                    let r = Math.random() * 5;
                    for (let i = 0; i < r; i++) {
                        let x = util.getRandomRange(50, 450);
                        let y = util.getRandomRange(50, 100);
                        let pos = new util.Pos(x, y);
                        let angle = util.getRandomRange(45, 135);
                        let speed = util.getRandomRange(1, 4);
                        let ox, oy;
                        let center_bullet = new Bullet(pos, 10, angle, speed, 10, 1);
                        BULLETS.push(center_bullet);
                        for (let o = 0; o < offset.length; o++) {
                            [ox, oy] = offset[o];
                            let offPos = Object.create(pos);
                            offPos.x += ox;
                            offPos.y += oy;
                            let around_bullet = new Bullet(offPos, 5, angle, speed, 10, 1);
                            BULLETS.push(around_bullet);
                        }
                    }
                }
                if (this.action_cnt > 300) {
                    this.action_cnt = 0;
                }
                break;
            default:
                break;
        }
    }

}