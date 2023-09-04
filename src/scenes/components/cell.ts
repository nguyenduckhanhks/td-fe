import Phaser from "phaser";
import Constants from "../../constant";

export default class Cell {
  private cell: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;

  constructor({
    x,
    y,
    texture,
    scene,
  }: {
    x: number;
    y: number;
    texture?: string;
    scene: Phaser.Scene;
  }) {
    const trp = scene.add
      .sprite(x, y, texture ?? "cells")
      .setInteractive({ cursor: "pointer" });
    trp.displayHeight = Constants.CELL_WIDTH;
    trp.displayWidth = Constants.CELL_WIDTH;
    trp.setInteractive({
      useHandCursor: true,
    });

    this.cell = trp;
    this.scene = scene;
  }
  public destroy() {
    this.cell.destroy();
  }
  public addTerrain(terrain: number) {
    this.scene.add.tween({
      targets: this.cell,
      alpha: 0,
      duration: Constants.deltatime / 3,
      onComplete: () => {
        this.cell.destroy();
      },
    });
    const newCell = this.scene.add
      .sprite(
        this.cell.x,
        this.cell.y,
        // @ts-ignore
        Constants.TerrainTexture[terrain]
      )
      .setInteractive({ cursor: "pointer" });
    newCell.displayHeight = Constants.CELL_WIDTH;
    newCell.displayWidth = Constants.CELL_WIDTH;
    newCell.alpha = 0;
    newCell.setDepth(0);
    newCell.setInteractive({
      useHandCursor: true,
    });
    this.scene.add.tween({
      targets: newCell,
      alpha: 1,
      duration: Constants.deltatime,
      onComplete: () => {
        this.cell = newCell;
      },
    });
  }
}
