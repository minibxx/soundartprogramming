var n;
var oscil;
var position;
var sloop;
var arpflag;

let poseNet;
let poses = [];
let isMajor = 0;

let major_scale = [261, 293, 329, 349, 391, 440, 493, 523, 587, 659, 698, 783, 880, 987];
let major_string = ['CM7', 'Dm7', 'Em7', 'FM7', 'G7', 'Am7', 'Bm7'];

let minor_scale = [261, 293, 311, 349, 391, 415, 466, 523, 587, 622, 698, 783, 830, 932];
let minor_string = ['Cm7', 'Dm7', 'EbM7', 'Fm7', 'Gm7', 'AbM7', 'Bb7'];

let buttonPositions = [];

function setup() {
  createCanvas(displayWidth, displayHeight);
  n=0;
  userStartAudio();
  polySynth = new p5.PolySynth();
  arpFlag = 0;
}

function drawStartPage() {
  background('#F49F0A');
  textSize(100);
  textStyle(BOLDITALIC);
  fill('#00A6A6');
  text("Carpeggiator", displayWidth/2-500, displayHeight/2-400);
  
  textSize(50);
  textStyle(ITALIC);
  text("Made By Yubin", displayWidth/2-400, displayHeight/2-300);
  
  textSize(40)
  textStyle(NORMAL);
  text("Press any key to Start", displayWidth/2-400, displayHeight/2-200)
}

function modelReady() {
  select('#status').html('Model Loaded');
}


function draw() {
  if (n === 0) {
    drawStartPage();
  }
  if(n === 1){
    drawPad();
//     textSize(60);
//     textStyle(BOLDITALIC);
//     fill('#00A6A6');
//     text("Carpeggiator", 20, 70);
    
//     strokeWeight(0);
//     fill('#F49F0A');
//     rect(0, 80, 200, 50)
//     textSize(40)
//     textStyle(ITALIC);
//     fill('#00A6A6');
//     if (isMajor == 1) {
//       text("Major Key", 20, 110);  
//     } else {
//       text("Minor Key", 20, 110);
//     }
    
    
    
//     drawStartButton();
//     drawChangeButton();
    
    
//     image(c, 0, 200);
//     drawKeypoints();
//     drawChordString();
  }
}

function drawPad() {
  strokeWeight(0);
  fill('#BBDEF0');
  var padWidth = displayWidth-60;
  var padHeight = displayHeight-150;
  rect(30, 100, padWidth, padHeight);
  
  var buttonFrameWidth = padWidth - 40;
  var buttonFrameHeight = padHeight - 40;
  let buttons = [];
  for (var i = 0 ; i < 3 ; i++) {
    for (var j = 0 ; j < 3 ; j++) {
      let buttonWidth = buttonFrameWidth/3;
      let buttonHeight = buttonFrameHeight/3;
      let buttonStartX = 50+buttonWidth*j;
      let buttonStartY = 120+buttonHeight*i;
      let strokeSize = 10;
      
      stroke('#BBDEF0');
      strokeWeight(strokeSize);
      fill('#B9F942');
      rect(buttonStartX, buttonStartY, buttonWidth, buttonHeight);
      buttons.push({
        startX: buttonStartX + strokeSize,
        startY: buttonStartY + strokeSize,
        endX: buttonStartX + buttonWidth - strokeSize,
        endY: buttonStartY + buttonHeight - strokeSize,
      })
    }
  }
  buttonPositions = buttons;
}

function mousePressed(){
  padMousePressController();
//   if (n == 1) {
//     if (mouseX > 600 && mouseX < 770 && mouseY > 30 && mouseY < 80) {

//       if (sloop.isPlaying) {
//         sloop.pause();
//       } else {
//         sloop.start();
//       }
//     } else if (mouseX > 800 && mouseX < 980 && mouseY > 30 && mouseY < 80) {
//       if (sloop.isPlaying) {
//         sloop.pause();
//       }
//       if (isMajor == 1) {
//         isMajor = 0;
//       } else {
//         isMajor = 1;
//       }
//     }    
//   }
}

function mouseReleased() {
  padMouseReleaseController();
}

function padMousePressController() {
  if (n === 1) {
    let scale;
    if (isMajor == 1) {
      scale = major_scale;
    } else {
      scale = minor_scale;
    }
    
    let velocity = 0.5;
    let duration = 1;
    for (let i = 0 ; i < buttonPositions.length ; i++) {
      let buttonPos = buttonPositions[i];
      if (mouseX > buttonPos.startX && mouseX < buttonPos.endX && mouseY > buttonPos.startY && mouseY < buttonPos.endY) {
        console.log('buttonClicked : ', i);
        polySynth.noteAttack(scale[i], velocity);
        break;
      }
    }
  }
}

function padMouseReleaseController() {
  if (n === 1) {
    let scale;
    if (isMajor == 1) {
      scale = major_scale;
    } else {
      scale = minor_scale;
    }
    
    let velocity = 0.5;
    let duration = 1;
    for (let i = 0 ; i < buttonPositions.length ; i++) {
      let buttonPos = buttonPositions[i];
      if (mouseX > buttonPos.startX && mouseX < buttonPos.endX && mouseY > buttonPos.startY && mouseY < buttonPos.endY) {
        console.log('buttonClicked : ', i);
        polySynth.noteRelease(scale[i]);
        break;
      }
    }
  }
}

function drawChordString() {
  let chords;
  strokeWeight(0);
  fill('#F49F0A');
  rect(0, 150, 1050, 50)
  
  if (isMajor == 1) {
    chords = major_string;
  } else {
    chords = minor_string;
  }
  
  for (let i = 0; i < 7; i++) {
    let width = 1050/7;
    textSize(40);
    if (position == i) {
      fill('#BBDEF0');
    } else {
      fill('#00A6A6');  
    }
    
    textStyle(ITALIC);
    text(chords[i], width*i + 30, 180);
    if (position == i) {
      strokeWeight(0);
      fill('#BBDEF079');
      rect(width*i, 200, width, 600);
      
      let height = 600/4
      strokeWeight(0);
      fill('#00A6A699');
      rect(width*i, ((3 - (arpFlag-1)%4))*height + 200, width, height);
    }
  }
  textStyle(ITALIC);
  textSize(30);
  fill('#445E93');
  text('VOLUME', 1060, 175);
}

function drawStartButton() {
  strokeWeight(0);
  if (sloop.isPlaying) {
    fill('rgb(255, 0, 0)');  
  } else {
    fill('#00A6A6');
  }
  
  rect(600, 30, 170, 50, 20);
  textStyle(BOLD);
  textSize(30);
  fill('#ffffff');  
  if (sloop.isPlaying) {
    text('Stop', 650, 65);
  } else {
    text('Start', 650, 65);  
  }
}

function drawChangeButton() {
  strokeWeight(0);
  fill('#00A6A6');
  rect(800, 30, 180, 50, 20);
  textStyle(BOLD);
  textSize(30);
  fill('#ffffff');  
  text('Change', 840, 65);  
}

