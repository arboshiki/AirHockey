class AirHockey {
  constructor(el) {
    this.el = el;
    this.ball = el.querySelector('.ball');
    this.ourControl = el.querySelector('.our-control');
    this.ourControl.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.mouseDown = false;
    // Pixels per second
    this.ballSpeed = 200;
    this.fps = 60;
    //Angle in degrees
    this.ballAngle = Math.ceil(Math.random() * 360);
    // this.ballAngle = 192;
    this.ballAngleRad = this.ballAngle *  Math.PI / 180;

    if (this.ballAngle <= 90){

    } else if (this.ballAngle <= 180){

    } else if (this.ballAngle <= 270){

    } else {

    }

    console.log(this.ballAngle);
    this.initBallMovement();
  }

  onMouseDown(ev) {
    this.mouseDown = true;

    const mouseX = ev.x;
    const mouseY = ev.y;
    const ourControlRect = this.ourControl.getBoundingClientRect();
    const offsetControlLeft = mouseX - ourControlRect.left;
    const offsetControlTop = mouseY - ourControlRect.top;
    this.el.setAttribute('data-offset-left', offsetControlLeft);
    this.el.setAttribute('data-offset-top', offsetControlTop);
    console.log("mouse down ", this.mouseDown);
  }

  onMouseMove(ev) {
    if (this.mouseDown) {
      const stadiumRect = this.el.getBoundingClientRect();
      const mouseX = ev.x;
      const mouseY = ev.y;

      const offsetControlLeft = parseFloat(this.el.getAttribute('data-offset-left'));
      const offsetControlTop = parseFloat(this.el.getAttribute('data-offset-top'));

      let finalX = mouseX - stadiumRect.left - offsetControlLeft;
      let finalY = mouseY - stadiumRect.top - offsetControlTop;

      finalX = Math.max(finalX, 0);
      finalX = Math.min(finalX, this.el.offsetWidth - this.ourControl.offsetWidth);

      finalY = Math.max(finalY, this.el.offsetHeight / 2);
      finalY = Math.min(finalY, this.el.offsetHeight - this.ourControl.offsetHeight);

      // console.log(offsetControlLeft, offsetControlTop);
      this.ourControl.style.left = `${finalX}px`;
      this.ourControl.style.top = `${finalY}px`;
    }
    console.log(this.mouseDown);
  }

  onMouseUp() {
    this.mouseDown = false;
    console.log("mouse up");
  }

  initBallMovement(){
    let x = 0,
      y = 0;

    setInterval(() => {
      let distance = this.ballSpeed / this.fps;
      x += distance * Math.cos(this.ballAngleRad);
      y += distance * Math.sin(this.ballAngleRad);

      this.setPosition(this.ball, x, y);
    }, 1000/this.fps);
  }

  setPosition(el, x, y){
    const centerLeft = this.el.offsetWidth/2,
      centerTop = this.el.offsetHeight/2;

    const finalX = centerLeft + x;
    let finalY;
    finalY = centerTop - y;

    el.style.left = `${finalX}px`;
    el.style.top = `${finalY}px`;
  }
}


new AirHockey(document.querySelector('.air-hockey'));