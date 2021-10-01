/**
 * ステージデータ
 * 全6ステージ
 */

class StageData {
    constructor(stage_num = 0, name = "Unknown Stage") {
        this.stage_num = stage_num;
        this.name = name;
        this.enemy_index = 0;
        this.enemy_data = [];
        this.end = false;
        this.last_frame = 0;
    }

    getEnemy(frame) {
        if (this.end) {
            return null;
        }
        let enemy = [];
        let next_frame = this.getNextFrame();
        while (frame > next_frame) {
            enemy.push(this.getEnemyData());
            this.enemy_index++;
            if (this.enemy_index == this.enemy_data.length) {
                this.end = true;
                break;
            }
            next_frame = this.getNextFrame();
        }
        return enemy
    }

    getEnemyData(index = -1) {
        if (index == -1) {
            return this.enemy_data[this.enemy_index];
        } else {
            return this.enemy_data[index];
        }
    }
    getNextFrame() {
        return this.enemy_data[this.enemy_index][0]
    }

    // ステージデータを構築
    build() {
        this.enemy_data = this.enemy_data.sort(this.sortStageData);
        this.last_frame = this.enemy_data[this.enemy_data.length - 1][0];
    }
    addFormation(frame = 0, formation_data = []) {
        for (let index = 0; index < formation_data.length; index++) {
            let data = formation_data[index];
            this.enemy_data.push([data[0] + frame, ...data.slice(1)]);
        }
    }

    sortStageData(first, second) {
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
}
// 隊形のテンプレ
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
const Formation_Down_Right = [
    [0, 410, 0, 2, 0, 2, 10],
    [0, 370, -20, 2, 0, 2, 10],

    [20, 410, 0, 2, 0, 2, 10],
    [20, 370, -20, 2, 0, 2, 10],

    [40, 410, 0, 2, 0, 2, 10],
    [40, 370, -20, 2, 0, 2, 10],

    [60, 410, 0, 2, 0, 2, 10],
    [60, 370, -20, 2, 0, 2, 10],

    [80, 410, 0, 2, 0, 2, 10],
    [80, 370, -20, 2, 0, 2, 10],

    [100, 410, 0, 2, 0, 2, 10],
    [100, 370, -20, 2, 0, 2, 10]
];

const Formation_Down_Left = [
    [0, 90, 0, 1, 0, 2, 10],
    [0, 130, -20, 1, 0, 2, 10],

    [20, 90, 0, 1, 0, 2, 10],
    [20, 130, -20, 1, 0, 2, 10],

    [40, 90, 0, 1, 0, 2, 10],
    [40, 130, -20, 1, 0, 2, 10],

    [60, 90, 0, 1, 0, 2, 10],
    [60, 130, -20, 1, 0, 2, 10],

    [80, 90, 0, 1, 0, 2, 10],
    [80, 130, -20, 1, 0, 2, 10],

    [100, 90, 0, 1, 0, 2, 10],
    [100, 130, -20, 1, 0, 2, 10],

];

const Formation_Top = [
    [0, 50, 0, 3, 3, 5, 50],
    [0, 150, 0, 3, 3, 5, 50],
    [0, 250, 0, 3, 3, 5, 50],
    [0, 350, 0, 3, 3, 5, 50],
    [0, 450, 0, 3, 3, 5, 50]
]

class FirstStage extends StageData {
    constructor() {
        super(0, "始まりの終わり");
    }
    build() {
        this.addFormation(100, Formation_Down_Right);
        this.addFormation(300, Formation_Top);
        this.addFormation(400, Formation_Down_Left);
        this.addFormation(600, Formation_Down_Right);
        this.addFormation(600, Formation_Down_Left);
        super.build();
    }
}
class BossTest extends StageData {
    constructor() {
        super(0, "ボステスト");
    }
    build() {
        this.addFormation(2, Formation_Top);
        super.build();
    }
}


export function loadStage() {
    const First = new FirstStage();
    const Fist = new BossTest();
    First.build();
    Fist.build();
    STAGE_DATA.push(First);
    STAGE_DATA.push(Fist);
    console.log(STAGE_DATA)
}

export const STAGE_DATA = [];
