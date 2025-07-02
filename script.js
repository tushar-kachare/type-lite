src = "https://random-word-api.vercel.app/api?words=";

const select = document.querySelector(".select ");
const game = document.querySelector(".game");
const timer = document.querySelector(".timer");
const selectAns = document.querySelector(".selectAns");
const selectChilds = document.querySelectorAll('.allSelect')

let allLetters = []
timer.textContent = ''
let timeRem;
let totalWords;
let WPM;
const generateWords = function (str) {
  wordList = str.split(" ");
  wordList.forEach((word) => {
    const outerSpan = document.createElement("span");
    outerSpan.className = "outerSpan";

    for (let i = 0; i < word.length; i++) {
      const letterSpan = document.createElement("span");
      letterSpan.className = "letter";
      letterSpan.textContent = word[i];
      outerSpan.appendChild(letterSpan);
    }
    const space = document.createElement("span");
    space.class = "letter";
    space.textContent = "\u00A0";
    outerSpan.appendChild(space);
    game.appendChild(outerSpan);
  });
};

function getWords(data) {
  str = "";

  data.forEach((e) => {
    str += e + " " + " ";
  });
  return str;
}

const taskbarSelect = async function (num) {
  // console.log(num);
  if (num > 0) {
    src = `${src}${num}`;
  } else {
    src = `${src}100`;
  }

  const res = await fetch(src);
  const data = await res.json();

  wordList = getWords(data);
  generateWords(wordList);
};

function storeLetters() {
  let childSpans = game.childNodes;
  childSpans.forEach(e => {
    let letters = e.childNodes;
    allLetters.push(...letters)
  })
}

const setUpGame = async function(words) {
  await taskbarSelect(words)
  storeLetters();
  startGame();
}

function updateSelectAns(arr) {
  let i = 0;
  selectChilds.forEach(child => {
    child.textContent = arr[i];
    i++;
  })
}
select.addEventListener("click", (e) => {
  if(e.target.className != 'select') {
    e.target.style.color = 'white'
    const isTime = e.target.textContent === "Time";
    if (isTime) {
      updateSelectAns([15,30,60,120])
      selectAns.addEventListener("click", (check) => {
          timeRem = check.target.textContent
          check.target.style.color = 'white'
          allLetters = []
          setUpGame();
       });
    }
    else {
      updateSelectAns([10,25,50,100])
      selectAns.addEventListener("click", (e) => {
        totalWords = e.target.textContent
        allLetters = []
        setUpGame(totalWords);
      });
    }

  }
  
});


// start Game
function checkLetter(target , given) {
  if(target === given)return true
  return false;
}

function startGame() {
  let ind = 0;
  let correctLetters = 0
  timer.textContent = timeRem
  const secondsElapsed = timeRem
  const Int = setInterval(e => {
      if(timeRem <= 1) {
        clearInterval(Int)
        resetGame(correctLetters,secondsElapsed)
      }
      timeRem -=1;
      timer.textContent = timeRem
  },1000);
  document.addEventListener('keydown' , (e) => {
    // console.log(allLetters[ind]);
    
    if(timeRem > 0) {
        let target = allLetters[ind].textContent
        // console.log(ind);
        
        if(e.key  === "Backspace") {
           if(target === '\u00A0')ind-=1
           if(allLetters[ind-1] === '\u00A0')ind-=1;
           else if(allLetters[ind-1].style.color === 'red')ind--;
           if(allLetters[ind].style.color === 'red') {
            allLetters[ind].style.color = 'black'
          }

        }
        else {
          if(target === '\u00A0') {
            target = ' '
            ind++;
          }
          if(checkLetter(target , e.key)) {
            correctLetters++;
            allLetters[ind].style.color = 'white';
            // console.log("true");  
          }
          else {
            allLetters[ind].style.color = 'red'
          }
          ind++;
        }
    }
    
  })
}

// Reset 
function resetGame(correctLetters , secondsElapsed) {
  console.log(Math.round((correctLetters * 60) / (5 * secondsElapsed)));
}
