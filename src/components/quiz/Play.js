import React, { Fragment } from 'react';
import classnames from 'classnames'
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import isEmpty from '../../utils/is-empty';
import correctNotification from '../../assets/audio/right.mp3';
import wrongNotification from '../../assets/audio/wrong.mp3';
import selectNotification from '../../assets/audio/select.mp3';
import { withRouter } from 'react-router-dom'
import Axios from 'axios';

class Play extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions:[],
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer:' ',
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            nextButtonDisabled: false,
            previousButtonDisabled: true,
            previousRandomNumbers: [],
            time: {}
        };
        this.interval = null;
        this.correctSound = React.createRef()
        this.wrongSound = React.createRef()
        this.buttonSound = React.createRef()
    }

    // there are supposed to be questions that are taken from .json file 

    componentDidMount() {
        
        this.getQuestions()
    }
        startGame(){
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        this.startTimer();
        }
      getQuestions = async () => {
        try{

            const res = await Axios.get("http://localhost:5000/QuestionsRoute/me", {
                headers: {'Authorization': `Bearer ${localStorage.getItem("usertoken")}`}
            })
            // if(res.status)
            this.setState({questions:res.data}, ()=> this.startGame())
        }
        catch(e){
            console.log("error while geting questions",e)
        }
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
                numberOfQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }, () => {
                this.showOptions();
                this.handleDisableButton();

            });
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                this.correctSound.current.play();
            }, 200)
            this.correctAnswer();
        } else {
            setTimeout(() => {
                this.wrongSound.current.play();
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
        this.buttonSound.current.play();
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
                if (this.state.nextQuestion === undefined) {
                    this.endGame();
    
                } else {
                    this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion)
                }
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
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame();

            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion)
            }
        });
    }
    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });
        this.setState({
            usedFiftyFifty: false
        })
    }

    handleHints = () => {
        if (this.state.hints > 0) {
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
                if (this.state.previousRandomNumbers.length >= 3) break;
            }
        }

    }
    handleFiftyFifty = () => {
        if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });
            let count = 0;
            do {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer) {
                    if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                        randomNumbers.push(randomNumber);
                        count++
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if (!randomNumbers.includes(newRandomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                                randomNumbers.push(newRandomNumber)
                                count++;
                                break;
                            }
                        }
                    }
                }
            } while (count < 2);
            options.forEach((option, index) => {
                if (randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            });
            this.setState(prevState => ({
                fiftyFifty: prevState.fiftyFifty - 1,
                usedFifty: true
            }));
        }
    }

    startTimer = () => {
        const countDownTime = Date.now() + 180000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
                });
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds
                    }
                });
            }
        }, 1000);
    }

    handleDisableButton = () => {
        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                previousButtonDisabled: true
            });
        } else {
            this.setState({
                previousButtonDisabled: false
            });
        }
        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions) {
            this.setState({
                nextButtonDisabled: true
            });
        } else {
            this.setState({
                nextButtonDisabled: false
            });
        }
    }
    endGame = () => {
        alert('Quiz has ended');
        const { state } = this;
        console.log(state)
        const playerStats = {
            score: state.score,
            numberOfQuestions: state.numberOfQuestions,
            numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            fiftyFiftyUsed: 2 - state.fiftyFifty,
            hintsUsed: 5 - state.hints
        };
        console.log(playerStats)
        setTimeout(() => {
            console.log(this.props)
            this.props.history.push('/play/quizSummary', playerStats )
        }, 1000)

    }


    render() {

        const { currentQuestion,
            currentQuestionIndex,
            fiftyFifty,
            hints,
            numberOfQuestions,
            time
        } = this.state;
        return (
            <Fragment>
                <Helmet><title>PART 107 - Commercial UAS Study Guide</title></Helmet>
                <Fragment>
                    <audio ref={this.correctSound} src={correctNotification}></audio>
                    <audio ref={this.wrongSound} src={wrongNotification}></audio>
                    <audio ref={this.buttonSound} src={selectNotification}></audio>
                </Fragment>
                <div className="questions">
                    <h2>Commercial UAS Study Guide</h2>
                    <div className="lifeline-container">
                        <p>
                            <span onClick={this.handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon" >
                                <span className="lifeline">{fiftyFifty}</span>
                            </span>
                        </p>
                        <p>
                            <span onClick={this.handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon" >
                                <span className="lifeline">{hints}</span>
                            </span>
                        </p>
                    </div>
                    <div className="timer-container">
                        <p>
                            <span className="left" style={{ float: 'left' }}>{currentQuestionIndex + 1} of {numberOfQuestions} </span>
                            <span className="right">{time.minutes}:{time.seconds}<span className="mdi mdi-clock-outline mdi-24px"></span></span>
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
                        <button
                            className={classnames('', { 'disable': this.state.previousButtonDisabled })}
                            id="previous-button"
                            onClick={this.handleButtonClick}>
                            Previous
                            </button>
                        <button
                            className={classnames('', { 'disable': this.state.nextButtonDisabled })}
                            id="next-button"
                            onClick={this.handleButtonClick}>
                            Next</button>
                        <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Play);