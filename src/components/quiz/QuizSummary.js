import React,{Component} from 'react';


class QuizSummary extends Component {
    constructor(props){
        super(props)
        this.state ={
            score:0,
            numberOfQuestions: 0, 
            numberOfAnsweredQuestions: 0,
            correctAnswers: 0,
            usedHints: 0,
            usedFiftyFifty: 0,
        }
    }

    
    render(){
        console.log(this.props)
        return (
            <h1>Hello from Quiz Summary </h1>
        )
    }
}


export default QuizSummary