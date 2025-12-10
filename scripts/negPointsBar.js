export function renderNegPointBar(playerData, activePlayer) {
  console.log('starting renderNegPointBar...');
let innerHTML = ''
playerData[activePlayer][1].negPointTiles.forEach((tile) => {
    innerHTML += `<div class="
    tile
    neg-point-tile 
    tile-${tile.tileColor}
    player${activePlayer}-neg-point-tile 
    player${activePlayer}-tile-${tile.tileColor}
    ">
      <div class="neg-point-indicator neg-point-indicator-${playerData[activePlayer][1].negPointTiles.indexOf(tile)}"></div>
    <img class="tile-image" src="../images/tile-${tile.tileColor}.png"></div>
    </div>`;
  })
  document.querySelector(`.js-player${activePlayer}-neg-point-container`).innerHTML = innerHTML;
  console.log('negPointTiles: ', playerData[activePlayer][1].negPointTiles, 'activePlayer: ', activePlayer);

  renderNegPointTileIndicators();
}

function renderNegPointTileIndicators (){
  document.querySelectorAll('.neg-point-indicator').forEach((element) => {
    if (element.classList.contains('neg-point-indicator-0') || element.classList.contains('neg-point-indicator-1')) {
      element.innerHTML = -1;
    }
    else if (element.classList.contains('neg-point-indicator-2') 
      || element.classList.contains('neg-point-indicator-3') 
      || element.classList.contains('neg-point-indicator-4')) {
      element.innerHTML = -2;
    }
    else if (element.classList.contains('neg-point-indicator-5') 
      || element.classList.contains('neg-point-indicator-6')) {
      element.innerHTML = -3;
    }
  })
}

export function generateBlankNegPointTiles(negPointTiles) {
  console.log('generateBlankNegPointTiles(negPointTiles')
  for (let i=0; i<7; i++) {
    const negPointTile = {
      id: `neg${i}`,
      tileColor: 'blank'
    }
    negPointTiles.negPointTiles.push(negPointTile);
  }
};

export function countNegPoints(playerData, activePlayer) {
  let negTileCount = 0;
  let negPoints = 0;
  let negPointsTiles = playerData[activePlayer][1].negPointTiles;
  negPointsTiles.forEach((tile) => {
    if (tile.tileColor !== 'blank') {
      if (negPointsTiles.indexOf(tile) <= 1) {
      negPoints--;
      console.log(`NegTileIndex: ${negPointsTiles.indexOf(tile)}, negPoints: ${negPoints}`);
    } 
    else if (negPointsTiles.indexOf(tile) > 1 
    || 
    negPointsTiles.indexOf(tile) <= 4) {
    negPoints -= 2;
    console.log(`NegTileIndex: ${negPointsTiles.indexOf(tile)}, negPoints: ${negPoints}`);

    }
    else if (negPointsTiles.indexOf(tile) > 4 
    || 
    negPointsTiles.indexOf(tile) <= 6) {
    negPoints -= 3;
    console.log(`NegTileIndex: ${negPointsTiles.indexOf(tile)}, negPoints: ${negPoints}`);
    }
    else if (negPointsTiles.indexOf(tile) > 6) {
    console.log(`Negative point tiles count: ${negTileCount}. Negative points: ${negPoints}`)
    console.log(`NegTileIndex: ${negPointsTiles.indexOf(tile)}, negPoints: ${negPoints}`)
    }
    }
  })
  console.log(`Negative point tiles count: ${negTileCount}. Negative points: ${negPoints}`)
  return negPoints;
}