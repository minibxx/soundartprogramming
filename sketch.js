var wave;

var button;
function setup(){
  createCanvas(720,256);
  wave = new p3.Oscillator();
  wave.setType('sine');
  wave.start(); #소리 나기 시작
  wave.freq(440); #주파수
  wave.amp(0); #볼륨

  button = createButton('play/pause');
  button.mousePressed(toggle);
}
  function draw(){
}
  function toggle(){
    if(!playing){
      wave.amp(0.5,1);
      playing= true;
    }else{
      wave.ammp(0,1);
      playing = false;
    }
    }
}