import { allTileColors } from "./tileBag.js";
import { pickedTiles } from "../azul.js";

export function renderPickedTiles(pickedTiles) {
  let innerHTML = '';
  pickedTiles.forEach((tile) => {
    innerHTML += `<div class="tile tile-${tile.tileColor} player-tile player-tile-${tile.tileColor}">
    <img class="tile-image" src="../images/tile-${tile.tileColor}.png"></div>
    </div>`
  })
  document.querySelector('.js-player-tiles').innerHTML = innerHTML;

  allTileColors.forEach((color) => {
    
      document.querySelectorAll(`.player-tile-${color}`).forEach((tile) => {
        tile.addEventListener('mouseover', () => {
          document.querySelectorAll(`.player-tile-${color}`).forEach((tile) => {
            tile.classList.add('tile-is-same-color');
          })
        })
      })
        document.querySelectorAll(`.player-tile-${color}`).forEach((tile) => { 
          tile.addEventListener('mouseout', () => {
          document.querySelectorAll(`.player-tile-${color}`).forEach((tile) => {
          tile.classList.remove('tile-is-same-color');
        })
      });
    })
  })
}