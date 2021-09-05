
// 弾クラス

/**
 * 弾の種類
 * 0 ~ 9 味方弾
 * 10 ~ 敵弾
 */
export class Bullet {
    constructor(pos, size, angle = 0, speed = 10, type = 0, canvas_size) {
        this.pos = pos;
        this.width = this.hight = this.size = size;
        this.speed = speed;
        this.type = type;
        this.angle;
        this.rate_x;
        this.rate_y;
        this.canvas_size = canvas_size;
        this.frame_cnt = 0;
        this.dead_flag = false;
        this.set_angle(angle);
    }
    set_angle(angle) {
        this.angle = angle;
        this.rate_x = Math.cos(angle * Math.PI / 180); //横の変化量
        this.rate_y = Math.sin(angle * Math.PI / 180); //縦の変化量
    }
    update() {
        this.frame_cnt++;
        this.move();
        // 画面外
        if (this.pos.x < 0 - this.size || this.pos.x > this.canvas_size[0] + this.size ||
            this.posy < 0 - this.size || this.pos.y > this.canvas_size[1] + this.size) {
            this.destroy();
        }
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
        }
    }
    render(ctx) {
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.hight);
    }
}
