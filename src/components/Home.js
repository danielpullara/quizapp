import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'
import  AddDepModal  from "./AddDepModal"


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { addModalShow: false }
    }

    addModalClose = () => this.setState({ addModalShow: false });

    render() {
        console.log(this.state.addModalShow)
        return (
            <div>

                <Fragment>
                    <Helmet><title>Quiz APP-Home</title></Helmet>
                    <div id="home">
                        <section>
                            <div style={{ textAlign: 'center' }}>
                                <span><span className="mdi mdi-cube-outline cube"></span></span>
                            </div>
                            <h1>Quiz App</h1>
                            <div className="play-button-container">
                                <ul>
                                    <li ><Link className="play-button" to="/play/instructions">Play</Link></li>
                                </ul>
                            </div>
                            <div className="auth-container">
                                <Link
                                    variant='primary'
                                    onClick={() => this.setState({ addModalShow: true })}
                                    className="auth-buttons"
                                    id="login-button">Login</Link>
                               
                                <Link to="/register" className="auth-buttons" id="signup-button">Register</Link>
                            </div>
                        </section>
                    </div>
                </Fragment>
                <AddDepModal
                                    show={this.state.addModalShow}
                                    onHide={this.addModalClose} 
                                    />
            </div>

        )
    }
}

export default Home;