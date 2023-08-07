import type { IMonster } from "@/service/type";

import { Monster } from "@/service";
import { readAllSprite } from "@/utils";
import { MONSTER_A, MONSTER_B } from "@/const";
import { useGlobalStore } from "@/stores";

const monsterPresets = [MONSTER_A, MONSTER_B];

export function useMonster() {
    const global = useGlobalStore();

    /**
     * 批量创建敌人
     */
    async function createMonsters(): Promise<Set<IMonster>> {
        const monsterList = await Promise.all(
            monsterPresets.map(createMonster)
        );
        return new Set(monsterList);
    }

    /**
     * 创建敌人
     */
    async function createMonster(data: typeof MONSTER_A): Promise<IMonster> {
        const { speed, blood, coord, assets } = data;
        const { url, width, height, col, row } = assets;

        const springImages = await readAllSprite(url, col, row, width, height);
        const monster = new Monster(speed, blood, coord, springImages, {
            width,
            height,
        });
        return monster;
    }

    /**
     * 依次渲染敌人到全局画布上
     */
    function drawMonster() {
        const monsterList = global.getMonsterList();

        monsterList.forEach((monster) => {
            const nextMapItem = global.gameMap.mapData[monster.coord.index + 1];
            // if (!nextMapItem) {
            // }
            monster.draw(nextMapItem);
            global.layoutContext.drawImage(monster.context.canvas, 0, 0);
        });
    }

    return {
        drawMonster,
        createMonsters,
    };
}
