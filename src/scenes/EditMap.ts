import Phaser from "phaser";
import api from "../services/api";
import Constants from "../constant";
import { SpriteButton, TextButton } from "./components";

export class EditMapScene extends Phaser.Scene {
  private customerInfo: any;
  private assets: any[] = [];
  private mapIdInput: number = 6;
  private mapIdTextUI: any = null;
  private selectMapCell: any = null;
  private selectTower: any = null;
  private towers: any = [];
  private mapAssets: any = [];

  constructor() {
    super("editmap");
  }

  async init() {
    if (this.assets) {
      this.assets.map((ass) => ass.destroy());
    }
    this.customerInfo = null;
    this.assets = [];
    this.mapIdInput = 6;
    this.mapIdTextUI = null;
    this.selectMapCell = null;
    this.selectTower = null;
    this.towers = [];
    this.mapAssets = [];
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const { customerInfo } = await api.post(
          "/customer/get-customer-info",
          {}
        );
        this.customerInfo = customerInfo;
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
    this.load.image(
      "err-btn-bg",
      "assets/images/UI/attacker/3_0003_Layer-14.png"
    );

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
        (Constants.SIZE_WIDTH * Constants.CELL_WIDTH) / 2,
        (Constants.SIZE_HEIGHT * Constants.CELL_WIDTH) / 2,
        "background"
      )
      .setInteractive();
    background.displayWidth = Constants.SIZE_WIDTH * Constants.CELL_WIDTH;
    background.displayHeight = Constants.SIZE_HEIGHT * Constants.CELL_WIDTH;
    this.assets.push(background);
    const backgroundBorder = this.add
      .sprite(
        (Constants.SIZE_WIDTH * Constants.CELL_WIDTH) / 2,
        (Constants.SIZE_HEIGHT * Constants.CELL_WIDTH) / 2,
        "background-border"
      )
      .setInteractive();
    backgroundBorder.displayWidth = Constants.SIZE_WIDTH * Constants.CELL_WIDTH;
    backgroundBorder.displayHeight =
      Constants.SIZE_HEIGHT * Constants.CELL_WIDTH;
    this.assets.push(backgroundBorder);

    // map cell
    for (let i = 0; i < Constants.SIZE_WIDTH; i++) {
      for (let j = 0; j < Constants.SIZE_HEIGHT; j++) {
        const cell = new SpriteButton({
          x: i * Constants.CELL_WIDTH + Constants.CELL_WIDTH / 2,
          y: j * Constants.CELL_WIDTH + Constants.CELL_WIDTH / 2,
          width: Constants.CELL_WIDTH,
          heigh: Constants.CELL_WIDTH,
          texture: "btn-bg",
          onClick: () => {},
          scene: this,
          alpha: 0.001,
          alphaBorder: 0.2,
        });
        this.assets.push(cell);
        cell.onClick = () => {
          if (this.selectMapCell) {
            this.selectMapCell.active = false;
          }
          if (this.selectTower) {
            this.selectTower.active = false;
            this.selectTower = null;
          }
          this.selectMapCell = cell;
          cell.active = !cell.active;
        };
      }
    }

    this.renderMenu();
    // create raw map
    if (this.customerInfo && this.customerInfo.map) {
      this.loadMap(this.customerInfo.map);
    }
  }

  private renderMenu() {
    // render menu
    this.assets.push(
      new TextButton({
        text: "-",
        x: 1325,
        y: 20,
        width: 50,
        onClick: () => {
          if (this.mapIdTextUI) {
            this.mapIdInput--;
            if (this.mapIdInput <= 1) {
              this.mapIdInput = 1;
            }
            this.mapIdTextUI.text = this.mapIdInput;
          }
        },
        scene: this,
      })
    );
    const inputMapId = new TextButton({
      text: this.mapIdInput.toString(),
      x: 1415,
      y: 20,
      texture: "btn-bg1",
      onClick: () => {},
      scene: this,
    });
    this.assets.push(inputMapId);
    this.mapIdTextUI = inputMapId.Text;
    this.assets.push(
      new TextButton({
        text: "+",
        x: 1505,
        y: 20,
        width: 50,
        onClick: () => {
          if (this.mapIdTextUI) {
            this.mapIdInput++;
            if (this.mapIdInput > 18) {
              this.mapIdInput = 18;
            }
            this.mapIdTextUI.text = this.mapIdInput;
          }
        },
        scene: this,
      })
    );
    this.assets.push(
      new TextButton({
        text: "Create Map",
        x: 1600,
        y: 20,
        onClick: async () => {
          const { customerInfo } = await api.post("/customer/create-map", {
            id: this.mapIdInput,
          });
          this.customerInfo = customerInfo;
          if (this.customerInfo && this.customerInfo.map) {
            this.loadMap(this.customerInfo.map);
          }
        },
        scene: this,
      })
    );
    this.assets.push(
      new TextButton({
        text: "Save Map",
        x: 1350,
        y: 350,
        onClick: async () => {
          try {
            const { mapInfo } = await api.post("/customer/save-map", {
              towers: this.towers,
            });
            this.scene.start("mainmenu");
          } catch (e) {
            window.alert(JSON.stringify(e));
          }
        },
        scene: this,
      })
    );
    this.assets.push(
      new TextButton({
        text: "Back",
        texture: "err-btn-bg",
        x: 1460,
        y: 350,
        onClick: async () => {
          this.scene.start("mainmenu");
        },
        scene: this,
      })
    );
    Constants.towers.map((tower, index) => {
      const x =
        1300 +
        ((3 * Constants.CELL_WIDTH) / 2) * (index % 7) +
        Constants.CELL_WIDTH / 2;
      const y = 80 + ((3 * Constants.CELL_WIDTH) / 2) * Math.floor(index / 7);

      const towerBtn = new SpriteButton({
        x,
        y,
        texture: tower.image,
        width: Constants.CELL_WIDTH,
        heigh: Constants.CELL_WIDTH,
        onClick: () => {},
        scene: this,
      });
      this.assets.push(towerBtn);
      const nameTower = this.add.text(0, 0, tower.image.replace("-", " "), {
        font: "9px Arial",
      });
      nameTower.setPosition(
        x - nameTower.width / 2,
        y + 30 - nameTower.height / 2
      );
      this.assets.push(nameTower);
      towerBtn.onClick = () => {
        this.attachTower(towerBtn, tower);
      };
    });
  }

  private attachTower(tower: SpriteButton, towerData: any) {
    if (!this.selectMapCell) return;
    const { mapData } = this.customerInfo.map;
    const mapWidth = Math.sqrt(mapData.size);
    const cvX = Math.ceil(
      (this.selectMapCell.x - Constants.CELL_WIDTH / 2) / Constants.CELL_WIDTH -
        (Constants.SIZE_WIDTH - mapWidth) / 2
    );
    const cvY = Math.ceil(
      (this.selectMapCell.y - Constants.CELL_WIDTH / 2) / Constants.CELL_WIDTH -
        (Constants.SIZE_HEIGHT - mapWidth) / 2
    );
    this.towers.push({
      id: towerData.id,
      x: cvX,
      y: cvY,
    });
    console.log({ tower: this.towers });
    this.selectMapCell.active = false;
    const newTower = new SpriteButton({
      x: this.selectMapCell.x,
      y: this.selectMapCell.y,
      texture: tower.Texture,
      width: this.selectMapCell.Width,
      heigh: this.selectMapCell.Height,
      onClick: () => {},
      scene: this,
    });
    const deleteBtn = new SpriteButton({
      x: this.selectMapCell.x + (3 * Constants.CELL_WIDTH) / 8,
      y: this.selectMapCell.y - (3 * Constants.CELL_WIDTH) / 8,
      texture: "delete",
      width: Constants.CELL_WIDTH / 4,
      heigh: Constants.CELL_WIDTH / 4,
      onClick: () => {},
      scene: this,
    });
    deleteBtn.onClick = () => {
      deleteBtn.destroy();
      newTower.destroy();
      this.towers = this.towers.filter(
        (t: any) => !(t.x === cvX && t.y === cvY)
      );
      console.log({ tower: this.towers });
    };
    this.assets.push(newTower);
    this.assets.push(deleteBtn);
    this.mapAssets.push(newTower);
    this.mapAssets.push(deleteBtn);
    this.selectMapCell = null;
  }

  private loadMap(map: any) {
    this.mapAssets.map((a: any) => a.destroy());
    const { path, mapData } = map;
    const mapWidth = Math.sqrt(mapData.size);
    path.map((cell: any, index: number) => {
      const x =
        Math.floor((Constants.SIZE_WIDTH - mapWidth) / 2 + cell[0]) *
          Constants.CELL_WIDTH +
        Constants.CELL_WIDTH / 2;
      const y =
        Math.floor((Constants.SIZE_HEIGHT - mapWidth) / 2 + cell[1]) *
          Constants.CELL_WIDTH +
        Constants.CELL_WIDTH / 2;
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
        pathCell.on("pointerdown", () => {
          console.log({
            xy: [x, y],
            cell,
            convert: [
              Math.ceil(
                (x - Constants.CELL_WIDTH / 2) / Constants.CELL_WIDTH -
                  (Constants.SIZE_WIDTH - mapWidth) / 2
              ),
              Math.ceil(
                (y - Constants.CELL_WIDTH / 2) / Constants.CELL_WIDTH -
                  (Constants.SIZE_HEIGHT - mapWidth) / 2
              ),
            ],
          });
        });
        this.mapAssets.push(pathCell);
      }
    });
  }
}
