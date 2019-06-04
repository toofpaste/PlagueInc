import { Disease } from './Disease.js';
import { throwStatement } from '@babel/types';
export class Continent {
  constructor(alive, dead, healthy, infected, name) {
    this.world = 74999239;
    this.alive = alive;
    this.dead = dead;
    this.healthy = healthy;
    this.infected = infected;
    this.vax = false;
    this.waterPort = false;
    this.flyPort = false;
    this.name = name;
  }
  //Math.floor(Math.random() * 10); 0-9
  port(vis) {
    var close = Math.floor(Math.random() * (1000 / vis));
    if (close <= 2 && !this.waterPort) {
      console.log(this.name + " has closed their shipping port");
      this.waterPort = true;
      return true;
    } else return false;
  }
  airport(vis) {
    var close1 = Math.floor(Math.random() * (1000 / vis));
    if (close1 <= 2 && !this.flyPort) {
      console.log(this.name + " has closed their airport");
      this.flyPort = true;
      return true;
    } else return false;
  }
  isInfect(infect, vis) {
    let tfPort = this.port(vis);
    let air = this.airport(vis);
    var close2 = Math.floor(Math.random() * (15000 / infect));
    //console.log(infect);
    if (this.infected > 0) {
      return true;
    } else {
      if (close2 <= 50 && (!this.waterPort || !this.flyPort)) {
        this.infected++;
        return true;
      }
      return false;
    }
  }
  //this.isInfect(infect)
  spread(infect, vis, severity, resistance, countBreak) {
    if (this.isInfect(infect, vis) && !this.vax) {
      this.createVacination(resistance, countBreak);
      if (this.healthy >= this.infected) {
        this.infected += this.infected * (infect / 25);
        this.healthy -= this.infected;
        //console.log(this.healthy);
      } else if (this.infected >= this.healthy) {
        this.infected = this.alive;
        this.healthy = 0;
      }
    }
    //
    // console.log("alive " + this.alive);
    // console.log("healthy " + this.healthy);
    this.isDeadly(severity);
    console.log(this.name + " infected " + this.infected);
  }
  getPop() {

  }
  isDeadly(severity) {
    if (severity >= 15 && this.dead <= this.infected) {
      this.dead += Math.floor(this.infected * (severity / 200));
      //this.infected -= this.dead;
      console.log(`${this.dead} people have died in ${this.name}`);
    }
  }
  popInfection() {

  }
  popDead() {

  }
  startVax(resisCount) {
    console.log(this.name + " VAX STARTED: " + resisCount);
    if (this.vax) {
      setTimeout(() => {
        console.log(this.name + " HAS FINISHED MAKING THE VACCINATION");
        this.infected = 0;
      }, resisCount);
    }
  }
  createVacination(resistance, countBreak) {
    if (!this.vax) {
      var chance = Math.floor(Math.random() * (200));
      if (chance <= 3) {
        this.vax = true;
        this.startVax(resistance * 10000);
      }
    }
  };
}
