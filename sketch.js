var n;

let isMajor = 1;

let major_scale = [];
let major_scale_freq = [];
let major_string = ['CM7', 'Dm7', 'Em7', 'FM7', 'G7', 'Am7', 'Bm7'];

let minor_scale = [];
let minor_scale_freq = [];
let minor_string = ['Cm7', 'Dm7', 'EbM7', 'Fm7', 'Gm7', 'AbM7', 'Bb7'];

let current_scale = [];

let buttonPositions = [];
let canvasWidth = window.innerWidth-5;
let canvasHeight = window.innerHeight-10;

let currentTouches = [];
let endedTouches = [];
let permission = false;

let volume = 0;
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
let pitchLock = true;

let colorSet = {
  text: '#00A6A6',
  background: '#3F3B6C',
  first: '#A3C7D6',
  second: '#624F82',
  third: '#9F73AB'
};
let button;

function setup() {  
  
  for (let i = 0; i < 4 ; i++) {
    [48, 52, 55, 59].forEach(item => {
      major_scale.push(new p5.Oscillator(midiToFreq(item+12*i), 'sine'));
      major_scale_freq.push(item+12*i);
    });
    [48, 51, 55, 58].forEach(item => {
      minor_scale.push(new p5.Oscillator(midiToFreq(item+12*i), 'sine'));
      minor_scale_freq.push(item+12*i);
    });
  }
  
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    n = -1;
    button = createButton('Click to iOS Sensor');
    button.style('font-size', '70px');
    button.style('padding', '30px');
    button.style('border', 'none');
    button.style('background-color', colorSet.background);
    button.style('font-style', 'italic');
    button.style('font-weight', 'bold');
    button.style('color', colorSet.text);
    button.style('border-radius', '20px');
    button.position(canvasWidth/2 - 280, canvasHeight/2 - 100);
    button.mousePressed(iosAccess);
  } else {
    n = 0;
    text("is not a ios", 100, 100);
  }
}


function startScreenPressController() {
  if (n != 1) {
    n = 1;
  }
}

function iosAccess() {
  DeviceOrientationEvent.requestPermission().then(response => {
    if (response === 'granted') {
      console.log('responseGranted');
      n=0;
    } 
  })
  .catch(console.error);
}

function drawStartPage() {
  background(colorSet.background);
  textSize(100);
  textStyle(BOLDITALIC);
  fill(colorSet.text);
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
  if (n === 0) {
    if (button) button.hide();
    createCanvas(canvasWidth, canvasHeight);
    drawStartPage();
  }
  if(n === 1){
    background(colorSet.background);
    drawPad();
    drawRotation();
    
    soundControl();
    
    drawTitle();
    drawScaleGuid()
    drawChangeButton();
    drawPitchLockButton();
    
    drawGuide();
  }
}

function soundControl() {
  let scale;
  let scale_freq;
  if (isMajor == 1) {
    scale = major_scale;
    scale_freq = major_scale_freq;
  } else {
    scale = minor_scale;
    scale_freq = minor_scale_freq;
  }
  scale.forEach((item, index) => {
    item.amp(volume);
    item.freq(midiToFreq(scale_freq[index] + additionalFreq));
  });
}

function drawGuide() {
  textSize(30);
  fill(colorSet.text);
  textStyle(ITALIC);
  text('Interval ->', 50, canvasHeight - 50);
  textStyle(ITALIC);
  text('O\nc\nt\na\nv\ne\n', 15, 250);
  textStyle(ITALIC);
  text('V\no\nl\nu\nm\ne\n', canvasWidth - 32, 200);
  textStyle(ITALIC);
  text('Root Pitch', canvasWidth - 200, 120);
}

function drawTitle() {
  textSize(60);
  textStyle(BOLDITALIC);
  fill(colorSet.text);
  text("PitchPad", 20, 70);
}

function drawScaleGuid() {
  fill(colorSet.background);
  rect(290, 20, 200, 70);
  textSize(40);
  textStyle(ITALIC);
  fill(colorSet.text);
  if (isMajor == 1) {
    text("Major Key", 300, 70);  
  } else {
    text("Minor Key", 300, 70);
  }
}

function drawRotation() {
  strokeWeight(0);
  fill(colorSet.first);
  volume = (rotationX+30)/70;
  rect(canvasWidth - 80, 150, 30, canvasHeight - 230);
  fill(colorSet.second)
  rect(canvasWidth - 80, 150, 30, canvasHeight - 230 - volume*(canvasHeight - 230));
  
  
  if (pitchLock) {
    if (rotationY > 0) {
      if (additionalFreq < 5.8) additionalFreq += rotationY/500;
    } else {
      if (additionalFreq >= -6) additionalFreq += (rotationY/500);
    }  
  }
  
  
  let fullWidth = canvasWidth - 100;
  strokeWeight(0);
  fill(colorSet.second);
  rect(50, 140, fullWidth, 30);
  fill(colorSet.first)
  rect(50 + (fullWidth)/2 + additionalFreq*fullWidth/12, 140, 10, 30);
  
  textSize(25);
  fill(colorSet.text);
  textStyle(BOLD);
  
  text('F#', 48 + (canvasWidth - 100)/2 - fullWidth/12*6 + 5, 165);
  text('G', 48 + (canvasWidth - 100)/2 - fullWidth/12*5, 165);
  text('G#', 48 + (canvasWidth - 100)/2 - fullWidth/12*4, 165);
  text('A', 48 + (canvasWidth - 100)/2 - fullWidth/12*3, 165);
  text('A#', 48 + (canvasWidth - 100)/2 - fullWidth/12*2, 165);
  text('B', 48 + (canvasWidth - 100)/2 - fullWidth/12*1, 165);
  text('C', 48 + (canvasWidth - 100)/2, 165);
  text('C#', 48 + (canvasWidth - 100)/2 + fullWidth/12*1, 165);
  text('D', 48 + (canvasWidth - 100)/2 + fullWidth/12*2, 165);
  text('D#', 48 + (canvasWidth - 100)/2 + fullWidth/12*3, 165);
  text('E', 48 + (canvasWidth - 100)/2 + fullWidth/12*4, 165);
  text('F', 48 + (canvasWidth - 100)/2 + fullWidth/12*5, 165);
  
}

function drawPad() {
  strokeWeight(0);
  fill(colorSet.first);
  var padWidth = canvasWidth-170;
  var padHeight = canvasHeight-300;
  rect(50, 220, padWidth, padHeight);
  
  var buttonFrameWidth = padWidth - 40;
  var buttonFrameHeight = padHeight - 40;
  let buttons = [];
  for (var i = 0 ; i < 4 ; i++) {
    for (var j = 0 ; j < 4 ; j++) {
      let buttonWidth = buttonFrameWidth/4;
      let buttonHeight = buttonFrameHeight/4;
      let buttonStartX = 70+buttonWidth*j;
      let buttonStartY = 240+buttonHeight*i;
      let strokeSize = 10;
      
      stroke(colorSet.first);
      strokeWeight(strokeSize);
      if (pushedButtons[i*4 + j] === 1) {
        fill(colorSet.third);
      } else {
        fill(colorSet.second);  
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
  console.log('touchStarted n:', n);
  getAudioContext().resume();
  startScreenPressController();
  if(touches[0]) {
    changeKeyButtonPress(touches[0]);
    pitchLockButtonPress(touches[0]);
  } 
  touches.filter(item => currentTouches.findIndex(touch => touch.id === item.id) < 0).forEach(item => padMousePressController(item.x, item.y));
  currentTouches = touches;
  if (n == 1) {
    return false;  
  }
}

function touchEnded() {
  console.log('touchEnded n:', n);
  endedTouches = currentTouches.filter(item => touches.findIndex(touch => touch.id === item.id) < 0);
  endedTouches.forEach(item => padMouseReleaseController(item.x, item.y));
  currentTouches = touches;
  if (n == 1) {
    return false;  
  }
}

function changeKeyButtonPress(touch) {
  if (touch.x > 500 && touch.x < 680 && touch.y > 30 && touch.y < 80) {
    if (isMajor) {
      isMajor = 0;
      colorSet = {
        text: '#00A6A6',
        background: '#D8C593',
        // background: '#3F3B6C',
        first: '#708160',
        second: '#DD7631',
        third: '#BB3B0E'
      };
    } else {
      isMajor = 1;
      colorSet = {
        text: '#00A6A6',
        background: '#3F3B6C',
        first: '#A3C7D6',
        second: '#624F82',
        third: '#9F73AB'
      }
    }
  }
}

function pitchLockButtonPress(touch) {
  if (touch.x > 700 && touch.x < 920 && touch.y > 30 && touch.y < 80) {
    pitchLock = !pitchLock
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
        scale[i].stop();
        pushedButtons[i] = 0;
        break;
      }
    }
  }
}

function drawChangeButton() {
  strokeWeight(0);
  fill(colorSet.text);
  rect(500, 30, 180, 50, 20);
  textStyle(BOLD);
  textSize(30);
  fill('#ffffff');  
  text('Change', 540, 65);  
}

function drawPitchLockButton() {
  strokeWeight(0);
  fill(colorSet.text);
  rect(700, 30, 220, 50, 20);
  textStyle(BOLD);
  textSize(30);
  fill('#ffffff');  
  text('Pitch Lock', 740, 65);  
}

