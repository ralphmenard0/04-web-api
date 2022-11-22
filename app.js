// DOCUMENT SELECTORS
let startBtn = document.querySelector('#start-button');
let timerEl = document.querySelector('#timer');
let mainEl = document.querySelector('#main');
let homeLi = document.querySelector('#home-link');
let highscoreLi = document.querySelector('#highscore-link')

// GLOBAL VARIABLES
let timerInterval;
let secondsLeft;
let quizSelection;
let quizQuestions;
let quizAnswers;


// JS QUIZ
const javascriptQuestions = [
    'Javascript is an _______ language?',
    'Which of the following keywords is used to define a variable in Javascript?',
    'What is the correct syntax for referring to an external script called "script.js"?',
    'How would you write "Hello World" in an alert box?',
    'Which of the following is a correct way to create a function in JavaScript?'
];

const javascriptAnswers = [
    [['Object-Oriented', true], ['Object-Based', false], ['<script>', true], ['<js>', false]],
    [['var', false], ['let', false], ['Both a And b', true]],
    [['<script src="script.js">', true], ['<script href="script.js">', false], ['<script name="script.js">', false]],
    [['alert("Hello World");', true], ['alertBox("Hello World")', false], ['msg("Hello World");', false], ['msgBox("Hello World");', false]],
    [['function:myFunction() {}', false], ['function = myFunction() {}', false], ['function myFunction() {}', true]],
    
];

// runs on page load
function init() {
    renderHome();
}

// NAVBAR //
homeLi.addEventListener('click', renderHome);
highscoreLi.addEventListener('click', renderScoreboard);

function initializeTimer() {
    secondsLeft = 100;

    if (!timerInterval) {
        timerInterval = setInterval(function () {
            secondsLeft--;
            timerEl.textContent = secondsLeft;

            if (secondsLeft <= 0) {
                endQuiz();
            }
        }, 1000);
    }
}

function stopTime() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    secondsLeft = 0;
    timerEl.textContent = secondsLeft;
}

// HOMEPAGE RENDERING //
function renderHome() {
    resetQuiz();
    // check if timer is initialized
    if (timerInterval) {
        stopTime();
    }

    mainEl.textContent = '';

    renderTitle('Coding Quiz Challenge');

    let par = document.createElement('p');
    par.textContent = 'You will have 100 seconds to complete all questions! At the end, enter your initials for Leaderboard.';

    let startButton = document.createElement('button');
    startButton.textContent = 'Start Quiz!';
    startButton.setAttribute('id', 'start-button');
    startButton.addEventListener('click', startQuiz);

    mainEl.appendChild(par);
    
    mainEl.appendChild(startButton);
}

function createChoice(choiceName) {
    let choice = document.createElement('option');
    choice.textContent = choiceName;
    return choice;
}

// HIGHSCORE PAGE RENDERING
function renderScoreboard() {
    mainEl.textContent = '';
    resetQuiz();

    // check if timer is initialized
    if (timerInterval) {
        stopTime();
    }

    let scoreboard = JSON.parse(localStorage.getItem('scoreboard'));
    
    renderTitle('Leaderboard')

    if (!scoreboard) {
        let par = document.createElement('p');
        par.textContent = 'It looks like there are no high scores yet! Will you be the first one?'
        mainEl.appendChild(par);
       
        let button = document.createElement('button');
        button.textContent = 'Back to Home';
        button.addEventListener('click', renderHome);
        mainEl.appendChild(button)

        return
    }


    let playerUl = document.createElement('ul');
    playerUl.classList.add('scoreboard-list');

    for (let i = 0; i < scoreboard.length; i++) {
        let playerLi = document.createElement('li');
        playerLi.classList.add('scoreboard-item');
        playerLi.textContent = `${scoreboard[i].name} -- ${scoreboard[i].score}`;
        playerUl.appendChild(playerLi);
    }


    let homeButton = document.createElement('button');
    homeButton.textContent = 'Back to Home';
    homeButton.addEventListener('click', renderHome);

    let resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Highscores'
    resetButton.addEventListener('click', function() {
        localStorage.clear();
        renderScoreboard();
    });

    mainEl.appendChild(playerUl);
    mainEl.appendChild(homeButton);
    mainEl.appendChild(resetButton);
}

function addHighScore() {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard'));

    // validation of empty scoreboard
    if (scoreboard == null) {
        scoreboard = [];
    }

    let playerName = document.getElementById('initials-input').value.toUpperCase();
    let playerScore = secondsLeft;

    let player = {
        'name': playerName,
        'score': playerScore
    };

    // push player object onto localStorage array, then sort array highest to lowest
    scoreboard.push(player);                      
    scoreboard.sort((a, b) => b.score - a.score); 
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
}

// QUIZ RENDERING + HANDLING

// sets questions based on home selection, starts timer, and prints the first question
function startQuiz() {
    setQuiz();
    mainEl.textContent = '';
    initializeTimer(); 
    renderQuestion();
}

// sets quizQuestions
function setQuiz() {
    quizQuestions = JSON.parse(JSON.stringify(javascriptQuestions));
    quizAnswers = JSON.parse(JSON.stringify(javascriptAnswers));
    
}

function resetQuiz() {
    quizQuestions = null;
    quizAnswers = null;
    resetTimer();
}

function endQuiz() {
    if (secondsLeft < 0) {
        secondsLeft = 0;
        timerEl.textContent = secondsLeft;
    }
    stopTime();

    let affirmations = ['Keep it up, pal!', 'You\'re doing great!', 'I bet you could do this with your eyes closed!', 'I\'m sure everyone would be impressed if they saw you take this quiz!', 'Steve Jobs? Is that you?!', 'Excelsior!']

    let pageTitle = document.createElement('h1');
    pageTitle.textContent = 'Quiz Over!';

    let quizResults = document.createElement('p');
    quizResults.textContent = `You scored ${secondsLeft} points. ${affirmations[randomNumber(affirmations.length)]}`;

    let initialsPrompt = document.createElement('p');
    initialsPrompt.textContent = 'Please enter your initials:'
    initialsPrompt.classList.add('enter-initials')

    let initialsInput = document.createElement('input');
    initialsInput.classList.add('initials-input');
    initialsInput.setAttribute('id', 'initials-input');
    initialsInput.maxLength = 3;
    initialsInput.size = 4;

    let highscoreButton = document.createElement('button');
    highscoreButton.textContent = 'Go to Highscores';

    highscoreButton.addEventListener('click', function () {
        if (initialsInput.value) {
            addHighScore();
            resetQuiz();
            renderScoreboard();
        }
    })

    mainEl.textContent = '';

    mainEl.appendChild(pageTitle);
    mainEl.appendChild(quizResults);
    mainEl.appendChild(initialsPrompt);
    mainEl.appendChild(initialsInput);
    mainEl.appendChild(highscoreButton);
};

function renderQuestion() {
    // check if there are any remaining questions
    if (quizQuestions.length === 0) {
        return endQuiz();
    }

    mainEl.textContent = '';
    
    let card = document.createElement('div');
    card.classList.add('card');
    
    

    // generate a random number based on the number of questions available
    randomNum = randomNumber(quizQuestions.length);

    card.appendChild(renderQuestionTitle(quizQuestions[randomNum]));

    let listOptions = document.createElement('ol');

    // print questions depending on how many there are for that question
    for (let i = 0; i < quizAnswers[randomNum].length; i++) {
        listOptions.appendChild(createAnswerChoice(randomNum, i));
    }

    card.appendChild(listOptions);

    mainEl.appendChild(card);
}

function createAnswerChoice(randomNum, index) {
    let answer = document.createElement('li');

    answer.classList.add('answer-choice');
    answer.addEventListener('click', checkAnswer);
    answer.textContent = quizAnswers[randomNum][index][0];
    answer.dataset.answer = quizAnswers[randomNum][index][1];

    return answer;
}

function checkAnswer() {
    // check to see if the answer is correct, then remove it from its array
    if (this.dataset.answer === 'true') {
        this.classList.add('correct');

        quizQuestions.splice(randomNum, 1);
        quizAnswers.splice(randomNum, 1);

        setTimeout(renderQuestion, 500);
    } else {
        // notify user of wrong answer, then add 15 second penalty
        if (!this.textContent.endsWith('❌')) {
            this.textContent = `${this.textContent} ❌`;
            secondsLeft -= 15;
        }
    }
}

// UTILITY
function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function renderTitle(titleContent) {
    let title = document.createElement('h1');
    title.textContent = titleContent;
    title.classList.add('page-title');

    mainEl.appendChild(title);
}

function renderQuestionTitle(titleContent) {
    let title = document.createElement('h2');
    title.textContent = titleContent;
    title.classList.add('question-title');

    return title;
}

init();