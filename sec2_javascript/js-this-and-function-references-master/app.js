class NameField {
    constructor(name) {
        const field = document.createElement('li');
        field.textContent = name;
        const nameListHook = document.querySelector('#names');
        nameListHook.appendChild(field);
    }
}

class NameGenerator {
    constructor() {
        const btn = document.querySelector('button');
        this.names = ['Max', 'Manu', 'Anna'];
        this.currentName = 0;

        console.log(this);//this is constructor
       /*  btn.addEventListener('click', () => {
            this.addName();
        }); */
        // Alternative:
        //btn.addEventListener('click', this.addName.bind(this));

        //wrong way
        /* btn.addEventListener('click', function(){
            this.addName();
        }); */
        //Alternative:
        //btn.addEventListener('click', this.addName);//but this is refere to btn
    }
    
    addName() {
        console.log(this);
        const name = new NameField(this.names[this.currentName]);
        this.currentName++;
        if (this.currentName >= this.names.length) {
            this.currentName = 0;
        }
    }
}

const gen = new NameGenerator();