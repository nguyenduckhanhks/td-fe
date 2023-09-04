import Constants from "../constant";

export default function convertXY({ pos, mapData }: { pos: number[]; mapData: any }) {
  const mapWidth = Math.sqrt(mapData.size);
  const x =
    Math.floor((Constants.SIZE_WIDTH - mapWidth) / 2 + pos[0]) * Constants.CELL_WIDTH +
    Constants.CELL_WIDTH / 2;
  const y =
    Math.floor((Constants.SIZE_HEIGHT - mapWidth) / 2 + pos[1]) * Constants.CELL_WIDTH +
    Constants.CELL_WIDTH / 2;
  return { x, y };
}