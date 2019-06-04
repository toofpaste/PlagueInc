import {Continent} from './Continent.js';
export class Disease{
  constructor(selection, lethal, infect, vis){
    this.lethal = lethal;
    this.infect = infect;
    this.vis = vis;
    this.selection = selection;
  }
  //coughing, sneezing, nausuea, fever, diarrhea, vommiting
  //level 1-3;
  addSymptom(){
      let sympt = [
        {
          name: 'Coughing',
          severity: 0,
          transmit: (3),
          resistance: (1),
          visability: (2),
          valu: 0
        },
        {
          name: 'Sneezing',
          severity: 0,
          transmit: (3),
          resistance: (2),
          visability: 3,
          valu: 1
        },
        {
          name: 'Nausuea',
          severity: 0,
          transmit: (1),
          resistance: (1),
          visability: (2),
          valu: 2
        },
        {
          name: 'Vommiting',
          severity: 0,
          transmit: (2),
          resistance: (1),
          visability: (4),
          valu: 3
        },
        {
          name: 'Fever',
          severity: 0,
          transmit: (1),
          resistance: (3),
          visability: (1),
          valu: 4
        },
        {
          name: 'ExplosivePoops',
          severity: 0,
          transmit: (2),
          resistance: (3),
          visability: (2),
          valu: 5
        }
      ];

      return sympt[this.selection];
  }
  update(arr){
    arr.severity++;
    arr.transmit++;
    arr.resistance++;
    arr.visability++;
    return arr;
  }
  isActive(dise1){
    if(dise1.severity > 0){
      return true;
    }else return false;
  }
  addTraits(dise1){
    if(this.isActive(dise1)){
      for(var k = 0; k < dise1.resistance; k++){
      this.lethal++;
      }
      for(var p = 0; p < dise1.transmit; p++){
      this.infect++;
      }
      for(var o = 0; o < dise1.visability; o++){
      this.vis++;
      }

    }
    var arr = [this.lethal, this.infect, this.vis];
    return arr;

  }

}
