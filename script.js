GRAVITY = 1.2;

(function(){

function Camera(){
	this.x=-1;
	this.y=0;

}

Camera.prototype.moveX = function(x){
	this.x += x;
}

function Player(){
	this.x =50;
	this.y = 250;
	this.yVel =-5;
	this.xVel =2;
	this.width=50;
	this.height=70;
	r=25; //radius 

	this.img = new Image();
	this.img.src = ('images/char.png');


}

Player.prototype.moveX =  function(x){
	this.x += x+this.xVel;
	this.xvel -= 1;
	
}
Player.prototype.moveY =  function(y){
	this.y += y;
}
Player.prototype.jump = function(){
	this.yVel=-6;
}

Player.prototype.getOriginX = function(){
	return (this.width/2)+this.x;
}

Player.prototype.getOriginY = function(){
	return (this.height/2)+this.y;
}

function Obstacle(height,x,top){
this.x =x;

this.top=top;
this.height = height*10;

if(top){this.y = this.height;}
else{this.y = 490-this.height;}

this.width = 50;

this.stack=height;


}

Obstacle.prototype.getOriginX = function(){
	return (this.width/2)+this.x;
}
Obstacle.prototype.getOriginY = function(){
	//return (this.height/2)+this.y;
	if(this.top){return (this.height+43)/2;}
	else{
	return this.height/2+this.y;
	}
}

collision = function(player,obj){
	
	var playerCollideX=Math.abs(player.getOriginX() - obj.getOriginX() ) *2 < player.width + obj.width;
	var playerCollideY=Math.abs(player.getOriginY() - obj.getOriginY() ) *2  < player.height+obj.height;
	if( (Math.abs(player.getOriginX() - obj.getOriginX() ) )*2 < player.width + obj.width &&
			(  (Math.abs(player.getOriginY() - obj.getOriginY() ) )*2  < player.height+obj.height)
			){
	
		
		console.log('collision');
		return true;
	}
	return false;
}



init = function(){
	console.log('loaded');

	gameStart=false;
	gameEnd=false;

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	score=0;
	loc=0;//last visited pipe
	camera = new Camera();

	player= new Player();
	player.yvel=-5;

	bottomObstacles=[];
	topObstacles=[];

	bottomObstacles.push( new Obstacle(8,350));
	
	for(var i =1 ; i<10; i++){
		stack = Math.floor(Math.random() * 20) + 6;
		x= Math.floor(Math.random() * 120) + 120;
		x += bottomObstacles[i-1].x;

		
		topStack = Math.floor(Math.random() * (50-stack-13)) +3;

		bottomObstacles.push( new Obstacle(stack,x,false));
		topObstacles.push( new Obstacle(topStack,x,true));

	}

	canvas.addEventListener('keydown', function(e) {
        if (e.keyCode === 37) { // left
            
            player.moveX(-8);
            player.xVel=-4;
        } else if (e.keyCode === 39) { // right
            
            player.moveX(8);
            player.xVel=4;
        }
        else if (e.keyCode==74){
        	player.jump();
        	
        }
         else if (e.keyCode==83){ //s
        	gameStart=true;
        	player.x=30;
        	player.y=100;
        	player.yVel=-5;

        	
        }
        else if (e.keyCode==82){ //r
        	//reset all game variables
        	gameStart=true;
        	gameEnd=false;
        	loc=0;
        	score=0;
        	camera.x=0;
        	player.x=30;
        	player.y=100;
        	player.yVel=-5;

        	bottomObstacles=[];
			topObstacles=[];

			bottomObstacles.push( new Obstacle(8,350));
	
			for(var i =1 ; i<10; i++){
				stack = Math.floor(Math.random() * 20) + 6;
				x= Math.floor(Math.random() * 120) + 120;
				x += bottomObstacles[i-1].x;

		
				topStack = Math.floor(Math.random() * (50-stack-13)) +3;

				bottomObstacles.push( new Obstacle(stack,x,false));
				topObstacles.push( new Obstacle(topStack,x,true));

			}
			background = [0,500];
        	
        }
       },false);

	bg = new Image();
	bg.src = ('images/bg.jpg');


	cloud = new Image();
	cloud.src=('images/cloud.png');

	topPiece = new Image();
	topPiece.src = ('images/top.png');

	middle = new Image();
	middle.src = ('images/middle.png');
	
	background = [0,500];
	smallClouds=[ 0, 100, 200, 300, 400];
	middleClouds=[ 0, 150, 300, 450];
	largeClouds=[ 200,400];


	

	
	setInterval(update,100);
	


}

checkPoints = function(){
	if (player.x + 20 > bottomObstacles[loc].x){
		score++;
		loc++;
		console.log(score);

		var last = bottomObstacles.length;
		stack = Math.floor(Math.random() * 20) + 4;
		x= Math.floor(Math.random() * 150) + 120;
		x += bottomObstacles[last-1].x;

		topStack = Math.floor(Math.random() * (50-stack-10)) +3;


		bottomObstacles.push( new Obstacle(stack,x,false));
		topObstacles.push( new Obstacle(topStack,x,true));


	} 

}

update = function(){
	if(!gameEnd){
	player.moveX(1);
	camera.x -=3;
	player.y += player.yVel;
	player.yVel += GRAVITY;
}
	//console.log('camera loop counter' + camera.x%500);
	checkPoints();
	
	for(var i =0;i<=loc+4; i++){
		gameEnd=collision(player,topObstacles[i]);
		if(gameEnd){break;}
		gameEnd=collision(player,bottomObstacles[i]);
		if(gameEnd){break;}


	}
	//if(gameEnd){alert("collison");}
	
	if(gameStart){
	draw();
	}
	else if(!gameStart){
		drawWelcome();
	}

	
}

drawEndGame = function(){
	ctx.clearRect(0,0,500,500);
}

drawWelcome = function(){
	ctx.clearRect(0,0,500,500);

	ctx.drawImage(bg,0,0,500,500);

	for(var i=0;i<smallClouds.length;i++){
	 	smallClouds[i] -= +1;
		//console.log('clodud' + i +' '+ smallClouds[i] );

			if(smallClouds[i]+30<0){
				//alert('cloud off');
				smallClouds[i]=530;
				

			}
		ctx.drawImage(cloud,smallClouds[i],50,30,30);
	}
	for(var i=0;i<middleClouds.length;i++){
	 	middleClouds[i] -= +2;
		//console.log('clodud' + i +' '+ middleClouds[i] );

			if(middleClouds[i]+30<0){
				//alert('cloud off');
				middleClouds[i]=530;
				

			}
		ctx.drawImage(cloud,middleClouds[i],60,40,40);
	}
	for(var i=0;i<largeClouds.length;i++){
	 	largeClouds[i] -= +4;
		//console.log('clodud' + i +' '+ largeClouds[i] );

			if(largeClouds[i]+30<0){
				//alert('cloud off');
				largeClouds[i]=530;
				

			}
		ctx.drawImage(cloud,largeClouds[i],45,60,60);
	}

	ctx.font= "80px 'Indie Flower' red";
	ctx.fillText('Welcome!',100,200);

	ctx.font= "40px 'Indie Flower' red";
	ctx.fillText('Press "S" to start',100,250);
}



draw = function(){
	ctx.save();

	ctx.translate(camera.x,camera.y);

	

	ctx.clearRect(-camera.x,0,500,500);

	
	//ctx.drawImage(bg,500*loop,0,500,500);
	
	//ctx.drawImage(bg,500*(loop+1),0,500,500);
	for(var i=0;i<background.length;i++){
	 	background[i] -= +1;
		//console.log('clodud' + i +' '+ smallClouds[i] );

			if(background[i]+camera.x<-500){
				//alert('cloud off');
				background[i]+=1000;
				

			}
		ctx.drawImage(bg,background[i],0,500,500);
	}
	

	
	for(var i=0;i<smallClouds.length;i++){
	 	smallClouds[i] -= +1;
		//console.log('clodud' + i +' '+ smallClouds[i] );

			if(smallClouds[i]+camera.x+30<0){
				//alert('cloud off');
				smallClouds[i]+=530;
				

			}
		ctx.drawImage(cloud,smallClouds[i],50,30,30);
	}
	for(var i=0;i<middleClouds.length;i++){
	 	middleClouds[i] -= +2;
		//console.log('clodud' + i +' '+ middleClouds[i] );

			if(middleClouds[i]+camera.x+30<0){
				//alert('cloud off');
				middleClouds[i]+=530;
				

			}
		ctx.drawImage(cloud,middleClouds[i],60,40,40);
	}
	for(var i=0;i<largeClouds.length;i++){
	 	largeClouds[i] -= +4;
		//console.log('clodud' + i +' '+ largeClouds[i] );

			if(largeClouds[i]+camera.x+30<0){
				//alert('cloud off');
				largeClouds[i]+=530;
				

			}
		ctx.drawImage(cloud,largeClouds[i],45,60,60);
	}
	
		
		
	


	ctx.drawImage(player.img,player.x,player.y,player.width,player.height); // draw character

	for(var i =0;i<bottomObstacles.length;i++){
		ctx.drawImage(topPiece,bottomObstacles[i].x,490-bottomObstacles[i].height,80,20);
			
			//console.log(500-obstacles[0].stack*10);
			for( var h=490;h>500-bottomObstacles[i].stack*10; h -= 10){
				ctx.drawImage(middle,bottomObstacles[i].x,h);
				//console.log('in for');
			}

	}
	for(var i =0;i<topObstacles.length;i++){
		ctx.drawImage(topPiece,topObstacles[i].x,topObstacles[i].height,80,20);
			
			//console.log(topObstacles[i].height);
			for( var h=0;h<topObstacles[i].stack*10; h += 10){
				ctx.drawImage(middle,topObstacles[i].x,h);
				//console.log('in for');
			}

	}

	//ctx.fillText(player.x,-camera.x+50,30);
	//ctx.fillText('camera x' + camera.x,-camera.x+50,60);

	ctx.font= "40px 'Indie Flower' red";
	ctx.fillText('Score: ' + score,-camera.x+350,40);

	if(gameEnd){
		ctx.font= "80px 'Indie Flower' red";
		ctx.fillText('Game Over', 60-camera.x,150);

		ctx.font= "40px 'Indie Flower' red";
		if(score==1){
			ctx.fillText('You scored '+score+' point!',80-camera.x,230);

		}
		else{
			ctx.fillText('You scored '+score+' points!',80-camera.x,230);
		}

		ctx.font= "40px 'Indie Flower' red";
	ctx.fillText('Press "R" to play again',80-camera.x,300);
	}

	ctx.restore();



}



})();