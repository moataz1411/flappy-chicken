const canvas=document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
const bg=new Image();
bg.src="img/bg.png";
const ground = new Image();
ground.src = "img/ground.png";
const chicken1 = new Image();
chicken1.src = "img/chicken1.png";
const chicken2 = new Image();
chicken2.src = "img/chicken2.png";
const chicken3 = new Image();
chicken3.src = "img/chicken3.png";
const birdFrames = [chicken1,chicken2,chicken3];
const wingsound = new Audio("sounds/wing.mp3");
let gamestarted=false;
const chicken={x:90, y:250, width:34,height:24, velocity:0,gravity:0.45,jump:-7.5,frame:0,frameTimer:0};
let groundx=0;
const pipeImg=new Image();
pipeImg.src="img/pipe.png";
const pointsound= new Audio("sounds/point.mp3");
const diesound =new Audio ("sounds/die.mp3");
const PIPE_WIDTH = 70;
const GAP=170;
const PIPE_SPEED=2.5;
let pipes=[];
let score=0;
let kills=0;
pipes.push({x:canvas.width+100,top:Math.random()*220+50, scored:false});
document.addEventListener("keydown" ,(e)=>{
if (e.code==="Space"){
    e.preventDefault();
    if(!gamestarted){
        gamestarted=true;
        document.getElementById("startscreen").classList.add("hidden");
    }
    chicken.velocity=chicken.jump;
    wingsound.currentTime=0;
    wingsound.play();
}
});
function update(){
    if(!gamestarted)return;
    chicken.velocity +=chicken.gravity;
    chicken.y += chicken.velocity;
    groundx -=2;
    if(groundx <= -canvas.width){
        groundx=0;
    }
    chicken.frameTimer++;
    if(chicken.frameTimer>7){
        chicken.frame++;
        if (chicken.frame>2){
            chicken.frame=0;
        }
        chicken.frameTimer=0;
}
    for(let i = pipes.length-1; i>=0; i--){
        let pipe = pipes[i];
        pipe.x -= PIPE_SPEED;
        if(pipe.x + PIPE_WIDTH<0){
            pipes.splice(i,1);
        }
        if (pipe.x<chicken.x && !pipe.scored){
            pipe.scored=true;
            score++;
            document.getElementById("scoreval").textContent=score;
            pointsound.currentTime=0;
            pointsound.play();
        }
    }
    if (pipes.length==0||pipes[pipes.length-1].x<250){
        pipes.push({x: canvas.width,top: Math.random()*220 + 50,scored:false});
}
for(const pipe of pipes){
    if(chicken.x+40>pipe.x && chicken.x <pipe.x +PIPE_WIDTH){
        if(chicken.y<pipe.top||chicken.y+35>pipe.top+GAP){
            die();
        }
        }
    }
if(chicken.y + 35 >= canvas.height - 112){
    die();
}
}
function draw(){
ctx.clearRect(0,0,canvas.width, canvas.height);
ctx.drawImage(bg,0,0,canvas.width,canvas.height);
ctx.drawImage(birdFrames[chicken.frame],chicken.x,chicken.y,50,40);
ctx.drawImage(ground,groundx,canvas.height-112,canvas.width,112);
ctx.drawImage(ground,groundx+canvas.width,canvas.height-112,canvas.width,112);
for(const pipe of pipes){
    ctx.save();
    ctx.translate(pipe.x + PIPE_WIDTH/2, pipe.top/2);
    ctx.scale(1,-1);
        ctx.drawImage(pipeImg,-PIPE_WIDTH/2,-pipe.top/2,PIPE_WIDTH,pipe.top);
        ctx.restore();
        ctx.drawImage(pipeImg,pipe.x,pipe.top + GAP,PIPE_WIDTH,canvas.height - (pipe.top + GAP) - 112);
}
}
function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
function die(){
    if(!gamestarted) return;
    gamestarted = false;
    diesound.currentTime = 0;
    diesound.play();
    document.getElementById("finalscore").textContent=score;
    document.getElementById("finalkills").textContent=kills;
    document.getElementById("gameoverscreen").classList.remove("hidden");
    gamestarted=false;
}
