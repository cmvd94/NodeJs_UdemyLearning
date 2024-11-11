//primitive value
//(string,number,boolen,undefined,null,symbol) => stored in stack
let firstName = "vishnudas";
let secondName = firstName;
console.log(firstName);

console.log(secondName);
//two new entry refer different location in stack
secondName = "cmvishnudas"
console.log(secondName);
console.log(firstName);

//reference value
//object,array => store data in an address(heap) where pointer points to it, which is stored in stack

let obj1 = { 
    name: "vishnudas",
    age: 30,
    hobbies: ["fifa", "mobile"]
}
console.log(obj1)
let obj2 = obj1;
//two pointer created refer to same address
console.log(obj2);

let obj3 = Object.create(obj1);
let obj4 = Object.assign({
    test: "test"
},obj1)

obj2.name = "sankar";
obj2.hobbies.push("push");
console.log(obj1);
console.log(obj2);
console.log(obj3.name);
console.log(obj4);



