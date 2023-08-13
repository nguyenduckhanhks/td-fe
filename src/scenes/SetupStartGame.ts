import Phaser from "phaser";
import api from "../services/api";
import Constants from "../constant";
import { SpriteButton, TextButton } from "./components";

const SIZE_WIDTH = 32;
const SIZE_HEIGHT = 20;
const CELL_WIDTH = 40;

export class SetupStartGameScene extends Phaser.Scene {
  private customerInfo: any;
  private assets: any[] = [];
  private mapAssets: any = [];
  private mapInfo: any;

  constructor() {
    super("setupstartgame");
  }

  async init(data: any) {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const { customerInfo } = await api.post(
          "/customer/get-customer-info",
          {}
        );
        this.customerInfo = customerInfo;
        const { mapInfo } = await api.post("/map/get-by-id", { id: data.id });
        this.mapInfo = mapInfo;
      }
    } catch (e) {
      window.alert(JSON.stringify(e));
    }
  }

  preload() {
    this.load.image("background", "assets/images/Map/Background tong.png");
    this.load.image(
      "background-border",
      "assets/images/Map/layer decor tren cung.png"
    );

    //btn
    this.load.image("btn-bg", "assets/images/UI/main page/2_0016_Layer-9.png");
    this.load.image(
      "btn-bg1",
      "assets/images/UI/main page/2_0013_Layer-11.png"
    );
    this.load.image("delete", "assets/images/UI/main page/2_0009_Layer-13.png");

    // map
    this.load.image("target-cell", "assets/images/Map/Cuavao-anhsang.png");
    this.load.image("start-cell", "assets/images/Map/cua tha quan.png");
    this.load.image("path-cell", "assets/images/Map/duong di.png");

    // tower
    this.load.image("sentry-earth", "assets/images/Tower/Sentry/earth.png");
    this.load.image("sentry-elec", "assets/images/Tower/Sentry/elec.png");
    this.load.image("sentry-fire", "assets/images/Tower/Sentry/fire.png");
    this.load.image("sentry-ice", "assets/images/Tower/Sentry/ice.png");
    this.load.image("sentry-water", "assets/images/Tower/Sentry/water.png");

    this.load.image("sniper-earth", "assets/images/Tower/Sniper/earth.png");
    this.load.image("sniper-elec", "assets/images/Tower/Sniper/elec.png");
    this.load.image("sniper-fire", "assets/images/Tower/Sniper/fire.png");
    this.load.image("sniper-ice", "assets/images/Tower/Sniper/ice.png");
    this.load.image("sniper-water", "assets/images/Tower/Sniper/water.png");

    this.load.image("thrower-earth", "assets/images/Tower/Thrower/earth.png");
    this.load.image("thrower-elec", "assets/images/Tower/Thrower/elec.png");
    this.load.image("thrower-fire", "assets/images/Tower/Thrower/fire.png");
    this.load.image("thrower-ice", "assets/images/Tower/Thrower/ice.png");
    this.load.image("thrower-water", "assets/images/Tower/Thrower/water.png");

    this.load.image("tower-earth", "assets/images/Tower/Tower/earth.png");
    this.load.image("tower-elec", "assets/images/Tower/Tower/elec.png");
    this.load.image("tower-fire", "assets/images/Tower/Tower/fire.png");
    this.load.image("tower-ice", "assets/images/Tower/Tower/ice.png");
    this.load.image("tower-water", "assets/images/Tower/Tower/water.png");

    this.load.image("warper-earth", "assets/images/Tower/Warper/earth.png");
    this.load.image("warper-elec", "assets/images/Tower/Warper/elec.png");
    this.load.image("warper-fire", "assets/images/Tower/Warper/fire.png");
    this.load.image("warper-ice", "assets/images/Tower/Warper/ice.png");
    this.load.image("warper-water", "assets/images/Tower/Warper/water.png");
  }

  create() {
    this.assets.map((ass) => ass.destroy());
    this.createNewGame();
  }

  update() {}

  private createNewGame() {
    // background
    const background = this.add
      .sprite(
        (SIZE_WIDTH * CELL_WIDTH) / 2,
        (SIZE_HEIGHT * CELL_WIDTH) / 2,
        "background"
      )
      .setInteractive();
    background.displayWidth = SIZE_WIDTH * CELL_WIDTH;
    background.displayHeight = SIZE_HEIGHT * CELL_WIDTH;
    this.assets.push(background);
    const backgroundBorder = this.add
      .sprite(
        (SIZE_WIDTH * CELL_WIDTH) / 2,
        (SIZE_HEIGHT * CELL_WIDTH) / 2,
        "background-border"
      )
      .setInteractive();
    backgroundBorder.displayWidth = SIZE_WIDTH * CELL_WIDTH;
    backgroundBorder.displayHeight = SIZE_HEIGHT * CELL_WIDTH;
    this.assets.push(backgroundBorder);

    // map cell
    for (let i = 0; i < SIZE_WIDTH; i++) {
      for (let j = 0; j < SIZE_HEIGHT; j++) {
        const cell = new SpriteButton({
          x: i * CELL_WIDTH + CELL_WIDTH / 2,
          y: j * CELL_WIDTH + CELL_WIDTH / 2,
          width: CELL_WIDTH,
          heigh: CELL_WIDTH,
          texture: "btn-bg",
          onClick: () => {},
          scene: this,
          alpha: 0.001,
          alphaBorder: 0.2,
        });
        this.assets.push(cell);
      }
    }

    this.renderMenu();
    // create raw map
    if (this.mapInfo && this.mapInfo.map) {
      this.loadMap(this.mapInfo.map);
    }
  }

  private renderMenu() {
    this.assets.push(
      new TextButton({
        text: "Back",
        x: 1460,
        y: 350,
        onClick: async () => {
          this.scene.start("mainmenu");
        },
        scene: this,
      })
    );
    // Constants.towers.map((tower, index) => {
    //   const x = 1300 + ((3 * CELL_WIDTH) / 2) * (index % 7) + CELL_WIDTH / 2;
    //   const y = 80 + ((3 * CELL_WIDTH) / 2) * Math.floor(index / 7);

    //   const towerBtn = new SpriteButton({
    //     x,
    //     y,
    //     texture: tower.image,
    //     width: CELL_WIDTH,
    //     heigh: CELL_WIDTH,
    //     onClick: () => {},
    //     scene: this,
    //   });
    //   this.assets.push(towerBtn);
    //   const nameTower = this.add.text(0, 0, tower.image.replace("-", " "), {
    //     font: "9px Arial",
    //   });
    //   nameTower.setPosition(
    //     x - nameTower.width / 2,
    //     y + 30 - nameTower.height / 2
    //   );
    //   this.assets.push(nameTower);
    //   towerBtn.onClick = () => {};
    // });
  }
  private loadMap(map: any) {
    this.mapAssets.map((a: any) => a.destroy());
    const { path, mapData, towers } = map;
    const mapWidth = Math.sqrt(mapData.size);
    path.map((cell: any, index: number) => {
      const x =
        Math.floor((SIZE_WIDTH - mapWidth) / 2 + cell[0]) * CELL_WIDTH +
        CELL_WIDTH / 2;
      const y =
        Math.floor((SIZE_HEIGHT - mapWidth) / 2 + cell[1]) * CELL_WIDTH +
        CELL_WIDTH / 2;
      if (index === 0) {
        // target-cell
        const targetCell = this.add
          .sprite(x, y, "target-cell")
          .setInteractive();
        targetCell.displayWidth = 40;
        targetCell.displayHeight = 50;
        this.mapAssets.push(targetCell);
      }
      if (index !== 0 && index === path.length - 1) {
        const startCell = this.add.sprite(x, y, "start-cell").setInteractive();
        startCell.displayWidth = 50;
        startCell.displayHeight = 50;
        this.mapAssets.push(startCell);
      }
      if (index !== 0 && index !== path.length - 1) {
        const pathCell = this.add.sprite(x, y, "path-cell").setInteractive();
        pathCell.displayWidth = 40;
        pathCell.displayHeight = 40;
        this.mapAssets.push(pathCell);
      }
    });
    towers.map((tower: any) => {
      const x =
        Math.floor((SIZE_WIDTH - mapWidth) / 2 + tower.x) * CELL_WIDTH +
        CELL_WIDTH / 2;
      const y =
        Math.floor((SIZE_HEIGHT - mapWidth) / 2 + tower.y) * CELL_WIDTH +
        CELL_WIDTH / 2;
      const texture = Constants.towers.find((t) => t.id === tower.id)?.image;
      console.log({ tower, texture });
      if (texture) {
        const towerAsset = this.add.sprite(x, y, texture).setInteractive();
        towerAsset.displayWidth = 40;
        towerAsset.displayHeight = 50;
        this.mapAssets.push(towerAsset);
      }
    });
  }
}