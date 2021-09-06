/**
 * (c)2021 Gabuniku
 *  Game by Gabuniku
 * お試しで作ってみたゲーム
*/

import { Bullet } from "./bullet.js"
import * as util from "./stg_util.js"
import { STAGE_DATA } from "./stage_data.js"
import { Enemy } from "./enemy.js"
import { Entity } from "./entity.js"

// プレイヤークラス
class Player extends Entity {
    constructor() {
        super(new util.Pos(250, CANVAS_SIZE[1] - 100))
        this.width = 10;
        this.hight = 10;
        this.life = 3;
        this.speed = 5;
        this.shot_cool_frame = 5; // frame単位
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
            if (this.pos.y - move > 0 + this.size) {
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
            if (this.pos.x - move > 0 + this.size) {
                this.pos.x -= move;
            }
        }
        if (pressed_shot) {
            if (this.frame_cnt - this.last_shot_frame > this.shot_cool_frame) {
                let bullet;
                if (pressed_shift) {
                    bullet = new Bullet(Object.create(this.pos), 10, -90, 30, 0, 10);
                } else {
                    bullet = new Bullet(Object.create(this.pos), 10, -90, 15, 1, 5); // 追尾
                }
                BULLETS.push(bullet);
                this.last_shot_frame = this.frame_cnt;
            }
            //if (pressed_bomb) {

            //}
        }
    }
    update() {
        this.frame_cnt++;
        this.move()
    }
}

// キーが押されたときのイベント
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

// キーが離されたときのイベント
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
var score_show; //スコア表示
var life_show; //残機表示
var score = 0;
var game_flag = false;
var frame_cnt = 0;
var INIT_FLAG = false; //初期化したかどうか
var pressed_up = false;  // キー入力の変数
var pressed_down = false;
var pressed_right = false;
var pressed_left = false;
var pressed_shift = false;
var pressed_shot = false;
var pressed_bomb = false;

var stage_num = 0;
var enemy_index = 0;
var next_enemy_frame = 0;
var end_stage = false;

export const CANVAS_SIZE = [500, 550]; // 画面サイズ
export const PLAYER = new Player(); // プレイヤー


export const ENEMIES = [] // 敵のリスト
export const BULLETS = [] // 弾のリスト

function addScore(value) {
    score += value;
    score_show.innerText = ('000000' + score).slice(-6);
}

function updateBullet() {
    let bullet;
    for (var i = 0; i < BULLETS.length; i++) {
        bullet = BULLETS[i];
        bullet.update();
        if (bullet.dead_flag) {
            BULLETS.splice(i, 1);
        }
    }
}
function renderBullet(ctx) {
    let bullet;
    let old_style = ctx.fillStyle;
    ctx.fillStyle = "rgb(0, 0, 255)";
    for (var i = 0; i < BULLETS.length; i++) {
        bullet = BULLETS[i];
        bullet.render(ctx);
    }
    ctx.fillStyle = old_style;
}
function updateEnemy() {
    let enemy;
    for (var i = 0; i < ENEMIES.length; i++) {
        enemy = ENEMIES[i];
        enemy.update();
        if (enemy.dead_flag) {
            if (enemy.killed) {
                addScore(100);
            }
            ENEMIES.splice(i, 1);
        }
    }
}
function renderEnemy(ctx) {
    let enemy;
    let old_style = ctx.fillStyle;
    ctx.fillStyle = "rgb(255, 0, 0)";
    for (var i = 0; i < ENEMIES.length; i++) {
        enemy = ENEMIES[i];
        enemy.render(ctx);
    }
    ctx.fillStyle = old_style;
}
// 敵のスポーン
function spawn(frame_cnt) {
    let e_data, e;
    let stage_data = STAGE_DATA[stage_num]
    while (frame_cnt >= next_enemy_frame) {
        if (end_stage) {
            break;
        }
        e_data = stage_data[enemy_index];
        console.log(e_data);
        e = new Enemy(...e_data.slice(1));
        console.log(e);
        ENEMIES.push(e);
        enemy_index++;
        if (enemy_index == stage_data.length) {
            end_stage = true;
        } else {
            enemy_index;
            next_enemy_frame = stage_data[enemy_index][0];
        }
    }
}

// 更新
function update() {
    spawn(frame_cnt);
    updateEnemy();
    updateBullet();
    PLAYER.update();
}

// 描画
function render() {
    CANVAS_CONTEXT.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    CANVAS_CONTEXT.fillStyle = "rgb(0, 0, 0)";
    CANVAS_CONTEXT.fillRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    CANVAS_CONTEXT.fillStyle = "rgb(0, 0, 0)";
    renderEnemy(CANVAS_CONTEXT);
    renderBullet(CANVAS_CONTEXT);
    CANVAS_CONTEXT.fillStyle = "rgb(0, 255, 255)";
    PLAYER.render(CANVAS_CONTEXT);
    CANVAS_CONTEXT.fillStyle = "rgb(0, 0, 0)";
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
    if (win_w < 800 || win_h < 700) {
        alert("画面サイズを800px × 700px にしてください。 ※これより小さいとプレイに支障をきたす恐れがあります。")
    }
    CANVAS = document.getElementById("canvas");
    CANVAS_CONTEXT = CANVAS.getContext("2d");
    key_down = document.addEventListener("keydown", KeyDownEvent);
    key_up = document.addEventListener("keyup", KeyUpEvent);
    score_show = document.getElementById("score_show");
    life_show = document.getElementById("life_show");
    INIT_FLAG = true;
    stage_num = enemy_index = next_enemy_frame = 0;
}

// ゲーム開始
function Game() {
    if (INIT_FLAG) {
        next_enemy_frame = STAGE_DATA[stage_num][0][0]
        setInterval(MainLoop, 17); // メインループを設定 17ミリ秒 ≒ 60fps
    } else {
        console.log("初期化をしてください。")
    }
}

// 読み込み完了時に実行
window.onload = function () {
    Init();
    Game();
}