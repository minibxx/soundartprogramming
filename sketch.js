var n;
var oscil;
var position;
var sloop;
var arpflag;

let poseNet;
let poses = [];
let isMajor = 1;

let major_scale = [];
let major_string = ['CM7', 'Dm7', 'Em7', 'FM7', 'G7', 'Am7', 'Bm7'];

let minor_scale = [];
let minor_string = ['Cm7', 'Dm7', 'EbM7', 'Fm7', 'Gm7', 'AbM7', 'Bb7'];

let current_scale = [];

let buttonPositions = [];
let canvasWidth = window.innerWidth - 30;
let canvasHeight = window.innerHeight - 100;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission();
  }
  
  n=0;
  for (let i = 3; i < 7 ; i++) {
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(item => {
      major_scale.push(item + i);
    });
    ['A#','C', 'D', 'D#', 'F', 'G', 'G#'].forEach(item => {
      minor_scale.push(item + i);
    });
  }
  polySynth = new p5.PolySynth();
  arpFlag = 0;
}

function drawStartPage() {
  background('#F49F0A');
  textSize(100);
  textStyle(BOLDITALIC);
  fill('#00A6A6');
  text("Carpeggiator2", canvasWidth/2-300, canvasHeight/2-200);
  
  textSize(50);
  textStyle(ITALIC);
  text("Made By Yubin", canvasWidth/2-150, canvasHeight/2-100);
  
  textSize(40)
  textStyle(NORMAL);
  text("Touch the Screen to Start", canvasWidth/2-200, canvasHeight/2)
}

function modelReady() {
  select('#status').html('Model Loaded123');
}


function draw() {
  if (n === 0) {
    drawStartPage();
  }
  if(n === 1){
    drawPad();
    drawRotation();
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

function drawRotation() {
  textSize(72);
  text(`rotationX: ${rotationX}`, 100, 100);
  text(`rotationY: ${rotationY}`, 100, 200);
  text(`rotationZ: ${rotationZ}`, 100, 300);
}

function drawPad() {
  strokeWeight(0);
  fill('#BBDEF0');
  var padWidth = canvasWidth-60;
  var padHeight = canvasHeight-150;
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
  
  setScales();
}

function setScales() {
  let baseScales;
  if (isMajor == 1) {
    baseScales = major_scale;
  } else {
    baseScales = minor_scale;
  }
  
  let scales = [];
  let startIndex = 2;
  scales.push(baseScales[startIndex]);
  scales.push(baseScales[startIndex+2]);
  scales.push(baseScales[startIndex+4]);
  scales.push(baseScales[startIndex+6]);
  scales.push(baseScales[startIndex+7]);
  scales.push(baseScales[startIndex+9]);
  scales.push(baseScales[startIndex+11]);
  scales.push(baseScales[startIndex+13]);
  scales.push(baseScales[startIndex+14]);
  current_scale = scales;
}

function startScreenPressController() {
  if (n != 1) {
    n = 1;
  }
}

function touchStarted(){
  getAudioContext().resume();
  startScreenPressController();
  console.log('aaaa', touches);
  touches.forEach(item => padMousePressController(item.x, item.y));
  
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

function touchEnded() {
  touches.forEach(item => padMouseReleaseController(item.x, item.y));
}

function padMousePressController(x, y) {
  if (n === 1) {
    let scale;
    if (isMajor == 1) {
      scale = major_scale;
    } else {
      scale = minor_scale;
    }
    
    let velocity = 0.5;
    let duration = 1;
    console.log(x, y);
    for (let i = 0 ; i < buttonPositions.length ; i++) {
      let buttonPos = buttonPositions[i];
      if (x > buttonPos.startX && x < buttonPos.endX && y > buttonPos.startY && y < buttonPos.endY) {
        console.log('buttonClicked : ', current_scale[i]);
        polySynth.noteAttack(current_scale[i], velocity);
        // polySynth.noteAttack('C3', velocity);
        break;
      }
    }
  }
}

function padMouseReleaseController(x, y) {
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
      if (x > buttonPos.startX && x < buttonPos.endX && y > buttonPos.startY && y < buttonPos.endY) {
        polySynth.noteRelease(current_scale[i]);
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