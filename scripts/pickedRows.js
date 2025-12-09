import { switchActivePlayer, playerCount, renderShowPossibleRowsButton} from '../azul.js'
import { renderPickedTiles } from './pickedTiles.js';
import { renderNegPointBar } from './negPointsBar.js';

export function putTilesIntoPickedRowsArray(pickedTiles, rowNumber, activePlayer, playerData, playerCount) {
  let k; //k stores the index of the first blank tile in a picked row
  let isActionComplete; //true if the click should result in changing activePlayer
  console.log(`putTilesIntoPickedRowsArray(pickedTiles, rowNumber, activePlayer, playerData), pickedTiles: `, pickedTiles, 'rowNumber: ', rowNumber);
  if (!playerData[activePlayer][0].pickedRows[rowNumber][0]) {
    k = 0} 
  else {
        //maps tiles from objects to strings to enable searching for specific tile colors
    console.log('picked tiles: ', pickedTiles);
    k = playerData[activePlayer][0].pickedRows[rowNumber].map(e => e.tileColor).indexOf('blank'); //determines the index of the first blank tile in a picked row
    }
  let segregateTileOutcome;

  pickedTiles.forEach((t) => {
    
    let colorIsFilledInMosaicRow = false;
    playerData[activePlayer][2].mosaicArray[rowNumber].
      forEach((mosaicTile) => {
        if (mosaicTile.isFilled && mosaicTile.tileColor === t.tileColor)
        {colorIsFilledInMosaicRow = true;
          console.log('colorIsFilledInMosaicRow: ', colorIsFilledInMosaicRow)
        }
      })

    //segregateTileOutcome === -1: prevents full rows from taking more tiles

    if (playerData[activePlayer][0].pickedRows[rowNumber][rowNumber].tileColor !== 'blank') {      //
      let firstBlankPos = 0;
      firstBlankPos = playerData[activePlayer][0].pickedRows[rowNumber].findIndex(findFirstBlank);
      console.log (`First blank index in row ${rowNumber}: `, firstBlankPos);
      playerData[activePlayer][1].negPointTiles.splice(playerData[activePlayer][1].negPointTiles.findIndex(findFirstBlank), 1, t);
      segregateTileOutcome = -1;
    }  
    else if (colorIsFilledInMosaicRow) 
      {
      console.log(`A ${t.tileColor} tile already exists in this mosaic row. Pick a different row.`);
    }
    else if (
      t.tileColor === 'first-player') 
      {
      let firstBlankPos= 0;
      console.log(pickedTiles);
      firstBlankPos = playerData[activePlayer][1].negPointTiles.findIndex(findFirstBlank);
      playerData[activePlayer][1].negPointTiles.splice(firstBlankPos, 1, t);
      console.log('First player tile added to negative point bar');
      pickedTiles.splice(0, 1, 'out');
      console.log(pickedTiles);
      segregateTileOutcome = 0;
    } 
    else if (
      playerData[activePlayer][0].pickedRows[rowNumber]
      .map(e => e.tileColor)
      .every(string => string === 'blank')
      ||
      playerData[activePlayer][0].pickedRows[rowNumber]
      .map(e => e.tileColor)
      .includes(t.tileColor)
    ) {
      playerData[activePlayer][0].pickedRows[rowNumber].splice(k, 1, t);
      k++;
      segregateTileOutcome = 1;
      console.log(`option 1, tile transferred: `, t)
    }
    else if (!playerData[activePlayer][0].pickedRows[rowNumber]
      .map(e => e.tileColor)
      .includes(`${t.tileColor}`)) 
      {
      segregateTileOutcome = 2;
    }
    else {
      playerData[activePlayer][0].pickedRows[rowNumber].splice(k, 1, t);
      k++;
      console.log(`${pickedTiles.length} ${t.tileColor} tile(s) added to row ${rowNumber}`);
      console.log(`option 3, tile transferred: `, t)

      segregateTileOutcome = 3;
    } 
  })
  if (segregateTileOutcome === -1) {
    console.log(`Too many tiles. Tiles transfered to negPointsBar`)
    pickedTiles.splice(0, 5);
    isActionComplete = true;

    }
  else if (segregateTileOutcome === 0) {
    console.log(`Segregate option ${segregateTileOutcome}. You will go first next round.`)
    pickedTiles.splice(0, 5);
    isActionComplete = true;


    }
  else if (segregateTileOutcome === 1) {
    console.log(`${pickedTiles.length} tile(s) added to row ${rowNumber}`);
    pickedTiles.splice(0, 5);
    isActionComplete = true;

  }
  else if (segregateTileOutcome === 2) {
    console.log(`Invalid color, pick an empty row or a row with tiles of the same color as the picked ones`);
  }

  else if (segregateTileOutcome === 3) {
    console.log(`${pickedTiles.length} tile(s) added to row ${rowNumber}`);
    pickedTiles.splice(0, 5);
    isActionComplete = true;

  }

  return isActionComplete;
}; 

export const findFirstBlank = (e) => e.tileColor === 'blank';

export function renderPickedRows(pickedTiles, rowNumber, activePlayer, playerData) {
  console.log(`renderPickedRows(pickedTiles, rowNumber, activePlayer), pickedTiles: `, pickedTiles, 'rowNumber: ', rowNumber, 'activePlayer: ', activePlayer);
  rowNumber = 0;
  let innerHTML = ''
  let tileCount = 0;
  console.log(`Number of tiles picked: ${pickedTiles.length}`);
  !pickedTiles[0] ?
      console.log('No color.') :
      console.log(`Color selected: ${pickedTiles[0].tileColor}`)

    for(let i=0; i<5; i++) {
      
      innerHTML += `<div class="
      player${activePlayer}-picked-tile-row
      picked-tile-row
      js-picked-tile-row
      js-picked-tile-row-${i}
      js-player${activePlayer}-picked-tile-row-${i}
      js-player${activePlayer}-picked-tile-row
      ">`

      for(let j=0; j-1<tileCount; j++) {
            innerHTML += `<div class="tile picked-tile js-picked-tile-r${i}-${j} tile-${playerData[activePlayer][0].pickedRows[i][j].tileColor} player${activePlayer}-tile-${playerData[activePlayer][0].pickedRows[i][j].tileColor}">
            <img class="tile-image" src="../images/tile-${playerData[activePlayer][0].pickedRows[i][j].tileColor}.png"></div>`
          }

        if (tileCount > 4) {
          break;
        } else {
          tileCount++;
        }
      innerHTML += '</div>'
    }
    document.querySelector(`.js-player${activePlayer}-picked-rows-container`).innerHTML = innerHTML;

    //allows to choose which row the picked tiles go to

    document.querySelectorAll(`.js-player${activePlayer}-picked-tile-row`).  
    forEach((row) => {
      row.addEventListener('click', () => {
        while (!row.classList.contains(`js-player${activePlayer}-picked-tile-row-${rowNumber}`)) {
          rowNumber++ ;
          if (rowNumber > 5) {
            break;
          }
        }
      console.log(`pickedTiles: `, pickedTiles, 'activePlayer: ', activePlayer);
      let isActionComplete = putTilesIntoPickedRowsArray(pickedTiles, rowNumber, activePlayer, playerData, playerCount);

      renderPickedRows(pickedTiles, rowNumber, activePlayer, playerData);
      renderPickedTiles(pickedTiles);
      renderNegPointBar(playerData, activePlayer);
      

      console.log(`Picked row ${rowNumber}. Row ${rowNumber} contains:`);console.log(playerData[activePlayer][0].pickedRows[rowNumber]);
      console.log(`Picked rows ${activePlayer}: `, playerData[activePlayer][0].pickedRows);
      
      
      if (isActionComplete) {
      activePlayer = switchActivePlayer(activePlayer, playerCount);
      renderShowPossibleRowsButton(pickedTiles, activePlayer, playerCount, playerData);
      }
      rowNumber = 0;
      
      })
    })
  }
  
//generates an array of blank tiles for rendering in pickedRows
export function generateBlankPickedRows(playerCount, playerData) {
  for(let player = 0; player < playerCount; player++) {
    playerData[player][0].pickedRows.forEach((row) => {
    for(let j=0; j<5; j++) {
        row.push({id: 'defaultBlank', tileColor: 'blank'});
   }
  })
  console.log(`blank tiles pushed into player ${player} pickedRows. playerData[player][0].pickedrows: `, playerData[player][0].pickedRows)
  } 
};

export function checkPickedRowsStatus (activePlayer, playerData) {
  let pickedRowsStatus = [];
  let rowCap = 1;
  playerData[activePlayer][0].pickedRows.forEach((row) => {
    if (row[rowCap-1].tileColor !== 'blank') {
      pickedRowsStatus.push({isFilled: true, tileColor: row[rowCap-1].tileColor});
      console.log(`Row ${rowCap -1} full.`)
      console.log(`rowCap: ${rowCap}, tileColor at rowCap-1: ${row[rowCap-1].tileColor}`);
      rowCap++;
    } else {
      pickedRowsStatus.push(false);
      console.log(`Row ${rowCap -1} not full.`);
      console.log(`rowCap: ${rowCap}, tileColor at rowCap-1: ${row[rowCap-1].tileColor}`);
      console.log(row);
      rowCap++;
    }
  })
  return pickedRowsStatus;
}

export function discardFullPickedRows(discardBox, player, playerData) {
  let rowNum = 0;
  let pickedRowsStatus = playerData[player][3];
  console.log('pickedRowsStatus: ', pickedRowsStatus);
  pickedRowsStatus.forEach((row) => {
    if (row.isFilled) {
      console.log(`moving tiles from pickedRow ${rowNum} to discardBox`);
        playerData[player][0].pickedRows[rowNum].forEach((tile) => {
          if (playerData[player][0].pickedRows[rowNum].indexOf(tile) === 0) {
            playerData[player][0].pickedRows[rowNum].splice(playerData[player][0].pickedRows[rowNum].indexOf(tile), 1, { id: "defaultBlank",
            tileColor: "blank" })  //doesn't move one tile to discardBox to emulate the tile moved onto the mosaic  
          } else {
            discardBox.push(tile);
            playerData[player][0].pickedRows[rowNum].splice(playerData[player][0].pickedRows[rowNum].indexOf(tile), 1, { id: "defaultBlank",
            tileColor: "blank" })} 
        })
           
      console.log(`pickedRow ${rowNum}: `, playerData[player][0].pickedRows[rowNum]);
    }
    rowNum++;
  })
  console.log('discardBox: ', discardBox);
}
