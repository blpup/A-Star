const fs = require("fs");

let start;
let end;

function AStar(grid, start, end) {
  //We make an open and close set array
  let open = new Array(); // Keeps track of nodes to be looped through
  let close = new Array(); //Keeps track of nodes that are the lowest

  open.push(start); //Push start node to open array
  open[0].g = 0; //init
  open[0].f = h(open[0], end); //inti

  //Loop until the open array is empty
  while (open.length > 0) {
    let current = lowestValue(open); //get the lowest node in the open array
    //If the current node is the end then we found it and reconstruct the path to get there
    if (current.x == end.x && current.y == end.y) {
      return reconstructPath(close, current); //Node found!;
    }
    //Find the current element in the open array and remove it
    open = open.filter((el) => !(el.x == current.x && el.y == current.y));
    //Get the neighbors of the current element
    let neighbors = getNeighbors(current, grid);
    //For each neighbor
    //Get the g score and check if it is less than the neighbors
    //If it's less push the current to the possible paths
    //check neighbors
    neighbors.forEach((neighbor) => {
      let gScore = current.g + getDistance(current, neighbor);
      if (gScore < neighbor.g) {
        if (!isInSet(current, close)) {
          close.push(current);
        } else {
          close = replaceValues(neighbor, close);
        }

        neighbor.g = gScore;
        neighbor.f = gScore + h(neighbor, end);
        open = replaceValues(neighbor, open);
        if (!isInSet(neighbor, open)) {
          open.push(neighbor);
        }
      }
    });
  }
  return "Not Found";
}

//Check if the item is in the array
function isInSet(item, arr) {
  if (arr.length === 0) return false;
  return arr.find((element) => item.x == element.x && item.y == element.y);
}

//Replace any f and g values and return the mutated array
function replaceValues(item, arr) {
  return arr.map((inner) => {
    if (inner.x == item.x && inner.y === item.y) {
      inner.f = item.f;
      inner.g = item.g;
    }
    return inner;
  });
}

//Get the neighbors of a particular node
function getNeighbors(item, grid) {
  let tempArr = new Array();
  const y = item.x;
  const x = item.y;
  if (grid?.[x]?.[y - 1] && grid[x][y - 1].w != 1) {
    tempArr.push(grid[x][y - 1]);
  }
  if (grid?.[x]?.[y + 1] && grid[x][y + 1].w != 1) {
    tempArr.push(grid[x][y + 1]);
  }
  if (grid?.[x + 1]?.[y] && grid[x + 1][y].w != 1) {
    tempArr.push(grid[x + 1][y]);
  }
  if (grid?.[x - 1]?.[y] && grid[x - 1][y].w != 1) {
    tempArr.push(grid[x - 1][y]);
  }
  return tempArr;
}

//Calculate the distance between two given nodes
function getDistance(p1, p2) {
  let { x: x1, y: y1 } = p1;
  let { x: x2, y: y2 } = p2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//Get the lowest f value of a set
function lowestValue(set) {
  return set.reduce((prev, curr) => (prev.f < curr.f ? prev : curr));
}


//Reconstruct the path choosing a random path out of the potential paths
function reconstructPath(cameFrom, current) {
  let path = new Array();
  path.push(current);
  cameFrom = cameFrom.reverse();
  let currentG = current.g;
  let prevItem = current;
  cameFrom.forEach((item) => {
    if (currentG != item.g && getDistance(item, prevItem) < 2) {
      path.push(item);
      currentG = item.g;
      prevItem = item;
    }
  });

  return path;
}

//Manhattan distance; Going in an L shape
function h(p1, p2) {
  let { x: x1, y: y1 } = p1;
  let { x: x2, y: y2 } = p2;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

//Make a 2D array out of the file
function MakeGrid() {
  const readFileLines = (filename) =>
    fs.readFileSync(filename).toString("UTF8").split("\r\n");
  let arr = readFileLines("./grid.txt");
  arr = arr.map((item) => item.split(","));
  arr = storeValues(arr);
  return arr;
}

//Make each array item into an object containing information about it.
function storeValues(arr) {
  let detailedArr = new Array();
  for (let i = 0; i < arr.length; i++) {
    let innerArr = new Array();
    for (let k = 0; k < arr[i].length; k++) {
      if (arr[i][k] == "1") {
        //Is start node
        innerArr.push({ f: Infinity, g: Infinity, h: 0, x: k, y: i, w: 0 });
        start = { f: Infinity, g: Infinity, h: 0, x: k, y: i, w: 0 };
      } else if (arr[i][k] == "0") {
        //Is empty node
        innerArr.push({ f: Infinity, g: Infinity, h: 0, x: k, y: i, w: 0 });
      } else if (arr[i][k] == "3") {
        //Is wall
        innerArr.push({ f: Infinity, g: Infinity, h: 0, x: k, y: i, w: 1 });
      } else if (arr[i][k] == "2") {
        //Is ending node
        innerArr.push({ f: Infinity, g: Infinity, h: 0, x: k, y: i, w: 0 });
        end = { f: Infinity, g: Infinity, h: 0, x: k, y: i, w: 0 };
      }
    }
    detailedArr.push(innerArr);
  }
  return detailedArr;
}

let grid = MakeGrid();
console.log(AStar(grid, start, end));
