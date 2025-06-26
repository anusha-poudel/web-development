//array of questions
const questions = [
    {
        question: 'Which keyword declares a constant in JS?',
        options: ['let', 'var', 'const'],
        answer: 2 //answer as index
    },
    {
        question: 'What is the full form of HTML?',
        options: ['HyperText Markup Language', 'HighText Machine Language', 'Hyperlinks and Text Markup Language'],
        answer: 0
    },
    {
        question: 'Which method is used to add an element to the end of an array in JavaScript?',
        options: ['pop()', 'push()', 'unshift()'],
        answer: 1
    }
];
function quiz(questions){
    let score = 0;

    for(let i=0; i< questions.length; i++){
        const current = questions[i];

        //question with option:
        let askques = `Q${i+1}: ${current.question}\n`;

        for(let j=0; j< current.options.length; j++){
            askques += `${j}: ${current.options[j]}\n`;
        }

        //user answer
        let userans = prompt(askques);
        if(userans === String(current.answer)){//string bcs prompt only takes strings, no numbers
            alert('Correct answer!!');
            score++;
        }else{
            alert(`Wrong answer. The correct answer is ${current.options[current.answer]}`);
        }
        }
        alert(`Quiz over! You answered ${score} out of ${questions.length}`);
    }
    //play again loop
    let playagain = true;
    while(playagain){
        quiz(questions);
        playagain = confirm('Do you want to play again?');
    }
