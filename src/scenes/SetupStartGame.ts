import Phaser from "phaser";
import api from "../services/api";
import Constants from "../constant";
import { SpriteButton, TextButton } from "./components";

export class SetupStartGameScene extends Phaser.Scene {
  private customerInfo: any;
  private assets: any[] = [];
  private mapAssets: any = [];
  private mapInfo: any;
  private troopStrategy: any = [-1, -1, -1, -1];
  private selectTroop: any = null;
  private selectTroopSlot: any = null;
  private selectTroopSlotIndex: number = 0;
  private mapId: number = 0;
  private troopBoom: number = 0;
  private troopBoomIdTextUI: any = null;

  constructor() {
    super("setupstartgame");
  }

  init(data: any) {
    if (this.assets) {
      this.assets.map((ass) => ass.destroy());
    }
    this.assets = [];
    this.mapAssets = [];
    this.mapInfo = null;
    this.troopStrategy = [-1, -1, -1, -1];
    this.selectTroop = null;
    this.selectTroopSlot = null;
    this.selectTroopSlotIndex = 0;
    this.mapId = 0;
    this.troopBoom = 0;
    this.troopBoomIdTextUI = null;
    this.mapId = data.id;
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

    // troops
    this.load.image("troops", "assets/images/Troop/light/light-scout.png");
  }

  async create() {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const { customerInfo } = await api.post(
          "/customer/get-customer-info",
          {}
        );
        this.customerInfo = customerInfo;
        const { mapInfo } = await api.post("/map/get-by-id", { id: this.mapId });
        this.mapInfo = mapInfo;
      }
    } catch (e) {
      window.alert(JSON.stringify(e));
    }
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
        text: "Start",
        x: 1350,
        y: 20,
        onClick: async () => {
          const data = await api.post(
            "/tower-defense/get-tower-defense-game-frames",
            {
              id: this.mapId,
              troop_boom: this.troopBoom,
              troop_strategy: this.troopStrategy,
            }
          );
          this.scene.start("gameplay", data);
        },
        scene: this,
      })
    );
    this.assets.push(
      new TextButton({
        text: "Back",
        texture: "err-btn-bg",
        x: 1460,
        y: 20,
        onClick: async () => {
          this.scene.start("mainmenu");
        },
        scene: this,
      })
    );
    this.assets.push(
      this.add.text(1300, 80, "List Troop:", {
        font: "18px Arial",
      })
    );
    Constants.troops.map((troop, index) => {
      const x =
        1300 +
        ((5 * Constants.CELL_WIDTH) / 2) * (index % 5) +
        Constants.CELL_WIDTH / 2;
      const y = 150 + ((3 * Constants.CELL_WIDTH) / 2) * Math.floor(index / 5);

      const troopBtn = new SpriteButton({
        x,
        y,
        texture: "troops",
        width: Constants.CELL_WIDTH,
        heigh: Constants.CELL_WIDTH,
        onClick: () => {},
        scene: this,
      });
      this.assets.push(troopBtn);
      const nameTroop = this.add.text(0, 0, troop.name, {
        font: "9px Arial",
      });
      nameTroop.setPosition(
        x - nameTroop.width / 2,
        y + 30 - nameTroop.height / 2
      );
      this.assets.push(nameTroop);
      troopBtn.onClick = () => {
        this.attachTroop(troopBtn, troop);
      };
    });
    this.assets.push(
      this.add.text(1300, 450, "Strategy:", {
        font: "18px Arial",
      })
    );
    this.troopStrategy.map((slot: any, i: number) => {
      const cell = new SpriteButton({
        x: 1300 + i * Constants.CELL_WIDTH + Constants.CELL_WIDTH / 2,
        y: 500,
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
        if (this.selectTroopSlot) {
          this.selectTroopSlot.active = false;
        }
        if (this.selectTroop) {
          this.selectTroop.active = false;
          this.selectTroop = null;
        }
        this.selectTroopSlot = cell;
        this.selectTroopSlotIndex = i;
        cell.active = !cell.active;
      };
    });

    // select  troop boom
    this.assets.push(
      this.add.text(1300, 550, "Troop Boom:", {
        font: "18px Arial",
      })
    );
    this.assets.push(
      new TextButton({
        text: "-",
        x: 1325,
        y: 600,
        width: 50,
        onClick: () => {
          if (this.troopBoomIdTextUI) {
            this.troopBoom--;
            if (this.troopBoom <= 1) {
              this.troopBoom = 1;
            }
            this.troopBoomIdTextUI.text = this.troopBoom;
          }
        },
        scene: this,
      })
    );
    const inputMapId = new TextButton({
      text: this.troopBoom.toString(),
      x: 1415,
      y: 600,
      texture: "btn-bg1",
      onClick: () => {},
      scene: this,
    });
    this.assets.push(inputMapId);
    this.troopBoomIdTextUI = inputMapId.Text;
    this.assets.push(
      new TextButton({
        text: "+",
        x: 1505,
        y: 600,
        width: 50,
        onClick: () => {
          if (this.troopBoomIdTextUI) {
            this.troopBoom++;
            if (this.troopBoom >= 4) {
              this.troopBoom = 3;
            }
            this.troopBoomIdTextUI.text = this.troopBoom;
          }
        },
        scene: this,
      })
    );
  }
  private attachTroop(troopBtn: SpriteButton, troopData: any) {
    if (!this.selectTroopSlot) {
      return;
    }
    this.troopStrategy[this.selectTroopSlotIndex] = troopData.id;
    this.selectTroopSlot.active = false;
    const newTroop = new SpriteButton({
      x: this.selectTroopSlot.x,
      y: this.selectTroopSlot.y,
      texture: troopBtn.Texture,
      width: this.selectTroopSlot.Width,
      heigh: this.selectTroopSlot.Height,
      onClick: () => {},
      scene: this,
    });
    const deleteBtn = new SpriteButton({
      x: this.selectTroopSlot.x + (3 * Constants.CELL_WIDTH) / 8,
      y: this.selectTroopSlot.y - (3 * Constants.CELL_WIDTH) / 8,
      texture: "delete",
      width: Constants.CELL_WIDTH / 4,
      heigh: Constants.CELL_WIDTH / 4,
      onClick: () => {},
      scene: this,
    });
    deleteBtn.onClick = () => {
      deleteBtn.destroy();
      newTroop.destroy();
      this.troopStrategy[this.selectTroopSlotIndex] = -1;
    };
    this.assets.push(newTroop);
    this.assets.push(deleteBtn);
    this.mapAssets.push(newTroop);
    this.mapAssets.push(deleteBtn);
    this.selectTroopSlot = null;
  }
  private loadMap(map: any) {
    this.mapAssets.map((a: any) => a.destroy());
    const { path, mapData, towers } = map;
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
        this.mapAssets.push(pathCell);
      }
    });
    towers.map((tower: any) => {
      const x =
        Math.floor((Constants.SIZE_WIDTH - mapWidth) / 2 + tower.x) *
          Constants.CELL_WIDTH +
        Constants.CELL_WIDTH / 2;
      const y =
        Math.floor((Constants.SIZE_HEIGHT - mapWidth) / 2 + tower.y) *
          Constants.CELL_WIDTH +
        Constants.CELL_WIDTH / 2;
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
