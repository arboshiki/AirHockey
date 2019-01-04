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
    this.ballSpeed = 300;
    this.fps = 60;
    //Angle in degrees
    this.ballAngle = null;
    // Angle in radians
    this.ballAngleRad = null;

    this.setBallAngle(Math.ceil(Math.random() * 360));

    if (this.ballAngle <= 90) {

    } else if (this.ballAngle <= 180) {

    } else if (this.ballAngle <= 270) {

    } else {

    }

    console.log(this.ballAngle);
    this.initBallMovement();
  }

  setBallAngle(angle) {
    //Angle in degrees
    this.ballAngle = angle;
    // this.ballAngle = 192;
    this.ballAngleRad = this.ballAngle * Math.PI / 180;
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

  initBallMovement() {
    let x = 0,
      y = 0;

    setInterval(() => {
      let distance = this.ballSpeed / this.fps;
      x += distance * Math.cos(this.ballAngleRad);
      y += distance * Math.sin(this.ballAngleRad);

      this.setPosition(this.ball, x, y);
    }, 1000 / this.fps);
  }

  getCanvasSize() {
    return {
      w: this.el.offsetWidth,
      h: this.el.offsetHeight
    };
  }

  getBallSize() {
    return {
      w: this.ball.offsetWidth,
      h: this.ball.offsetHeight
    };
  }

  setPosition(el, x, y) {
    const {w: canvasW, h: canvasH} = this.getCanvasSize();
    const {w: ballW, h: ballH} = this.getBallSize();

    const centerLeft = canvasW / 2,
      centerTop = canvasH / 2;

    const finalX = centerLeft + x;
    const finalY = centerTop - y;
    // console.log(this.ball.getBoundingClientRect());
    // console.log(finalX, finalY);

    // this.leaveFootPrint(finalX, finalY);

    if (finalX + ballW/2 >= canvasW) {
      if (this.ballAngle < 90) {
        this.setBallAngle(180 - this.ballAngle);
      } else {
        this.setBallAngle(180 + (360 - this.ballAngle))
      }
    } else if (finalY + ballH/2 >= canvasH){
      this.setBallAngle(360 - this.ballAngle);
    } else if (finalX - ballW/2 <= 0){
      if (this.ballAngle < 180){
        this.setBallAngle(180 - this.ballAngle);
      } else {
        this.setBallAngle(360 - (this.ballAngle - 180));
      }
    } else if (finalY - ballH/2 <= 0){
      if (this.ballAngle < 90){
        this.setBallAngle(360 - this.ballAngle);
      } else {
        this.setBallAngle(90 + this.ballAngle);
      }
    }

    el.style.left = `${finalX}px`;
    el.style.top = `${finalY}px`;
  }


  leaveFootPrint(x, y){
    const tmp = document.createElement('div');
    tmp.style.position = 'absolute';
    tmp.style.width = '2px';
    tmp.style.height = '2px';
    tmp.style.borderRadius = '50%';
    tmp.style.backgroundColor = 'red';
    tmp.style.left = `${x}px`;
    tmp.style.top = `${y}px`;
    this.el.appendChild(tmp);
  }
}


new AirHockey(document.querySelector('.air-hockey'));