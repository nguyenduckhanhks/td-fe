import Phaser from "phaser";

export default class TextButton {
  private button: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;
  private border?: Phaser.GameObjects.Rectangle;

  public get Text() {
    return this.text;
  }

  constructor({
    text,
    x,
    y,
    width,
    heigh,
    texture,
    onClick,
    scene,
    depth,
    border,
  }: {
    text: string;
    x: number;
    y: number;
    width?: number;
    heigh?: number;
    texture?: string;
    onClick: Function;
    scene: Phaser.Scene;
    depth?: number;
    border?: boolean;
  }) {
    const btn = scene.add
      .sprite(x, y, texture ?? "btn-bg")
      .setInteractive({ cursor: "pointer" });
    btn.displayWidth = width ?? 100;
    btn.displayHeight = heigh ?? 40;
    btn.setInteractive({
      useHandCursor: true,
    });
    btn.on("pointerdown", onClick);
    const textComponent = scene.add.text(0, 0, text, {
      font: "bold 16px Arial",
    });
    textComponent.setPosition(
      x - textComponent.width / 2,
      y - textComponent.height / 2
    );
    if (depth && depth > 0) {
      btn.setDepth(depth);
      textComponent.setDepth(depth);
    }
    if (border) {
      const bd = scene.add.rectangle(x, y, width ?? 100, heigh ?? 40);
      this.border = bd;
      this.border.setStrokeStyle(1, 0xffffff, 1);
    }
    this.button = btn;
    this.text = textComponent;
    this.scene = scene;
  }
  public destroy() {
    this.button.destroy();
    this.text.destroy();
    this.border?.destroy();
  }
}
