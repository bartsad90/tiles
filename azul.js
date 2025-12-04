import {tileBag, allTileColors, createNewTileBag, pickTileFromBag, checkOutCount, fillWorkshops, currentWorkshop} from '/scripts/tileBag.js';
import {workshopArray, createWorkshopNumber, moveWorkshopsToDiscard, renderWorkshops} from '/scripts/workshops.js';
import { renderPickedTiles } from './scripts/pickedTiles.js';
import { renderMosaicGrid, createMosaicArray , moveTilesToMosaic, generateNewMosaicArray, checkIfFinalRound, countFilledColumns, countFilledRows, countCompleteColors} from './scripts/mosaic.js';
import { renderPickedRows, findFirstBlank, generateBlankPickedRows, putTilesIntoPickedRowsArray, checkPickedRowsStatus, discardFullPickedRows } from './scripts/pickedRows.js';
import { renderNegPointBar, generateBlankNegPointTiles, countNegPoints } from './scripts/negPointsBar.js';

let activePlayer = 0;
export const playerCount = 2;
export const workshopCount = playerCount * 2 + 1;
let hasFirstTile;
let winner;

let playerPoints = 0;
let playerPoints1 = 0;
let playerPoints2 = 0;
let playerPoints3 = 0;
let playerPoints4 = 0;
let pointsInRound = '-';
let negPoints = '-';
let isFinalRound = false

//places separate objects into the array in order to avoid nesting arrays
//if imported, PickedTiles activates a read-only error

const tileColorClasses = [
    'black',
    'blue',
    'yellow',
    'red',
    'white'
]

let pickedRow0 = [];
let pickedRow1 = [];
let pickedRow2 = [];
let pickedRow3 = [];
let pickedRow4 = [];

let pickedRow5 = [];
let pickedRow6 = [];
let pickedRow7 = [];
let pickedRow8 = [];
let pickedRow9 = [];

let pickedRow10 = [];
let pickedRow11 = [];
let pickedRow12 = [];
let pickedRow13 = [];
let pickedRow14 = [];

let pickedRow15 = [];
let pickedRow16 = [];
let pickedRow17 = [];
let pickedRow18 = [];
let pickedRow19 = [];

let pickedRows1 = [
  pickedRow0,
  pickedRow1,
  pickedRow2,
  pickedRow3,
  pickedRow4
];

let pickedRows2 = [
 pickedRow5,
 pickedRow6, 
 pickedRow7, 
 pickedRow8, 
 pickedRow9, 
];

let pickedRows3 = [
  pickedRow10,
  pickedRow11,
  pickedRow12,
  pickedRow13,
  pickedRow14
];

let pickedRows4 = [
 pickedRow15,
 pickedRow16, 
 pickedRow17, 
 pickedRow18, 
 pickedRow19, 
];

let negPointTiles1 = [];
let negPointTiles2 = [];
let negPointTiles3 = [];
let negPointTiles4 = [];

let mosaicArray = [];

let mosaicArray1 = [];
let mosaicArray2 = [];
let mosaicArray3 = [];
let mosaicArray4 = [];

let pickedRowsStatus1 = [];
let pickedRowsStatus2 = [];
let pickedRowsStatus3 = [];
let pickedRowsStatus4 = [];


let player1Data = [
  { pickedRows: pickedRows1 },
  { negPointTiles: negPointTiles1 },
  { mosaicArray: mosaicArray1 },
  { pickedRowsStatus: pickedRowsStatus1},
  { playerPoints: playerPoints1},
  {
  rows: [], 
  columns: [],
  colors: []
  }
];

let player2Data = [
  { pickedRows: pickedRows2 },
  { negPointTiles: negPointTiles2 },
  { mosaicArray: mosaicArray2 },
  { pickedRowsStatus: pickedRowsStatus2 },
  { playerPoints: playerPoints2},
  {
  rows: [], 
  columns: [],
  colors: []
  }
];

let player3Data = [
  { pickedRows: pickedRows3 },
  { negPointTiles: negPointTiles3 },
  { mosaicArray: mosaicArray3 },
  { pickedRowsStatus: pickedRowsStatus3 },
  { playerPoints: playerPoints3},
  {
  rows: [], 
  columns: [],
  colors: []
  }
]

let player4Data = [
  { pickedRows: pickedRows4 },
  { negPointTiles: negPointTiles4 },
  { mosaicArray: mosaicArray4 },
  { pickedRowsStatus: pickedRowsStatus4 },
  { playerPoints: playerPoints4},
  {
  rows: [], 
  columns: [],
  colors: []
  }
]

let playerData = [
  player1Data,
  player2Data,
  player3Data,
  player4Data
];

document.querySelector('.js-end-round-button').
addEventListener('click', () => {
  console.log(`Round end, activePlayer: ${activePlayer}`)

  updatePickedRowsStatus();
  let pointsInRound = moveTilesToMosaic(playerData, activePlayer, playerData[activePlayer][2].mosaicArray);  
  renderMosaicGrid(playerData, activePlayer);
  negPoints = countNegPoints(playerData, activePlayer);
  playerData[activePlayer][4].playerPoints += pointsInRound + negPoints;
  console.log(pointsInRound);
  console.log(negPoints);
  console.log(`Points this round: ${pointsInRound}`);
  console.log('Negative points this rounds: ', negPoints)
  console.log('Total points: ', playerData[activePlayer][4].playerPoints);
  renderPickedRows(pickedTiles, rowNumber, activePlayer, playerData);
  renderPlayerScore(pointsInRound, playerData[activePlayer][4].playerPoints, negPoints, activePlayer, playerData);
  isFinalRound = checkIfFinalRound(activePlayer, playerData, isFinalRound);

  if (isFinalRound) {
    document.querySelector('.js-new-round-button')
    .innerHTML = 'Count final scores'
  }

  countFilledRows(activePlayer, playerData);
  countCompleteColors(activePlayer, tileColorClasses, playerData);
  console.log(`Round ended for player: ${activePlayer}`);
  activePlayer = switchActivePlayer(activePlayer, playerCount);
  highlightActivePlayerMat(activePlayer);
});

document.querySelector('.js-new-round-button').
addEventListener('click', () => {
  if (isFinalRound) {
    countFinalScores(playerData);
    winner = determineWinner(playerCount, playerData);
    highlightWinner(winner);
  } else {

  console.log('New round started', playerData);

  workshopArray.forEach((row) => {
    row.forEach((tile) => {
      moveToDiscardBox(tile);
  })
    row.splice(0, row.length);
  })
  fillWorkshops(workshopCount);
  renderWorkshops(pickedTiles, centerTable);
  renderActivePlayer(activePlayer);
  activePlayer = chooseFirstPlayer(isFinalRound, playerData);



  for (let player = 0; player < playerCount; player++) {
    //let playerDataSet = playerData[player];
    console.log('Clearing player matt for player: ', player);
    discardFullPickedRows(discardBox, player, playerData);
    moveNegPointsTilesToDiscard(player, playerData);
    renderNegPointBar(playerData, player);
    let pickedRowsStatus = playerData[player][2].pickedRowsStatus;
    console.log(`pickedRowsStatus for player ${player}`, pickedRowsStatus);
    renderPickedRows(pickedTiles, rowNumber, player, playerData);
    console.log('pointsInRound: ',pointsInRound, 'playerData[4].playerPoints: ', playerData[player][4].playerPoints);
    renderPlayerScore(0, playerData[player][4].playerPoints, 0, player);
  }
  
  renderPickedRows(pickedTiles, rowNumber, activePlayer, playerData);
  removeBlanksFrom(discardBox);
  console.log('discardBox: ', discardBox);
  pickedTiles.splice(0, pickedTiles.length);
  console.log(`picked tiles cleared, pickedTiles: `, pickedTiles)
  centerTable.splice(0, centerTable.length, {id: 'firstPlayer', tileColor: 'first-player'});
  console.log(`centerTable reset. centerTable: `, centerTable);
  renderCenterTable(centerTable, pickedTiles);
  pointsInRound = '-';
  negPoints = '-';
  console.log('hasFirstTile: ', hasFirstTile)
  renderActivePlayer(activePlayer);
  highlightActivePlayerMat(activePlayer);
  console.log('activePlayer: ',activePlayer)
  } 
});

document.querySelector('.js-end-turn').
addEventListener('click', () => {
activePlayer = switchActivePlayer(activePlayer, playerCount);
console.log(activePlayer);
displayMessage(`New turn: player ${activePlayer}`);
})

let discardBox = [];

let newMosaicTemplate = [
  'blue',
  'yellow',
  'red',
  'black', 
  'white'
];

mosaicArray = generateNewMosaicArray(newMosaicTemplate, mosaicArray);

export let centerTable = [{
  id: 'firstPlayer',
  tileColor: 'first-player'
}];

export let pickedTiles = [];

createNewTileBag();

createWorkshopNumber(workshopCount);

fillWorkshops(workshopCount);

renderWorkshops(pickedTiles, centerTable);

renderCenterTable(centerTable, pickedTiles);

console.log('Mosaic array: ', mosaicArray)

generateBlankPickedRows(playerCount, playerData);

let pickedColor = 'blank'

let rowNumber = 0;

generatePlayerMatts(playerCount);

//generateBlankNegPointTiles() creates 7 blank tiles and pushes them into the array. To avoid generating n7 tiles, it is called only once outside the loop.
playerData.forEach((playerDataSet) => {
  generateBlankNegPointTiles(playerDataSet[1]);   //playerData[1] === negPointTiles 
  generateNewMosaicArray(newMosaicTemplate, playerDataSet[2].mosaicArray);
}) 

for(activePlayer = 0; activePlayer < playerCount; activePlayer++) {
renderPickedRows(pickedTiles, rowNumber, activePlayer, playerData);

renderMosaicGrid(playerData, activePlayer);

renderNegPointBar(playerData, activePlayer);

initializePlayerScoresHTML(activePlayer, playerData);

renderPlayerScore(pointsInRound, playerPoints, negPoints, activePlayer);
}

activePlayer = 0;

renderActivePlayer(activePlayer);

highlightActivePlayerMat(activePlayer);

export function refillTileBag(outCount) {
  if (outCount === 100) {
    discardBox.forEach((tile) => {
    tileBag.splice(tile.tileId, 1, tile);
    })
    console.log(`discardBox moved to tileBag. tileBag: `, tileBag, 'discardBox: ', discardBox);
  }
}

function renderPlayerScore(pointsInRound, playerPoints, negPoints, activePlayer) { 
  console.log('Rendering scores for player: ', activePlayer, ';', pointsInRound, playerPoints, negPoints, activePlayer);
  document.querySelector(`.player${activePlayer}-total-score`).innerHTML = playerPoints;
  document.querySelector(`.player${activePlayer}-score-this-round`).innerHTML = `${pointsInRound}, penalty: ${negPoints}`;
  document.querySelector(`.js-player${activePlayer}-bonus-score-container`).innerHTML = 
     `<p>Bonus points: </p>
      <div class="player${activePlayer}-bonus-score">
      <p>Complete rows: ${playerData[activePlayer][5].rows.length} x 2pts</p>
      <p>Complete columns: ${playerData[activePlayer][5].columns.length} x 7pts</p>
      <p>Complete colors: ${playerData[activePlayer][5].colors.length} x 10pts</p>`
}

function initializePlayerScoresHTML(activePlayer, playerData) {
  document.querySelector(`.js-player${activePlayer}-scores`).innerHTML =`
    <div class="player${activePlayer}-total-score-container js-player${activePlayer}-total-score-container">
      <p>Total score: </p>
      <div class="player${activePlayer}-total-score">
    </div>
    </div>
    <div class="player${activePlayer}-score-this-round-container js-player${activePlayer}-score-this-round-container">
      <p>Points this round: </p>
      <div class="player${activePlayer}-score-this-round">
      </div>
    </div>
    <div class="player${activePlayer}-bonus-score-container js-player${activePlayer}-bonus-score-container">
      <p>Bonus points: </p>
      <div class="player${activePlayer}-bonus-score">
      Complete rows: ${playerData[activePlayer][5].rows.length} x 2pts
      Complete columns: ${playerData[activePlayer][5].columns.length} x 7pts
      Complete colors: ${playerData[activePlayer][5].colors.length} x 10pts
      </div>
    </div>`
    
}

export function renderCenterTable(centerTable, pickedTiles) {
  let innerHTML = '';
  centerTable.forEach((tile) => {
    innerHTML += `<div class="tile center-table-tile center-table-tile-${tile.tileColor} tile-${tile.tileColor}">
    <img class="tile-image" src="../images/tile-${tile.tileColor}.png"></div>
    </div>`
  })
  document.querySelector('.js-table-center-container').innerHTML = innerHTML;

  document.querySelectorAll('.center-table-tile').
  forEach((tile) => {
    let tileColor;
    tileColorClasses.forEach((color) => {
      if (tile.classList.contains(`tile-${color}`)) {
        tileColor = color;
        }
      }
    )
    
    tile.addEventListener('click', () => {
      if (tile.classList.contains('tile-is-same-color') || tile.classList.contains('tile-first-player')) {
        console.log(`Picked from table center: ${tileColor}`);
      }

      let indecesToDelete = [];
      let firstPlayerPicked;

      centerTable.forEach((centerTableTile) => {

        if (centerTableTile.tileColor === 'first-player') {
          firstPlayerPicked = true;
          console.log('first player tile chosen');
          console.log(centerTable[0]);
        }
        if (centerTableTile.tileColor === tileColor) {
          pickedTiles.push(centerTableTile);
          console.log(`Center table: `, centerTable);      
          indecesToDelete.push(centerTable.indexOf(centerTableTile));

          if (firstPlayerPicked === true) {
            console.log('moving first tile to picked tiles.', centerTable[0])
            pickedTiles.push(centerTable[0]);
            indecesToDelete.splice(0, 0, 0) //enters 0 at index 0 of the array to prevent later array.reverse fromr eindexing
            firstPlayerPicked = false;
          }

          renderPickedTiles(pickedTiles);

          console.log('PickedTiles: ');
          console.log(pickedTiles);


          console.log('CenterTable: ');
          console.log(centerTable);
        }  
      })
      console.log('indecesToDelete', indecesToDelete)
      indecesToDelete.reverse().forEach((index) => {
      centerTable.splice(index, 1);
      renderCenterTable(centerTable, pickedTiles);
      })      
    }
   )
  })


  //adds listeners for mousover effects
  allTileColors.forEach((color) => {
    
      document.querySelectorAll(`.center-table-tile-${color}`).forEach((tile) => {
        tile.addEventListener('mouseover', () => {
          document.querySelectorAll(`.center-table-tile-${color}`).forEach((tile) => {
            tile.classList.add('tile-is-same-color');
          })
        })
      })
        document.querySelectorAll(`.center-table-tile-${color}`).forEach((tile) => { 
          tile.addEventListener('mouseout', () => {
          document.querySelectorAll(`.center-table-tile-${color}`).forEach((tile) => {
          tile.classList.remove('tile-is-same-color');
        })
      });
    })
  })
}

function moveNegPointsTilesToDiscard(player, playerData) {
  let indecesToDelete = [];
  let negPointTiles = playerData[player][1].negPointTiles;
  negPointTiles.forEach((tile) => {
    if (tile.tileId !== 'firstPlayer' && tile.tileColor !== 'blank') {
      moveToDiscardBox(tile);
      console.log('Moved tile from negPointsTiles to discardBox. Tile: ', tile)
      indecesToDelete.push(negPointTiles.indexOf(tile));
      console.log('Indeces to delete from negPointTiles: ', indecesToDelete)
      console.log('Moved negPointsTiles to discardBox: ', discardBox)
    }
  })
  indecesToDelete.reverse().forEach(index => negPointTiles.splice(index, 1, {id: `neg${index}`, tileColor: 'blank'}));
  console.log('negPointTiles after discard: ', negPointTiles);
}

export function moveToDiscardBox(tile) {
  if (tile.tileId >= 0 || tile.tileId < 100) {
    discardBox.push(tile);
    console.log(`tile ${tile.tileId} (${tile.tileColor}) moved to discardBox`)
  }
  console.log('currentWorkshop: ', currentWorkshop);
}

function generatePlayerMatts(playerCount) {
  for (activePlayer = 0; activePlayer < playerCount; activePlayer++) {
    document.querySelector('.js-players-area').innerHTML += generatePlayerMattHTML(activePlayer);
  }
  activePlayer = 0;
}

function generatePlayerMattHTML(activePlayer) {
  let innerHTML = '';
  innerHTML = `
  <div class="player-playmat-container player${activePlayer}-playmat-container">
    <div class="picked-rows-mosaic-container player${activePlayer}-picked-rows-mosaic-container">
    <div class="picked-rows-container js-picked-rows-container player${activePlayer}-picked-rows-container js-player${activePlayer}-picked-rows-container">
    </div>
    <div class="mosaic-container player${activePlayer}-mosaic-container">
      <div class="mosaic js-mosaic player${activePlayer}-mosaic js-player${activePlayer}-mosaic">
     </div>
     </div>
      </div>
      <div class="neg-point-container js-neg-point-container player${activePlayer}-neg-point-container js-player${activePlayer}-neg-point-container">
      </div>
      <div class="player-scores js-player-scores player${activePlayer}-scores js-player${activePlayer}-scores">
    </div>
    </div>
    `;
  return innerHTML;
}

export function removeBlanksFrom(array) {
  let indecesToDelete = [];
  array.forEach((tile) => {
    if (tile === 'blank' || tile.tileColor === 'blank') {
      indecesToDelete.push(array.indexOf(tile));
    }
  })
  indecesToDelete = indecesToDelete.reverse();
  console.log(`Indeces of blanks to delete from named array: `, indecesToDelete);
    indecesToDelete.forEach((index) => {
      array.splice(index, 1)
    })
}

export function moveDiscardBoxToTileBag() {
  discardBox.forEach((tile) => {
    tileBag.splice(tile.tileId, 1, tile);
    console.log(`Tile ${tile.tileId} (${tile.tileColor}) from discardBox returned to the tileBag`)
  })
  discardBox.splice(0, discardBox.length);   //clears the discardBox at the end
  console.log('discardBox cleared. discardBox: ', discardBox, 'tileBag: ', tileBag);
}

function updatePickedRowsStatus() {
  let pickedRowsStatus = checkPickedRowsStatus(activePlayer, playerData);
  
  console.log(`pickedRowsStatus: `, pickedRowsStatus);
  playerData[activePlayer].splice(3, 1, pickedRowsStatus);
  console.log('pickedRowsStatus: ', pickedRowsStatus);
}

function renderActivePlayer(activePlayer) {
  document.querySelector('.js-active-player-container').innerHTML = `Active player: ${activePlayer}`
}

function highlightActivePlayerMat(activePlayer) {
  document.querySelectorAll(`.player-playmat-container`).
forEach((playmat) => {
  if (playmat.classList.contains('player-is-active'))  {
    playmat.classList.remove('player-is-active')}
})

console.log(activePlayer);
document.querySelector(`.player${activePlayer}-playmat-container`).classList.add('player-is-active');
};

export function switchActivePlayer(activePlayer, playerCount) {
  console.log(`switchActivePlayer(activePlayer: ${activePlayer}, playerCount: ${playerCount}`);
  activePlayer++;

  if (activePlayer > playerCount-1) {
    console.log(activePlayer);
    activePlayer = 0;
  }

  highlightActivePlayerMat(activePlayer);

  renderActivePlayer(activePlayer);

  console.log(`Player ${activePlayer} starts the turn.`)
  return activePlayer;
}

function chooseFirstPlayer(isFInalRound, playerData) {
  let firstNextRound;
    playerData.forEach((playerDataSet) => {
      console.log(`Searching for first player tile in player ${playerData.indexOf(playerDataSet)} negPointTiles`, playerData)
      playerDataSet[1].negPointTiles.forEach((tile) => {
        if (tile.tileColor === 'first-player' && !isFInalRound) {
          firstNextRound = playerData.indexOf(playerDataSet);
          console.log(`Player ${firstNextRound} has the first player tile and begins the next round.`)
          console.log('firstNextRound: ', firstNextRound);
        }
      })
     })
    return firstNextRound;
  }

  function displayMessage(message) {
    document.querySelector('.js-message-panel').innerHTML = `${message}`
  }

  function countFinalScores(playerData) {
    playerData.forEach((player) => {
      const scoreRows = player[5].rows.length * 2;
      const scoreColumns = player[5].columns.length * 7;
      const scoreColors = player[5].colors.length * 10;
      console.log(`player ${playerData.indexOf(player)} scoreRows, scoreColumns, scoreColors: `, scoreRows, scoreColumns, scoreColors);
      console.log(scoreRows);
      console.log(scoreColumns);
      console.log(scoreColors);
      console.log(`bonus points total: `, scoreRows + scoreColumns + scoreColors);
      console.log('player[4].playerPoints: ', player[4].playerPoints);
      console.log('player[4].playerPoints + scoreColumns: ', player[4].playerPoints + scoreColumns);
      console.log('player[4].playerPoints + bonus points: ', player[4].playerPoints + scoreRows + scoreColumns + scoreColors);
      
      player[4].playerPoints = player[4].playerPoints + scoreRows + scoreColumns + scoreColors;
      console.log('player[4].playerPoints after counting: ', player[4].playerPoints)

      console.log(`Player ${playerData.indexOf(player)} final score: ${player[4].playerPoints}`)
    })
  }


function determineWinner(playerCount, playerData) {
  console.log('determineWinner')
  let winner = 0;
  let highestScore = playerData[0][4].playerPoints;
  let contenderScore;
  for (let player = 1; player < playerCount; player++) 
    //starts at one in order to skip the iteration for the default winner: player 0
    { 
    console.log(`Comparing player ${player} to current winner: player ${winner}. contenderScore: `, contenderScore);
    contenderScore = playerData[player][4].playerPoints;
    if (contenderScore > highestScore) {
      highestScore = contenderScore;
      winner = player;
    }
  }
  displayMessage(`Player ${winner} wins with score: ${highestScore}`);
  return winner;
}

function highlightWinner(winner) {
  document.querySelector(`.player${winner}-playmat-container`).classList.add('player-is-winner')
}

