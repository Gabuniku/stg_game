import { Entity } from "./entity.js"
import * as util from "./stg_util.js"

// 弾クラス

/**
 * 弾の種類
 * 0 ~ 9 味方弾
 * 10 ~ 敵弾
 */
export class Bullet extends Entity {
    constructor(pos, size, angle = 0, speed = 10, type = 0, damage = 10) {
        super(pos, angle, speed);
        this.type = type;
        this.width = this.hight = this.size = size;
        this.is_enemy = (type > 9);
        this.damage = damage;
    }
    set_angle(angle) {
        this.angle = angle;
        this.rate_x = Math.cos(angle * Math.PI / 180); //横の変化量
        this.rate_y = Math.sin(angle * Math.PI / 180); //縦の変化量
    }
    update() {
        super.update();
    }
    destroy() {
        this.dead_flag = true;
    }
    move() {
        switch (this.type) {
            case 0: // 向いてる方向に進む
                this.pos.x += this.speed * this.rate_x;
                this.pos.y += this.speed * this.rate_y;
                break;
            case 1: // 最寄りの敵 
                let pos = util.getNearEnemy(this.pos);
                if (pos != null) {
                    this.set_angle(util.getAngleToPos(this.pos, pos));
                }
                this.pos.x += this.speed * this.rate_x;
                this.pos.y += this.speed * this.rate_y;
                break;
        }
    }

}
