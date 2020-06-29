# maxViewSpotFinder

## Description:

**This algorithm find all peak elements in a mesh like map and outputs the first `n` peaks in descending order.**

The way this algorithm works is as follows:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.Find the current maximum element and the coresponding nodes<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.Find all of his neighbours(elements which have at least one common node)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.For each neighbour, check if one of them has a greater value that our current maximum<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.If there are no neighbours with value greater than current maximum, then our current maximum is a peak<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.Repeat until you find `n` peaks, where `n` is a command line argument corresponding to the number of peaks to be found or until all the peak have been found<br/>

**Assuming we have negative values for height(depth), e.g *Holland, Denmark*, negativea peaks are taken in consideration.**

## How to run the program

To run the program type **`node fileName n`**, where **`fileName`** is a **JSON** file and **`n`** the number of peaks to be found