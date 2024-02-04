const inputSlider = document.querySelector("[data-lenSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolscheck = document.querySelector("#symbols");
const indi = document.getElementsByClassName("#indicator");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set circle color to grey
setIndicator('#ccc');



// set length of password
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize= ((passwordLength-min)*100/(max-min))+"% 100%"
    
}


function setIndicator(color) {
    
    document.getElementById("indicator").style.backgroundColor = color;
    document.getElementById(
      "indicator"
    ).style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min))+min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(90, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 90));
}


function generateSymbol() {
    return symbols.charAt(getRndInteger(0, symbols.length));
}

function calcStrength() {
    
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolscheck.checked) hasSym = true;

    // Strong password
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
        console.log("strong")
    }
    // Medium password
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
        console.log("mid");

    }
    // Weak password
    else {
        setIndicator("#f00");
        console.log("weak");

    }
}

async function copyContent() {
    
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.textContent = "Copied";
    }
    catch (e) {
        copyContent.textContent = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000)
}

function shufflePassword(array) {
    // Fisher yates mtehod

    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));;
    return str;

}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    // Special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    if (checkCount == 0) {
        alert("Please check atleast one checkbox!")
        return
    };

    if (passwordLength < checkCount) {
        passwordLength = checkCount;;
        handleSlider();
    }


    console.log("journey started")

    // remove password
    password = "";

    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if (lowercasecheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numberCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if (symbolscheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercasecheck.checked) {
      funcArr.push(generateLowerCase);
    }
    if (numberCheck.checked) {
      funcArr.push(generateRandomNumber);
    }
    if (symbolscheck.checked) {
      funcArr.push(generateSymbol);
    }

    
    // compulsory
    for (let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compusory addition done");

    
    // remaining
    for (let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += (funcArr[randIndex])();
    }
    console.log("Remaining addition done");

    // shuffle password;
    password = shufflePassword(Array.from(password));

    console.log("Shuffling done");

    passwordDisplay.value = password;

    console.log("UI addition done");

    calcStrength();
    console.log("Strength calc done");
});





