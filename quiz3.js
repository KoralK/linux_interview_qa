document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded and DOM is ready");
    let score = 0;
    let currentQuestionIndex = 0;
    let quizData = [];
    let totalCorrect = 0;
    let totalWrong = 0;

    function loadQuizData() {
        fetch('quiz_questions.json')
            .then(response => response.json())
            .then(data => {
                quizData = data;
                displayQuizQuestion();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayQuizQuestion() {
        console.log("currentQuestionIndex:", currentQuestionIndex);
    
        if (currentQuestionIndex >= quizData.length) {
            alert('Quiz finished!');
            return;
        }
    
        let questionData = quizData[currentQuestionIndex];
        let questionText = document.getElementById('question-text');
        
        // Prepend the current question number to the question
        questionText.textContent = (currentQuestionIndex + 1) + ". " + questionData.question;
    
        let optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '';
    
        questionData.options.forEach((option, index) => {
            let checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.id = 'option' + index;
            checkBox.value = index;
    
            let label = document.createElement('label');
            label.htmlFor = 'option' + index;
            label.appendChild(document.createTextNode(option));
    
            optionsDiv.appendChild(checkBox);
            optionsDiv.appendChild(label);
            optionsDiv.appendChild(document.createElement('br'));
        });
    }
    

    document.getElementById('prev-question').addEventListener('click', function() {
        console.log("Previous Question clicked");
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuizQuestion();
        } else {
            alert('This is the first question');
        }
    });

    function updateScoreReport() {
        let report = document.getElementById('display-score');
        report.textContent = `Total Correct Answers: ${totalCorrect}, Total Wrong Answers: ${totalWrong}, Score: ${score}`;
    }
    
    
    function hasAnswerSelected() {
        let questionData = quizData[currentQuestionIndex];
        let selectedOptions = [];

        questionData.options.forEach((option, index) => {
            let checkBox = document.getElementById('option' + index);
            if (checkBox.checked) {
                selectedOptions.push(index);
            }
        });

        return selectedOptions.length > 0;
    }

    document.getElementById('check-answer').addEventListener('click', function() {
        console.log("Check Answer clicked");
        let questionData = quizData[currentQuestionIndex];
        let selectedOptions = [];
        
        questionData.options.forEach((option, index) => {
            let checkBox = document.getElementById('option' + index);
            if (checkBox.checked) {
                selectedOptions.push(index);
            }
        });
    
        // Check if any answer was selected
        if (selectedOptions.length === 0) {
            alert('Please select an answer before checking.');
            return; // Exit from the event handler without doing anything further
        }
        
        if (JSON.stringify(selectedOptions) === JSON.stringify(questionData.answers)) {
            score++;
            totalCorrect++;
        } else {
            score = Math.max(score - 1/3, 0);
            totalWrong++; // Assuming you have initialized this variable at the beginning
            alert('Incorrect. The correct answer is: ' + questionData.answers.map(answerIndex => questionData.options[answerIndex]).join(', '));
        }
        
        updateScoreReport();
        currentQuestionIndex++;
        displayQuizQuestion();
    });
        

    document.getElementById('next-question').addEventListener('click', function() {
        console.log("Next Question clicked");
        if (!hasAnswerSelected()) {
            alert('Please select an answer before moving to the next question.');
            return;
        }
    
        // Check the answer and update the score
        let questionData = quizData[currentQuestionIndex];
        let selectedOptions = [];
    
        questionData.options.forEach((option, index) => {
            let checkBox = document.getElementById('option' + index);
            if (checkBox.checked) {
                selectedOptions.push(index);
            }
        });
    
        if (JSON.stringify(selectedOptions) === JSON.stringify(questionData.answers)) {
            score++;
            totalCorrect++; // Add this line here
            
        } else {
            score = Math.max(score - 1/3, 0);
            totalWrong++; // Increment the totalWrong count
            alert('Incorrect. The correct answer is: ' + questionData.answers.map(answerIndex => questionData.options[answerIndex]).join(', '));
        }
    
        document.getElementById('display-score').textContent = 'Score: ' + score;
    
        // Move to the next question
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            displayQuizQuestion();
        } else {
            alert('This is the last question');
        }
    });
    

    loadQuizData();
});
