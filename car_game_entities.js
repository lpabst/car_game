import words from './words';

let entities = {
    Ship: function(health, shield, increasedDamage) {
        console.log(this);
        this.health = health;
        this.shield = shield;
        this.increasedDamage = increasedDamage || 0;
    },

    Word: function(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.timeCreated = new Date().getTime();
        
        let randomIndex = Math.floor(Math.random() * words[type].length);
        this.word = words[type][randomIndex];
    },

    Repair: function(x, y) {
        this.x = x;
        this.y = y;
        this.timeCreated = new Date().getTime();

        let randomIndex = Math.floor(Math.random() * words.repairs.length);
        this.word = words.repairs[randomIndex];
    },
}

export default entities;