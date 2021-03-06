# maxViewSpotFinder

## Description:

**This algorithm finds all peak elements in a mesh like map and outputs the first `n` peaks in descending order on the console.**

The way this algorithm works is as follows:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.Find the current maximum element and the coresponding nodes<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.Find all of his neighbours(elements which have at least one common node)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.For each neighbour, check if one of them has a greater value that our current maximum<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.If there are no neighbours with value greater than current maximum, then our current maximum is a peak<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.Repeat until you find `n` peaks, where `n` is a command line argument corresponding to the number of peaks to be found or until all the peak have been found<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.When the current maximum is a negative number, the program will break since we are only looking for positive value peaks(Assuming this is a walking tour as mentioned in the assignment description)<br/>


## How to run the program

To run the program type **`node maxViewSpot.js fileName n`**, where **`fileName`** is a **JSON** file and **`n`** the number of peaks to be found