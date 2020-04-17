import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';
import correctNotification from '../../assets/img/audio/right.mp3';
import wrongNotification from '../../assets/img/audio/wrong.mp3';
import selectNotification from '../../assets/img/audio/select.mp3';

class Play extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: ' ',
            numberofQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            previousRandomNumbers:[],
            time: {}
        };
    }

    // there are supposed to be questions that are taken from .json file 

    componentDidMount() {
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
    }

    displayQuestions = (questions = this.state.questions) => {
        let { currentQuestionIndex } = this.state;
        let currentQuestion, nextQuestion, previousQuestion
        if (!isEmpty(questions)) {
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex === 0 ? currentQuestionIndex : currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberofQuestions: questions.length,
                answer,
            }, () => {
                this.showOptions();
                
            });
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                document.getElementById('correct-sound').play();
            }, 200)
            this.correctAnswer();
        } else {
            setTimeout(() => {
                document.getElementById('wrong-sound').play();
            }, 200)
            this.wrongAnswer();
        }
    }
    handleNextButtonClick = () => {
        this.playButtonSound();
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextionQuestion, this.state.previousQuestion)
            });
        }
    };
    handlePreviousButtonClick = () => {
        this.playButtonSound();
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextionQuestion, this.state.previousQuestion)
            });
        }
    };

    handleQuitButtonClick = () => {
        this.playButtonSound();
        if (window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/')
        }
    }


    handleButtonClick = (e) => {
        switch (e.target.id) {
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'previous-button':
                this.handlePreviousButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButtonClick();
                break;
            default:
                break;

        }


    };
    playButtonSound = () => {
        document.getElementById('select-sound').play();
    };



    correctAnswer = () => {
        M.toast({
            html: 'Correct!',
            classes: 'toast-valid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }),
            () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion)
            });
    }

    wrongAnswer = () => {
        navigator.vibrate(1000)
        M.toast({
            html: 'Wrong Answer',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            wrongAnswer: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
        }),
            () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion)
            });
    }
    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));
        
        options.forEach(option => {
            option.style.visibility = 'visible';
        });
    }
    
    handleHints = () => {
        const options = Array.from(document.querySelectorAll('.option'));
        let indexOfAnswer;

        options.forEach((option, index) => {
            if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                indexOfAnswer = index;
            }
        })
        while (true) {
            const randomNumber = Math.round(Math.random() * 3);
            if (randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                options.forEach((option, index) => {
                    if (index === randomNumber) {
                        option.style.visibility = 'hidden';
                        this.setState((prevState) => ({
                            hints: prevState.hints - 1,
                            previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                        }));
                    }
                });
                break;
            }
            if(this.state.previousRandomNumbers.length >= 3) break;
        }
    }

    render() {

        const { currentQuestion, currentQuestionIndex, hints, numberofQuestions } = this.state;
        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <Fragment>
                    <audio id="correct-sound" src={correctNotification}></audio>
                    <audio id="wrong-sound" src={wrongNotification}></audio>
                    <audio id="select-sound" src={selectNotification}></audio>
                </Fragment>
                <div className="questions">
                    <h2>QUIZ MODE</h2>
                    <div className="lifeline-container">
                        <p>
                            <span className="mdi mdi-set-center mdi-24px lifeline-icon" >
                            </span><span className="lifeline"></span>
                        </p>
                        <p>
                            <span onClick={this.handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon" ></span>
                            <span className="lifeline">{hints}</span>
                        </p>
                    </div>
                    <div className="timer-container">
                        <p>
                            <span className="left" style={{ float: 'left' }}>{currentQuestionIndex + 1} of {numberofQuestions} </span>
                            <span className="right">2:15<span className="mdi mdi-clock-outline mdi-24px"></span></span>
                        </p>
                    </div>

                    <h5>{currentQuestion.question}</h5>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                    </div>
                    <div className="button-container">
                        <button id="previous-button" onClick={this.handleButtonClick}>Previous</button>
                        <button id="next-button" onClick={this.handleButtonClick}>Next</button>
                        <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Play;