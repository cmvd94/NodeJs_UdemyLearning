const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')! ;

//const numberArray: number[] = [];
const numberArray: Array<number> = [];
//const stringArray: string[] = [];
const stringArray: Array<string> = [];
const myObj = {
  name: 'vishnudas',
  age: 30,

}

type NumOrString = number | string
type ResObj = { value : number ; timestamps: Date}

interface ResultObject {
  value : number ; 
  timestamps: Date
}
//function add(num1: number, num2: number) {
//function add(num1: any, num2: any) {
function add(num1: NumOrString, num2: NumOrString ) {
  if(typeof num1 === 'number' && typeof num2 === 'number'){
  return num1 + num2;
  }else if(typeof num1 === 'string' && typeof num2 === 'string'){
  return num1 + num2;
  }/* else { // not possible 
  return num1 + num2;
  } */
}
//console.log(add(num1Element, num2Element));
//console.log(add('1', '6'));
    
function printResult( resultObj : ResObj) {
  console.log(resultObj.value);
}

buttonElement.addEventListener('click', () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const numberRes = add(+num1, +num2)
  const stringRes = add(num1, num2)
  numberArray.push(numberRes as number);
  stringArray.push(stringRes as string);
  console.log(numberArray);
  console.log(stringArray);
  printResult( { value: numberRes as number, timestamps: new Date()})
  
});

//const myPromise = new Promise( (resolve, reject) => {
const myPromise = new Promise<string>( (resolve, reject) => {
  setTimeout( ()=> {
    resolve('it worked');  
    //resolve(1);  
  }, 1000);
})

myPromise.then(result => {
  //console.log(result); // when result just print no issue
  console.log(result.split('w')); //but when doing certain operation with that value we have defines its inner type
})
