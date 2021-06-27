import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { InputGroup, FormControl, Container, Row, Form, Card, FormGroup, Col, Button, Media } from 'react-bootstrap';
import './dashboard.css';
import bikeMeter from './../../images/Bike_Meter.jpg';
import fuelMeter from './../../images/Fuel_Meter.jpg';
import fallBack from './../../images/FallBack.png';
import Snackbar from '@material-ui/core/Snackbar';
import url from './../BaseUrl';
import axios from 'axios';
import moment from 'moment';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const [show, setShow] = useState();
    const [data, setData] = useState([]);
    const [toggle, setToggle] = useState(true);
    const [message, setMessage] = useState('');
    const [valid, setValid] = useState('');
    // const [phototoggle, setphototoggle] = useState(true);

    const meterReading = useRef();
    const fuelPricePerLiter = useRef();
    const fuelRupees = useRef();
    const fuelInLiters = useRef();
    const ofDates = useRef();

    // ----------------------------- Start Show Data Function -------------------------------------
    useEffect(() => {
        axios({
            method: 'get',
            url: url + '/getdata',
            withCredentials: true
        }).then((response) => {
            if (response.data.data.length === 0) {
                setMessage("No Data found")
            }
            var tempdata = response.data.data

            tempdata = tempdata.map((eachReading, index) => {
                var prevReading = tempdata[index + 1]

                if (prevReading === undefined) {
                    return eachReading
                }
                else {
                    return {
                        ...eachReading,
                        readingDifference: ((eachReading.meterReading - prevReading.meterReading) / prevReading.fuelInLiters).toFixed(1)
                    }
                }
            })
            setData(tempdata)
            console.log("TempData ===> : ", tempdata)
            moment.defaultFormat = 'YYYY-MM-DD';
            ofDates.current.value = moment().format();
            if (fuelPricePerLiter.current.value.type === undefined && tempdata.length === 0) {
                return
            }
            else {
                fuelPricePerLiter.current.value = response.data.data[response.data.data.length - 1].fuelPricePerLiter
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [toggle])
    // ----------------------------- End Show Data Function ---------------------------------------

    // ----------------------------- Start Form Data Function -------------------------------------
    function handleSubmit(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: url + '/dashboard',
            data: {
                meterReading: meterReading.current.value,
                fuelPricePerLiter: fuelPricePerLiter.current.value,
                fuelRupees: fuelRupees.current.value,
                fuelInLiters: fuelInLiters.current.value,
                ofDates: ofDates.current.value
            }, withCredentials: true
        }).then((response) => {
            console.log("Dashbaord ===> : ", response.data);
            setToggle(!toggle)
            setShow("Done")

            meterReading.current.value = ""
            fuelRupees.current.value = ""
            fuelInLiters.current.value = ""

        }).catch((error) => {
            console.log(error);
        });
    }
    // ----------------------------- End Form Data Function ---------------------------------------

    // ----------------------------- Start Meter Reading Validation Function ----------------------
    function validation() {
        if (!data.length) {
            return setValid("")
        }
        else {
            const prevReading = data[0].meterReading;
            const currentReading = meterReading.current.value;
            if (currentReading <= prevReading) {
                return setValid("false")
            }
            else {
                return setValid("true")
            }
        }
    }
    // ----------------------------- End Meter Reading Validation Function ------------------------

    const handlePrice = () => {
        let fuelRate = fuelPricePerLiter.current.value;
        let liter = fuelInLiters.current.value;
        let showPrice = fuelRate * liter;
        return fuelRupees.current.value = showPrice.toFixed(2);
    }

    const handleLiter = () => {
        let fuelRate = fuelPricePerLiter.current.value;
        let rupees = fuelRupees.current.value;
        let showLiter = rupees / fuelRate;
        return fuelInLiters.current.value = showLiter.toFixed(2);
    }

    const handleRate = () => {
        let fuelPrice = fuelRupees.current.value;
        let fuelRate = fuelPricePerLiter.current.value;
        let updateLiter = fuelPrice / fuelRate;
        return fuelInLiters.current.value = updateLiter.toFixed(2);
    }

    // --------------------------------------------------------------------------------------------

    // ----------------------------- Start Preview Image Function -----------------------------------
    function previewMultiple(event) {
        var url = URL.createObjectURL(event.target.files[0]);
        document.getElementById(event.target.id).parentElement.firstChild.src = url;
    }
    // ----------------------------- End Preview Image Function -------------------------------------

    // ----------------------------- Start Photo Upload Function ------------------------------------
    function upload(event) {
        event.preventDefault();
        var fileInput = document.getElementById("fileInput");
        var fileInput2 = document.getElementById("fileInput2");

        let formData = new FormData();

        formData.append("myFile", fileInput.files[0]);
        formData.append("myFile2", fileInput2.files[0]);

        formData.append("myName", "sameer");
        formData.append("myDetails",
            JSON.stringify({
                "subject": "Science",
                "year": "2021"
            })
        );
        axios({
            method: 'post',
            url: url + "/upload",
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        }).then(res => {
            console.log(`  upload Success,====>`, res.data);
            setShow(res.data.message)
            previewdefault()
        }).catch(err => {
            console.log(err);
        })
    }
    // ----------------------------- End Photo Upload Function --------------------------------------

    // ----------------------------- Start Default Image Function -----------------------------------
    function previewdefault() {
        console.log("2nd Button Running")
        document.getElementById('show_pic').src = fallBack
        document.getElementById('show_pic2').src = fallBack
        console.log(document.getElementById('show_pic').src)
    }
    // ----------------------------- End Default Image Function -------------------------------------

    // --------------------------------------------------------------------------------------------

    // ----------------------------- Start Snackbar Function --------------------------------------
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
            <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })} className="btn btn-dark" style={{ color: "white" }} type="submit">Submit</Button>
        </React.Fragment>
    );
    // ----------------------------- End Snackbar Function ----------------------------------------

    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <div className={classes.root}>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Manual Data Entry" {...a11yProps(0)} />
                                <Tab label="AI Data Entry" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <Container>

                                    <Form onSubmit={handleSubmit}>

                                        <InputGroup className="mb-3">
                                            <FormControl
                                                placeholder="Meter Reading"
                                                aria-label="Meter Reading"
                                                aria-describedby="basic-addon2"
                                                ref={meterReading}
                                                type="number"
                                                required
                                                onChange={validation}
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">{valid}</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <FormControl
                                                placeholder="Fuel Price Per liter"
                                                aria-label="Fuel Price Per liter"
                                                aria-describedby="basic-addon2"
                                                ref={fuelPricePerLiter}
                                                type="float"
                                                required
                                                onChange={handleRate}
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">/per liter</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <FormControl
                                                placeholder="Enter Fuel in Rupes"
                                                aria-label="Enter Fuel in Rupes"
                                                aria-describedby="basic-addon2"
                                                ref={fuelRupees}
                                                type="float"
                                                required
                                                onChange={handleLiter}
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">rupees</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <FormControl
                                                placeholder="Enter Fuel Liters"
                                                aria-label="Enter Fuel Liters"
                                                aria-describedby="basic-addon2"
                                                ref={fuelInLiters}
                                                type="float"
                                                required
                                                onChange={handlePrice}
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">/liters</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <FormGroup controlId="date">
                                                <FormControl
                                                    type="date"
                                                    required
                                                    ref={ofDates}
                                                />
                                            </FormGroup>
                                        </InputGroup>

                                        <center>
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
                                        </center>
                                    </Form>
                                </Container>
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <Container>
                                    <Form onSubmit={upload}>
                                        <Row>
                                            <Col>
                                                <div className="col-md-12 mb-3" >
                                                    <div className="row justify-content align-items-lg-start d-flex">
                                                        <div className='col-12'>
                                                            <div className="file-upload" >
                                                                <img src={fallBack} alt="FallBack" id="show_pic" required />
                                                                <input type="file" onChange={previewMultiple} id="fileInput" required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="col-md-12 mb-3" >
                                                    <div className="row justify-content align-items-lg-start d-flex">
                                                        <div className='col-12'>
                                                            <div className="file-upload" >
                                                                <img src={fallBack} alt="FallBack" id="show_pic2" required />
                                                                <input type="file" onChange={previewMultiple} id="fileInput2" required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div style={{ width: "100%", height: "2px", backgroundColor: "black" }}></div>
                                        </Row>
                                        <Row>
                                            <Col className="text-center mt-2">Meter Photo</Col>
                                            <Col className="text-center mt-2">Fuel Photo</Col>
                                        </Row>
                                        <br />
                                        <center> <div>
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
                                        </div></center>
                                    </Form>
                                    <br />
                                    {/* --------------------- Start Card Instruction ------------------- */}
                                    <Row className="justify-content-md-center">
                                        <Col md="auto">
                                            <h6 style={{ marginBottom: "15px" }}><b>Read the following instructions carefully</b></h6>
                                            <Media>
                                                <div className="ins-file-upload">
                                                    <img
                                                        width={64}
                                                        height={64}
                                                        className="mr-3"
                                                        src={bikeMeter}
                                                        alt={bikeMeter}
                                                    />
                                                </div>
                                                <Media.Body>
                                                    <h6><b>Meter Photo</b></h6>
                                                    <p style={{ fontSize: "10px", marginLeft: "5px" }}>
                                                        <b>Upload bike meter photo clearly during filling fuel.
                                                    <br /> Blur picture will not be procced.
                                                    <br /> Upload picture as shown in example. </b></p>
                                                </Media.Body>
                                            </Media>
                                            <Media>
                                                <div className="ins-file-upload">
                                                    <img
                                                        width={64}
                                                        height={64}
                                                        className="mr-3"
                                                        src={fuelMeter}
                                                        alt={fuelMeter}
                                                    />
                                                </div>
                                                <Media.Body>
                                                    <h6><b>Fuel Photo</b></h6>
                                                    <p style={{ fontSize: "10px", marginLeft: "5px" }}>
                                                        <b>Upload fuel meter photo clearly during filling fuel.
                                                        <br /> Blur picture will not be procced.
                                                        <br /> Upload picture as shown in example. </b></p>
                                                </Media.Body>
                                            </Media>
                                            <h6 style={{ marginTop: "15px" }}><b>Note:</b>Your data will be procced in 48 hours.</h6>
                                        </Col>
                                    </Row>
                                    {/* --------------------- End Card Instruction ------------------- */}
                                </Container>
                            </TabPanel>
                        </SwipeableViews>
                    </div>
                </Row>
                <Row>
                    <Col>
                        {/* -------------------- Card Data & Image Data ------------------------- */}
                        {data.length === null ? "Loading..........................." : null}
                        {data.length === 0 ? message : null}
                        {data.map((eachItem, index) => {
                            return (
                                <>
                                    {(eachItem.meterReadingImage && eachItem.fuelReadingImage && eachItem.email && eachItem.status && eachItem.createdOn && eachItem.status === "In Process") ?
                                        <>
                                            {/* -------------------- Display Image Data ------------------------- */}
                                            <Card style={{ width: '18rem' }} key={index}>
                                                <Card.Body>
                                                    <center><b>Status: </b>{eachItem.status}</center>
                                                    <Row>
                                                        <Col>
                                                            <div className="file-upload" >
                                                                <img
                                                                    width={64}
                                                                    height={64}
                                                                    className="mr-3"
                                                                    src={eachItem.meterReadingImage}
                                                                    alt={""}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className="file-upload" >
                                                                <img
                                                                    width={64}
                                                                    height={64}
                                                                    className="mr-3"
                                                                    src={eachItem.fuelReadingImage}
                                                                    alt={""}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className="text-center mt-2">Meter Photo</Col>
                                                        <Col className="text-center mt-2">Fuel Photo</Col>
                                                        <br />
                                                    </Row>
                                                    <Row>
                                                        <br />
                                                        <br />
                                                        <Col className="text-center mt-2">
                                                            <b>Date: {moment(eachItem.createdOn).format("L")}</b>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                            {/* -------------------- End Display Image Data ------------------------- */}
                                        </>
                                        :
                                        <>

                                        </>
                                    }
                                    {(eachItem.meterReading && eachItem.fuelPricePerLiter && eachItem.fuelRupees && eachItem.fuelInLiters) ?
                                        <>
                                            <Card style={{ width: '18rem' }} key={index}>
                                                <Card.Body>
                                                    <Card.Subtitle className="text-muted text-center">Date : {moment(eachItem.createdOn).format("MMMM Do YYYY")}</Card.Subtitle>
                                                    <Row>
                                                        <Col>
                                                            <center><div className="milage" >
                                                                <div id="mask"><b>Milage</b>
                                                                    <div className="p-2 bd-highlight col-example" style={{ fontSize: "2em", marginTop: "-105px" }}>{eachItem.readingDifference}</div>
                                                                </div>
                                                            </div></center>
                                                        </Col>
                                                    </Row><br />
                                                    <Card.Text>
                                                        <b>Meter Reading <span className="tab1">:</span> </b> {eachItem.meterReading} <br />
                                                        <b>Fuel Price Per Liter <span className="tab2">:</span> </b> {eachItem.fuelPricePerLiter} <br />
                                                        <b>Total Fuel Rupees <span className="tab3">:</span> </b> {eachItem.fuelRupees} <br />
                                                        <b>Fuel In Liters <span className="tab4">:</span> </b> {eachItem.fuelInLiters} <br />
                                                        <b>Date <span className="tab5">:</span> </b> {moment(eachItem.ofDates).format("L")}
                                                    </Card.Text>
                                                    <>
                                                        {(eachItem.meterReadingImage && eachItem.fuelReadingImage) ?
                                                            <>
                                                                <div className="d-flex flex-row-reverse">
                                                                    <div className="p-2" >
                                                                        <div className="card-file-upload" >
                                                                            <img
                                                                                width={64}
                                                                                height={64}
                                                                                className="mr-3"
                                                                                src={eachItem.meterReadingImage}
                                                                                alt={""}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-2">
                                                                        <div className="card-file-upload" >
                                                                            <img
                                                                                width={64}
                                                                                height={64}
                                                                                className="mr-3"
                                                                                src={eachItem.fuelReadingImage}
                                                                                alt={""}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : null}
                                                    </>
                                                </Card.Body>
                                            </Card>
                                        </>
                                        :
                                        <>
                                            <Card style={{ width: '18rem' }} key={index}>
                                                <Card.Body>
                                                    <Card.Subtitle className="text-muted text-center">Date : {moment(eachItem.createdOn).format("MMMM Do YYYY")}</Card.Subtitle>
                                                    <Row>
                                                        <Col>
                                                            <center><div className="milage" >
                                                                <div id="mask"><b>Milage</b>
                                                                    <div className="p-2 bd-highlight col-example" style={{ fontSize: "2em", marginTop: "-105px" }}>{eachItem.readingDifference}</div>
                                                                </div>
                                                            </div></center>
                                                        </Col>
                                                    </Row><br />
                                                    <Card.Text>
                                                        <b>Meter Reading <span className="tab1">:</span> </b> {eachItem.meterReading} <br />
                                                        <b>Fuel Price Per Liter <span className="tab2">:</span> </b> {eachItem.fuelPricePerLiter} <br />
                                                        <b>Total Fuel Rupees <span className="tab3">:</span> </b> {eachItem.fuelRupees} <br />
                                                        <b>Fuel In Liters <span className="tab4">:</span> </b> {eachItem.fuelInLiters} <br />
                                                        <b>Date <span className="tab5">:</span> </b> {moment(eachItem.ofDates).format("L")}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </>
                                    }
                                </>
                            )
                        })}
                        {/* --------------------End Card Data & Image Data ------------------------- */}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
