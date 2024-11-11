const o1 = {};
o1.constructor === Object ? console.log(true) : console.log(false); // true

const o2 = new Object();
o2.constructor === Object ?  console.log(true) : console.log(false); // true

const a1 = [];
a1.constructor === Array ?  console.log(true) : console.log(false); // true

const a2 = new Array();
a2.constructor === Array ?  console.log(true) : console.log(false); // true

const n = 3;
n.constructor === Number ?  console.log(true) : console.log(false); // true

function Tree(name) {
    this.name = name;

}
  const theTree = new Tree("Redwood");
  console.log(`theTree.constructor is ${theTree.constructor} \n${theTree.name}`);

  
  