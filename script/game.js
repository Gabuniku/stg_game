/**
 * (c)2021 Gabuniku
 *  Game by Gabuniku
 * お試しで作ってみたゲーム
*/

import { Bullet } from "./bullet.js"
import { Boss } from "./boss.js"
import * as util from "./stg_util.js"
import { loadStage, STAGE_DATA } from "./stage_data.js"
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
        this.original_size = 10;
        this.shot_cool_frame = 5; // frame単位
        this.frame_cnt = 0;
        this.last_shot_frame = 0;
        this.dead_frame = 0;
        this.is_play_dead_anime = false;
        this.power = 7;
        this.shot_poss = [[0, -8, 0], [15, -5, 30], [-15, -5, -30], [30, 0, 45], [-30, 0, -45], [45, 5, 75], [-45, 5, -75]];
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
                    BULLETS.push(bullet);
                } else {
                    for (let index = 0; index < this.power; index++) {
                        if (index == this.shot_poss.length) {
                            break;
                        }
                        let [x, y, r] = this.shot_poss[index];
                        r -= 90;
                        let b_pos = Object.create(this.pos);
                        b_pos.x += x;
                        b_pos.y += y;
                        bullet = new Bullet(b_pos, 5, r, 10, 1, 2); // 追尾
                        BULLETS.push(bullet);
                    }
                }
                this.last_shot_frame = this.frame_cnt;
            }
            //if (pressed_bomb) {

            //}
        }
    }
    update() {
        this.frame_cnt++;
        this.move()
        let hit_bullet = util.getHitBullet(this.pos, this.size, true);
        if (this.is_play_dead_anime) {
            let dis = this.frame_cnt - this.dead_frame;
            this.alpha -= 0.01;
            this.size = this.original_size + (dis);
            if (this.alpha<0.2) {
                this.alpha = 1;
                this.size = this.original_size;
                this.is_play_dead_anime = false;
            }
        }
        if (hit_bullet.length > 0) {
            if (this.life == 0) {
                this.dead_flag = true;
            } else if (!this.is_play_dead_anime) {
                damagePlayer();
                this.dead_frame = this.frame_cnt;
                this.is_play_dead_anime = true;

            }
            hit_bullet.forEach(bullet => bullet.destroy());
        }
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
    else if (e.key == "z" || e.key == "Z") {
        pressed_shot = true;
    }
    else if (e.key == "x" || e.key == "X") {
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
    else if (e.key == "z" || e.key == "Z") {
        pressed_shot = false;
    }
    else if (e.key == "x" || e.key == "X") {
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
var spawn_boss = false;
var boss_count = 0;
var finish = false;

export const CANVAS_SIZE = [500, 550]; // 画面サイズ
export const PLAYER = new Player(); // プレイヤー


export const ENEMIES = [] // 敵のリスト
export const BULLETS = [] // 弾のリスト
const GAME_SPEED = 1000 / 60;

export function addScore(value) {
    score += value;
    score_show.innerText = ('000000' + score).slice(-6);
}
export function damagePlayer(value) {
    PLAYER.life--;
    life_show.innerText = PLAYER.life;
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
            if (enemy instanceof Boss) { // ボス撃破
                boss_count--;
                if (boss_count < 1) {
                    nextStage();
                }
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
    let enemy = STAGE_DATA[stage_num].getEnemy(frame_cnt);
    if (STAGE_DATA[stage_num].end && !spawn_boss && STAGE_DATA[stage_num].last_frame + 500 < frame_cnt) {
        for (let index = 0; index < ENEMIES.length; index++) {
            ENEMIES[index].destroy();
        }
        let boss = new Boss(stage_num);
        boss_count++;
        ENEMIES.push(boss);
        spawn_boss = true;
        return;
    }
    else if (enemy == null) {
        return;
    }
    for (let index = 0; index < enemy.length; index++) {
        const data = enemy[index];
        let e = new Enemy(...data.slice(1));
        ENEMIES.push(e);
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
    CANVAS_CONTEXT.fillStyle = "rgb(0, 255, 255)";
    CANVAS_CONTEXT.font = "48px メイリオ";
    CANVAS_CONTEXT.textBaseline = "hanging";
    CANVAS_CONTEXT.fillText(frame_cnt, 0, 100);
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
    loadStage();
    INIT_FLAG = true;
    stage_num = enemy_index = next_enemy_frame = 0;
}

function nextStage() {
    stage_num++;
    if (stage_num == STAGE_DATA.length) {
        finish = true;
        return;
    }
    enemy_index = 0;
    boss_count = 0;
    frame_cnt = 0;
    spawn_boss = false;
}

// ゲーム開始
function Game() {
    if (INIT_FLAG) {
        next_enemy_frame = STAGE_DATA[stage_num].getNextFrame();
        setInterval(MainLoop, GAME_SPEED); // メインループを設定 17ミリ秒 ≒ 60fps
    } else {
        console.log("初期化をしてください。")
    }
}

// 読み込み完了時に実行
window.onload = function () {
    Init();
    Game();
}