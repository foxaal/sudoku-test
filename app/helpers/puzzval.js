import { helper } from '@ember/component/helper';

export function puzzval([arg1,arg2]/*, hash*/) {
  let cellId = arg1; // string 'colrow', e.g.,'a1' or 'd5'   
  let sud = arg2;  // sud model
  console.log('puzzval cell:', cellId);
  console.log('  sud:', sud);
  let decode='abcdefghi';
  let colIdx = decode.indexOf(cellId.charAt(0));
  console.log('  colIdx:', colIdx);
  return sud.puzzles.puzzle1[1][colIdx];
}

export default helper(puzzval);
