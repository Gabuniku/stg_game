/**
 * (c)2021 Gabuniku
 *  Game by Gabuniku
 * お試しで作ってみたゲーム
*/

import { Bullet } from "./bullet.js"
import * as util from "./stg_util.js"

// プレイヤークラス
class Player {
    constructor() {
        this.pos = new util.Pos(0, 0);
        this.width = 10;
        this.hight = 10;
        this.life = 3;
        this.speed = 10;
        this.shot_cool_frame = 10; // frame単位
        this.frame_cnt = 0;
        this.last_shot_frame = 0;
    }
    move() {
        let rate = 1.0;
        if (pressed_left != pressed_right && pressed_up != pressed_down) {
            // 斜め移動対策
            rate = 0.71;
        }
        let move = this.speed * rate;
        if (pressed_shift) {
            move = move / 2;//シフトが押されているなら低速
        }
        if (pressed_up) {
            if (this.pos.y - move > 0) {
                this.pos.y -= move;
            }
        }
        if (pressed_down) {
            if (this.pos.y + move < CANVAS_SIZE[1] - this.hight) {
                this.pos.y += move;
            }
        }
        if (pressed_right) {
            if (this.pos.x + move < CANVAS_SIZE[0] - this.width) {
                this.pos.x += move;
            }
        }
        if (pressed_left) {
            if (this.pos.x - move > 0) {
                this.pos.x -= move;
            }
        }
        if (pressed_shot) {
            if (this.frame_cnt - this.last_shot_frame > this.shot_cool_frame) {
                let bullet = new Bullet(Object.create(this.pos), 10, -90, 10, 0, CANVAS_SIZE);
                BULLETS.push(bullet);
                this.last_shot_frame = this.frame_cnt;
            }
        }
    }
    update() {
        this.frame_cnt++;
        this.move()
    }
    render() {
        CANVAS_CONTEXT.fillRect(this.pos.x, this.pos.y, this.width, this.hight);
    }
}

function KeyDownEvent(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        pressed_up = true;
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        pressed_down = true;
    }
    else if (e.key == "Right" || e.key == "ArrowRight") {
        pressed_right = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        pressed_left = true;
    }
    else if (e.key == "Shift") {
        pressed_shift = true;
    }
    else if (e.key == "z") {
        pressed_shot = true;
    }
    else if (e.key == "x") {
        pressed_bomb = true;
    }
}

function KeyUpEvent(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        pressed_up = false;
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        pressed_down = false;
    }
    else if (e.key == "Right" || e.key == "ArrowRight") {
        pressed_right = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        pressed_left = false;
    }
    else if (e.key == "Shift") {
        pressed_shift = false;
    }
    else if (e.key == "z") {
        pressed_shot = false;
    }
    else if (e.key == "x") {
        pressed_bomb = false;
    }
}

var CANVAS;
var CANVAS_CONTEXT;
var key_down;
var key_up;
var main_loop_interval;
var score = 0;
var game_flag = false;
var frame_cnt = 0;
var INIT_FLAG = false; //初期化したかどうか
var pressed_up = false;
var pressed_down = false;
var pressed_right = false;
var pressed_left = false;
var pressed_shift = false;
var pressed_shot = false;
var pressed_bomb = false;

const CANVAS_SIZE = [500, 550]; // 画面サイズ
const PLAYER = new Player(); // プレイヤー


const ENEMIES = [] // 敵のリスト
const BULLETS = [] // 弾のリスト

function update_bullet() {
    let bullet;
    for (var i = 0; i < BULLETS.length; i++) {
        bullet = BULLETS[i];
        bullet.update();
        if (bullet.dead_flag) {
            BULLETS.splice(i, 1);
        }
    }
}
function render_bullet(ctx) {
    let bullet;
    let old_style = ctx.fillStyle;
    ctx.fillStyle = "rgb(0, 0, 255)";
    for (var i = 0; i < BULLETS.length; i++) {
        bullet = BULLETS[i];
        bullet.render(ctx);
    }
    ctx.fillStyle = old_style;
}

// 更新
function update() {
    update_bullet();
    PLAYER.update();
}

// 描画
function render() {
    CANVAS_CONTEXT.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    render_bullet(CANVAS_CONTEXT);
    PLAYER.render();
}

// メインループ
function MainLoop() {
    frame_cnt++;
    update();
    render();
}

// 初期化
function Init() {
    let win_w = document.documentElement.clientWidth;
    let win_h = document.documentElement.clientHeight;
    if (win_w < 500 || win_h < 650) {
        alert("画面サイズを500px × 650px にしてください。 ※これより小さいとプレイに支障をきたす恐れがあります。")
    }
    CANVAS = document.getElementById("canvas");
    CANVAS_CONTEXT = CANVAS.getContext("2d");
    key_down = document.addEventListener("keydown", KeyDownEvent);
    key_up = document.addEventListener("keyup", KeyUpEvent);
    INIT_FLAG = true;
}

// ゲーム開始
function Game() {
    if (INIT_FLAG) {
        setInterval(MainLoop, 20); // メインループを設定
    } else {
        console.log("初期化をしてください。")
    }
}

// 読み込み完了時に実行
window.onload = function () {
    Init();
    Game();
}