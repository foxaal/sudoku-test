import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
  },
  click(evt) {
    console.log('new-puzz');
    let puzzName = this.sud.curPuzzleName;
    console.log('  puzzName:', puzzName);
    this.sud.curPuzzleName = 'puzzle3';
  }
});
