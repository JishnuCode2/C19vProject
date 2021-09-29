//assigning the variables
    var backGround, backGroundImg,backGround2, invisibleGround;
    var runner, runner_animation;
    var obstacle, obstacleImg,clouds,cloudsImg;
    var gameState = "play";
    var score = 0;
    var obstaclesGroup, cloudsGroup;
    var restart, restartImg, gameOver, gameOver_img;
    var balloonImg,obstacle2,obstacle3,obstacle4;;
    var rand; 
    var day = 1;
    var dieSound, jumpSound, checkPointSound; 
    
    


function preload(){

 // loading the animations, sounds and images.
 runner_animation = loadAnimation("mainPlayer1.png","mainPlayer2.png");
 backGroundImg = loadImage("backGround.png");
 obstacleImg = loadImage("obstacle1.png");
 restartImg = loadImage("restart.png");
 gameOver_img = loadImage("gameOver.png");
 cloudsImg = loadImage("cloud.png");
 balloonImg = loadImage("blue_balloon0.png");
 balloon2Img = loadImage("blue_balloon1.png");
 obstacle2 = loadImage("obstacle2.png");
 obstacle3 = loadImage("obstacle3.png");
 obstacle4 = loadImage("obstacle4.png");
 backGround2 = loadImage("backGround2.png");
 dieSound = loadSound("die.mp3");
 jumpSound = loadSound("jump.mp3");
 checkPointSound = loadSound("checkpoint.mp3")


}

function setup() {
 // creating the canvas
 createCanvas(600,400);

 //creating the sprites and assigning properties to them
 backGround = createSprite(200,100);
 backGround.addImage("background", backGroundImg);
 backGround.addImage("night",backGround2);
 backGround.scale = 4;
 backGround.width = 600;
 runner = createSprite(100,200);
 runner.addAnimation("Running", runner_animation);
 runner.scale = 0.05;
 runner.setCollider("rectangle",0,0,800,800);
 invisibleGround = createSprite(100,330,400,50);
 invisibleGround.visible = false; 
 restart = createSprite(300,200);
 restart.scale = 0.5;
 restart.addImage("restart", restartImg);
 restart.visible = false;
 gameOver = createSprite(300,150);
 gameOver.scale = 0.4;
 gameOver.addImage("gameover", gameOver_img);
 gameOver.visible = false;

 //creating the groups
 obstaclesGroup = new Group();
 cloudsGroup = new Group();



}

function draw() {
 // assigning the background
 background("white");

 // making infinite moving background
 if(backGround.x<50){
     backGround.x = 600;
    }

 if(gameState === "play"){
     //adding gravity to the runner
     runner.velocityY = runner.velocityY+0.7;

     //assigning the increasing velocity of the background
     backGround.velocityX = -(3+score/100);

     //making the runner jump
     if(keyDown("space") && runner.y>280){
         runner.velocityY = -12.6;
         jumpSound.play();
        }

     //making the score increase
     score = Math.round(score+getFrameRate()/60);

     //playing checkPointSound if score becomes a multiple of 100
     if(score%100 === 0 && score>0){
         checkPointSound.play();
        }


     // changing the background randomly
     if(score%560=== 0 && score>0  ){
            switch(Math.round(random(1,2))){
            case 1 :backGround.changeImage("night",backGround2);
                    obstaclesGroup.destroyEach()
                    day = 0
            break;
            case 2 :backGround.changeImage("background", backGroundImg);
                    obstaclesGroup.destroyEach()
                    day = 1;     
            default : break
            }
        }
        
     //making the runner collide with the invisible ground
     runner.collide(invisibleGround);

     //ending the game
     if(obstaclesGroup.isTouching(runner)){
         dieSound.play();
         gameState = "end";
        }

     //calling the functions to generate clouds and obstacles
     spawnObstacles();
     spawnClouds();
    }

 
 if(gameState === "end"){
     //adding conditions that occur when the game ends
     runner.visible = false;
     backGround.velocityX = 0;
     obstaclesGroup.destroyEach();
     cloudsGroup.destroyEach();
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     restart.visible = true;
     gameOver.visible = true;
     runner.velocityY=0;

     //writing code to reset the game
     if(mousePressedOver(restart)){
         reset();
        }

    }

  // displaying the sprites on the screen
  drawSprites()

  //displaying the score
  textSize(20);
  fill("red");
  text("Score: ",10,30);
  fill("black");
  stroke("black");
  text(score, 80,30 );


}

//writing function to generate obstacles
function spawnObstacles(){
    if(frameCount%70 === 0 ){
     obstacle = createSprite(800,300,20,20);
  
     obstacle.velocityX = -(4+score/100);
     obstacle.lifetime =600;
     obstacle.scale = 0.6;
     obstaclesGroup.add(obstacle);

     rand = Math.round(random(1,5));  
     switch(rand){
         case 1:   obstacle.addImage(obstacleImg);
         break;
         case 2:  obstacle.addImage(obstacle2);  
         break;
         case 3 :  obstacle.addImage(obstacle3);
                   obstacle.scale = 0.8;
         break;
         case 4 :  obstacle.addImage(obstacle4);
                   obstacle.scale = 0.4;
                                            
         break;
         case 5:   
                   obstacle.scale = 0.08;
                   obstacle.y = 210;
                   if(day === 0){
                        obstacle.addImage("balloon2", balloon2Img);
                        obstacle.changeImage("balloon2", balloon2Img)
                    }
                   if(day === 1){
                        obstacle.addImage("balloon1", balloonImg);
                        obstacle.changeImage("balloon1", balloonImg);
                    }
         default: break;
        }
    }
}

//writing function to generate clouds
function spawnClouds(){
    if(frameCount%46 === 0){
        clouds = createSprite(600,Math.round(random(30,180)),20,20);
        clouds.addImage(cloudsImg);
    
        clouds.velocityX = -(4+score/100);
        clouds.lifetime =600;
        clouds.scale = 0.4;
        cloudsGroup.add(clouds);
        clouds.depth = runner.depth;
        runner.depth = runner.depth+1;
    }
}

//writing function to reset the game
function reset(){
    gameState = "play";
    restart.visible = false;
    gameOver.visible = false;
    runner.visible = true;
    score = 0;
}



