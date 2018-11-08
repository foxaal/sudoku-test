import { helper } from '@ember/component/helper';

export function puzzval([arg1,arg2]/*, hash*/) {
  let cellId = arg1; // string 'colrow', e.g.,'a1' or 'd5'   
  let sud = arg2;
  let decode='abcdefghi';
  let colIdx = decode.indexOf(cellId.charAt(0));
  let rowIdx = cellId.charAt(1);
  return sud.puzzles.puzzle1[rowIdx][colIdx];
}

export default helper(puzzval);
