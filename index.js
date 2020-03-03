
window.addEventListener('DOMContentLoaded', (event) => {
    
let mainDiv = document.querySelector(".main-div")
let wordCard = mainDiv.querySelector(".word-card")
let formBox = document.createElement("div")
let rhymesBox = document.createElement("div")


        

    fetch("http://localhost:3000/words/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        
        fetch(`http://localhost:3000/words/${populateRandomWord(data)}`,{mode: 'cors'})
        .then(resp => resp.json())
        .then(data => { 
            createWordBox(data)
            createFormBox()
            createRhymesBox()
          
        })
 })//.THEN
    
    


function populateRandomWord(data){
    wordId = data.map(word =>word.id)
    wordId.sample = function(){
        return this[Math.floor(Math.random()*this.length)];
      }
      
        return wordId.sample()
    }

    function createWordBox(data){
            let wordBox = document.createElement("div")
            wordBox.className = "word-box"
            wordBox.innerHTML = `<h1 class = "game-word">${data.word}</h1>`
            wordCard.append(wordBox)
        }
        
    function createFormBox(){
        formBox.className = "form-box"
        formBox.innerHTML = `
        <form class= "rhymes-form">
        <label for="lname">Rhymes</label><br>
        <input type="text" id="rhyme" name="rhyme" ><br><br>
        <input type="submit" value="Submit">
        </form> `
        wordCard.append(formBox)

    }


   

    function createRhymesBox(){
        rhymesBox.className = "rhymes-box"
        rhymesBox.innerHTML = `<ul class= "rhymes-list"></ul>`
        formBox.append(rhymesBox)
        let rhymesForm = document.querySelector(".rhymes-form")
        //    console.log(rhymesForm) 
        }

        document.addEventListener("submit", e => {
        e.preventDefault()
        
        let gameWord = document.querySelector(".game-word").innerText
        let form = document.querySelector(".rhymes-form")
        let ul = document.querySelector(".rhymes-list")
       
        console.log(form)
        let input = document.querySelector("#rhyme").value
        
        fetch(`https://api.datamuse.com/words?rel_rhy=${gameWord}`)
        .then(resp => resp.json())
        .then(resp => {
            let wordsArr = resp.map(word => word.word)
            
            if (wordsArr.includes(input)){
            ul.innerHTML += `<li class= "each-word">${input}</li>` 
            }//IF STATEMENT
            
            form.reset()
            })//.then
         })//submit

         document.addEventListener("click", e => {
             switch(e.target.className) {
           case "play":
            console.log(e.target)
                timerFunc()
                break;
                default:
                break;
            }//SWITCH
  })//CLICK EVENTS 

         function timerFunc() {
            let timerH2 = document.querySelector(".timer")
            let clear = setInterval(decrimentTimer,1000)

            function decrimentTimer() {
                let newTime = parseInt(timerH2.innerHTML,10)  
                newTime--
                timerH2.innerHTML = newTime
                    if (newTime <= 0){
                        clearInterval(clear)
                        let form = document.querySelector(".rhymes-form")
                        form.style.display = "none"
                    }//IF STATEMENT
            }//Decrament
        }//timerFunc

});//dom



//invisible div for user login and to show score 
//that score should append to the side of the page to see other users scores. 
//new game button that refreshes the page
//set up score to increase when input correct*
//css