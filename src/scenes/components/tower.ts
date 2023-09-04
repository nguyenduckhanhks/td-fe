import Phaser, { Types } from "phaser";
import Constants from "../../constant";
import Troop from "./troop";

const styleAddStatus = {
  font: "15px Arial",
  fill: "#0070ff",
  wordWrapWidth: 60,
  align: "center",
  fontWeight: 700,
  backgroundColor: "#ffffff00",
} as Types.GameObjects.Text.TextStyle;

export default class Tower {
  private tower: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

  public get Text() {
    return this.text;
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
      .sprite(x, y, texture ?? "towers")
      .setInteractive({ cursor: "pointer" });
    trp.displayHeight = Constants.CELL_WIDTH;
    trp.displayWidth = Constants.CELL_WIDTH;
    trp.setInteractive({
      useHandCursor: true,
    });
    const textComponent = scene.add.text(0, 0, text, {
      font: "bold 16px Arial",
    });
    textComponent.setPosition(
      x - textComponent.width / 2,
      y - textComponent.height / 2
    );
    textComponent.alpha = 0;
    this.tower = trp;
    this.text = textComponent;
    this.scene = scene;
  }
  public destroy() {
    this.tower.destroy();
    this.text.destroy();
  }
  public attack(target: Troop) {
    const graphics = this.scene.add.graphics();
    const color = 0xff0000;
    graphics.lineStyle(4, color, 1);
    const line1 = graphics.lineBetween(
      this.tower.x,
      this.tower.y,
      target.Troop.x,
      target.Troop.y
    );
    this.scene.add.tween({
      targets: line1,
      alpha: 0,
      duration: Constants.deltatime / 2,
      onComplete: () => {
        line1.destroy();
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
    text.x = this.tower.x;
    text.y = this.tower.y - 30;
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
