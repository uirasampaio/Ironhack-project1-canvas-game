let gameSpace = {
  canvas: document.createElement("canvas"),
  // the frames element will allow us to keep track of the user movement 
  frames: 0,
  start: () => {
    this.canvas.width = 400;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext("2d");
    canvas.insertBefore(this.canvas, drawThis.childNodes[0]);
    // call updateGameArea() every 20 milliseconds
    this.interval = setInterval(updateGameArea, 20);
  },
};