const start = new Date();
const fs = require('fs');
const args = process.argv.slice(2);
const [fileName, numberOfPeaksToFind] = [...args];

try{
  const rawData = fs.readFileSync(fileName);
  var mesh = JSON.parse(rawData);
  
}
catch(error){
  throw new Error("First argument has to be a valid JSON file");
}

let elements = mesh.elements;
let values = mesh.values;
let peaks = [];


let maxValue = Number.NEGATIVE_INFINITY;
let maxID = -1;
let maxIndex = -1;
let numberOfMaxims = 0;

while(peaks.length < numberOfPeaksToFind && numberOfMaxims < elements.length - 1){

  if(parseInt(numberOfPeaksToFind) < 0 || isNaN(parseInt(numberOfPeaksToFind)))
    throw new Error("Second argument has to be a positive integer");

  for(let index = 1; index < values.length; index++){
    if(values[index].value > maxValue && !values[index].wasMax){
      maxValue = values[index].value;
      maxID = values[index].element_id;
      maxIndex = index;
    }
  };

  let foundElement = elements[maxID];
  const [node1, node2, node3] = [...foundElement.nodes];
  
  const firstNeighbour = elements.find(element => {
    return (((element.nodes[0] == node1 && element.nodes[1] == node2) ||
             (element.nodes[0] == node1 && element.nodes[2] == node2) ||
             (element.nodes[1] == node1 && element.nodes[2] == node2) ||
             (element.nodes[0] == node2 && element.nodes[1] == node1) ||
             (element.nodes[0] == node2 && element.nodes[2] == node1) ||
             (element.nodes[1] == node2 && element.nodes[2] == node1)) && element.id != maxID);
    });
  let firstNeighbourID = -1;       
  if(typeof(firstNeighbour) == 'undefined'){
  firstNeighbourID = -1;
  }
  else{
    firstNeighbourID = firstNeighbour.id;
  }

  let firstNeighbourElement = -100;
  if(firstNeighbourID != -1){
    firstNeighbourElement = values[firstNeighbourID].value;
  }
  else{
    firstNeighbourElement = Number.NEGATIVE_INFINITY;
  }
  

  const secondNeighbour = elements.find(element => {
    return (((element.nodes[0] == node1 && element.nodes[1] == node3) ||
             (element.nodes[0] == node1 && element.nodes[2] == node3) ||
             (element.nodes[1] == node1 && element.nodes[2] == node3) ||
             (element.nodes[0] == node3 && element.nodes[1] == node1) ||
             (element.nodes[0] == node3 && element.nodes[2] == node1) ||
             (element.nodes[1] == node3 && element.nodes[2] == node1)) && element.id != maxID);
    });
  let secondNeighbourID = -1;
  try{
    secondNeighbourID = secondNeighbour.id;
  }catch(e){
    
  }

  if(typeof(secondNeighbour) == 'undefined'){
    secondNeighbourID = -1;
   }
   else{
    secondNeighbourID = secondNeighbour.id;
   }

  let secondNeighbourElement = -100;
  if(secondNeighbourID != -1){
    secondNeighbourElement = values[secondNeighbourID].value;
  }
  else{
    secondNeighbourElement = Number.NEGATIVE_INFINITY;
  }

  const thirdNeighbour = elements.find(element => {
    return (((element.nodes[0] == node3 && element.nodes[1] == node2) ||
             (element.nodes[0] == node3 && element.nodes[2] == node2) ||
             (element.nodes[1] == node3 && element.nodes[2] == node2) ||
             (element.nodes[0] == node2 && element.nodes[1] == node3) ||
             (element.nodes[0] == node2 && element.nodes[2] == node3) ||
             (element.nodes[1] == node2 && element.nodes[2] == node3)) && element.id != maxID);
    });
  
  
  let thirdNeighbourID = -1;       
  if(typeof(thirdNeighbour) == 'undefined'){
    thirdNeighbourID = -1;
   }
   else{
    thirdNeighbourID = thirdNeighbour.id;
   }

  let thirdNeighbourElement = -100;
  if(thirdNeighbourID != -1){
    thirdNeighbourElement = values[thirdNeighbourID].value;
  }
  else{
    thirdNeighbourElement = Number.NEGATIVE_INFINITY;
  }

  if(maxValue > firstNeighbourElement && maxValue > secondNeighbourElement && maxValue > thirdNeighbourElement ){
      peaks.push({element_id: maxID, value: maxValue});
      values[maxIndex].wasMax = true;
    }

    values[maxIndex].wasMax = true;
    maxValue = Number.NEGATIVE_INFINITY;
    maxID = 0;
    numberOfMaxims ++;
  }


console.log(peaks);

const end = new Date() - start;
fs.writeFile('executionTimeFaster.txt', `Execution time: ${end} milliseconds;\nNumber of peaks found: ${peaks.length};`, (err) => {
  if (err) return console.error(err);
});
  