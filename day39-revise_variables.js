var a = 5;
if(true){
    let a = 10;
    console.log('Block scope:',a);
}
console.log('Global scope:',a);