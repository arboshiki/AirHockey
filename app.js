class AirHockey {
  constructor(el) {
    this.el = el;
    this.ourControl = el.querySelector('.our-control');
    this.ourControl.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.mouseDown = false;
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
}


new AirHockey(document.querySelector('.air-hockey'));