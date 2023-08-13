import Phaser from "phaser";

export default class TextButton {
  private button: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

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
  }: {
    text: string;
    x: number;
    y: number;
    width?: number;
    heigh?: number;
    texture?: string;
    onClick: Function;
    scene: Phaser.Scene;
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
    this.button = btn;
    this.text = textComponent;
    this.scene = scene;
  }
  public destroy() {
    this.button.destroy();
    this.text.destroy();
  }
}
