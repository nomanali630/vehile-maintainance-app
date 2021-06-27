import './App.css';
import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink
} from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { useGlobalState } from './context/globalContext';
import Dashboard from './components/user/Dashboard';
import Signup from './components/user/Signup';
import LogoutButton from './components/Logout';
import Login from './components/user/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminHistory from './components/admin/adminHistory'

function App() {

  const globalState = useGlobalState();
  return (
    <React.Fragment>
      <nav className="sticky-top">
        <Navbar bg="dark" variant="dark" >
          {(globalState.role === 'admin') ?
            <React.Fragment>
              <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/">Admin Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/adminHistory">Admin History</Nav.Link>
              </Nav>
              <LogoutButton />
            </React.Fragment> : null
          }
          {(globalState.role === 'user') ?
            <React.Fragment>
              <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
              </Nav>
              <LogoutButton />
            </React.Fragment> : null
          }
          {(globalState.role === 'loggedout') ?
            <React.Fragment>
              <Nav className="ml-auto">
                <Nav.Link as={NavLink} to="/">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/signup">Signup</Nav.Link>
              </Nav>
            </React.Fragment> : null
          }
        </Navbar>
      </nav >

      {/* ROLE NULL////////////////////////////////////// */}

      {
        (globalState.role === null) ?
          <Switch>
            <Route path="*" ><h1>LOADING......</h1></Route>
          </Switch>
          : null
      }

      {/* ROLE LOGGEDOUT////////////////////////////////////// */}

      {
        (globalState.role === "loggedout") ?
          <Switch>
            <Route exact path="/"><Login /></Route>

            <Route path="/signup"><Signup /></Route>

            <Route path="*" ><Redirect to="/" /></Route>

          </Switch>

          : null
      }



      {/* ROLE USER ////////////////////////////////////// */}
      {
        (globalState.role === "user") ?
          <Switch>
            <Route exact path="/"><Dashboard /></Route>
            <Route path="*"><Redirect to="/" /></Route>
          </Switch>
          : null
      }

      {/*ROLE ADMIN ////////////////////////////////////////////*/}
      {
        (globalState.role === "admin") ?
          <Switch>
            <Route exact path="/"><AdminDashboard /></Route>
            <Route path="/adminHistory"><AdminHistory /></Route>
            <Route path="*"><Redirect to="/" /></Route>
          </Switch>
          : null
      }

    </React.Fragment>
  );
}

export default App;
