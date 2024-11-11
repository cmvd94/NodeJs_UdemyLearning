"use strict";
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const buttonElement = document.querySelector('button');
//const numberArray: number[] = [];
const numberArray = [];
//const stringArray: string[] = [];
const stringArray = [];
//function add(num1: number, num2: number) {
//function add(num1: any, num2: any) {
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + num2;
    } /* else { // not possible
    return num1 + num2;
    } */
}
//console.log(add(num1Element, num2Element));
//console.log(add('1', '6'));
function printResult(resultObj) {
    console.log(resultObj.value);
}
buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const numberRes = add(+num1, +num2);
    const stringRes = add(num1, num2);
    numberArray.push(numberRes);
    stringArray.push(stringRes);
    console.log(numberArray);
    console.log(stringArray);
    printResult({ value: numberRes, timestamps: new Date() });
});
//const myPromise = new Promise( (resolve, reject) => {
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('it worked');
        //resolve(1);  
    }, 1000);
});
myPromise.then(result => {
    //console.log(result); // when result just print no issue
    console.log(result.split('w')); //but when doing certain operation with that value we have defines its inner type
});
