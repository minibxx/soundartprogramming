let osc;

function setup() {
  osc = new p5.Oscillator("sine");

  osc.amp(0.5); //소리의 크기(0과 1 사이의 값으로 소수점으로 처리)
  osc.freq(440);//주파수 값 설정(수업자료 참고)
}

function draw() {
  
}

function touchStarted() { //터치 허용 함수(p5js 문법)
  getAudioContext().resume(); //강제로 사운드 허용하는 문법(구글 및 애플 뚫기)
  osc.start();//오실레이터 시작
}
