

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, BulletImage, EnemyImgae, gameOverImage; 
let gameOver = false //true = over, false =weiter;
let score = 0;
let spaceshipImageX = (canvas.width/2) - 16;
let spaceshipImageY = canvas.height-64;
let enemyList=[];
let BulletList = [];
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipImageX+26;
        this.y = spaceshipImageY;
        this.alive = true;
        BulletList.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit = function(){
        for(let i = 0; i<enemyList.length; i++){
            if(this.y <= enemyList[i].y
                && this.x>=enemyList[i].x 
                && this.x <= enemyList[i].x+50){
                score++;
                this.alive = false;
                enemyList.splice(i, 1);
                //
            }
        }
        
    }
}
function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum
}
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-50);
        enemyList.push(this)
    };

    this.update = function(){
        this.y += 5;
        if(this.y >= canvas.height-50){
            gameOver = true;
        //    console.log("gameover");
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "image/backgroundImage.jpeg";

    spaceshipImage = new Image();
    spaceshipImage.src = "image/spaceshipImage.png";

    BulletImage = new Image();
    BulletImage.src = "image/bullet.png";

    EnemyImgae = new Image();
    EnemyImgae.src = "image/EnemyImage.png";

    gameOverImage = new Image();
    gameOverImage = "imgae/gameover_Background.png";
}
let keysDown={};
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode] = true;

       // console.log("키다운객체에 들어간 값은?", keysDown);
    });
    document.addEventListener("keyup", function(){
        delete keysDown[event.keyCode]
        //console.log("버튼 클릭후",keysDown);
        if(event.keyCode == 32){
            createBullet() //Bullet created.

        }
    });
}

function createBullet(){
    //console.log("Bullet wurde herstellt");
    let b = new Bullet();
    b.init();
     
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000)
}
function update(){
    
    if( 39 in keysDown){
        spaceshipImageX += 3;
    } //right
    if( 37 in keysDown){
        spaceshipImageX -= 3;
    }//left
    if(spaceshipImageX <= 0){
        spaceshipImageX = 0;
    }
    if(spaceshipImageX >= canvas.width-64){
        spaceshipImageX = canvas.width-64;
    }

    for(let i = 0; i< BulletList.length; i++){
        if(BulletList[i].alive){
            BulletList[i].update();
            BulletList[i].checkHit();  
        }
        
    }
    for(let i = 0; i< enemyList.length; i++){
        enemyList[i].update();  
    }
}
function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipImageX, spaceshipImageY);
    ctx.fillText(`Score: ${score}` ,20,20);
    ctx.fillStyle='white';
    ctx.font = '25px serif';
    for(let i = 0; i<BulletList.length; i++){
        if(BulletList[i].alive){
            ctx.drawImage(BulletImage, BulletList[i].x, BulletList[i].y);
        }
        
    }
    for(let i = 0; i< enemyList.length; i++){
        ctx.drawImage(EnemyImgae,enemyList[i].x, enemyList[i].y)
    }


}

function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(spaceshipImage,20,20,300,300);
    }
    
        
}

loadImage();
setupKeyboardListener();
createEnemy();
main();