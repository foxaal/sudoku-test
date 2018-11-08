import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';

export default Route.extend({
  model() {
    let sud = {
      answer: null,
      curPuzzleName: 'puzzle3',
      blksPoss: {},
      rowsPoss: {},
      colsPoss: {},
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
    return new RSVP.Promise((resolve) => {
      let func = () => {
	// Input any number of strings containing [1-9|X] and find single
	// occurences.  Like a histogram.
	let uniques = function(...strs) {
	  let str = '';
	  let acc = [0,0,0,0,0,0,0,0,0];
	  for (let str of strs) {
	    for (let chr of str) {
	      if (chr !== 'X') {
		let val = Number(chr);
		acc[val-1]++;
	      }
	    }
	  }
	  acc.forEach(function(val, idx) {
	    if (val === 3) str = str + String(idx+1);
	  })
	  //console.log('uniques:', str);
	  return str;
	};

	// Input str, output str of numerals between 1-9 not in str
	let eliminate = (str) => {
	  let ret = '';
	  // Iterate over possible values in str which are numerals 1-9
	  for (let i = 1; i <= 9; i++) {
	    // Stringify i. Note, this is diff from *new* String(i)!
	    let istr = String(i);
	    // Build up numerals in ret which are not included in str.
	    if (!str.includes(istr)) ret = ret + istr;
	  }
	  // Return numerals not in str
	  return ret;
	};

	let getCol = (idx) => {
	  if (idx < 0 || idx > 8) {
	    console.log('getRow: ERROR: idx not within 0-8', idx);
	    return;
	  }
	  let ret = null;
	  for (let j = 0; j < 9; j++) {
	    let row = sud.puzzles[sud.curPuzzleName][j+1];
	    ret = ret + row[idx];
	  }
	  return ret;
	};

	let getRow = (idx) => {
	  if (idx < 1 || idx > 9) {
	    console.log('getRow: ERROR: idx not within 1-9', idx);
	    return;
	  }
	  return sud.puzzles[sud.curPuzzleName][idx];
	};

	let copyPuzzleToSolution = (puzzleName) => {
	  let solveName = puzzleName.replace('puzzle', 'solve');
	  let sol = {};
	  for (let j = 0; j < 9; j++) {
	    let row = sud.puzzles[sud.curPuzzleName][j+1];
	    sol[j+1] = row;
	  }
	  sud.puzzles[solveName] = sol;
	  sud.curPuzzleName = solveName;
	};

	// i is across, j is down
	let traverseEmptyCells = (func) => {
	  let count = 0, xcount = 0, curcount = 0;
	  for (let j = 0; j < 9; j++) {
	    let row = sud.puzzles[sud.curPuzzleName][j+1];
	    for (let i = 0; i < 9; i++) {
	      if (row[i] === 'X') {
		xcount++;
		curcount = func(i,j);
		if (curcount) {
		  count++;
		  break;
		}
	      }
	    }
	  }
	  return {count, xcount, curcount};
	};

	/*  i  row | s1,s2 (string indices for getting substring)
	    -------------------------------------------------------------
	    0    1 | 0,3  2 | 0,3  3 | 0,3     
	    1    1 | 3,6  2 | 3,6  3 | 3,6
	    2    1 | 6,9  2 | 6,9  3 | 6,9 
	    3    4             .
	    4    4             .
	    5    4             .
	    6    7
	    7    7
	    8    7
	    -------------------------------------------------------------
	    row-frmla: Math.floor(i/3)*3+1  str-idx-frmla: i%3*3, i%3*3+3 */
	let getBlksPoss = () => {
	  let ret = 'blank';
	  for (let i = 0; i < 9; i++) {
	    let r,s1,s2;
	    s1 = (i%3)*3;
	    s2 = s1+3;
	    r = Math.floor(i/3)*3+1;
	    let str1 = sud.puzzles[sud.curPuzzleName][r].substring(s1,s2);
	    let str2 = sud.puzzles[sud.curPuzzleName][r+1].substring(s1,s2);
	    let str3 = sud.puzzles[sud.curPuzzleName][r+2].substring(s1,s2);
	    sud.blksPoss[i+1] = eliminate(str1+str2+str3); 
	  }
	};

	let getRowsPoss = () => {
	  for (let j = 0; j < 9; j++) {
	    let row = sud.puzzles[sud.curPuzzleName][j+1];
	    sud.rowsPoss[j+1] = eliminate(row);
	  }
	};

	let getColsPoss = () => {
	  for (let i = 0; i < 9; i++) {
	    sud.colsPoss[i+1] = eliminate(getCol(i));
	  }
	};

	let setCell = (i,j,chr) => {
	  let row = getRow(j+1);
	  //console.log('setCell bef:', row);	  
	  let newStr = row.substr(0,i) + chr + row.substr(i+1);
	  sud.puzzles[sud.curPuzzleName][j+1] = newStr;
	  //console.log('setCell aft:', getRow(j+1));	  
	};

	let getCell = (i,j) => {
	  let row = getRow(j+1);
	  let val = row[i];
	  return val;
	};

	let setSolvedCell = (i,j) => {
	  let rowPoss = sud.rowsPoss[j+1];
	  let colPoss = sud.colsPoss[i+1];
	  let blkIdx = Math.floor(i/3) + (Math.floor(j/3)*3) + 1; 
	  let blkPoss = sud.blksPoss[blkIdx];
	  let totalPoss = uniques(rowPoss, colPoss, blkPoss);
	  if (totalPoss.length === 1) {
	    console.log('Solved:'
			, i+1, j+1, 'blkidx:', blkIdx, 'val:', getCell(i,j)
			,'\n  rowPoss', rowPoss
			,'\n  colPoss', colPoss
			,'\n  blkPoss', blkPoss
			,'\n  totalPoss', totalPoss);
	    setCell(i, j, totalPoss);
	    return 1;
	  }
	  return 0;
	};
	/*
	let checkSolution = () => {
	  ret = true;
	  let sol = sud.puzzles[sud.curPuzzleName];
	  // check for X
	  
	  return ret;
	};
	*/
	let loadPossBlkRowCol = () => {
	  getColsPoss();
	  getRowsPoss();
	  getBlksPoss();
	  let count = traverseEmptyCells(setSolvedCell);
	  if (count.count) loadPossBlkRowCol();
	  sud.answer = count.count+'-'+count.xcount+'-'+count.curcount;
	  console.log('loadPoss', sud);
	  //let good = checkSolution();
	  //if (!good) brutish();
	};

	copyPuzzleToSolution(sud.curPuzzleName);
	loadPossBlkRowCol();

	resolve(sud);
      };
      //setTimeout(func, 3000);
      func();
    });
  },


  setupController(controller, model) {
    this._super(...arguments);
    controller.set('sud', model);
  },
});
