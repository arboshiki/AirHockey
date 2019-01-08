class AirHockey {
  constructor(el) {
    this.el = el;
    this.ball = el.querySelector('.ball');
    this.ourControl = el.querySelector('.our-control');
    this.theirGate = el.querySelector('.their-gate');
    this.ourGate = el.querySelector('.our-gate');

    this.ourControl.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.mouseDown = false;
    this.ballRadius = this.ball.offsetWidth / 2;
    // Pixels per second
    this.ballSpeed = 300;
    this.fps = 60;
    //Angle in degrees
    this.ballAngle = null;
    // Angle in radians
    this.ballAngleRad = null;

    // this.setBallAngle(Math.ceil(Math.random() * 360));
    this.setBallAngle(73);

    console.log(this.ballAngle);
    this.initBallMovement();
  }

  setBallAngle(angle) {
    //Angle in degrees
    this.ballAngle = angle;
    // this.ballAngle = 192;
    this.ballAngleRad = AirHockey.degreeToRadian(this.ballAngle);
  }

  static degreeToRadian(angle){
    return angle * Math.PI / 180
  }

  static radianToDegree(angle){
    return angle * 180/ Math.PI;
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

    this.ballInterval = setInterval(() => {
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

    const centerLeft = canvasW / 2,
      centerTop = canvasH / 2;

    const finalX = centerLeft + x;
    const finalY = centerTop - y;
    // console.log(this.ball.getBoundingClientRect());
    // console.log(finalX, finalY);


    if (finalY + this.ballRadius < 0) {
      console.log("Ball is in their gate");
      clearInterval(this.ballInterval);
      return;
    }

    this.leaveFootPrint(finalX, finalY);

    // Change the angle when ball touches the canvas edge
    // Check for RIGHT edge
    if (finalX + this.ballRadius >= canvasW) {
      console.log("Hit RIGHT edge");
      if (this.ballAngle < 90) {
        this.setBallAngle(180 - this.ballAngle);
      } else {
        this.setBallAngle(180 + (360 - this.ballAngle))
      }
    }
    // Check for BOTTOM edge
    else if (finalY + this.ballRadius >= canvasH) {
      console.log("Hit BOTTOM edge");
      this.setBallAngle(360 - this.ballAngle);
    }
    // Check for LEFT edge
    else if (finalX - this.ballRadius <= 0) {
      console.log("Hit LEFT edge");
      if (this.ballAngle < 180) {
        this.setBallAngle(180 - this.ballAngle);
      } else {
        this.setBallAngle(360 - (this.ballAngle - 180));
      }
    }
    // Check for TOP edge
    else if (finalY - this.ballRadius <= 0) {
      console.log("Hit TOP edge");
      const {leftEdge: theirGateLeft, rightEdge: theirGateRight} = this.getTheirGatePosition();
      if (finalX - this.ballRadius > theirGateLeft && finalX + this.ballRadius < theirGateRight || finalY < 0) {
        console.log("Let it go")
      } else if (finalY - this.ballRadius <= 0) {
        let distanceToLeft = AirHockey.getDistance(finalX, finalY, theirGateLeft, 0);
        let distanceToRight = AirHockey.getDistance(finalX, finalY, theirGateRight, 0);

        //If we hit the corner of the gate on the LEFT side
        if (distanceToLeft <= this.ballRadius){
          let alpha = AirHockey.radianToDegree(Math.atan2(finalY, finalX - theirGateLeft));
          let beta = (180 - this.ballAngle) - alpha;
          this.setBallAngle(360 - (alpha - beta));
        }
        //If we hit the corner of the gate on the RIGHT side
        else if (distanceToRight < this.ballRadius){
          let alpha = AirHockey.radianToDegree(Math.atan2(finalY, theirGateRight - finalX));
          let beta = this.ballAngle - alpha;
          this.setBallAngle(180 + (alpha - beta));
        }

      } else if (this.ballAngle < 90) {
        this.setBallAngle(360 - this.ballAngle);
      } else {
        this.setBallAngle(90 + this.ballAngle);
      }
    }

    el.style.left = `${finalX}px`;
    el.style.top = `${finalY}px`;
  }

  getTheirGatePosition() {
    const stadiumRect = this.el.getBoundingClientRect();
    const gateRect = this.theirGate.getBoundingClientRect();
    return {
      leftEdge: gateRect.left - stadiumRect.left,
      rightEdge: gateRect.left - stadiumRect.left + gateRect.width
    }
  }

  static getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.abs(x1 - x2) * Math.abs(x1 - x2) + Math.abs(y1 - y2) * Math.abs(y1 - y2))
  }


  leaveFootPrint(x, y) {
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