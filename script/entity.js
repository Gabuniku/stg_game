
import * as util from "./stg_util.js"
import { CANVAS_SIZE } from "./game.js"

// 動くもののベースクラス
export class Entity {
    constructor(pos, angle = 0, speed = 10) {
        this.pos = pos;
        this.width = this.hight = 10;
        this.speed = speed;
        this.type;
        this.angle;
        this.rate_x;
        this.size = 10;
        this.rate_y;
        this.canvas_size = CANVAS_SIZE;
        this.frame_cnt = 0;
        this.dead_flag = false;
        this.first_out = false;
        this.set_angle(angle);
    }
    set_angle(angle) {
        this.angle = angle % 360;
        this.rate_x = Math.cos(angle * Math.PI / 180); //横の変化量
        this.rate_y = Math.sin(angle * Math.PI / 180); //縦の変化量
    }
    update() {
        this.frame_cnt++;
        this.move();
        // 画面外
        if (this.pos.x < 0 - this.size || this.pos.x > this.canvas_size[0] + this.size ||
            this.pos.y < 0 - this.size || this.pos.y > this.canvas_size[1] + this.size) {
            if (this.first_out) {
                this.destroy();
            }
        } else {
            this.first_out = true;
        }
    }
    destroy() {
        this.dead_flag = true;
    }
    move() {
    }
    go_forward() {
        this.pos.x += this.speed * this.rate_x;
        this.pos.y += this.speed * this.rate_y;
    }
    render(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true);
        ctx.fill()
    }
}
