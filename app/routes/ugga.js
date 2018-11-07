import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';

export default Route.extend({
  model() {
    let sud = {
      answer: null,
      curPuzzleName: 'puzzle1',
      blksPoss: {},
      rowsPoss: {},
      colsPoss: {},
      solutions: {},
      puzzles: { 
	puzzle1: {
	  1: 'XXX15XX7X',
	  2: '1X6XXX82X',
	  3: '3XX86XX4X',
	  4: '9XX4XX567',
	  5: 'XX47X83XX',
	  6: '732XX6XX4',
	  7: 'X4XX81XX9',
	  8: 'X17XXX2X8',
	  9: 'X5XX37XXX',
	},
	puzzle2: {
	  1: 'X21XXX543',
	  2: 'X6X51X872',
	  3: '87X4X2X61',
	  4: 'XX4283X1X',
	  5: 'XXX6453X9',
	  6: '6X8971XX5',
	  7: '3X9X271X6',
	  8: '25X194738',
	  9: '1XXX5XX9X',
	},
	puzzle3: {
	  1: 'XXX7X8XXX',
	  2: 'X6XXX98XX',
	  3: 'XXX43XXXX',
	  4: 'XXXXXX6XX',
	  5: 'X1XXX5X89',
	  6: 'X38XXX4XX',
	  7: '34X8X71X6',
	  8: 'X56X9X73X',
	  9: '1XXX5XX9X',
	},
	puzzle4: {
	  1: '53XX7XXXX',
	  2: '6XX195XXX',
	  3: 'X98XXXX6X',
	  4: '8XXX6XXX3',
	  5: '4XX8X3XX1',
	  6: '7XXX2XXX6',
	  7: 'X6XXXX28X',
	  8: 'XXX419XX5',
	  9: 'XXXX8XX79',
	},
	puzzle5: {
	  1: 'XXXXXXXX7',
	  2: 'X486X2159',
	  3: 'X6XXXXX8X',
	  4: 'X9X8X4X3X',
	  5: 'XXXX2XXXX',
	  6: 'X2X9X5X6X',
	  7: 'X7XXXXX9X',
	  8: '1832X754X',
	  9: '2XXXXXXXX',
	},
      }
    };
    return new RSVP.Promise(function(resolve) {
      let func = function() {
	    //let str1Row = sud.puzzles[sud.curPuzzleName][1];
	    //for (const ch of str1) {
	      //if (ch === 'X') {
	      //} else {
		//if 
	      //}
	//}
	
	/*  i r s    s      s
	    0 1 0,3  2 0,3  3 0,3  i%3*3,i%3*3+3 
	    1 1 3,6  2 3,6  3 3,6
	    2 1 6,9  2 6,9  3 6,9 
	    3 4        .
	    4 4        .
	    5 4        .
	    6 7
	    7 7
	    8 7
	*/
	
	// Input arr, output arr of numbers between 1-9 not in arr
	let eliminate = function(str) {
	  let ret = '';
	  // Iterate over possible numerals in str
	  for (let i = 1; i <= 9; i++) {
	    // Stringify i. Note, this is diff from *new* String(i)!
	    let istr = String(i);
	    // Build up numerals in ret which are not included in str.
	    if (!str.includes(istr)) ret = ret + istr;
	  }
	  // Return numerals not in str
	  return ret;
	};
	let getCol = function(idx) {
	  if (idx < 0 || idx > 8) {
	    console.log('getRow: ERROR: idx not within 0-8', idx);
	    return;
	  }
	  let ret = null;
	  for (let i = 0; i < 9; i++) {
	    let row = sud.puzzles[sud.curPuzzleName][i+1];
	    ret = ret + row[idx];
	  }
	  return ret;
	};
	let getRow = function(idx) {
	  if (idx < 1 || idx > 9) {
	    console.log('getRow: ERROR: idx not within 1-9', idx);
	    return;
	  }
	  return sud.puzzles[sud.curPuzzleName][idx];
	};
	let getBlksPoss = function() {
	  let ret = 'blank';
	  for (let i = 0; i < 9; i++) {
	    let r,s1,s2;
	    s1 = (i%3)*3;
	    s2 = s1+3;
	    if (i < 3) {
	      r = 1;
	    } else if (i < 6) {
	      r = 4;
	    } else {
	      r = 7;
	    }
	    let str1 = sud.puzzles[sud.curPuzzleName][r].substring(s1,s2);
	    let str2 = sud.puzzles[sud.curPuzzleName][r+1].substring(s1,s2);
	    let str3 = sud.puzzles[sud.curPuzzleName][r+2].substring(s1,s2);
	    sud.blksPoss[i+1] = eliminate(str1+str2+str3); 
	  }
	};
	let getRowsPoss = function() {
	  for (let i = 0; i < 9; i++) {
	    let row = sud.puzzles[sud.curPuzzleName][i+1];
	    sud.rowsPoss[i+1] = eliminate(row);
	  }
	};
	let getColsPoss = function() {
	  for (let i = 0; i < 9; i++) {
	    sud.colsPoss[i+1] = eliminate(getCol(i));
	  }
	};
	let traverseEmptyCells = function(funkyfunc) {
	  let count = 0;
	  for (let i = 0; i < 9; i++) {
	    let row = sud.puzzles[sud.curPuzzleName][i+1];
	    for (let j = 0; j < 9; j++) {
	      if (row[j] === 'X') {
		count = count + funkyfunc(i,j);
	      }
	    }
	  }
	  return count;
	};
	let setCell = function(i,j,chr) {
	  let row = getRow(i+1);
	  return row.substr(0,j) + chr + row.substr(j+1);
	};
	let setSolvedCell = function(i,j) {
	  let rowPoss = sud.rowsPoss[i+1];
	  let colPoss = sud.colsPoss[j+1];
	  let blkPoss = sud.blksPoss[(i%3)*(j%3)+1];
	  let cellPoss = eliminate(rowPoss+colPoss+blkPoss);
	  if (cellPoss.length === 1) {
	    setCell(i, j, cellPoss);
	    return 1;
	  }
	  return 0;
	};
	let loadPossBlkRowCol = function() {
	  getColsPoss();
	  getRowsPoss();
	  getBlksPoss();
	  let count = traverseEmptyCells(setSolvedCell);
	  if (count)
	    loadPossBlkRowCol();
	};
	loadPossBlkRowCol();

	//console.log('func:', str);
	sud.answer = sud.answer+'-'+str;
	resolve(sud);
      };
      //setTimeout(func, 3000);
      func();
    });
  },
  /*
  model() {
    return {
      puzzle1: {
	a: 'XXX15XX7X',
	b: '1X6XXX82X',
	c: '3XX86XX4X',
	d: '9XX4XX567',
	e: 'XX47X83XX',
	f: '732XX6XX4',
	g: 'X4XX81XX9',
	h: 'X17XXX2X8',
	i: 'X5XX37XXX',
      },
      puzzle2: {
	a: 'X21XXX543',
	b: 'X6X51X872',
	c: '87X4X2X61',
	d: 'XX4283X1X',
	e: 'XXX6453X9',
	f: '6X8971XX5',
	g: '3X9X271X6',
	h: '25X194738',
	i: '1XXX5XX9X',
      },
      puzzle3: {
	a: 'XXX7X8XXX',
	b: 'X6XXX98XX',
	c: 'XXX43XXXX',
	d: 'XXXXXX6XX',
	e: 'X1XXX5X89',
	f: 'X38XXX4XX',
	g: '34X8X71X6',
	h: 'X56X9X73X',
	i: '1XXX5XX9X',
      },
      puzzle4: {
	a: '53XX7XXXX',
	b: '6XX195XXX',
	c: 'X98XXXX6X',
	d: '8XXX6XXX3',
	e: '4XX8X3XX1',
	f: '7XXX2XXX6',
	g: 'X6XXXX28X',
	h: 'XXX419XX5',
	i: 'XXXX8XX79',
      },
      puzzle5: {
	a: 'XXXXXXXX7',
	b: 'X486X2159',
	c: 'X6XXXXX8X',
	d: 'X9X8X4X3X',
	e: 'XXXX2XXXX',
	f: 'X2X9X5X6X',
	g: 'X7XXXXX9X',
	h: '1832X754X',
	i: '2XXXXXXXX',
      },
    }
  },
  */
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('sud', model);
    //controller.solveGames();
  },
});
