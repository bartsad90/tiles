export function generateNewMosaicArray(template, mosaicArray) {   
  template.forEach((rowFirstTile) => {
  let mosaicArrayRow = [];
    for(let i = 0; i < 5; i++) {
      let mosaicEmptyTile = {isFilled: false, tileColor: template[i], wasScored: false};
      mosaicArrayRow.push(mosaicEmptyTile);
    }
    mosaicArray.push(mosaicArrayRow);
    template.splice(0, 0, template[4]);
    template.splice(5, 1);
})
  console.log('Created new mosaic array: ', mosaicArray)
  return mosaicArray
}

export function renderMosaicGrid(playerData, activePlayer) {
  let innerHTML='';
  let mosaicArray = playerData[activePlayer][2].mosaicArray
  console.log('array to render grid from: ', playerData[activePlayer][2].mosaicArray);

  for(let i = 0; i < 5; i++) {
    innerHTML += `
    <div class="
    mosaic-row-${i}-container 
    mosaic-row 
    js-mosaic-row-${i}
    player${activePlayer}-mosaic-row-${i}-container 
    player${activePlayer}-mosaic-row 
    player${activePlayer}-js-mosaic-row-${i}
    ">`
    console.log('playerData: ', playerData);
    mosaicArray[i].forEach((element) => {
      let tileIndex = 0;
      innerHTML += `<div class="
      tile
      mosaic-tile tile-${element.tileColor} 
      mosaic-tile-is-filled-${element.isFilled} 
      mosaic-row-${i}-tile-${tileIndex}
      player${activePlayer}-mosaic-row-${i}-tile-${tileIndex}">
      <img class="tile-image tile-image-mosaic" src="../images/tile-${element.tileColor}.png">
     
      </div>`;
      tileIndex++;
      })
    innerHTML += '</div>';
  }
    innerHTML += `</div>`;
    console.log(`.js-player${activePlayer}-mosaic`, 'activePlayer: ', activePlayer);
  document.querySelector(`.js-player${activePlayer}-mosaic`).innerHTML = innerHTML;
}

export function createMosaicArray(mosaicGridRowTemplate, mosaicArray) {
  mosaicArray.forEach((row) => {
    mosaicGridRowTemplate.forEach((tileColor) => {
      let mosaicTile = {isFilled: false, tileColor};
      row.push(mosaicTile);
      })
    mosaicGridRowTemplate.splice(0, 0, mosaicGridRowTemplate[4]);
    mosaicGridRowTemplate.splice(5, 1);
  })
  console.log('mosaic array: ', mosaicArray);
}

//the function has to first move a tile, then score the tile, then move another tile, score, etc. 
export function moveTilesToMosaic(playerData, activePlayer, mosaicArray) {
  let pointsInRound = 0;
  let rowIndex = 0;
  let pickedRowsStatus = playerData[activePlayer][3];
  console.log('playerData[activePlayer][3]', playerData[activePlayer][3])
  pickedRowsStatus.forEach((tileStatus) => {    
    if (tileStatus.isFilled) {
      console.log('tileStatus.isFilled', tileStatus.isFilled)
      let matchingColor = pickedRowsStatus[rowIndex].tileColor;
      console.log(`pickedRowsStatus for row ${rowIndex}`, pickedRowsStatus, 'matchingColor: ', matchingColor);
      let tileIndex = mosaicArray[rowIndex].findIndex(e => e.tileColor === matchingColor);
      console.log('tileIndex:', tileIndex)
      mosaicArray[rowIndex].splice(tileIndex, 1, {isFilled: true, tileColor: matchingColor, wasScored: false})
      let scoringTile =  mosaicArray[rowIndex][tileIndex];
      console.log('scoringTile: ', scoringTile);

      let tileScore = 1;
      //check to the left
      
      let n = 1  //a variable which operates on tileIndex
      while (tileIndex - n >= 0 && mosaicArray[rowIndex][tileIndex-n].isFilled === true) {
        tileScore++;
        n++;
      }
      console.log('Tile score (adjacent tiles left): ', tileScore);

      //check to the right
      
      n = 1  //a variable which operates on tileIndex
      while (tileIndex + n < 5 && mosaicArray[rowIndex][tileIndex + n].isFilled === true) {
        tileScore++;
        n++;
      }
      console.log('Tile score (adjacent tiles right): ', tileScore);

  
      //check above
      
      n = 1  //a variable which operates on tileIndex
      while (rowIndex - n >= 0 && mosaicArray[rowIndex - n][tileIndex].isFilled === true) {
        tileScore++;
        n++;
      }
      console.log('Tile score (adjacent tiles above): ', tileScore);

      //check down
      
      n = 1  //a variable which operates on tileIndex
      while (rowIndex + n < 5 && mosaicArray[rowIndex + n][tileIndex].isFilled === true) {
        tileScore++;
        n++;
      }
      console.log('Tile score (adjacent tiles down): ', tileScore);

      console.log(`Total points for the ${(mosaicArray[rowIndex][tileIndex].tileColor).toUpperCase()} tile in row ${rowIndex}: ${tileScore}  `)
      pointsInRound += tileScore;

      rowIndex++;  
    }
    else {
      console.log(`Row ${rowIndex} not filled yet.`, 'tileStatus.isFilled', tileStatus.isFilled);
      rowIndex++;
    }

  })
  console.log(`Total points this round: ${pointsInRound}`);
  console.log('Updated mosaic Array: ', mosaicArray);
  console.log('pickedRowsStatus: ', playerData[activePlayer][3])
  //pickedRowsStatus remains in playerData[3] to enable tile discard from pickedRows.   

  return pointsInRound;
}

export function checkIfFinalRound(activePlayer, playerData, isFinalRound) {
  console.log('CheckIfColumnComplete(activePlayer: ', activePlayer, 'playerData :', playerData, ')');
  if (isFinalRound) {
    console.log('isFinalRound: ', isFinalRound);
    return isFinalRound
  } else {
    countFilledColumns(activePlayer, playerData);
     if (playerData[activePlayer][5].columns.length > 0) {
      isFinalRound = true;
      console.log('isFinalRound: ', isFinalRound)
      return isFinalRound; 
    }
  console.log('isFinalRound: ', isFinalRound)
  return isFinalRound; 
  }
}

export function countFilledColumns(activePlayer, playerData) {
  console.log(`countFilledColumns(activePlayer, playerData): Counting filled columns for player ${activePlayer}`)
    for (let column = 0; column < 5; column++) {
    let tilesInColumn = 0;
    playerData[activePlayer][2].mosaicArray.forEach((row) => {
      if (row[column].isFilled) {
        tilesInColumn++;
      }
      console.log(`Tiles in column ${column}: ${tilesInColumn}`);

      if (tilesInColumn === 5) {
          if (!playerData[activePlayer][5].columns.includes(column)) {
        playerData[activePlayer][5].columns.push(column);
        console.log(`player ${activePlayer} column ${column} is full`)
        console.log('playerData[activePlayer][5].columns.push(column), column: ', column);
        }
      }
    })
  }
  if (playerData[activePlayer][5].columns.length > 0) {
  }
}

export function countFilledRows(activePlayer, playerData) {
  console.log(`countFilledRows(activePlayer: ${activePlayer})`)
  playerData[activePlayer][2].mosaicArray.
  forEach((row) => {
    let rowIndex = playerData[activePlayer][2].mosaicArray.indexOf(row);
    console.log(`checking if row ${rowIndex} is filled...`)
    let filledTiles = 0;
    row.forEach((tile) => {
      if (tile.isFilled) {
        filledTiles++;
      }
      if (filledTiles === 5 && !playerData[activePlayer][5].rows.includes(rowIndex)) {
        playerData[activePlayer][5].rows.push(rowIndex);
        console.log(`Row ${rowIndex} is filled. Added rowIndex to bonus points`)
      }
    })
    if (filledTiles < 5) {
    console.log(`filledTiles: ${filledTiles}. Row incomplete`)
  }
  } 
)
}

export function countCompleteColors(activePlayer, tileColorClasses, playerData) {
  tileColorClasses.forEach((color) => {
    console.log(`countCompleteColors for color: ${color}`)
    let tilesOfSameColor = 0;
    playerData[activePlayer][2].mosaicArray.
      forEach((row) => {
        row.forEach((tile) => {
          if (tile.tileColor === color && tile.isFilled) {
            tilesOfSameColor++;
          }
          if (tilesOfSameColor === 5 && !playerData[activePlayer][5].colors.includes(color)) {
            playerData[activePlayer][5].colors.push(color);
            console.log(`Player ${activePlayer} has all 5 ${color} tiles in their mosaic`)
            console.log(`Player's bonus points array: `, playerData[activePlayer][5]);
          }
        })
      })
    }) 
  }