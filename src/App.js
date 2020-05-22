import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from '../src/components/Home';
import QuizInstructions from './components/quiz/QuizInstructions'
import Play from './components/quiz/Play'
import QuizSummary from './components/quiz/QuizSummary'
import Register from './components/Register'
import Profile from './components/Profile'
import Login from './components/Login'
import Protected from "./components/Protected"
function App() {
  const [user,setUser] = useState(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{
    checkUser()
  },[])

  const checkUser = async () => {
    // extracting token from url
    const urlToken = window.location.href.split("?token=")[1]
      ? window.location.href.split("?token=")[1].replace("#_=_", "")
      : null;
    // get token from storage or urlToken
    const token = localStorage.getItem("usertoken") || urlToken;
  
    // if there is no token, we don't need to do anything else, just set our app state as LOADED
    if (!token) {
      setLoaded(true)
      return;
    }
  
    // if there is token, we will fetch user information from api server using the token.
    try {
      const url = process.env.REACT_APP_SERVER+"/users/me";
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      });
      const data = await resp.json();
      console.log(data.data)
      // if we get user object from response, it means token is correct, we save it back to storage, as well as setState our user to the value we just got from the response
      if (data.status === "success") {
        localStorage.setItem("usertoken", token);
        setUser(data.data);
        setLoaded(true)

      } else {
        // token is not valid, clear the token so that we don't have to check again
        localStorage.removeItem("usertoken");
        setLoaded(true)
      }
    } catch (err) {
      console.log(err);
      setLoaded(true)
    }
    // finally set our app state to LOADED
  };
  console.log(user)
  if (!loaded) return <h1> loading </h1>
  return ( 
    <Router>
      <Protected path="/play/QuizSummary" exact user={user} component={QuizSummary}/>
      <Protected path="/play/Quiz" exact user={user} component={Play} />
      <Route path="/play/instructions" exact render={()=>  <QuizInstructions checkUser={checkUser}/>}/>
      <Route path="/" exact  render={()=> <Home user={user}  checkUser={checkUser} />}/>
      <Route path="/register" exact component={Register}/>
      <Protected path="/profile" exact user={user} component={Profile} />
      <Route path="/login" exact render={()=>  <Login checkUser={checkUser} />}/>
    </Router>
  );
}


export default App;
