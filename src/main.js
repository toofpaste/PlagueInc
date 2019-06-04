import 'jquery.terminal';
import World from '../src/world';
import '../node_modules/jquery.terminal/css/jquery.terminal.min.css';
import './styles.css';


import { Continent } from './Continent.js';
import { Disease } from './Disease.js';
import $ from 'jquery';


let intro =
  `
██▒   █▓ ██▓ ██▀███   █    ██   ██████     ██░ ██  █    ██  ███▄    █ ▄▄▄█████▓▓█████  ██▀███  
▓██░   █▒▓██▒▓██ ▒ ██▒ ██  ▓██▒▒██    ▒    ▓██░ ██▒ ██  ▓██▒ ██ ▀█   █ ▓  ██▒ ▓▒▓█   ▀ ▓██ ▒ ██▒
▓██  █▒░▒██▒▓██ ░▄█ ▒▓██  ▒██░░ ▓██▄      ▒██▀▀██░▓██  ▒██░▓██  ▀█ ██▒▒ ▓██░ ▒░▒███   ▓██ ░▄█ ▒
 ▒██ █░░░██░▒██▀▀█▄  ▓▓█  ░██░  ▒   ██▒   ░▓█ ░██ ▓▓█  ░██░▓██▒  ▐▌██▒░ ▓██▓ ░ ▒▓█  ▄ ▒██▀▀█▄  
  ▒▀█░  ░██░░██▓ ▒██▒▒▒█████▓ ▒██████▒▒   ░▓█▒░██▓▒▒█████▓ ▒██░   ▓██░  ▒██▒ ░ ░▒████▒░██▓ ▒██▒
  ░ ▐░  ░▓  ░ ▒▓ ░▒▓░░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░    ▒ ░░▒░▒░▒▓▒ ▒ ▒ ░ ▒░   ▒ ▒   ▒ ░░   ░░ ▒░ ░░ ▒▓ ░▒▓░
  ░ ░░   ▒ ░  ░▒ ░ ▒░░░▒░ ░ ░ ░ ░▒  ░ ░    ▒ ░▒░ ░░░▒░ ░ ░ ░ ░░   ░ ▒░    ░     ░ ░  ░  ░▒ ░ ▒░
    ░░   ▒ ░  ░░   ░  ░░░ ░ ░ ░  ░  ░      ░  ░░ ░ ░░░ ░ ░    ░   ░ ░   ░         ░     ░░   ░ 
     ░   ░     ░        ░           ░      ░  ░  ░   ░              ░             ░  ░   ░     
    ░                                                                                          
`;
var updateLines = [];

var scanlines = $('.scanlines');
var tv = $('.tv');
var term = $('#term').terminal(function (command, term) {
  if (command.match(/^\s*exit\s*$/)) {
    $('.tv').addClass('collapse');
    term.disable();
  } else if (command !== '') {
    processCommand(command, term);
  }
}, {
    name: 'js_demo',
    onResize: set_size,
    exit: false,
    // detect iframe codepen preview
    enabled: $('body').attr('onload') === undefined,
    onInit: function () {
      set_size();
      //this.echo('Type [[b;#fff;]camera()] to get video and [[b;#fff;]pause()]/[[b;#fff;]play()] to stop/play');
    },
    prompt: 'V://> ',
    greetings: intro
  });

// window.world = new World();
// for (let i = 0; i < 20; i++) {
//   window.world.infectCity()
// }

function set_size() {
  // for window height of 170 it should be 2s
  var height = $(window).height();
  var width = $(window).width()
  var time = (height * 2) / 170;
  scanlines[0].style.setProperty("--time", time);
  tv[0].style.setProperty("--width", width);
  tv[0].style.setProperty("--height", height);
}


function processCommand(command, term) {
  let cmd = command.split(" ");
  if (cmd[0] == "status") {
    window.world.cities.forEach(city => {
      let sick = "";
      term.echo(`[[b;#fff;]Name:] ${city.name}`);
      term.echo(`Population: ${city.population}${sick > 0 ? ` / [[b;#EEFC12;]${sick}]` : ``}`);

      city.infected.forEach(i => {
        term.echo(`[[b;#ce2f2f;]${i.name}]: ${i.infected}`);
        updateLines.push({
          id: term.last_index(),
          city: city.name,
          infection: i.name
        })
      });

    });
    return;
  }
  if (cmd[0] == "flyto") {
    if (window.world.cities.filter(i => i.name === cmd[1]).length > 0) {
      term.echo(`[[b;#549af5;]Flying to ${cmd[1]}]`)
    } else {
      term.echo(`[[b;#ce2f2f;]Invalid location. Please input valid destination.]`)
    }
  }

  if (cmd[0] == "start") {
    startSymptom(0);
  }
}

function termUpdate() {
  updateLines.forEach(l => {

    let city = window.world.cities.filter(c => c.name === l.city)[0];
    let infection = city.infected.filter(i => i.name === l.infection)[0];
    let pop = city.population;


    let color = "";
    if (infection.infected < pop * 0.20) {
      color = "#0ab864"//Green
    }
    if (infection.infected > pop * 0.50) {
      color = "#EEFC12"//Yellow
    }
    if (infection.infected > pop * 0.90) {
      color = "#ce2f2f"//Red
    }
    term.update(l.id, `[[b;#ce2f2f;]${infection.name}]: [[b;${color};]${infection.infected}]`);
  });

}

setInterval(() => {
  termUpdate();
}, 1000);









let conts = [];
let symptHold = [];
let numHold = [];
let names = ['Coughing', 'Sneezing', 'Nausuea', 'Vommiting', 'Fever', 'ExplosivePoops'];
let lethal = 0;
let infect = 0;
let vis = 0;
let countBreak = 0;
let bank = 10;
let tempBank = 10;
let resistance = 0;
let infectionStarted = false;


//let dis = new Disease(0, lethal, infect, vis);

//$("#diseForm").submit(function(event){

function startSymptom(hold) {

  //let hold = parseInt($("#dise").val());
  let dis = new Disease(hold, lethal, infect, vis);

  //check if it already includes 
  if (!numHold.includes(hold) && bank >= 4) {
    bank -= 4;
    resistance++;
    numHold.push(hold);
    symptHold.push(dis.addSymptom());
    symptHold[numHold.indexOf(hold)].severity++;
  } else {
    //update old symptom
    for (var i = 0; i < symptHold.length; i++) {
      if (symptHold[i].name === names[hold]) {
        if (symptHold[i].severity >= 3) {
          term.echo(`${symptHold[i].name} max level reached`);
          break;
        } else {
          if (bank >= 4) {
            bank -= 4;
            resistance++;
            symptHold[numHold.indexOf(hold)] = dis.update(symptHold[numHold.indexOf(hold)]);
          }
          break;
        }
      }
    }
  }



  for (var u = 0; u < symptHold.length; u++) {
    if (symptHold[u].severity < 3 && tempBank >= 4) {
      tempBank -= 4;
      var arrHold = dis.addTraits(symptHold[u]);
      lethal = arrHold[0];
      infect = arrHold[1];
      vis = arrHold[2];
    }
    $("#level" + (u + 1)).text(`${symptHold[u].name} level ${symptHold[u].severity}`)
  }


  // $("#dis1").text(`Lethality: ${dis.lethal} `);
  // $("#dis2").text(`Infection Rate: ${dis.infect} `);
  // $("#dis3").text(`Visibility: ${dis.vis} `);
  if (!infectionStarted) {
    startTime();
    infectionStarted = true;
  }
}



function startTime() {
  conts.push(
    new Continent(45848070, 0, 45848070, 0, "Asia"),
    new Continent(13200387, 0, 13200387, 1, "Africa"),
    new Continent(7431026, 0, 7431026, 0, "Europe"),
    new Continent(4319984, 0, 4319984, 0, "South America"),
    new Continent(3664968, 0, 3664968, 0, "North America"),
    new Continent(534802, 0, 534802, 0, "Australia"),
    new Continent(1, 0, 1, 0, "Antartica")
    )
  setInterval(() => updateThings(), 5000);
}


function updateThings() {
  bank += 2;
  tempBank += 2;
  conts.forEach(c => {
    c.spread(infect, vis, lethal, resistance, countBreak);
  });
}