import { pickedTiles, playerCount, workshopCount, renderCenterTable, highlightPossibleRows, dehighlightPossibleRows, displayMessage} from '/../azul.js';
import { pickTileFromBag, tileBag, allTileColors } from './tileBag.js';
import { renderPickedTiles } from './pickedTiles.js';
import { renderShowPossibleRowsButton } from '../azul.js';


let selectedColor;
let workshopNum;

export let workshopArray = []; 
//sets up the correct number of workshops based on playerCount for renderWorkshops

export function createWorkshopNumber(workshopCount) {
  for (let i = 0; i < workshopCount; i++) {
    let workshop = [];
    workshopArray[i] = workshop; 
  }

  console.log(`Number of workshops: ${workshopCount}, Workshops:`)
  console.log(workshopArray);
}

//uses RnG to draw tiles from the tile bag. Replaces drawn tiles with string 'out' to avoid reindexing issues

export function moveWorkshopsToDiscard () {
  workshopArray.forEach((workshop) => {
    workshop.forEach((tile) => {
      if (tile.tileId >= 0 || tile.tileId < 100) {
        moveToDiscardBox(tile);
      }
    })
    workshop.splice(0, 4);
    console.log(`workshop ${workshopArray.indexOf(workshop)} cleared`, workshop);       //expected for workshop to === []
  })
  console.log(`workshops clear`, workshopArray);
}

export function renderWorkshops(pickedTiles, centerTable, activePlayer, playerData) {
  console.log('renderWorkshops. playerData', playerData, 'activePlayer', activePlayer);
  
  let workshopInnerHTML = ``;

  workshopArray.forEach((workshop) => {
    workshopInnerHTML += `
    <div class="workshop-image-container">
    <img class="workshop-image" src="../images/workshop.png">
    <div class="
    workshop 
    js-workshop-${workshopArray.indexOf(workshop)}
    ">
    `;
    workshop.forEach((tile) => {
      workshopInnerHTML += `<div class="
      tile
      workshop-tile
      tile-in-workshop-${workshopArray.indexOf(workshop)}
      ${tile.tileColor}-tile-in-workshop-${workshopArray.indexOf(workshop)}
      js-workshop-${workshopArray.indexOf(workshop)}-tile-${workshop.indexOf(tile)} 
      js-tile 
      tile-${tile.tileColor}
      ">
      <img class="tile-image" src="../images/tile-${tile.tileColor}.png"></div>`
    })
    workshopInnerHTML += '</div></div>'
  })
  workshopInnerHTML += `</div>`

  document.querySelector('.js-workshop-container').innerHTML = workshopInnerHTML;

  addWorkshopsMouseoverEffects();

  addEventListenerWorkshop(pickedTiles, centerTable, activePlayer, playerData);
  console.log('test, activePlayer: activePlayer: ', activePlayer);
}

function addWorkshopsMouseoverEffects () {
  workshopArray.forEach((workshop) => {
    const workshopNum = workshopArray.indexOf(workshop);
    allTileColors.forEach((color) => {
    
      document.querySelectorAll(`.${color}-tile-in-workshop-${workshopNum}`).forEach((tile) => {
        tile.addEventListener('mouseover', () => {
          document.querySelectorAll(`.${color}-tile-in-workshop-${workshopNum}`).forEach((tile) => {
            tile.classList.add('tile-is-same-color');
          })
        })
      })
    }) 
  })

  document.querySelectorAll('.js-tile').forEach((tile) => { 
    tile.addEventListener('mouseout', () => {
      document.querySelectorAll('.js-tile').forEach((tile) => {
        tile.classList.remove('tile-is-same-color');
      })
    });
  })
}

export function addEventListenerWorkshop(pickedTiles, centerTable, activePlayer, playerData){
  console.log('addEventListenerWorkshop. activePlayer: ', activePlayer);
  document.querySelectorAll('.js-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      if (tile.classList.contains('tile-black')) {
        selectedColor = 'black'
      } else if (tile.classList.contains('tile-red')) {
        selectedColor = 'red'
      } else if (tile.classList.contains('tile-yellow')) {
        selectedColor = 'yellow'
      } else if (tile.classList.contains('tile-white')) {
        selectedColor = 'white'
      } else if (tile.classList.contains('tile-blue')) {
        selectedColor = 'blue'
      }

  for (let i = 0; i < 9; i++) {
    if (tile.classList.contains(`tile-in-workshop-${i}`)) {
          workshopNum = i;
        }
      } 

        //stores picked and discarded tiles after click
        const clickedWorkshop = selectTilesFromWorkshop(selectedColor, workshopNum);
        console.log(`selectedColor: ${selectedColor}
          from workshop: ${workshopNum}
          number of tiles: ${clickedWorkshop[0].length}`);
        /*
        pushTilesFromTo(clickedWorkshop[1], centerTable);

        console.log('pickedTiles error?: ', pickedTiles);
        pushTilesFromTo(clickedWorkshop[0], pickedTiles);
        */


          clickedWorkshop[1].forEach((tile) => {
          centerTable.push(tile)
        })

        clickedWorkshop[0].forEach((tile) => {
          pickedTiles.push(tile)
        })

        console.log('Discarded tiles:'); 
        
        centerTable.forEach((tile) =>
        console.log(tile))
        console.log('Picked tiles:');
        pickedTiles.forEach((tile) => 
        console.log(tile))

        workshopArray[workshopNum].splice(0, 4, 'blank', 'blank', 'blank', 'blank');
        console.log(`Workshop ${workshopNum}`, workshopArray[workshopNum]);
        console.log('pickedTiles: ', pickedTiles);
        renderWorkshops(pickedTiles, centerTable, activePlayer, playerData);
        renderCenterTable(centerTable, pickedTiles);
        renderPickedTiles(pickedTiles);
        displayMessage(`Player ${activePlayer}: Click an available row on your player mat to collect the tiles`);
      
        //[] Highlight available rows after workshop tiles are clicked
      
      //  dehighlightPossibleRows();
      //  highlightPossibleRows(pickedTiles, activePlayer, playerData);

      })
    })
  }

function selectTilesFromWorkshop(selectedColor, workshopNum) {
    let selectedTiles = [];
    let unselectedTiles = [];
    let clickedWorkshop = [];
    workshopArray[workshopNum].forEach((tile) => {
      if (selectedColor === tile.tileColor) {
        selectedTiles.push(tile);
      } else {
        unselectedTiles.push(tile);
      }
    })
    clickedWorkshop.push(selectedTiles, unselectedTiles); //the array stores selected tiles at index 0, tiles for discard at index 1
    return clickedWorkshop;
  }
