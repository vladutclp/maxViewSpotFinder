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
let lastMaxValue = Number.NEGATIVE_INFINITY;
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
* Description: Function used to find all neighbours of an element(elements that have a common node)
* Parameters : int, int, int, array, int
* Return type: object or undefined
*/
function findAllNeighbours(node1, node2, node3, elements, id){
  const allNeighbours = elements.filter(element => {
    return (((element.nodes[0] == node1) || (element.nodes[1] == node1) || (element.nodes[2] == node1)  ||
             (element.nodes[0] == node2) || (element.nodes[1] == node2) || (element.nodes[2] == node2)  ||
             (element.nodes[0] == node3) || (element.nodes[1] == node3) || (element.nodes[2] == node3)) && element.id != id);
  });
    
  return allNeighbours;
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
    // Get maximum element nodes
    const [node1, node2, node3] = [...foundElement.nodes];
  
    // Get all neighbours
    const allNeighbours  = findAllNeighbours(node1, node2, node3,elements, maxID);

    // Returns undefined if there are no neighbours with a greater value than the current maximum value
    const greaterThanCurrentMax = allNeighbours.find(element =>{
      return (values[element.id].value > maxValue);
    });
    
    // Always keep a record on the last maximum value so we avoid plateau values
    if(peaks.length > 0){
      lastMaxValue = peaks[peaks.length - 1];
    }
    if(greaterThanCurrentMax === undefined && maxValue !== lastMaxValue.value){
      peaks.push({element_id: maxID, value: maxValue});
      values[maxIndex].wasMax = true;
      lastMaxValue = maxValue;
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