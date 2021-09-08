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

function createFormation(frame = 0, formation_data) {
    let result = [];
    let formation =  formation_data.concat();
    
    for (let index = 0; index < formation.length; index++) {
        const data = formation[index];
        let b = data[0]
        data[0] = data[0] + frame;
        result.push(data);
    }
    return result;
}

function sortStageData(first, second) {
    if (first[0] < second[0]) { // firstの方が若い
        return -1;
    } else if (first[0] > second[0]) { // secondの方が若い
        return 1;
    } else if (first[1] < second[1]) {
        return -1;
    } else if (first[1] > second[1]) {
        return 1;
    } else {
        return 0;
    }
}

const Formation_Down_Cross = [
    [0, 90, 0, 1, 0, 2, 10],
    [0, 130, -20, 1, 0, 2, 10],
    [0, 410, 0, 2, 0, 2, 10],
    [0, 370, -20, 2, 0, 2, 10],

    [20, 90, 0, 1, 0, 2, 10],
    [20, 130, -20, 1, 0, 2, 10],
    [20, 410, 0, 2, 0, 2, 10],
    [20, 370, -20, 2, 0, 2, 10],

    [40, 90, 0, 1, 0, 2, 10],
    [40, 130, -20, 1, 0, 2, 10],
    [40, 410, 0, 2, 0, 2, 10],
    [40, 370, -20, 2, 0, 2, 10],

    [60, 90, 0, 1, 0, 2, 10],
    [60, 130, -20, 1, 0, 2, 10],
    [60, 410, 0, 2, 0, 2, 10],
    [60, 370, -20, 2, 0, 2, 10],

    [80, 90, 0, 1, 0, 2, 10],
    [80, 130, -20, 1, 0, 2, 10],
    [80, 410, 0, 2, 0, 2, 10],
    [80, 370, -20, 2, 0, 2, 10],

    [100, 90, 0, 1, 0, 2, 10],
    [100, 130, -20, 1, 0, 2, 10],
    [100, 410, 0, 2, 0, 2, 10],
    [100, 370, -20, 2, 0, 2, 10]
];
var FIRST_STAGE = [];
FIRST_STAGE = FIRST_STAGE.concat(createFormation(200,Formation_Down_Cross));
export function loadStage(){
    STAGE_DATA.push(FIRST_STAGE);
    console.log(STAGE_DATA)
}

export const STAGE_DATA = [];
