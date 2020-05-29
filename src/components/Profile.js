import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import QuizInstructions from './quiz/QuizInstructions'
import InputQuestions from './InputQuestions'
import Chart from './Chart'
import Questions from "../components/Questions"

class Profile extends Component {


    componentDidMount() {
        if (!this.props.user) return this.props.history.push("/")
    }

    render() {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <h1 className="text-center">Profile</h1>
                </div>
                <Chart />
                <h2 style={{ textAlign: "center" }}> Welcome Back! {this.props.user.first_name}</h2>
                <table className="table col-md-6 mx-auto">
                    <tr >
                        <td style={{ textAlign: "center" }}> Email: {this.props.user.email}</td>
                    </tr>
                </table>

                <QuizInstructions/>
                <InputQuestions />
                <Questions />
            </div>
        )
    }
}

export default withRouter(Profile)