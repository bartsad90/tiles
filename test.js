let workshop = [
  "blank", 
  "blank", 
  "blank", 
  "blank" 
]

const tileIsBlank = (tile) => (tile === 'blank');



console.log(workshop);

workshop.every(tileIsBlank);

console.log(workshop.every(tileIsBlank));