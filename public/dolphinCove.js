

let step1 = document.querySelector('.step1');
let step2 = document.querySelector('.step2');
let step3 = document.querySelector('.step3');
step1.style.display = "block";
step2.style.display = "none";
step3.style.display = "none";


let step = 1;

var update = () =>{
    let ttlPrice = document.querySelector('.price');
    let ttlPriceInt = document.querySelector('.priceInt');
    let reqPrgrm = document.querySelector('#prgm');
    let currentPrice = 0;
    let options = Array.from(reqPrgrm.children);
    let gstAmt = document.querySelector("#gst_amnt");
    

    options.forEach(option => {
        if(reqPrgrm.value == option.value){ 
            currentPrice = option.dataset.prg_prc;
        }
    });

    let gstNum = gstAmt.value;
    if (gstNum == "" || gstNum < 1){
        gstNum = 1;
    }

    ttlPrice.value = "$ " + parseInt(gstNum) * parseFloat(currentPrice) + " USD";
    ttlPriceInt.value =  parseInt(gstNum) * parseFloat(currentPrice);
    console.log(ttlPriceInt.value);
};

var admUpdate = () =>{
    let ttlPrice = document.querySelector('.price');
    let ttlPriceInt = document.querySelector('.priceInt');
    let reqPrgrm = document.querySelector('#prgm');
    let currentPrice = 0;
    let options = Array.from(reqPrgrm.children);
    let gstAmt = document.querySelector("#gst_amnt");
    

    options.forEach(option => {
        if(reqPrgrm.value == option.value){ 
            currentPrice = option.dataset.prg_prc;
        }
    });

    let gstNum = gstAmt.value;
    if (gstNum == "" || gstNum < 1){
        gstNum = 1;
    }

    ttlPrice.value = "$ " + parseInt(gstNum) * parseFloat(currentPrice) + " USD";
    ttlPriceInt.value =  parseInt(gstNum) * parseFloat(currentPrice);
    console.log(ttlPriceInt.value);
};

//----- FORM BUTTONS NEXT FUNCTION ------//
var next = () => {
    if (step <= 2){
        step++;
    }

    if (step === 1){
        step1.style.display = "block";
        step2.style.display = "none";
        step3.style.display = "none";
    }else if (step === 2){
        step1.style.display = "none";
        step2.style.display = "block";
        step3.style.display = "none";
    } else if (step === 3){
        step1.style.display = "none";
        step2.style.display = "none";
        step3.style.display = "block";
    }
};

//----- FORM BUTTONS BACK FUNCTION ------//
var back = () => {

    if (step >= 2){
        step--;
    }

    if (step === 1){
        step1.style.display = "block";
        step2.style.display = "none";
        step3.style.display = "none";
    } else if (step === 2){
        step1.style.display = "none";
        step2.style.display = "block";
        step3.style.display = "none";
    } else if (step === 3){
        step1.style.display = "none";
        step2.style.display = "none";
        step3.style.display = "block";
    } 
};

//----- TOTAL PRICE CALCULATE FUNCTION ------//

