import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';



export default Component.extend({
  init() {
    this._super(...arguments);
  },
  change(evt) {
    console.log('puzzval-in:\n  sud before', this.sud);
    console.log('  change: evt:', this.cellId, evt.target.value);
    this.sud.puzzles.puzzle1[1]='999999999';
    //this.sud[evt.currentTarget.id] = evt.target.value;
    //console.log('  sud after', this.sud);
  }
});
