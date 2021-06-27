import axios from 'axios';
import { useGlobalStateUpdate } from "../context/globalContext";
import { Button } from "react-bootstrap";
import url from './BaseUrl'

function LogoutButton() {


    const setGlobalState = useGlobalStateUpdate();

    function logout() {
        axios({
            method: 'post',
            url: url + '/auth/logout',
            withCredentials: true,
        }).then((response) => {
            if (response.data.status === 200) {
                alert(response.data.message)
                setGlobalState((prev) => ({ ...prev, loginStatus: false, role: "loggedout", user: null }))
            }
        }, (error) => {
            console.log(error.message);
        });

    }
    return (<Button className="btn btn-danger" onClick={logout}>Logout</Button>)
}

export default LogoutButton;