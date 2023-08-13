import Phaser from "phaser";

export default class SpriteButton {
  private button: Phaser.GameObjects.Sprite;
  private border: Phaser.GameObjects.Rectangle;
  private scene: Phaser.Scene;
  private isActive: boolean;
  private alphaBorder: number;
  private x: number;
  private y: number;
  private width: number;
  private heigh: number;
  private texture: string;
  constructor({
    x,
    y,
    width,
    heigh,
    texture,
    onClick,
    scene,
    alpha = 1,
    alphaBorder = 0,
  }: {
    x: number;
    y: number;
    width: number;
    heigh: number;
    texture: string;
    onClick: Function;
    scene: Phaser.Scene;
    alpha?: number;
    alphaBorder?: number;
  }) {
    this.alphaBorder = alphaBorder;
    this.x = x;
    this.y = y;
    this.width = width;
    this.heigh = heigh;
    this.texture = texture;

    const btn = scene.add
      .sprite(x, y, texture ?? "btn-bg")
      .setInteractive({ cursor: "pointer" });
    btn.displayWidth = width;
    btn.displayHeight = heigh;
    btn.setInteractive({
      useHandCursor: true,
    });
    btn.alpha = alpha;
    const border = scene.add.rectangle(x, y, width, heigh);
    this.button = btn;
    this.border = border;
    this.scene = scene;

    btn.on("pointerdown", onClick);
    this.border.setStrokeStyle(1, 0xffffff, alphaBorder);
    btn.on("pointerout", async () => {
      if (!this.isActive) {
        this.border.setStrokeStyle(1, 0xffffff, alphaBorder);
      }
    });
    btn.on("pointerover", async () => {
      if (!this.isActive) {
        this.border.setStrokeStyle(1, 0xffffff, 1);
      }
    });
    this.isActive = false;
  }

  public get active() {
    return this.isActive;
  }
  public set active(atv: boolean) {
    this.isActive = atv;
    if (this.isActive) {
      this.border.setStrokeStyle(1, 0xffffff, 1);
    } else {
      this.border.setStrokeStyle(1, 0xffffff, this.alphaBorder);
    }
  }
  public get X() {
    return this.x;
  }
  public get Y() {
    return this.y;
  }
  public get Width() {
    return this.width;
  }
  public get Height() {
    return this.heigh;
  }
  public get Texture() {
    return this.texture;
  }
  public set onClick(f: Function) {
    this.button.on("pointerdown", f);
  }
  public destroy() {
    this.button.destroy();
    this.border.destroy();
  }
}
