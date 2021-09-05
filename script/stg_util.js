/**
 * 便利な計算関数などをまとめたモジュール
 */

export class Pos {
    /**
     * 座標オブジェクト
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

export function calcDistance(pos1, pos2) {
    /**
     * 二点の距離を計算
     */
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
}

export function getNearPos(pos, pos_array) {
    /**
     * posに最も近いposをpos_arrayから見つける
     */
    let close_pos;
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
    return close_val;
}

export function getAngleToPos(pos1, pos2) {
    /**
     * pos1からpos2への向きを計算
     */
    let rad = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
    return rad * (180 / Math.PI);
}

export function getPosInRange(pos, pos_array, range) {
    /**
     * posからrangeに入ってるposを返す
     */
    let hit_poss = [];
    let distance;
    let _pos;
    for (var i = 0; pos_array.length; i++) {
        _pos = pos_array[i];
        distance = calcDistance(pos, _pos);
        if(distance < range){
            hit_poss.push(_pos);
        }
    }
    return hit_poss;
}
