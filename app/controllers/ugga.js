import Controller from '@ember/controller';


export default Controller.extend({
  queryParams: ['solve'],
  solve: 333,

  resolve(){
    let self = this;
    let func = function() {
    };
    later(func.bind(self), 5000);
  },
  solveGames() {
    let self = this;
    self.puzzles['solve1'] = {
      a: '111111111',
      b: '111111111',
      c: '111111111',
      d: '111111111',
      e: '111111111',
      f: '111111111',
      g: '111111111',
      h: '111111111',
      i: '111111111',
    }
  }, newGame() {
  },
});
