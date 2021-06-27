import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import url from '../BaseUrl';
import { Button } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';

export default function Signup() {

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [errmessage, setErrmessage] = useState('');
    const [show, setResult] = useState('');


    useEffect(() => {
        axios({
            method: 'post',
            url: url + '/auth/validemail',
            data: {
                email: email
            }, withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                if (response.data.isFound) {
                    setErrmessage("Email Already exit")
                }
                else {
                    setErrmessage("Email is Available")
                }
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.log(error);
        });

    }, [email])

    const userName = useRef();
    const password = useRef();
    const phoneNumber = useRef();

    function handleSubmit(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: url + '/auth/signup',
            data: {
                name: userName.current.value,
                email: email,
                phone: phoneNumber.current.value,
                password: password.current.value
            }, withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                setResult(response.data.message)

            } else {
                // alert(response.data.message);
                setResult(response.data.message)
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function move() {
        history.push('/')
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
            <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })} className="btn btn-dark btn-block my-4" style={{ color: "white" }} type="submit">Sign Up</Button>
        </React.Fragment>
    );

    return (
        <div className="d-flex justify-content-center">
            <div className="p-2 col-example text-center">


                <form className="text-center border border-light p-5" onSubmit={handleSubmit} style={{ width: "100%", margin: "0 auto" }}>

                    <p className="h4 mb-4">Sign Up</p>
                    {/* <center><span style={{ textAlign: "center", fontWeight: "bolder" }} id="show-result"></span></center>
                    {show ? <div className="alert alert-danger" role="alert">
                        {show}
                    </div> : null} */}
                    <input type="text" className="form-control mb-4" placeholder="Your Name" ref={userName} required />

                    <input type="email" className="form-control mb-4" placeholder="Your Email" onChange={(e) => setEmail(e.target.value)} required />
                    <h6 style={{ textAlign: "right", marginTop: "-15px" }}>{errmessage}</h6>

                    <input type="password" id="defaultLoginFormPassword" className="form-control mb-4" placeholder="Password" ref={password} required />
                    <input type="text" id="defaultLoginFormPassword" className="form-control mb-4" placeholder="Phone Number" ref={phoneNumber} required />

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

                    <p onClick={move} style={{ cursor: "pointer", color: 'blue' }}>Go To Login</p>

                </form>
                <br />
            </div>
        </div>
    )
}