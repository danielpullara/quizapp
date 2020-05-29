import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import answer from '../../assets/img/answer.png'
import options from '../../assets/img/options.png'
import fiftyfifty from '../../assets/img/fiftyfifty.png'
import hints from '../../assets/img/hints.png'


const QuizInstructions = () => (
    <Fragment>
        <Helmet><title>PART 107 - Commercial UAS Study Guide</title></Helmet>
        <div className="instructions container">
            <h1>How to Play the Game</h1>
            <p>Read this guide from start to finish!</p>
            <ul className="browser-default" id="main-list">
                <li>The Quiz last for 60 minutes and ends when your time elapses.</li>
                <li>Each game consists of 60 questions.</li>
                <li>
                    Every question constains 4 possible answers.
                    <img src={options} alt="Quiz App Options Example"></img>
                </li>
                <li>Select the option that best answers the question by clicking
                    <img src={answer} alt="Quiz App Answer Example"></img>
                </li>
                <li>
                    Although you don't have such a feature on the real test, Each game comes 2 lifelines namely:
                 <ul id="sublist">
                        <li> (2) 50-50 chances</li>
                        <li> 5 Hints </li>
                    </ul>
                </li>
                <li>
                    Selecting a 50-50 lifeline by clicking the icon
                     <span className="mdi mdi-set-center mdi-24px lifeline-icon"></span>
                    will remove 2 wrong answers, leaving the correct answer and one wrong answer.
                     <img scr={fiftyfifty} alt="Quiz App Fifty-Fifty example" />
                </li>
                <li>Using a hint by clicking the icon <span className="mdi mdi-lightbulb-on mdi-24px lifeline-icon"></span>
                    will remove one wrong answer leaving two wrong answers and one correct answer. You can use as many hints as possible on a single question.
                    <img src={hints} alt="Quiz App Options Example" />
                </li>
                <li>You may quit the game at any time.However You in order to recieve a score, you must finish the game.</li>
                <li>The timer starts as soon as the game loads! Goodluck and Happy Studies!</li>
            </ul>

            <div>
                <Link className="left" to="/">No Take me Back</Link>
                <Link className="right" to="/play/Quiz">Okay lets Do This! </Link>
            </div>
        </div>
    </Fragment>
);

export default QuizInstructions;
