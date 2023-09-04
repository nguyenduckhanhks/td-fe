import Phaser, { Types } from "phaser";
import api from "../services/api";
import Constants from "../constant";
import { Cell, SpriteButton, TextButton, Tower, Troop } from "./components";
import { CharacterType, EventType } from "../interface";
import convertXY from "../services/convert-xy";

export class GamePlayScene extends Phaser.Scene {
  private customerInfo: any;
  private assets: any[] = [];
  private dataBattle: any = null;
  private isPlay: boolean = false;
  private gameCharacters: any = {};

  constructor() {
    super("gameplay");
  }

  async init(data: any) {
    if (this.assets) {
      this.assets.map((ass) => ass.destroy());
    }
    this.dataBattle = null;
    this.isPlay = false;
    this.gameCharacters = {};
    this.assets = [];
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const { customerInfo } = await api.post(
          "/customer/get-customer-info",
          {}
        );
        this.customerInfo = customerInfo;
        this.dataBattle = data;
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
      "lose",
      "assets/images/UI/main page/result_0000_Layer-560.png"
    );
    this.load.image(
      "win",
      "assets/images/UI/main page/result_0001_Layer-559.png"
    );

    // map
    this.load.image("target-cell", "assets/images/Map/Cuavao-anhsang.png");
    this.load.image("start-cell", "assets/images/Map/cua tha quan.png");
    this.load.image("path-cell", "assets/images/Map/duong di.png");
    this.load.image("ANTI GRAVITY", "assets/images/Terrain/ANTI GRAVITY.png");
    this.load.image("CRYSTALFIELD", "assets/images/Terrain/CRYSTALFIELD.png");
    this.load.image("DITRTYMIST", "assets/images/Terrain/DITRTYMIST.png");
    this.load.image("ICELAKE", "assets/images/Terrain/ICELAKE.png");
    this.load.image("LAVA", "assets/images/Terrain/LAVA.png");
    this.load.image("MINEFIELD", "assets/images/Terrain/MINEFIELD.png");
    this.load.image("POND", "assets/images/Terrain/POND.png");
    this.load.image("SANDSTORM", "assets/images/Terrain/SANDSTORM.png");
    this.load.image("SNOWFIELD", "assets/images/Terrain/SNOWFIELD.png");
    this.load.image("STATICFIELD", "assets/images/Terrain/STATICFIELD.png");
    this.load.image("SWAMP", "assets/images/Terrain/SWAMP.png");
    this.load.image("THUNDERSTORM", "assets/images/Terrain/THUNDERSTORM.png");

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

  create() {
    this.assets.map((ass) => ass.destroy());
    this.createNewGame();
  }

  update() {
    if (!this.isPlay) {
      this.playGame();
    }
  }

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
  }

  private handleAddCharacter({
    id,
    tp,
    pos,
    cid,
    boom,
    mapData,
  }: {
    id: number;
    tp: CharacterType;
    pos: number[];
    cid?: number;
    boom?: boolean;
    mapData: any;
  }) {
    const { x, y } = convertXY({ pos, mapData });
    switch (tp) {
      case CharacterType.CellWay:
        const cellWay = new Cell({
          x,
          y,
          scene: this,
          texture: "path-cell",
        });
        this.assets.push(cellWay);
        this.gameCharacters[id] = cellWay;
        break;
      case CharacterType.GateSpawn:
        const gateSpawn = new Cell({
          x,
          y,
          scene: this,
          texture: "target-cell",
        });
        this.assets.push(gateSpawn);
        this.gameCharacters[id] = gateSpawn;
        break;
      case CharacterType.MainHouse:
        const mainHouse = new Cell({
          x,
          y,
          scene: this,
          texture: "start-cell",
        });
        this.assets.push(mainHouse);
        this.gameCharacters[id] = mainHouse;
        break;
      case CharacterType.Tower:
        const towerData = Constants.towers.find((t) => t.id == cid);
        if (towerData) {
          const tower = new Tower({
            x,
            y,
            scene: this,
            text: towerData.image,
            texture: towerData.image,
          });
          this.assets.push(tower);
          this.gameCharacters[id] = tower;
        }
        break;
      case CharacterType.Troop:
        const troopData = Constants.troops.find((t) => t.id == cid);
        if (troopData) {
          const troop = new Troop({
            x,
            y,
            text: troopData.name,
            scene: this,
            texture: "troops",
          });
          this.assets.push(troop);
          this.gameCharacters[id] = troop;
        }
        break;
    }
  }
  private handleMove({
    id,
    to,
    mapData,
  }: {
    id: number;
    to: number[][];
    mapData: any;
  }) {
    if (to && to.length) {
      const char = this.gameCharacters[id];
      if (char) {
        (char as Troop).move({ to, mapData });
      }
    }
  }
  private handleDie({ id }: { id: number }) {
    const char = this.gameCharacters[id];
    if (char) {
      (char as Troop).die();
    }
  }
  private handleReceiveDamage({ id, dmg }: { id: number; dmg: number }) {
    const char = this.gameCharacters[id];
    if (char) {
      (char as Troop).receiveDamage(dmg);
    }
  }
  private handleTowerAttack({ id, trg }: { id: number; trg: number[] }) {
    const char = this.gameCharacters[id];
    if (char) {
      trg.map((t) => {
        const target = this.gameCharacters[t];
        if (!target) return;
        (char as Tower).attack(target);
      });
    }
  }
  private handleHeal({ id, val }: { id: number; val: number }) {
    const char = this.gameCharacters[id];
    setTimeout(function () {
      if (char) {
        (char as Troop).heal(val);
      }
    }, (4 * Constants.deltatime) / 10);
  }
  private handleAddStatus({ id, stt }: { id: number; stt: number }) {
    const char = this.gameCharacters[id];
    setTimeout(function () {
      if (char) {
        (char as Troop).addStatus(stt);
      }
    }, (3 * Constants.deltatime) / 10);
  }
  private handleRemoveStatus({ id, stt }: { id: number; stt: number }) {
    const char = this.gameCharacters[id];
    setTimeout(function () {
      if (char) {
        (char as Troop).removeStatus(stt);
      }
    }, (2 * Constants.deltatime) / 10);
  }
  private handleAddTerrain({ id, terrain }: { id: number; terrain: number }) {
    const char = this.gameCharacters[id];
    setTimeout(function () {
      if (char) {
        (char as Cell).addTerrain(terrain);
      }
    }, Constants.deltatime / 10);
  }
  private handleTowerLevelUp({ lv }: { lv: number }) {
    for (let i in this.gameCharacters) {
      if (this.gameCharacters[i] instanceof Tower) {
        (this.gameCharacters[i] as Tower).levelUp(lv);
      }
    }
  }
  private handleTroopLevelUp({ lv }: { lv: number }) {
    for (let i in this.gameCharacters) {
      if (this.gameCharacters[i] instanceof Troop) {
        (this.gameCharacters[i] as Troop).levelUp(lv);
      }
    }
  }
  private playGame() {
    if (!this.dataBattle) {
      return;
    }
    this.isPlay = true;
    const { frames, stageData, isWin } = this.dataBattle;
    const { mapData } = stageData;
    frames?.forEach((frame: any, index: number) => {
      let moveFrame: any = {};
      frame.filter((ac: any) => {
        if (
          [EventType.Move, EventType.KnockBack, EventType.PushSlip].includes(
            ac.tp
          )
        ) {
          if (!moveFrame[ac.inp.id]) {
            moveFrame[ac.inp.id] = [];
          }
          if (ac.tp == EventType.Move) {
            moveFrame[ac.inp.id] = moveFrame[ac.inp.id].concat(ac.inp.to);
          } else {
            moveFrame[ac.inp.id].push(ac.inp.to);
          }
          return false;
        }
        return true;
      });
      setTimeout(() => {
        frame.forEach((action: any) => {
          switch (action.tp) {
            case EventType.AddCharacter:
              this.handleAddCharacter({ ...action.inp, mapData });
              break;
            // case EventType.Move:
            //   this.handleMove({ ...action.inp, mapData });
            //   break;
            case EventType.Die:
              this.handleDie({ ...action.inp });
              break;
            case EventType.ReceiveDamage:
              this.handleReceiveDamage({ ...action.inp });
              break;
            case EventType.TowerAttack:
              this.handleTowerAttack({ ...action.inp });
              break;
            case EventType.Heal:
              this.handleHeal({ ...action.inp });
              break;
            case EventType.AddStatus:
              this.handleAddStatus({ ...action.inp });
              break;
            case EventType.RemoveStatus:
              this.handleRemoveStatus({ ...action.inp });
              break;
            case EventType.AddTerrain:
              this.handleAddTerrain({ ...action.inp });
              break;
            case EventType.TowerLevelUp:
              this.handleTowerLevelUp({ ...action.inp });
              break;
            case EventType.TroopLevelUp:
              this.handleTroopLevelUp({ ...action.inp });
              break;
            case EventType.ProcessWeather:
              let text = this.add.text(
                0,
                0,
                // @ts-ignore
                `Process Weather`,
                {
                  font: "35px Arial",
                  fill: "#ff0044",
                  wordWrapWidth: 60,
                  align: "center",
                  fontWeight: 700,
                  backgroundColor: "#ffffff00",
                } as Types.GameObjects.Text.TextStyle
              );
              text.x = window.innerWidth / 2;
              text.y = window.innerHeight / 2;
              this.add.tween({
                targets: text,
                y: text.y - 100,
                opacity: 1,
                duration: Constants.deltatime,
                onComplete: () => {
                  text.destroy();
                },
              });
              break;
          }
        });
        Object.keys(moveFrame).map((id) => {
          this.handleMove({ id: Number(id), to: moveFrame[id], mapData });
        });
      }, 500 * index);
    });
    setTimeout(() => {
      const bg = this.add.rectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth,
        window.innerHeight,
        0x00000
      );
      bg.setAlpha(0.4);
      bg.setDepth(2);
      this.assets.push(bg);
      this.assets.push(
        new TextButton({
          text: "",
          texture: isWin ? "win" : "lose",
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 - 150,
          width: 700,
          heigh: 380,
          onClick: async () => {
            this.scene.start("mainmenu");
          },
          scene: this,
          depth: 2,
        })
      );
      const textComponent = this.add.text(0, 0, isWin ? "VICTORY" : "DEFEAT", {
        font: "bold 80px Arial",
      });
      textComponent.setColor("#ffff00");
      textComponent.setDepth(2);
      textComponent.setPosition(
        window.innerWidth / 2 - textComponent.width / 2,
        window.innerHeight / 2 - 60 - textComponent.height / 2
      );
      this.assets.push(textComponent);
      this.assets.push(
        new TextButton({
          text: "Back",
          texture: "err-btn-bg",
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 + 100,
          onClick: async () => {
            this.isPlay = false;
            this.scene.start("mainmenu");
          },
          scene: this,
          depth: 2,
        })
      );
    }, 500 * (frames.length ?? 0));
  }
}
