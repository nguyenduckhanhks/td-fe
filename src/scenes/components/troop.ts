import Phaser, { Types } from "phaser";
import convertXY from "../../services/convert-xy";
import Constants from "../../constant";
const styleHP = {
  font: "15px Arial",
  fill: "#ff0044",
  wordWrapWidth: 60,
  align: "center",
  fontWeight: 700,
  backgroundColor: "#ffffff00",
} as Types.GameObjects.Text.TextStyle;

const styleHPHeal = {
  font: "15px Arial",
  fill: "#26ff00",
  wordWrapWidth: 60,
  align: "center",
  fontWeight: 700,
  backgroundColor: "#ffffff00",
} as Types.GameObjects.Text.TextStyle;

const styleAddStatus = {
  font: "15px Arial",
  fill: "#0070ff",
  wordWrapWidth: 60,
  align: "center",
  fontWeight: 700,
  backgroundColor: "#ffffff00",
} as Types.GameObjects.Text.TextStyle;

const styleRemoveStatus = {
  font: "15px Arial",
  fill: "#00ffae",
  wordWrapWidth: 60,
  align: "center",
  fontWeight: 700,
  backgroundColor: "#ffffff00",
} as Types.GameObjects.Text.TextStyle;

export default class Troop {
  private troop: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

  public get Text() {
    return this.text;
  }

  public get Troop() {
    return this.troop;
  }

  constructor({
    text,
    x,
    y,
    texture,
    scene,
  }: {
    text: string;
    x: number;
    y: number;
    texture?: string;
    scene: Phaser.Scene;
  }) {
    const trp = scene.add
      .sprite(x, y, texture ?? "troops")
      .setInteractive({ cursor: "pointer" });
    trp.displayHeight = Constants.CELL_WIDTH;
    trp.displayWidth = Constants.CELL_WIDTH;
    trp.setDepth(1);
    trp.setInteractive({
      useHandCursor: true,
    });
    const textComponent = scene.add.text(0, 0, text, {
      font: "bold 10px Arial",
    });
    textComponent.setDepth(1);
    textComponent.setColor("#000000");
    textComponent.setPosition(
      x - textComponent.width / 2,
      y - Constants.CELL_WIDTH
    );
    this.troop = trp;
    this.text = textComponent;
    this.scene = scene;
  }
  public destroy() {
    this.troop.destroy();
    this.text.destroy();
  }
  public move({ to, mapData }: { to: number[][]; mapData: any }) {
    if (to && to.length) {
      to?.map((pos, i) => {
        setTimeout(() => {
          const { x, y } = convertXY({ pos, mapData });
          this.scene.add.tween({
            targets: this.troop,
            x,
            y,
            duration: Constants.deltatime / to.length,
          });
          this.scene.add.tween({
            targets: this.text,
            x: x - this.text.width / 2,
            y: y - Constants.CELL_WIDTH,
            duration: Constants.deltatime / to.length,
          });
        }, (Constants.deltatime / to.length) * i);
      });
    }
  }
  public die() {
    this.scene.add.tween({
      targets: this.troop,
      alpha: 0,
      duration: Constants.deltatime,
    });
    this.scene.add.tween({
      targets: this.text,
      alpha: 0,
      duration: Constants.deltatime,
    });
  }
  public receiveDamage(dmg: number) {
    let text = this.scene.add.text(0, 0, `-${dmg}`, styleHP);
    text.x = this.troop.x;
    text.y = this.troop.y - 30;
    this.scene.add.tween({
      targets: text,
      y: text.y - 30,
      opacity: 1,
      duration: Constants.deltatime,
      onComplete: () => {
        text.destroy();
      },
    });
  }
  public heal(dmg: number) {
    let text = this.scene.add.text(0, 0, `+${dmg}`, styleHPHeal);
    text.x = this.troop.x;
    text.y = this.troop.y - 30;
    this.scene.add.tween({
      targets: text,
      y: text.y - 30,
      opacity: 1,
      duration: Constants.deltatime,
      onComplete: () => {
        text.destroy();
      },
    });
  }
  public addStatus(stt: any) {
    let text = this.scene.add.text(
      0,
      0,
      // @ts-ignore
      `+${Constants.TroopStatusText[stt]}`,
      styleAddStatus
    );
    text.x = this.troop.x;
    text.y = this.troop.y - 30;
    this.scene.add.tween({
      targets: text,
      y: text.y - 30,
      opacity: 1,
      duration: Constants.deltatime,
      onComplete: () => {
        text.destroy();
      },
    });
  }
  public removeStatus(stt: any) {
    let text = this.scene.add.text(
      0,
      0,
      // @ts-ignore
      `-${Constants.TroopStatusText[stt]}`,
      styleRemoveStatus
    );
    text.x = this.troop.x;
    text.y = this.troop.y - 30;
    this.scene.add.tween({
      targets: text,
      y: text.y - 30,
      opacity: 1,
      duration: Constants.deltatime,
      onComplete: () => {
        text.destroy();
      },
    });
  }
  public levelUp(lv: number) {
    let text = this.scene.add.text(
      0,
      0,
      // @ts-ignore
      `Level Up ${lv}`,
      styleAddStatus
    );
    text.x = this.troop.x;
    text.y = this.troop.y - 30;
    this.scene.add.tween({
      targets: text,
      y: text.y - 30,
      opacity: 1,
      duration: Constants.deltatime,
      onComplete: () => {
        text.destroy();
      },
    });
  }
}
