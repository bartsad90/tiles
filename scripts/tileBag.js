import { workshopArray } from "./workshops.js";
import { workshopCount, refillTileBag } from "../azul.js";

export let tileBag = [];

export const allTileColors = [
  "blue",
  "white",
  "black",
  "red",
  "yellow",
  "first-player",
];

export function createNewTileBag() {
  for (let i = 0; i <= 99; i++) {
    let tile = {};
    if (i >= 0 && i <= 19) {
      tile = {
        tileId: i,
        tileColor: "blue",
      };
    } else if (i >= 20 && i <= 39) {
      tile = {
        tileId: i,
        tileColor: "yellow",
      };
    } else if (i >= 40 && i <= 59) {
      tile = {
        tileId: i,
        tileColor: "red",
      };
    } else if (i >= 60 && i <= 79) {
      tile = {
        tileId: i,
        tileColor: "black",
      };
    } else if (i >= 80 && i <= 99) {
      tile = {
        tileId: i,
        tileColor: "white",
      };
    }
    tileBag.push(tile);
  }

  console.log("New tile bag created");
}

export let currentWorkshop = 0;
//split pickTileFromBag into two functions:

// pickTileFromBag() and putTileIntoWorkshop(currentWorkshop) which ends with currentWorkshop = 0;
export function pickTileFromBag(workshopCount) {
  let randomTileIndex = Math.ceil(Math.random() * 100 - 1);

  console.log("pickTileFromBag starts. currentWorkshop: ", currentWorkshop);

  if (tileBag[randomTileIndex]) {
    while (randomTileIndex <= 100) {
      let outCount = checkOutCount();
      refillTileBag(outCount);

      if (currentWorkshop > workshopCount) {
        currentWorkshop = 0;
        console.log(
          "currentWorkshop exceeded 4. Setting currentWorkshop to: ",
          currentWorkshop
        );
      }

      if (workshopArray[currentWorkshop].length >= 4) {
        console.log(
          `Filled workshop ${currentWorkshop} with ${
            workshopArray[currentWorkshop].slice().length
          } tiles: `,
          workshopArray[currentWorkshop].slice()
        );
        currentWorkshop++;
        console.log("currentWorkshop increased by 1:", currentWorkshop);
        console.log(
          `Workshop ${
            currentWorkshop - 1
          } full. Switching to ${currentWorkshop}`
        );
      }

      if (currentWorkshop > workshopCount) {
        currentWorkshop = 0;
        console.log(
          "currentWorkshop exceeded 4. Setting currentWorkshop to: ",
          currentWorkshop
        );
      }

      if (randomTileIndex === 100) {
        randomTileIndex = 0;
      } else {
        if (tileBag[randomTileIndex] === "out") {
          randomTileIndex++;
        } else {
          console.log("currentWorkshop: ", currentWorkshop);
          workshopArray[currentWorkshop].push(tileBag[randomTileIndex]);
          tileBag.splice(randomTileIndex, 1, "out");
          console.log(
            `object id ${randomTileIndex} found and put from tileBag to workshop ${currentWorkshop}`
          );
          console.log(
            `Workshop array after tile ${randomTileIndex} push: `,
            workshopArray.slice()
          );
          break;
        }
      }
    }
  } else {
    console.log("random tile: ", tileBag[randomNum]);
  }
}

export function fillWorkshops(workshopCount) {
  for (let i = 0; i < workshopCount * 4; i++) {
    pickTileFromBag();
  }
  currentWorkshop = 0;
  console.log(`All ${workshopCount} workshops filled.`);
  console.log(`Tile bag status:`, tileBag);
  // console.log(`currentWorkshop reset to: `, currentWorkshop);
}

export function checkOutCount() {
  let outCount = 0;
  tileBag.forEach((i) => {
    if (i === "out") {
      outCount++;
    }
    return outCount;
  });

  if (outCount === workshopArray.length * 4) {
    console.log(
      `${
        workshopArray.length * 4
      } tiles out of the bag. Everything is spick and span`
    );
  } else {
    console.log(`${outCount} tiles out of the bag. Something is not right`);
    return outCount;
  }
}
