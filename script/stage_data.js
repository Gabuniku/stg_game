/**
 * ステージデータ
 */

/** [frame,x,y,type,gun_type,speed,hp]
 * frame : 出現フレーム
 * x : 座標
 * y : 座標
 * type : 軌道
 * gun_type : 使う弾
 * speed : 移動スピード
 * hp : 体力
*/

const FIRST_STAGE = [
    [300, 0, 0, 0, 0, 1,5],
    [300, 100, 0, 0, 0, 1,10],
    [300, 200, 0, 0, 0, 1,10],
    [300, 300, 0, 0, 0, 1,10]
];



export const STAGE_DATA = [FIRST_STAGE];
