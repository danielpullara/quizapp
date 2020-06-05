
import React, { useEffect, useState } from "react"
import Axios from "axios"
import { deleteQuestion } from './InputQuestionsFunctions'
import { useHistory } from "react-router-dom"

export default function (props) {
    const [questions, setQuestions] = useState([])
    const history = useHistory()
    useEffect(() => {
        getQuestions()
    }, [])

    async function getQuestions() {
        try {

            const res = await Axios.get("http://localhost:5000/QuestionsRoute/me", {
                headers: { 'Authorization': `Bearer ${localStorage.getItem("usertoken")}` }
            })
            // if(res.status)
            setQuestions(res.data)
        }
        catch (e) {
            console.log("error while geting questions", e)
        }
    }

    const deletedQuestion = (id) => {
        deleteQuestion(id)
            .then(res => {
                history.push('/profile')
            })
    }


    const renderQuestions = () => {
        return questions.map(eachQuestion => {
            return (
                <div>
                    <table className="table col-md-6 mx-auto">
                    <button onClick={() => { deletedQuestion(eachQuestion._id); }}
                                className="mdi mdi-delete mdi-24px lifeline-icon" />
                        <tr>                           
                            <td> {eachQuestion.question}</td>
                            <td style={{ color: "blue" }}> {eachQuestion.answer}</td>
                        </tr>
                    </table>

                </div >
            )
        })
    }
    return (
        <div>
            {renderQuestions()}
        </div>
    )
}