
// import entities from './entities';

let pirateGame = {
    init: (difficulty, pirateClass) => {
        let difficultyMapping = {
            // difficulty: [health, shield, wordDuration, newWordFrequency]
            'Easy': [150, 2, 5000, 100],
            'Medium': [125, 1, 3500, 80],
            'Hard': [100, 0, 2000, 60],
        }

        document.getElementById('messageDiv').innerText = '';
        document.querySelectorAll('.btn').forEach( btn => btn.style.visibility = 'hidden');

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var animationFrame = 0;
        var gameOver = false;
        var gameRunning = true;

        let wordsToType = [];
        let typedWord = '';
        let score = 0;
        let scoreIncrementer = 1;
        let shipScoreIncrementer = 100;
        let health = difficultyMapping[difficulty][0];
        let shield = difficultyMapping[difficulty][1];
        let wordDuration = difficultyMapping[difficulty][2];
        let newWordFrequency = difficultyMapping[difficulty][3];
        let ship = new entities.Ship(health, shield);
        let enemy = new entities.Ship(50, 3);
        let shipsDestroyed = 0;

        pirateClass.data = { pirateClass, canvas, context, animationFrame, gameOver, gameRunning, wordsToType, typedWord, score, scoreIncrementer, shipScoreIncrementer, wordDuration, newWordFrequency, ship, enemy, shipsDestroyed };

        document.getElementById('toggleShop').style.visibility = 'visible';
        document.getElementById('toggleShop').addEventListener('click', function(){
            pirateGame.togglePauseGame(pirateClass);
            pirateClass.toggleShop();
        })

        // Add keydown event listener
        pirateClass.data.keydownListener = function(e){
            pirateGame.handleInput(e, pirateClass);
        }
        window.addEventListener('keydown', pirateClass.data.keydownListener);

        pirateGame.run(pirateClass);
    },

    run: pirateClass => {
        function loop() {
            if (pirateClass.data.gameOver) {
                pirateGame.gameOver(pirateClass);
            } else {
                if (pirateClass.data.gameRunning){
                    pirateGame.update(pirateClass);
                    pirateGame.render(pirateClass);
                    pirateClass.data.animationFrame++;
                }

                window.requestAnimationFrame(loop);
            }
        }

        loop();
    },

    togglePauseGame: pirateClass => {
        if (pirateClass.data.gameRunning){
            // Check how much time has elapsed for each word on the screen
            let now = new Date().getTime();
            pirateClass.data.wordsToType.forEach( obj => {
                obj.timeElapsed = now - obj.timeCreated;
            })

            pirateClass.data.gameRunning = false;
        }else{
            // Update the 'timeCreated' of each word to reflect how much time has elapsed. 
            // This helps pause the game while in the shop
            let now = new Date().getTime();
            pirateClass.data.wordsToType.forEach( obj => {
                obj.timeCreated = now - obj.timeElapsed;
            })

            document.getElementById('messageDiv').innerText = '';
            pirateClass.data.gameRunning = true;
        }
    },

    handleInput: (e, pirateClass) => {
        if (pirateClass.data.gameOver) return;

        // Arrows shouldn't scroll the screen
        if (e.keyCode >= 37 && e.keyCode <= 40){
            e.preventDefault();
        }

        // right arrow pauses game and opens shop for purchasing upgrades
        if(e.keyCode === 39) {
            pirateGame.togglePauseGame(pirateClass);
            pirateClass.toggleShop();
        }
        
        // backspace and delete should both remove most recently typed letter
        if (e.keyCode === 8 || e.keyCode === 46){
            e.preventDefault();
            pirateClass.data.typedWord = pirateClass.data.typedWord.substring(0, pirateClass.data.typedWord.length-1);
        }
        // enter and space bar both clear what user has typed completely
        else if (e.keyCode === 13 || e.keyCode === 32){
            e.preventDefault();
            pirateGame.checkForCompleteWord(pirateClass);
            pirateClass.data.typedWord = '';
        }
        // Only letters should be added to the word
        else if (e.keyCode >= 65 && e.keyCode <= 90){
            e.preventDefault();
            pirateClass.data.typedWord += e.key;
            pirateGame.checkForCompleteWord(pirateClass);
        }

        document.getElementById('typedWord').innerText = pirateClass.data.typedWord;
    },

    checkForCompleteWord: pirateClass => {
        let { wordsToType, typedWord, ship, scoreIncrementer, shipScoreIncrementer } = pirateClass.data;
        // Finds the first word that matches what the user has typed so far and removes it from the list
        for (let i = 0; i < wordsToType.length; i++){
            if (wordsToType[i].word.toLowerCase().trim() === typedWord.toLowerCase().trim()){

                if (wordsToType[i].type === 'cannonball'){
                    // score goes up & enemy ship takes damage
                    pirateClass.data.score += scoreIncrementer;
                    let damage = wordsToType[i].word.length + ship.increasedDamage - pirateClass.data.enemy.shield;
                    pirateClass.data.enemy.health -= damage > 0 ? damage : 0;

                    // When destroying an enemy ship
                    if (pirateClass.data.enemy.health <= 0){
                        // Additional points
                        pirateClass.data.score += shipScoreIncrementer;
                        pirateClass.data.shipsDestroyed ++;
                        
                        // User earns additional damage
                        pirateClass.data.ship.increasedDamage++;

                        // "Create" a new enemy by updating the enemy's health/increasedDamage
                        pirateClass.data.enemy.health = (20 * pirateClass.data.shipsDestroyed) + (Math.floor(Math.random() * 50) + 70);
                        pirateClass.data.enemy.increasedDamage++;

                        // things get faster (max out at 1500ms word duration and a new word every 50 animationFrames)
                        pirateClass.data.wordDuration -= 100;
                        pirateClass.data.newWordFrequency -= 2;
                    }
                }else{
                    pirateClass.data.ship.health += 2;
                }

                pirateClass.data.typedWord = '';
                pirateClass.data.wordsToType.splice(i--, 1);
                return;
            }
        }
    },

    update: pirateClass => {
        let { wordsToType, newWordFrequency, ship, enemy, canvas } = pirateClass.data;

        // Establish minimums for wordDuration and newWordFrequency
        if (pirateClass.data.wordDuration < 1200) pirateClass.data.wordDuration = 1200;
        if (pirateClass.data.newWordFrequency < 50) pirateClass.data.newWordFrequency = 50;

        // Every 60/80/100 frames (depending on difficulty), add a word to the user's array of words they need to type
        if (pirateClass.data.animationFrame % newWordFrequency === 0){
            let randX = Math.floor(Math.random() * (canvas.width-170)) + 50;
            let randY = Math.floor(Math.random() * (canvas.height-270)) + 240;
            let newWord = new entities.Word(randX, randY, 'cannonball');
            wordsToType.push(newWord);

            // Every now and then randomly add a repair word to the array as well
            let randomChance = Math.floor(Math.random() * 100);
            if (randomChance <= 2){
                let randX = Math.floor(Math.random() * (canvas.width-170)) + 50;
                let randY = Math.floor(Math.random() * (canvas.height-270)) + 240;
                let newWord = new entities.Word(randX, randY, 'repair');
                wordsToType.push(newWord);
            }
        }

        // Any word that has been up for longer than the chosen word duration disappears
        let now = new Date().getTime();
        for (let i = wordsToType.length-1; i >= 0; i--){
            if (now - wordsToType[i].timeCreated >= pirateClass.data.wordDuration){
                // If it's a cannonball, it causes damage equal to the length of the word
                if (wordsToType[i] && wordsToType[i].type === 'cannonball'){
                    let damage = wordsToType[i].word.length + enemy.increasedDamage - ship.shield;
                    pirateClass.data.ship.health -= ( damage > 0 ) ? damage : 0;

                    if (pirateClass.data.ship.health <= 0){
                        pirateClass.data.gameOver = true;
                    }
                }
                
                wordsToType.splice(i, 1);
            }
        }
        
    },

    render: pirateClass => {
        let { canvas, context, ship, score, wordsToType } = pirateClass.data;

        // Black background
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // white Game Info
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText('Score: ' + score, 10, 25);
        context.fillText('Health: ' + ship.health, 10, 50);
        context.fillText('Shield: ' + ship.shield, 10, 75);

        // Words to type
        context.font = '20px Arial';
        wordsToType.forEach( obj => {
            if (obj.type === 'repair'){
                context.fillStyle = 'green';
            }else{
                context.fillStyle = 'white';
            }
            context.fillText(obj.word, obj.x, obj.y);
        })

        // Red Text for enemy info
        context.fillStyle = 'red';
        context.font = '20px Arial';
        context.fillText('Enemy', 450, 25);
        context.fillText('Health: ' + pirateClass.data.enemy.health, 450, 50);
        context.fillText('Shield: ' + pirateClass.data.enemy.shield, 450, 75);

    },
    
    gameOver: pirateClass => {
        let { context, score } = pirateClass.data;

        pirateGame.render(pirateClass);

        // game over text
        context.fillStyle = 'white';
        context.font = '42px Arial';
        context.fillText('Game Over', 200, 300);

        if (pirateClass.data.gameOverMessage) {
            document.getElementById('messageDiv').innerText = pirateClass.data.gameOverMessage;
        }
        
        document.querySelectorAll('.btn').forEach( btn => btn.style.visibility = 'visible');
        document.getElementById('toggleShop').style.visibility = 'hidden';

        // remove keydown event listener
        window.removeEventListener('keydown', pirateClass.data.keydownListener);

        // Send score to back end
        pirateClass.newPiratesHighScore(score);
    },
}

export default pirateGame;