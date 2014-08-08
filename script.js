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
	this.yVel =0;
	this.xVel =0;
	r=25; //radius 


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

function Obstacle(height,x){
this.x =x;

this.height = height*10;

this.stack=height;


}



init = function(){
	console.log('loaded');

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	score=0;
	loc=0;//last visited pipe
	camera = new Camera();

	player= new Player();

	bottomObstacles=[];
	topObstacles=[];

	bottomObstacles.push( new Obstacle(8,350));
	
	for(var i =1 ; i<10; i++){
		stack = Math.floor(Math.random() * 20) + 6;
		x= Math.floor(Math.random() * 120) + 120;
		x += bottomObstacles[i-1].x;

		
		topStack = Math.floor(Math.random() * (50-stack-13)) +3;

		bottomObstacles.push( new Obstacle(stack,x));
		topObstacles.push( new Obstacle(topStack,x));

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


	loop =0;
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


		bottomObstacles.push( new Obstacle(stack,x));
		topObstacles.push( new Obstacle(topStack,x));


	} 

}

update = function(){
	player.moveX(1);
	camera.x -=3;
	player.y += player.yVel;
	player.yVel += GRAVITY;
	//console.log('camera loop counter' + camera.x%500);
	checkPoints();
	
	draw();

	//console.log(player.x);
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
	
		
		
	


	ctx.fillRect(player.x,player.y,50,50);

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

	ctx.fillText(player.x,-camera.x+50,30);
	ctx.fillText('camera x' + camera.x,-camera.x+50,60);

	ctx.font= "40px 'Indie Flower' red";
	ctx.fillText('Score: ' + score,-camera.x+350,40);

	ctx.restore();



}



})();