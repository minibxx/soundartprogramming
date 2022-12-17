var n;
var oscil;
var position;
var sloop;
var arpflag;

let poseNet;
let poses = [];
let isMajor = 1;

let major_scale = [];
let major_scale_freq = [];
let major_string = ['CM7', 'Dm7', 'Em7', 'FM7', 'G7', 'Am7', 'Bm7'];

let minor_scale = [];
let minor_scale_freq = [];
let minor_string = ['Cm7', 'Dm7', 'EbM7', 'Fm7', 'Gm7', 'AbM7', 'Bb7'];

let current_scale = [];

let buttonPositions = [];
let canvasWidth = window.innerWidth - 30;
let canvasHeight = window.innerHeight - 100;

let currentTouches = [];
let endedTouches = [];
let permission = false;

let volume = 0;
let env = new p5.Envelope();
let pushedButtons = {
  '0': 0,
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': 0,
  '11': 0,
  '12': 0,
  '13': 0,
  '14': 0,
  '15': 0,
};
let additionalFreq = 0;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  n=0;
  for (let i = 0; i < 4 ; i++) {
    [36, 40, 43, 47].forEach(item => {
      major_scale.push(new p5.Oscillator(midiToFreq(item+12*i), 'sine'));
      major_scale_freq.push(item+12*i);
    });
    [36, 39, 43, 46].forEach(item => {
      minor_scale.push(new p5.Oscillator(midiToFreq(item+12*i), 'sine'));
      minor_scale_freq.push(item+12*i);
    });
  }
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    background(63, 59, 108);
    button = createButton('click to iOS Sensor');
    button.mousePressed(iosAccess);   
  } else {
    background(63, 59, 108);
    text("is not a ios", 100, 100);
    permission = true;
  }
  polySynth = new p5.PolySynth();
  arpFlag = 0;
}


function startScreenPressController() {
  if (n != 1 && permission) {
    n = 1;
  }
}

function iosAccess() {
  DeviceOrientationEvent.requestPermission().then(response => {
    if (response === 'granted') permission = true;
  })
  .catch(console.error);
}

function drawStartPage() {
  background('#3F3B6C');
  textSize(100);
  textStyle(BOLDITALIC);
  fill('#00A6A6');
  text("PitchPad", canvasWidth/2-200, canvasHeight/2-200);
  
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
  if (n === 0 && permission) {
    drawStartPage();
  }
  if(n === 1){
    drawPad();
    drawRotation();
    let scale;
    if (isMajor == 1) {
      scale = major_scale;
    } else {
      scale = minor_scale;
    }
    scale.forEach((item, index) => {
      item.amp(volume);
      item.freq(midiToFreq(major_scale_freq[index] + additionalFreq));
    });
    textSize(60);
    textStyle(BOLDITALIC);
    fill('#00A6A6');
    text("PitchPad", 20, 70);
    
    
    textSize(40)
    textStyle(ITALIC);
    fill('#00A6A6');
    if (isMajor == 1) {
      text("Major Key", 300, 70);  
    } else {
      text("Minor Key", 300, 70);
    }
    
    
    
//     drawStartButton();
    drawChangeButton();
    
    
//     image(c, 0, 200);
//     drawKeypoints();
//     drawChordString();
  }
}

function drawRotation() {
  strokeWeight(0);
  fill('#A3C7D6');
  volume = (rotationX+30)/70;
  rect(canvasWidth - 100, 200, 30, canvasHeight - 250);
  fill('#624F82')
  rect(canvasWidth - 100, 200, 30, canvasHeight - 250 - volume*(canvasHeight - 250));
  
  
  strokeWeight(0);
  fill('#A3C7D6');
  if (rotationZ > 180) additionalFreq = (360 - rotationZ)/10;
  else additionalFreq = (rotationZ/10)*(-1);
  rect(30, canvasHeight - 70, canvasWidth - 100, 30);
  fill('#624F82')
  rect(30 + (canvasWidth - 100)/2 + additionalFreq*10, canvasHeight - 70, 10, 30);
}

function drawPad() {
  strokeWeight(0);
  fill('#A3C7D6');
  var padWidth = canvasWidth-170;
  var padHeight = canvasHeight-300;
  rect(30, 200, padWidth, padHeight);
  
  var buttonFrameWidth = padWidth - 40;
  var buttonFrameHeight = padHeight - 40;
  let buttons = [];
  for (var i = 0 ; i < 4 ; i++) {
    for (var j = 0 ; j < 4 ; j++) {
      let buttonWidth = buttonFrameWidth/4;
      let buttonHeight = buttonFrameHeight/4;
      let buttonStartX = 50+buttonWidth*j;
      let buttonStartY = 220+buttonHeight*i;
      let strokeSize = 10;
      
      stroke('#A3C7D6');
      strokeWeight(strokeSize);
      if (pushedButtons[i*4 + j] === 1) {
        fill('#9F73AB');
      } else {
        fill('#624F82');  
      }
      
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

function touchStarted(){
  getAudioContext().resume();
  startScreenPressController();
  if(touches[0]) changeKeyButtonPress(touches[0]);
  touches.filter(item => currentTouches.findIndex(touch => touch.id === item.id) < 0).forEach(item => padMousePressController(item.x, item.y));
  currentTouches = touches;
  console.log('touchStarted : ', currentTouches);
  return false;
}

function touchEnded() {
  endedTouches = currentTouches.filter(item => touches.findIndex(touch => touch.id === item.id) < 0);
  endedTouches.forEach(item => padMouseReleaseController(item.x, item.y));
  currentTouches = touches;
  console.log('touchEnded : ', endedTouches);
  return false;
}

function changeKeyButtonPress(touch) {
  if (touch.x > 800 && touch.x < 980 && touch.y > 30 && touch.y <50) {
    if (isMajor) isMajor = 0;
    else isMajor = 1;
  }
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
    for (let i = 0 ; i < buttonPositions.length ; i++) {
      let buttonPos = buttonPositions[i];
      if (x > buttonPos.startX && x < buttonPos.endX && y > buttonPos.startY && y < buttonPos.endY) {
        console.log('buttonClicked : ', current_scale[i]);
        // polySynth.noteAttack(current_scale[i], velocity);
        scale[i].start();
        pushedButtons[i] = 1;
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
        // polySynth.noteRelease(current_scale[i]);
        scale[i].stop();
        pushedButtons[i] = 0;
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

function drawChangeButton() {
  strokeWeight(0);
  fill('#00A6A6');
  rect(800, 30, 180, 50, 20);
  textStyle(BOLD);
  textSize(30);
  fill('#ffffff');  
  text('Change', 840, 65);  
}

