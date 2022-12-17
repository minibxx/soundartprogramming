var wave;

var button;
function setup(){
  createCanvas(720,256);
  wave = new p5.Oscillator();
  wave.setType('sine');
  wave.start();
  wave.freq(440);
  wave.amp(0);

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
