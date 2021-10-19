/**
 * 便利な計算関数などをまとめたモジュール
 */
import { ENEMIES, BULLETS } from "./game.js"

export class Pos {
    /**
     * 座標を表すクラス
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

export class Rect {
    /**
     * 短形の当たり判定を表すクラス
     * @param {Pos} pos 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(pos = null, width = 0, height = 0) {
        if (pos == null) {
            pos = new Pos();
        }
        this.pos = pos;
        this.width = width;
        this.height = height;
    }
}
/**
 * minとmaxの間にxがあるかどうか返す
 * @param {number} x 
 * @param {number} min 
 * @param {number} max 
 * @returns bool
 */
export function between(x, min, max) {
    return x >= min && x <= max;
}

/**
 * 二点の距離を計算
 * @param {Pos} pos1 
 * @param {Pos} pos2 
 * @returns number
 */
export function calcDistance(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
}

/**
 * posに最も近いposをpos_arrayから見つける
 * @param {Pos} pos 
 * @param {Array<Pos>} pos_array 
 * @returns  Pos or null
 */
export function getNearPos(pos, pos_array) {
    let close_pos = null;
    let distance = 0;
    let most_min_distance = 0;
    for (var i = 0; i < pos_array.length; i++) {
        distance = calcDistance(pos, pos_array[i]);
        if (i == 0) {
            most_min_distance = distance; //一回目は代入
            close_pos = pos_array[i];
        } else {
            if (distance < most_min_distance) { // 現時点で最も小さい距離より小さいなら値を上書き
                most_min_distance = distance;
                close_pos = pos_array[i];
            }
        }
    }
    return close_pos;
}

/**
 * posから最も近い敵の位置を返す getNearPosのラッパー
 * @param {Pos} pos 
 * @returns Pos or null
 */
export function getNearEnemy(pos) {
    let poss = [];
    for (var i = 0; i < ENEMIES.length; i++) {
        poss.push(ENEMIES[i].pos);
    }
    return getNearPos(pos, poss);
}

/**
 * pos1からpos2への向きを計算
 * @param {Pos} pos1 
 * @param {Pos} pos2 
 * @returns 
 */
export function getAngleToPos(pos1, pos2) {
    let rad = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
    return rad * (180 / Math.PI);
}

/**
 * posからrangeに入ってるposを返す
 * @param {Pos} pos 
 * @param {Array<Pos>} pos_array 
 * @param {number} range 
 * @returns Pos
 */
export function getPosInRange(pos, pos_array, range) {
    let hit_poss = [];
    let distance;
    let _pos;
    for (var i = 0; pos_array.length; i++) {
        _pos = pos_array[i];
        distance = calcDistance(pos, _pos);
        if (distance < range) {
            hit_poss.push(_pos);
        }
    }
    return hit_poss;
}

/**
 * posとsizeに一致する弾を取得
 * is_enemyで弾種分別 true -> 敵弾
 * @param {Pos} pos 
 * @param {number} size 
 * @param {Boolean} is_enemy 
 * @returns Array<Bullet>
 */
export function getHitBullet(pos, size, is_enemy) {
    let bullets = []
    for (let index = 0; index < BULLETS.length; index++) {
        const bullet = BULLETS[index];
        const distance = calcDistance(pos, bullet.pos);
        if (distance < size && bullet.is_enemy == is_enemy) {
            bullets.push(bullet);
        }
    }
    return bullets;
}

/**
 * min以上max以下の乱数を返す
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
export function getRandomRange(min, max) {
    return Math.random() * (max - min) + min;
}