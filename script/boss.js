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
        this.hp = 5000;
        this.max_hp = 5000;
        this.size = 30;
        this.action_cnt = 0;
        this.last_shot = 0;
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
                        let bullet = new Bullet(Object.create(this.pos), 5, r, 10, 81, 10);
                        BULLETS.push(bullet);
                        let bullet2 = new Bullet(Object.create(this.pos), 5, r, 10, 82, 10);
                        BULLETS.push(bullet2);
                    }
                } else if (util.between(this.action_cnt, 120, 220)) {
                    let r = Math.random() * (360 - 0)
                    let bullet = new Bullet(Object.create(this.pos), 5, r, 5, 80, 10);
                    BULLETS.push(bullet);
                } else if (util.between(this.action_cnt, 200, 250)) {
                    let r = util.getAngleToPos(this.pos, PLAYER.pos);
                    let bullet = new Bullet(Object.create(this.pos), 10, r, 5, 83, 10);
                    BULLETS.push(bullet);
                    let bullet2 = new Bullet(Object.create(this.pos), 10, r, 5, 84, 10);
                    BULLETS.push(bullet2);
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