import Phaser from "phaser";
import api from "../services/api";
import { TextButton } from "./components";

export class MapStagesScene extends Phaser.Scene {
  private customerInfo: any;
  private mapInfos: any;
  private assets: any[] = [];

  constructor() {
    super("mapstages");
  }

  async init() {
    this.mapInfos = [];
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const { customerInfo } = await api.post(
          "/customer/get-customer-info",
          {}
        );
        this.customerInfo = customerInfo;
        const { mapInfos } = await await api.post("/map/get-all", {});
        this.mapInfos = mapInfos;
        this.create();
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
  }

  create() {
    this.assets.map((ass) => ass.destroy());
    this.createBackground();
    this.createMainMenu();
  }

  update() {}

  private createMainMenu() {
    this.mapInfos?.map((map: any, index: number) => {
      this.assets.push(
        new TextButton({
          text: `map #${map.id}`,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 - 300 + 50 * index,
          width: 300,
          onClick: () => {
            this.scene.start("setupstartgame", { id: map.id });
          },
          scene: this,
        })
      );
    });
    this.assets.push(
      new TextButton({
        text: `Back`,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 300 + 50 * (this.mapInfos.length ?? 0),
        width: 300,
        onClick: () => {
          this.scene.start("mainmenu");
        },
        scene: this,
      })
    );
  }

  private createBackground() {
    // background
    const background = this.add
      .sprite(
        window.innerWidth / 2,
        (window.innerHeight - 73) / 2,
        "background"
      )
      .setInteractive();
    background.displayWidth = window.innerWidth;
    background.displayHeight = window.innerHeight - 73;
    this.assets.push(background);
    const backgroundBorder = this.add
      .sprite(
        window.innerWidth / 2,
        (window.innerHeight - 73) / 2,
        "background-border"
      )
      .setInteractive();
    backgroundBorder.displayWidth = window.innerWidth;
    backgroundBorder.displayHeight = window.innerHeight - 73;
    this.assets.push(backgroundBorder);
  }
}
