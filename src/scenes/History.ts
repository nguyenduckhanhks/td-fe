import Phaser from "phaser";
import api from "../services/api";
import { TextButton } from "./components";

export class HistoryScene extends Phaser.Scene {
  private customerInfo: any;
  private gameInfos: any;
  private assets: any[] = [];
  private total: number = 0;
  private current: number = 0;

  constructor() {
    super("history");
  }

  async init(data: any) {
    if (this.assets) {
      this.assets.map((ass) => ass.destroy());
    }
    this.current = 0;
    this.assets = [];
    this.total = 0;
    this.gameInfos = [];
    if (data && data.page) {
      this.current = data.page;
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
    this.load.image(
      "err-btn-bg",
      "assets/images/UI/attacker/3_0003_Layer-14.png"
    );
  }

  async create() {
    console.log("create");
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const { customerInfo } = await api.post(
          "/customer/get-customer-info",
          {}
        );
        this.customerInfo = customerInfo;
        const { towerDefenseGameInfos, total } = await api.post(
          "/tower-defense/get-all",
          {
            offset: this.current * 10,
          }
        );
        this.total = total;
        this.gameInfos = towerDefenseGameInfos;
      }
    } catch (e) {
      window.alert(JSON.stringify(e));
    }
    this.assets.map((ass) => ass.destroy());
    this.createBackground();
    this.createMainMenu();
    return true;
  }

  update() {}

  private createMainMenu() {
    this.gameInfos?.map((map: any, index: number) => {
      this.assets.push(
        new TextButton({
          text: `Game #${map.id}`,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 - 300 + 50 * index,
          width: 300,
          onClick: () => {
            api.post("/tower-defense/get-by-id", { id: map.id }).then((res) => {
              this.scene.start("gameplay", res);
            });
          },
          scene: this,
        })
      );
    });
    this.assets.push(
      new TextButton({
        text: `Back`,
        texture: "err-btn-bg",
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 300 + 50 * (this.gameInfos.length ?? 0),
        width: 300,
        onClick: () => {
          this.scene.start("mainmenu");
        },
        scene: this,
      })
    );
    for (let i = 0; i < Math.ceil(this.total / 10); i++) {
      this.assets.push(
        new TextButton({
          text: `${i + 1}`,
          x: window.innerWidth / 2 - 150 + 50 / 2 + 50 * (i % 6),
          y:
            window.innerHeight / 2 -
            300 +
            100 +
            50 * (this.gameInfos.length ?? 0) +
            Math.floor(i / 6) * 50,
          width: 50,
          onClick: () => {
            this.scene.start("mapstages", { page: i });
          },
          scene: this,
          border: i === this.current,
        })
      );
    }
  }

  private createBackground() {
    // background
    const background = this.add
      .sprite(window.innerWidth / 2, window.innerHeight / 2, "background")
      .setInteractive();
    background.displayWidth = window.innerWidth;
    background.displayHeight = window.innerHeight;
    this.assets.push(background);
    const backgroundBorder = this.add
      .sprite(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "background-border"
      )
      .setInteractive();
    backgroundBorder.displayWidth = window.innerWidth;
    backgroundBorder.displayHeight = window.innerHeight;
    this.assets.push(backgroundBorder);
  }
}
