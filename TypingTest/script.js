// Random Quotes API URL
const quoteApiUrl = "https://api.quotable.io/quotes/random?minLength=80&maxLength=110";

const quoteSelection = document.getElementById("quote");
const userInput = document.getElementById('quote-input');

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display Random Quotes
const renderNewQuote = async () => {
    try {
        // Fetching quotes from url
        const response = await fetch(quoteApiUrl);

        // Check if response is ok
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        // Store response
        let data = await response.json();

        // Access quote from the first item in the array
        quote = data[0].content;

        // Array of characters in the quote
        let arr = quote.split("").map((value) => {
            // Wrap the characters in a span tag
            return "<span class='quote-chars'>" + value + "</span>";
        });

        // Join the array for display purpose
        quoteSelection.innerHTML = arr.join(""); // Use = instead of += to replace old content

    } catch (error) {
        console.error("Error fetching the quote:", error);
    }
};

//compare test sentence with the input sentence
userInput.addEventListener("input", ()=>{
    let quoteChars = document.querySelectorAll(".quote-chars")
    //create an array from the received span tag
    quoteChars = Array.from(quoteChars)

    //Array of user input characters
    let userInputChars = userInput.value.split("")

    //loop through each character in quote 
    quoteChars.forEach((char, index) => {
        if(char.innerText == userInputChars[index]){
            char.classList.add("success")
        }
        //If user hasnot entered entered anything or backspaced
        else if(userInputChars[index]==null){
            //remove class if any
            if(char.classList.contains("success")){
                char.classList.remove("success")
            }

            else{
                char.classList.remove("fail");
            }
        }

        else{
            //checks if we already added the fail class
            if(!char.classList.contains("fail")){
                //increment and display mistakes
                mistakes +=1
                char.classList.add("fail")
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        //returns if all characters or correct
        let check = quoteChars.every(element=>{
            return element.classList.contains("success")
        });
        //End test if all characters are correct
        if(check){
            displayResult();
        }
    })
})


//Update timer
function updateTimer(){
    if(time==0){
        displayResult();
    }

    else{
        document.getElementById("timer").innerText = --time + "s"
    }
}

//Set the timer
const timeReduce = ()=>{
    time = 60;
    timer = setInterval(updateTimer, 1000)
}
//End the test
const displayResult = ()=>{
    //display result div
    document.querySelector(".result").style.display = "block"
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none"
    userInput.disabled = true
    let timeTaken = 1
    if(time!=0){
        timeTaken = (60-time)/100
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm"
    document.getElementById('accuracy').innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%"
}

//const StartTest
const startTest = () => {
    mistakes = 0
    timer = ""
    userInput.disabled = false;
    timeReduce()
    document.getElementById("start-test").style.display = "none"
    document.getElementById("stop-test").style.display = "block"
} 

window.onload = () => {
    userInput.value = "";
    document.getElementById('start-test').style.display = 'block';
    document.getElementById('stop-test').style.display = 'none';
    userInput.disabled = true;
    renderNewQuote();
};
