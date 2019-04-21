// Start of boot state
// Load assets and set to the preloader
// Logo
var boot = {
   
    preload: function() {
        this.loadFonts();
        this.loadImages();
        this.loadSounds();
    },
     
    create: function() {
        this.setTimerToChange();
    },

    setTimerToChange: function(){
        this.timer = game.time.events.loop(1000, this.changeToPreLoader, this);
    },

    changeToPreLoader: function(){
        this.state.start("preloader");
    },

    loadFonts: function(){
        game.load.bitmapFont('newFont', 'assets/fonts/newfont.png', 'assets/fonts/newfont.fnt');
    },

    loadImages: function(){
        this.loadLoadingScreen();
        this.loadBackground();
        this.loadObstacles();
        this.loadCharacters();
    },

    loadLoadingScreen: function(){
        game.load.image('loading-clouds', 'assets/loading/loading-back.png');
        game.load.image('loading-text', 'assets/loading/loading-front.png');
    },

    loadObstacles: function(){
        game.load.image('brick', 'assets/obstacles/brick.png');
    },

    loadBackground: function(){
        game.load.image('background-color', 'assets/background/bg-back.png');
        game.load.image('background-clouds', 'assets/background//bg-mid.png');
        game.load.image('background-city', 'assets/background/bg-front.png');
    },

    loadCharacters: function(){
        game.load.image('bord', 'assets/characters/bord.gif');
        game.load.image('divol', 'assets/characters/divol.gif');
        game.load.image('general', 'assets/characters/general.gif');
        game.load.image('pink', 'assets/characters/pink.gif');
        game.load.image('punky', 'assets/characters/punky.gif');  
        game.load.image('rom', 'assets/characters/rom.gif');        
        game.load.image('ufo', 'assets/characters/ufo.png');        
    },

    loadSounds: function(){
        game.load.audio('jump', 'assets/sounds/jump.wav');
        game.load.audio('coin','assets/sounds/coin.wav');
        game.load.audio('collission','assets/sounds/collision.wav');
        game.load.audio('falling','assets/sounds/falling.wav');
        game.load.audio('game_over', 'assets/sounds/game_over.wav');
    },
};
// end of boot state


// Start of preload
// loading screen and progress bar
var preloader = {
   
    preload: function() {
        this.setLoadingScreen();
    },
     
    create: function() {
        this.setLoadingTimmer();
    },

    update: function(){
        this.moveBackgroundLoading();
    },

    setLoadingTimmer: function(){
        this.timer = game.time.events.loop(2500, this.changeToGame, this);
    },

    changeToGame: function(){
        this.state.start("main");
    },

    setLoadingScreen: function(){
        game.stage.backgroundColor = '#3DDEED';
        this.loadingClouds = game.add.tileSprite(0, 0, 1000, 600, 'loading-clouds');
        this.loadingTitle = game.add.tileSprite(0, 0, 1000, 600, 'loading-text');
        this.loadingBird = game.add.sprite(0, 125, 'bord');
    },

    moveBackgroundLoading: function(){
        this.loadingClouds.tilePosition.x -= 0.4;
        this.loadingBird.x += 0.9;
    }
};
// end of preload function


// Start of main state
// game logic and level
var main = {

    preload: function(){

    },

    create: function(){
        this.addSounds();
        this.addSceneSettings();
        this.addBackground();
        this.addMainCharacter();
        this.addGameController();
        this.addBricks();
        this.addScoreSettings();
        this.pauseSettings();
        this.startGame();
    },

    update: function(){
        this.isGameOver();
        this.isBirdColliding();
        this.isBirdFalling();
        this.moveBackground();
        this.setBirdOnTop();
    },

    startGame: function(){
        start_text = game.add.bitmapText(this.world.centerX, 175, 'newFont', 'Press to start', 40);
        start_text.anchor.set(0.5);
        start_text.inputEnabled = true;
        game.paused = true;
    },

    addSounds: function(){
        this.jumpSound = game.add.audio('jump'); 
        this.coinSound = game.add.audio('coin');
        this.collisionSound = game.add.audio('collission');
        this.fallingSound = game.add.audio('falling');
        this.gameOverSound = game.add.audio('game_over');
    },

    addSceneSettings: function(){
        game.stage.backgroundColor = '#8AC4D2';
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    addBackground: function(){
        this.bgColor = game.add.tileSprite(0, 0, 1000, 600, 'background-color');
        this.bgClouds = game.add.tileSprite(0, 0, 1000, 600, 'background-clouds');
        this.bgCity = game.add.tileSprite(0, 0, 1000, 600, 'background-city');
    },
 
    addMainCharacter: function(){
        this.getRandomCharacter();
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        this.bird.anchor.setTo(-0.1, 0.5);   
    },

    useBordCharacter: function(){
        var isTimeToChange = Math.floor(Math.random() * 100);
        if(isTimeToChange < 65 ){
            return true;
        }else{
            return false;
        }
    },

    getRandomCharacter: function(){
        var changeCharacter = this.useBordCharacter();

        if(changeCharacter){
            this.bird = game.add.sprite(50, 245, "bord");
        }else{
            var listOfCharacters = ["divol", "general", "pink", "punky", "rom", "ufo"];
            var characterNumber = Math.floor(Math.random() * listOfCharacters.length);
            this.bird = game.add.sprite(50, 245, listOfCharacters[characterNumber]);
        }
    },

    addGameController: function(){
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);
    },

    addBricks: function(){
        this.bricks = game.add.group(); 
        this.timer = game.time.events.loop(1500, this.addRowOfBricks, this);
    },

    addScoreSettings: function(){
        this.score = 0;
        this.labelScore = game.add.bitmapText(145, 45, 'newFont', '0', 60);
        
    },

    setBirdOnTop: function(){
        game.world.bringToTop(this.bird);
    },

    isGameOver: function(){
        if (this.bird.y < 0 || this.bird.y > 490)this.restartGame();
    },
    
    isBirdColliding: function(){
        game.physics.arcade.overlap(this.bird, this.bricks, this.hitBrick, null, this); 
    },

    moveBackground: function(){
        if(this.bird.alive){
            this.bgClouds.tilePosition.x -= 0.5;
            this.bgCity.tilePosition.x -= 2.5;
        }
    },

    isBirdFalling: function(){
        if (this.bird.angle < 20)
        this.bird.angle += 1; 
    },
    
    jump: function() {
        if (this.bird.alive == false)
        return;
        this.bird.body.velocity.y = -350;
        this.addBirdAnimation();
        this.jumpSound.play();
    },

    addBirdAnimation: function(){
        var animation = game.add.tween(this.bird);
        animation.to({angle: -20}, 100);
        animation.start(); 
    },

    restartGame: function() {
        this.gameOverSound.play();
        this.saveScore();
        game.state.start('main');
    },

    pauseSettings: function(){
        pause_label = game.add.bitmapText(255, 5, 'newFont', 'pause', 25);
        highScoreBoard = game.add.bitmapText(this.world.centerX, this.world.centerY+45, 'newFont', '', 25);
        highScoreBoard.anchor.set(0.5);
        pause_label.inputEnabled = true;
        this.pauseGame();
    },

    pauseGame: function(){
        this.updateLocalResult();

        pause_label.events.onInputUp.add(function () {
            game.paused = true;
            pause_label.setText('play');
            highScoreBoard.setText(results);
        });
        game.input.onDown.add(this.unPauseGame, self);
    },

    unPauseGame: function(){
        game.paused = false;
        pause_label.setText('pause');
        highScoreBoard.setText('');
        start_text.setText('');
    },

    saveScore: function(){
        if(this.isNewScoreBiggerThantLastOne()){
            this.addScore();
            this.orderHighScore();
            this.removeLastPosition();
            this.saveOnLocal();  
        }
    },

    isNewScoreBiggerThantLastOne: function(){
        const lasPosition = highScores.length-1;
        return highScores[lasPosition]<this.score;
    },

    addScore: function(){
        highScores.push(this.score);
    },

    removeLastPosition: function(){
        const lasPosition = 5;
        if(highScores[lasPosition]!=null){
            highScores.splice(5,1);
        }
    },

    orderHighScore: function(){
        for(i=0;i<(highScores.length-1);i++)
        for(j=0;j<(highScores.length-i);j++){
            if(highScores[j]>highScores[j+1]){
             aux=highScores[j];
             highScores[j]=highScores[j+1];
             highScores[j+1]=aux;
            }
        }
        highScores = highScores.sort(this.biggerToSmaller);
    },
    
    biggerToSmaller: function(elem1, elem2){
        return elem2-elem1;
    },

    saveOnLocal: function(){
        localStorage.setItem('highScores', JSON.stringify(highScores));
    },

    addOnBrick: function(x, y) {
        var brick = game.add.sprite(x, y, 'brick');
        this.bricks.add(brick);
        game.physics.arcade.enable(brick);
        brick.body.velocity.x = -200;
        this.removeBrick(brick);
    },

    removeBrick: function(brickToRemove){
        brickToRemove.checkWorldBounds = true;
        brickToRemove.outOfBoundsKill = true;
    },

    addRowOfBricks: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnBrick(340, i * 60);
        this.addLocalScore();
    },

    addLocalScore: function(){
        this.score += 1;
        this.labelScore.text = this.score;
        this.coinSound.play();
    },

    hitBrick: function() {
        if (this.bird.alive == false)
            return;
        this.bird.alive = false;
        this.collisionSound.play();
        this.fallingSound.play();
    
        game.time.events.remove(this.timer);
    
        this.bricks.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    updateLocalResult: function(){
        results = 'HighScore:';
        for(i=0;i<(highScores.length);i++){
            results += '\n     '+highScores[i];
        }
    },
    
};
// end of main state


var results = '';
var highScores = localStorage.getItem('highScores') ? JSON.parse(localStorage.getItem('highScores')) : [0];

var game = new Phaser.Game(340, 480, Phaser.CANVAS, 'game-container');

game.state.add('boot', boot); 
game.state.add('preloader', preloader); 
game.state.add('main', main); 

game.state.start('boot');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('service-worker.js')
            //  .then(function() { console.log('Service Worker Registered'); });
}