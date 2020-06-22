// Varibale used to store initial time of execution
const start = new Date();

// fs is a package used for file handling(read and write in this case)
const fs = require('fs');

// args stores the command line arguments
const args = process.argv.slice(2);
const [fileName, numberOfPeaksToFind] = [...args];

/*
* Initialization of maximum value, maximum value ID,
* maximum value index in the array, number of maximum values,
* and the peaks array
*/
let maxValue = Number.NEGATIVE_INFINITY;
let maxID = -1;
let maxIndex = -1;
let numberOfMaxValues = 0;
let peaks = [];

/*
* Reading the data from JSON file and storing
* it in 2 separate arrays, one for elements,
* and the other one for their values
*/
const mesh = readDataFromJson();
let elements = mesh.elements;
let values = mesh.values;

/*
* Description: Function used to read data from JSON file
* Parameters : none
* Return type: object
*/
function readDataFromJson(){
  try{
    const rawData = fs.readFileSync(fileName);
    const parsedData = JSON.parse(rawData);
    return parsedData;
  }
  catch(error){
    throw new Error("First argument has to be a valid JSON file");
  }
}
/*
* Description: Function used to find an element neighbour if it exists
* Parameters : int, int, array, int
* Return type: object or undefined
*/
function findNeighbourNode(node1, node2, elements, id){
  const foundNeighbour = elements.find(element => {
    return (((element.nodes[0] == node1 && element.nodes[1] == node2) ||
             (element.nodes[0] == node1 && element.nodes[2] == node2) ||
             (element.nodes[1] == node1 && element.nodes[2] == node2) ||
             (element.nodes[0] == node2 && element.nodes[1] == node1) ||
             (element.nodes[0] == node2 && element.nodes[2] == node1) ||
             (element.nodes[1] == node2 && element.nodes[2] == node1)) && element.id != id);
    });
    
  return foundNeighbour;
}

/*
* Description: Function used to find the value of a specific element
* Parameters : object
* Return type: int
*/
function getElementValue(element){
  let elementID = -1;
  let elementValue = Number.NEGATIVE_INFINITY;

  if(typeof(element) !== 'undefined'){
    elementID = element.id;
   }

  if(elementID != -1){
    elementValue = values[elementID].value;
  }

  return elementValue;
}

/*
* Description: Function used to find all the peaks
* Parameters : int
* Return type: array
*/
function getPeakElements(numberOfPeaksToFind){
  
  if(parseInt(numberOfPeaksToFind) < 0 || isNaN(parseInt(numberOfPeaksToFind)))
    throw new Error("Second argument has to be a positive integer");

  while(peaks.length < numberOfPeaksToFind && numberOfMaxValues < elements.length - 1){
    // Find current maximum value
    for(let index = 1; index < values.length; index++){
      if(values[index].value > maxValue && !values[index].wasMax){
        maxValue = values[index].value;
        maxID = values[index].element_id;
        maxIndex = index;
      }
    };
    
    // Get maximum value element
    let foundElement = elements[maxID];
    // Get element nodes
    const [node1, node2, node3] = [...foundElement.nodes];
  
    // Get all neighbours
    const firstNeighbour  = findNeighbourNode(node1, node2, elements, maxID);
    const secondNeighbour = findNeighbourNode(node1, node3, elements, maxID);
    const thirdNeighbour  = findNeighbourNode(node2, node3, elements, maxID);
    
    // Get neighbour elements values
    const firstNeighbourElementValue  = getElementValue(firstNeighbour);
    const secondNeighbourElementValue = getElementValue(secondNeighbour);
    const thirdNeighbourElementValue  = getElementValue(thirdNeighbour);
   
    if(maxValue > firstNeighbourElementValue && maxValue > secondNeighbourElementValue && maxValue > thirdNeighbourElementValue ){
        peaks.push({element_id: maxID, value: maxValue});
        values[maxIndex].wasMax = true;
    }
      
    values[maxIndex].wasMax = true;
    maxValue = Number.NEGATIVE_INFINITY;
    maxID = 0;
    numberOfMaxValues ++;
  }
  if(peaks.length > 0) console.log(peaks);
}

getPeakElements(numberOfPeaksToFind);

// Variable used to store execution time in milliseconds
const end = new Date() - start;

// Output execution time and number of peaks in text file
fs.writeFile('executionTime.txt', `Execution time: ${end} milliseconds;\nNumber of peaks found: ${peaks.length};`, (err) => {
  if (err) return console.error(err);
});