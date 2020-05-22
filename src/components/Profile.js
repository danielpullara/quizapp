import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import QuizInstructions from './quiz/QuizInstructions'
import InputQuestions from './InputQuestions'
import Chart from './Chart'
import Questions from "../components/Questions"

class Profile extends Component {


    componentDidMount() {
        if(!this.props.user) return this.props.history.push("/")
    }


    render() {
        console.log("this.props", this.props)
        return (
            <div className="container">
                <Chart/>
                <div className="jumbotron mt-5">
                    <h1 className="text-center">Profile</h1>
                </div>
                <table className="table col-md-6 mx-auto">
                    <tbody>
                        <tr>
                            <td>First Name</td>
                            <td>{this.props.user.first_name}</td>
                        </tr>
                        <tr>
                            <td>Last Name</td>
                            <td>{this.props.user.last_name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{this.props.user.email}</td>
                        </tr>
                    </tbody>
                </table>
              
                <QuizInstructions/>
                <InputQuestions />
                <Questions />
            </div>
        )
    }
}

export default withRouter(Profile)