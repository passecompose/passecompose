const verbs = [
    { inf: "aller", part: "allé", aux: "être", diff: "easy", eng: "to go" },
    { inf: "avoir", part: "eu", aux: "avoir", diff: "easy", eng: "to have" },
    { inf: "être", part: "été", aux: "avoir", diff: "easy", eng: "to be" },
    { inf: "faire", part: "fait", aux: "avoir", diff: "easy", eng: "to do/make" },
    { inf: "venir", part: "venu", aux: "être", diff: "easy", eng: "to come" },
    { inf: "voir", part: "vu", aux: "avoir", diff: "medium", eng: "to see" },
    { inf: "prendre", part: "pris", aux: "avoir", diff: "medium", eng: "to take" },
    { inf: "pouvoir", part: "pu", aux: "avoir", diff: "medium", eng: "to be able to" },
    { inf: "savoir", part: "su", aux: "avoir", diff: "medium", eng: "to know (a fact)" },
    { inf: "vouloir", part: "voulu", aux: "avoir", diff: "medium", eng: "to want" },
    { inf: "devoir", part: "dû", aux: "avoir", diff: "hard", eng: "to have to/must" },
    { inf: "falloir", part: "fallu", aux: "avoir", diff: "hard", eng: "to be necessary" },
    { inf: "pleuvoir", part: "plu", aux: "avoir", diff: "hard", eng: "to rain" },
    { inf: "mourir", part: "mort", aux: "être", diff: "hard", eng: "to die" },
    { inf: "naître", part: "né", aux: "être", diff: "hard", eng: "to be born" }
];
const subjects = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];
let currentVerb, currentSubject, score, questionCount, startTime, gameInterval, streak = 0, level = 1;

const $ = id => document.getElementById(id);
const random = arr => arr[Math.floor(Math.random() * arr.length)];

function startGame() {
    score = 0;
    questionCount = 0;
    streak = 0;
    level = 1;
    startTime = Date.now();
    gameInterval = setInterval(updateTime, 1000);
    nextQuestion();
    $('startBtn').style.display = 'none';
    $('submitBtn').style.display = 'inline-block';
    $('hintBtn').style.display = 'inline-block';
    $('answer').style.display = 'block';
}

function nextQuestion() {
    if (questionCount >= 20) return endGame();
    questionCount++;
    currentVerb = random(verbs.filter(v => v.diff === $('difficulty').value));
    currentSubject = random(subjects);
    $('question').innerHTML = `<strong>Question ${questionCount}/20:</strong><br>Translate to French (Passé Composé):<br>"${currentSubject} ${currentVerb.eng}"`;
    $('answer').value = '';
    $('feedback').textContent = '';
    $('feedback').className = 'feedback';
    updateScore();
    updateProgress();
}

function checkAnswer() {
    const userAnswer = $('answer').value.trim().toLowerCase();
    const correctAnswer = `${currentSubject.toLowerCase()} ${getAuxiliary()} ${getParticiple()}`.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    $('feedback').textContent = isCorrect ? 'Correct! Well done!' : `Not quite. The correct answer is: "${correctAnswer}"`;
    $('feedback').className = isCorrect ? 'feedback correct' : 'feedback incorrect';
    if (isCorrect) {
        score++;
        streak++;
        if (streak % 5 === 0) levelUp();
    } else {
        streak = 0;
    }
    updateStreak();
    setTimeout(nextQuestion, 2000);
}

function getAuxiliary() {
    const auxConj = {
        être: ["suis", "es", "est", "sommes", "êtes", "sont"],
        avoir: ["ai", "as", "a", "avons", "avez", "ont"]
    };
    return auxConj[currentVerb.aux][subjects.indexOf(currentSubject)];
}

function getParticiple() {
    let part = currentVerb.part;
    if (currentVerb.aux === "être") {
        if (["Je", "Tu", "Il/Elle"].includes(currentSubject)) part += "e";
        if (["Nous", "Vous", "Ils/Elles"].includes(currentSubject)) part += "s";
    }
    return part;
}

function showHint() {
    $('feedback').textContent = `Hint: This verb uses "${currentVerb.aux}" as its auxiliary. The past participle is "${currentVerb.part}".`;
    $('feedback').className = 'feedback hint';
}

function updateScore() {
    $('score').textContent = `Score: ${score}/${questionCount}`;
}

function updateTime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    $('time').textContent = `Time: ${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`;
}

function updateStreak() {
    $('streak').textContent = `Streak: ${streak}`;
}

function updateProgress() {
    $('progress').style.width = `${(questionCount / 20) * 100}%`;
}

function levelUp() {
    level++;
    $('level-indicator').textContent = `Level ${level}`;
    $('level-indicator').style.display = 'block';
    setTimeout(() => $('level-indicator').style.display = 'none', 2000);
}

function endGame() {
    clearInterval(gameInterval);
    $('question').innerHTML = `<strong>Adventure Complete!</strong><br>Final Score: ${score}/20<br>Time: ${$('time').textContent.split(': ')[1]}`;
    $('answer').style.display = 'none';
    $('submitBtn').style.display = 'none';
    $('hintBtn').style.display = 'none';
    $('startBtn').style.display = 'inline-block';
    $('startBtn').textContent = 'Start New Adventure';
}

function insertAccent(accent) {
    const input = $('answer');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.substring(0, start) + accent + input.value.substring(end);
    input.setSelectionRange(start + 1, start + 1);
    input.focus();
}

$('startBtn').onclick = startGame;
$('submitBtn').onclick = checkAnswer;
$('hintBtn').onclick = showHint;
$('answer').onkeypress = e => { if (e.key === 'Enter') checkAnswer(); };
