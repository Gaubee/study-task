import type { IMonster, BulletConfig, Coord } from "./type";
import { calcMoveCoord } from "@/utils";
import { inRange } from "lodash";

export class Bullet {
    // 攻击范围
    range: number = 0;
    // 子弹速度
    speed: number = 0;
    // 伤害
    damage: number = 0;
    // 记录当前子弹位置
    currentCoord: Coord = null!;
    // 子弹的生命周期是否已经结束
    finished: boolean = false;

    /**
     * 这里绑定Monster的原因是，在子弹飞行时间内，Monster位置会变化，
     * 绑定Monster可以在每次绘制帧时获取Monster实时位置，保证落点准确
     */
    target: IMonster = null!;
    bulletImage: HTMLImageElement = null!;
    // 爆炸动图效果抽帧canvas图集
    effectSpringImages: HTMLCanvasElement[] = [];

    constructor(config: BulletConfig) {
        Object.assign(this, config);
        this.currentCoord = { ...config.towerCoord };
    }

    get targetCoord() {
        return this.target.coord;
    }
    get targetSpeed() {
        return this.target.speed;
    }

    /**
     * 基于 防御塔画布 绘制子弹
     * @param {CanvasRenderingContext2D} context: 防御塔画布
     */
    drawBulletOnTower(context: CanvasRenderingContext2D) {
        const targetCoord = {
            x: this.targetCoord.x + this.target.springItemSize.width / 2,
            y: this.targetCoord.y + this.target.springItemSize.height / 2,
        };
        const offset = calcMoveCoord(
            this.speed,
            this.currentCoord,
            targetCoord
        );
        this.currentCoord = {
            x: (this.currentCoord.x += offset.x),
            y: (this.currentCoord.y += offset.y),
        };

        /**
         * 子弹生命周期检查
         */
        if (inRange(Math.abs(offset.distance), 0, this.targetSpeed)) {
            this.finish();
            return;
        }

        // 绘制子弹
        context.drawImage(
            this.bulletImage,
            this.currentCoord.x,
            this.currentCoord.y
        );
    }

    finish() {
        this.finished = true;
    }
}
