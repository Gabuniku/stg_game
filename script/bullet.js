import { Entity } from "./entity.js"
import * as util from "./stg_util.js"

// 弾クラス

/**
 * 弾の種類
 * 0 ~ 9 味方弾
 * 10 ~ 敵弾
 * 80 ~ boss用
 */
export class Bullet extends Entity {
    constructor(pos, size, angle = 0, speed = 10, type = 0, damage = 10) {
        super(pos, angle, speed);
        this.type = type;
        this.width = this.hight = this.size = size;
        this.is_enemy = (type > 9);
        this.damage = damage;
        this.original_angle = angle;
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
    render(ctx) {
        let old_style = ctx.fillStyle;
        if (this.is_enemy) {
            ctx.fillStyle = "rgb(255,255, 0)";
        }
        super.render(ctx);
        ctx.fillStyle = old_style;
    }
    move() {
        switch (this.type) {
            case 0: // 向いてる方向に進む
                this.go_forward();
                break;
            case 1: // 最寄りの敵 
                let pos = util.getNearEnemy(this.pos);
                if (pos != null) {
                    let ang = util.getAngleToPos(this.pos, pos) + 90;
                    let rotate = 0;
                    if (this.angle + 90 > ang) {
                        rotate = -8;
                    } else if (this.angle + 90 < ang) {
                        rotate = 8;
                    }
                    this.set_angle(this.angle + rotate);
                }
                this.go_forward();
                break;
            case 10:
                this.go_forward();
                break;
            case 80:
                this.go_forward();
                break;
            case 81://左巻き
                this.set_angle(this.angle + 2);
                this.go_forward();
                break;
            case 82://右巻き
                this.set_angle(this.angle - 2);
                this.go_forward();
                break;
            case 83: // sin波
                this.set_angle(this.original_angle + (60 * Math.sin((this.frame_cnt * 4 -90 % 360) * Math.PI / 180)));
                this.go_forward();
                break;
            case 84: // cos波
                this.set_angle(this.original_angle + (60 * Math.cos((this.frame_cnt * 4 % 360) * Math.PI / 180)));
                this.go_forward();
                break;

        }
    }

}
