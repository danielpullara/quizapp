
import React, {useEffect, useState} from "react"
import Axios from "axios"


export default function () {
    const [questions, setQuestions] = useState([])

    useEffect(()=>{
        getQuestions()  
    },[])

    async function getQuestions(){
        try{

            const res = await Axios.get("http://localhost:5000/QuestionsRoute/me", {
                headers: {'Authorization': `Bearer ${localStorage.getItem("usertoken")}`}
            })
            // if(res.status)
            setQuestions(res.data)
        }
        catch(e){
            console.log("error while geting questions",e)
        }
    }
    console.log(questions)



    const renderQuestions = () => {
        return questions.map(eachQuestion => {
            return (
            <p> {eachQuestion.question}</p>
            )
        })
    }
    return (
     <div>
         dsadasdas
         {renderQuestions()}
     </div>
    )
}