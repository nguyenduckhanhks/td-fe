import Phaser from "phaser";
import api from "../services/api";
import { TextButton } from "./components";

export class MainMenuScene extends Phaser.Scene {
  private customerInfo: any;
  private assets: any[] = [];

  private menuButtons = [
    {
      text: "Create Map",
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 300,
      width: 300,
      onClick: () => {
        this.scene.start("editmap");
      },
      scene: this,
    },
    {
      text: "Maps Stage",
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 250,
      width: 300,
      onClick: () => {
        this.scene.start("mapstages");
      },
      scene: this,
    },
    {
      text: "History",
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 200,
      width: 300,
      onClick: () => {
        this.scene.start("history");
      },
      scene: this,
    },
  ];

  constructor() {
    super("mainmenu");
  }

  async init() {
    if (this.assets) {
      this.assets.map((ass) => ass.destroy());
    }
    this.assets = [];
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
  }

  create() {
    this.assets.map((ass) => ass.destroy());
    this.createBackground();
    this.createMainMenu();
  }

  update() {}

  private createMainMenu() {
    this.menuButtons.map((btn) => {
      this.assets.push(new TextButton(btn));
    });
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
