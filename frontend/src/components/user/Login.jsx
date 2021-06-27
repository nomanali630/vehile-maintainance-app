import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import { Button } from 'react-bootstrap'

import axios from 'axios';
import { useGlobalState, useGlobalStateUpdate } from './../../context/globalContext';
import url from './../BaseUrl'

function Login() {

    const history = useHistory();

    let [show, setShow] = useState();
    const globalState = useGlobalState();
    const setGlobalState = useGlobalStateUpdate();

    function handleLogin(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: url + '/auth/login',
            data: {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            }, withCredentials: true
        }).then((response) => {
            console.log("response.data: ", response.data);
            if (response.data.status === 200) {
                // alert(response.data.message)
                // history.push('/AdminDashboard')
                sessionStorage.setItem("email", document.getElementById("email").value)
                setGlobalState(prev => {
                    return { ...prev, user: response.data.user, role: response.data.user.role, userProfile: response.data.user.profilePic }
                })

            } else {
                // alert(response.data.message);
                setShow(response.data.message)
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function move() {
        history.push('/signup')
    }

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = state;

    const handleClick = (newState) => () => {
        setState({ open: true, ...newState });
        setTimeout(function () { setState({ ...state, open: false }); }, 3000);
    };

    const buttons = (
        <React.Fragment>
            <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })} className="btn btn-dark btn-block my-4" style={{ color: "white" }} type="submit">Log In</Button>
        </React.Fragment>
    );

    return (
        <div className="d-flex justify-content-center">
            <div className="p-2 col-example text-center">

                <form className="text-center border border-light p-5" onSubmit={handleLogin}>

                    <p className="h4 mb-4">Log In</p>

                    <input type="email" id="email" className="form-control mb-4" placeholder="Your Email" required />
                    <input type="password" id="password" className="form-control mb-4" placeholder="Password" required />

                    <div>
                        {buttons}
                        {show ?
                            <Snackbar
                                anchorOrigin={{ vertical, horizontal }}
                                open={open}
                                message={show}
                                key={vertical + horizontal}
                            />
                            : null
                        }
                    </div>
                    <p onClick={move} style={{ cursor: "pointer" }}>Don't have an account?</p>

                </form>
                <br />
                {'===>' + JSON.stringify(globalState)}
            </div>

        </div>
    )
}

export default Login;