const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const gridh = 25;
const gridw = 25;
const sl = 25;
const sgrid = new Array(gridh).fill(new Array(gridw).fill(0))

const snake = {
  x: 0,
  y: 1,
  increment: 2,
  currentGrowth: 0,
  snakeShift: true,
  parts: [[0,1]],
  keys: {
  	ArrowRight: true,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false,
    clear(){
			this.ArrowRight = false;
      this.ArrowLeft = false;
      this.ArrowUp = false;
      this.ArrowDown = false;
    }
  },
  food: {
  	x: undefined,
    y: undefined,
    randomFood(){
    	this.x = Math.round(Math.random() * (gridw - 1));
      this.y = Math.round(Math.random() * (gridh - 1));
    }
  }
};

class Grid {
	constructor(r,c, options){
  	this.rows = r;
    this.col = c;
    this.options = options;
    this.sl = options.sidelength;
    this.height = r * options.sidelength;
    this.width = c * options.sidelength;
  }
  validation(){
  	if(this.rows === undefined || this.rows === null){
    	throw Error('The specified value rows cannot be' + this.rows);
    }
    if(this.col === undefined || this.col === null){
    	throw Error('The specified value col cannot be' + this.col);
    }
    if(this.options === undefined || this.options === null){
    	throw Error('The specified value options cannot be' + this.options)
    }
  }
  scoreGrid(){
    const target = document.querySelector(this.options.target);
    const ctx = target.getContext('2d');
    target.height = this.height;
    target.width = this.width;
  	target.style.border = '1px solid black';
  	for(let i = this.sl; i <= this.width; i += this.sl){
    	ctx.beginPath();
    	ctx.lineWidth = 1;
    	ctx.moveTo(i,0);
      ctx.lineTo(i, this.height);
      ctx.stroke();
    }
    for(let i = this.sl; i <= this.height; i += this.sl){
    	ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(0,i);
      ctx.lineTo(this.width, i);
      ctx.stroke();
    }
  }
  draw(r,c,color){
  	const ctx = document.querySelector(this.options.target).getContext('2d');
  	const dims = this.dimensions(r,c);
    ctx.fillStyle = color;
    ctx.fillRect(dims[0], dims[1], this.sl - 2, this.sl - 2);
  }
  dimensions(r,c){
  	const x1 = r * this.sl + 1;
    const y1 = c * this.sl + 1;
  	return [x1,y1];
  }
  setup(){
  	this.validation();
    this.scoreGrid();
  }
  redraw(){
  	const ctx = document.querySelector(this.options.target).getContext('2d');
    ctx.clearRect(0,0,this.width, this.height);
    this.scoreGrid();
  }
}

const grid = new Grid(gridh,gridw, {
	sidelength: sl,
  target: 'canvas'
})
grid.setup();

function headCheck(){
	for(let i = 0; i < snake.parts.length - 2; i++){
  	const head = snake.parts[snake.parts.length-1];
    if(head[0] === snake.parts[i][0] && head[1] === snake.parts[i][1]){
    	return true;
    }
  }
  return false;
}

function restart(){
	snake.x = 0;
  snake.y = 1;
  snake.parts = [[0,1]]
  snake.keys.clear();
  snake.keys.ArrowRight = true;
}

function draw(){
	grid.redraw();
  snake.parts.forEach(a => grid.draw(a[0],a[1], 'brown'))
  if(snake.food.x === undefined){
  	snake.food.randomFood();
  }
  grid.draw(snake.food.x, snake.food.y, 'red');
}

function update(){
	checkFoodSnakeCollide();
	if(snake.keys.ArrowRight){
  	snake.x += 1;
  } else if(snake.keys.ArrowLeft){
  	snake.x += -1;
  } else if(snake.keys.ArrowUp){
  	snake.y += -1;
  } else if(snake.keys.ArrowDown){
  	snake.y += 1;
  }
  if(snake.currentGrowth === 0){
  	snake.parts.shift();
  }
  if(snake.x >= gridw){
  	snake.x = 0;
  } else if(snake.x < 0){
  	snake.x = gridw
  }
  if(snake.y >= gridh){
  	snake.y = 0;
  } else if(snake.y < 0){
  	snake.y = gridh;
  }
  snake.parts.push([snake.x, snake.y]);
  if(headCheck()){
  	restart();
  }
}

document.addEventListener('keydown', (e) => {

	if(e.key === 'ArrowRight' && !snake.keys.ArrowLeft){
  	snake.keys.clear();
  	snake.keys.ArrowRight = true;
  }
  if(e.key === 'ArrowLeft' && !snake.keys.ArrowRight){
  	snake.keys.clear();
  	snake.keys.ArrowLeft = true;
  }
  if(e.key === 'ArrowDown' && !snake.keys.ArrowUp) {
  	snake.keys.clear();
  	snake.keys.ArrowDown = true;
  }
  if(e.key === 'ArrowUp' && !snake.keys.ArrowDown) {
  	snake.keys.clear();
  	snake.keys.ArrowUp = true;
  }
})


function checkFoodSnakeCollide(){
  if(snake.currentGrowth > 0){
  	snake.currentGrowth--;
  }
	if(snake.y == snake.food.y && snake.x == snake.food.x ){
  	snake.food.x = undefined;
    snake.food.y = undefined;
    snake.currentGrowth = snake.increment;
  }
}

setInterval(() => {
	update();
  draw();
}, 100)
