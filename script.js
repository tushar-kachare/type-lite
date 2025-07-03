const orginalSrc = "https://random-word-api.vercel.app/api?words=";
let src = "https://random-word-api.vercel.app/api?words=";
let keydownHandler = null;

const select = document.querySelector(".select ");
const game = document.querySelector(".game");
const timer = document.querySelector(".timer");
const selectAns = document.querySelector(".selectAns");
const selectChilds = document.querySelectorAll(".allSelect");

let allLetters = [];
timer.textContent = "";
let timeRem;
let totalWords = 0;
let WPM = 0;
let totalKeys = 0;
let intForTime;
let intForWords;
let handlerSelect;
let handlerSelectAns;

// checking for start on Time / Words
function selectAll() {
  if(handlerSelect)document.removeEventListener('click' , handlerSelect)
  if(handlerSelectAns)document.removeEventListener('click' , handlerSelectAns)

  handlerSelect = function (e) {
      totalWords = 0;
      if (e.target.className !== "select") {
        // Reset styles
        document.querySelectorAll(".select span").forEach((span) => {
          span.style.backgroundColor = "#3c3c3c";
          span.style.color = "black";
        });

        e.target.style.color = "white";
        e.target.style.backgroundColor = "#4fc3f7";

        isTimeSelection = e.target.textContent === "Time";

        const options = isTimeSelection ? [15, 30, 60, 120] : [10, 25, 50, 100];
        updateSelectAns(options);
    }
  }
  select.addEventListener('click' , handlerSelect);

  handlerSelectAns = (e) => {
    if (e.target.tagName !== "SPAN") return;

    // Reset styles
    document.querySelectorAll(".selectAns span").forEach((span) => {
      span.style.backgroundColor = "#3c3c3c";
      span.style.color = "black";
    });

    e.target.style.color = "white";
    e.target.style.backgroundColor = "#4fc3f7";

    allLetters = [];

    if (isTimeSelection) {
      timeRem = parseInt(e.target.textContent);
      setGameForTime();
    } else {
      totalWords = parseInt(e.target.textContent);
      setGameForWords(totalWords);
    }
  }
  selectAns.addEventListener("click", handlerSelectAns);

}

selectAll();

function clearPreviousGameState() {
  clearInterval(intForTime);
  clearInterval(intForWords);
  // document.removeEventListener("keydown", keydownHandler);
}

// setting game for Time duration
const setGameForTime = async function () {
  clearPreviousGameState()
  game.innerHTML = ''
  await taskbarSelect();
  storeLetters();
  startGameforTime();
};

// Genrate words and adding to game
const generateWords = function (str) {

  // clear game div before
  game.innerHTML = ''
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

// creating string of letters with spaced
function getWords(data) {
  str = "";

  data.forEach((e) => {
    str += e + " ";
  });
  return str;
}

const taskbarSelect = async function (num) {
  if (num > 0) {
    src = `${orginalSrc}${num}`;
  } else {
    src = `${orginalSrc}95`;
  }

  const res = await fetch(src);
  const data = await res.json();

  wordList = getWords(data);
  generateWords(wordList);
};

function storeLetters() {
  let childSpans = game.childNodes;
  childSpans.forEach((e) => {
    let letters = e.childNodes;
    allLetters.push(...letters);
  });
}

function updateSelectAns(arr) {
  let i = 0;
  selectChilds.forEach((child) => {
    child.textContent = arr[i];
    i++;
  });
}

function checkLetter(target, given) {
  if (target === given) return true;
  return false;
}

// Start Game
function startGameforTime() {
  let ind = 0;
  let correctLetters = 0;
  totalKeys = 0;
  timer.textContent = timeRem;
  const secondsElapsed = timeRem;
  clearInterval(intForTime)
  intForTime = setInterval(() => {
    if (timeRem <= 1) {
      clearInterval(intForTime);
      document.removeEventListener("keydown", keydownHandler);
      resetGame(correctLetters, secondsElapsed);
    }
    timeRem -= 1;
    timer.textContent = timeRem;
  }, 1000);

  // Remove previous keydown listener
  document.removeEventListener("keydown", keydownHandler);

  // Define new keydown handler
  keydownHandler = function (e) {
    if (timeRem > 0) {
      let target = allLetters[ind].textContent;

      if (e.key === "Backspace") {
        if (ind > 0) {
          ind -= 1;
          allLetters[ind].style.color = "white";
        }
      } else {
        totalKeys += 1;
        if (target === "\u00A0") target = " ";

        if (checkLetter(target, e.key)) {
          correctLetters++;
          allLetters[ind].style.color = "#383e42";
        } else {
          allLetters[ind].style.color = "#e25303";
        }
        ind++;
      }
    }
  };

  // Attach the new keydown listener
  document.addEventListener("keydown", keydownHandler);
}

// for words Selected
const setGameForWords = async function (totalWords) {
  clearPreviousGameState()
  game.innerHTML = ''
  timeRem = 0;
  await taskbarSelect(totalWords);
  storeLetters();
  startGameForWords();
};

function startGameForWords() {
  let ind = 0;
  let correctLetters = 0;
  totalKeys = 0;
  timer.textContent = 0;

  clearInterval(intForWords);
  intForWords = setInterval(() => {
    if (ind >= allLetters.length - 2) {
      clearInterval(intForWords);
      document.removeEventListener("keydown", keydownHandler);
      resetGame(correctLetters, timeRem);
      return;
    }

    timeRem += 1;
    timer.textContent = timeRem;
  }, 1000);

  // Remove previous keydown listener
  document.removeEventListener("keydown", keydownHandler);

  // Define new keydown handler
  keydownHandler = function (e) {
    if (ind >= allLetters.length - 2) {
      clearInterval(Int);
      document.removeEventListener("keydown", keydownHandler);
      resetGame(correctLetters, timeRem);
      return;
    }

    let target = allLetters[ind].textContent;

    if (e.key === "Backspace") {
      if (ind > 0) {
        ind -= 1;
        allLetters[ind].style.color = "white";
      }
    } else {
      totalKeys += 1;
      if (target === "\u00A0") target = " ";

      if (checkLetter(target, e.key)) {
        correctLetters++;
        allLetters[ind].style.color = "#383e42";
      } else {
        allLetters[ind].style.color = "#e25303";
      }
      ind++;
    }
  };

  document.addEventListener("keydown", keydownHandler);
}

// Reset
function resetGame(correctLetters, secondsElapsed) {
  WPM = Math.round((correctLetters * 60) / (5 * secondsElapsed));
  showStats(correctLetters);
  timer.innerHTML = "";
  const Restart = document.createElement("div");
  Restart.className = "restart";
  Restart.textContent = "Restart";
  result = document.querySelector(".result");
  result.appendChild(Restart);

  allLetters = [];
  timer.textContent = "";
  timeRem;
  totalWords = 0;
  WPM = 0;
  totalKeys = 0;
  RestartGame();
}
// showStats of user

function showStats(correct) {
  game.innerHTML = "";

  let accuracy = ((correct / totalKeys) * 100).toFixed(2); // "92.00"
  if (totalKeys > 0)
    game.innerHTML = `<div class="result">
    <div class="wpm">WPM: ${WPM}</div>
    <div class="accuracy">Accuracy: ${accuracy}%</div>
  </div>`;
  else {
    game.innerHTML = `<div class="result">
        <div class="wpm">WPM: ${WPM}</div>
        <div class="accuracy">Accuracy: ${0}</div>
      </div>`;
  }
}

// RestartGame
function RestartGame() {
  const restart = document.querySelector(".restart");
  restart.addEventListener("click", (e) => {
    game.innerHTML = "";
    const selectSpans = document.querySelectorAll(".select span");
    const selectAnsSpans = document.querySelectorAll(".selectAns span");

    selectSpans.forEach((e) => {
      e.style.backgroundColor = "#3c3c3c";
      e.style.color = "#121212";
    });
    selectAnsSpans.forEach((e) => {
      e.style.backgroundColor = "#3c3c3c";
      e.style.color = "black";
    });
  });
}
