import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import url from '../BaseUrl';
import './adminDashboard.css';
// import { Form, Col, Row, Container, Table } from 'react-bootstrap';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useContainedCardHeaderStyles } from '@mui-treasury/styles/cardHeader/contained';
import { useSoftRiseShadowStyles } from '@mui-treasury/styles/shadow/softRise';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';

const useStyles = makeStyles((theme) => ({

    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },

    },


    card: {
        marginTop: 40,
        borderRadius: theme.spacing(0.5),
        transition: '0.3s',
        width: '90%',
        overflow: 'initial',
        background: '#ffffff',


    },
    content: {
        paddingTop: 0,
        textAlign: 'left',
        overflowX: 'auto',
        '& table': {
            marginBottom: 0,
        }
    },

}));





export default function AdminDashboard() {
    const [imageUrl, setURL] = useState([]);
    const classes = useStyles();

    const cardHeaderStyles = useContainedCardHeaderStyles();
    const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
    const cardHeaderShadowStyles = useFadedShadowStyles();




    // let [show, setShow] = useState();
    // const [data, setData] = useState([]);
    // const [valid, setValid] = useState('');

    const meterReading = useRef();
    const [fuelRate, setfuelRate] = useState(0);
    const [fuelInLiters, setfuelInLiters] = useState(0);
    const [fuelTotalRupees, setfuelTotalRupees] = useState(0);

    console.log("meter reading........",meterReading)
    useEffect(() => {
        axios({
            method: "get",
            url: url + "/adminGetPhotoData",
            withCredentials: true
        }).then((res) => {
            console.log("getPhotoData ===> : ", res.data.data);
            setURL(res.data.data)
        }).catch((err) => {
            console.log(err)
        })
        return () => {
            console.log("cleanup");
        }
    }, [])


    useEffect(() => {
        console.log("fuelRate: ", fuelRate)
        if (fuelRate && fuelRate > 0) {

            let totalPrice = fuelRate * fuelInLiters;
            setfuelTotalRupees(totalPrice.toFixed(2));
        }
    }, [fuelRate]);

    useEffect(() => {
        console.log("fuelRate: ", fuelRate)
        if (fuelRate && fuelRate > 0) {

            let fuelInLiters = fuelTotalRupees / fuelRate;
            setfuelInLiters(fuelInLiters.toFixed(2));
        }
    }, [fuelTotalRupees]);

    useEffect(() => {
        console.log("fuelRate: ", fuelRate)
        if (fuelRate && fuelRate > 0) {

            let totalRupees = fuelInLiters * fuelRate;
            setfuelTotalRupees(totalRupees.toFixed(2));
        }
    }, [fuelInLiters]);






    function updateStatus(id) {
        console.log("Id ===>", id)
        axios({
            method: 'post',
            url: url + '/updateStatus',
            data: {
                id: id,
                meterReading: meterReading.current.value,
                fuelRate: fuelRate,
                fuelTotalRupees: fuelTotalRupees,
                fuelInLiters: fuelInLiters,
                status: "Process Complete"
            },
            withCredentials: true
        }).then((response) => {
            alert(response.data.message)
        }).catch((err) => {
            console.log(err)
        })
    }
    

    return (

        <>
            <h1 style={{ textAlign: "center", marginBottom: "50px" }}>Admin Dashboard</h1>

            {imageUrl.map((eachItem, index) => {
                return (
                    <div style={{ padding: "30px" }}>
                        <Card className={(classes.card, cardShadowStyles.root)}>
                            <CardHeader
                                className={cardHeaderShadowStyles.root}
                                classes={cardHeaderStyles}
                                title={'Desserts'}
                                subheader={'Vehicle Details'}
                            />
                            <CardContent className={classes.content}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Meter Photo</b></TableCell>
                                            <TableCell><b>Fuel Photo</b></TableCell>
                                            {/* <TableCell align="left"><b>Meter Reading</b></TableCell>
                                            <TableCell align="left"><b>Fuel Rate</b></TableCell>
                                            <TableCell align="left"><b>Fuel Rupees</b></TableCell>
                                            <TableCell align="left"><b>Fuel In Liters</b></TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                <img
                                                    width={64}
                                                    height={64}
                                                    className="mr-3"
                                                    src={eachItem.meterReadingImage}
                                                    alt={""}
                                                />

                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <img
                                                    width={64}
                                                    height={64}
                                                    className="mr-3"
                                                    src={eachItem.fuelReadingImage}
                                                    alt={""}
                                                />

                                            </TableCell>
                                            <TableCell>
                                                <form onSubmit={(e) => { e.preventDefault(); updateStatus(eachItem._id) }}>
                                                    <form className={classes.root} style={{ display: "flex" }} >
                                                        {/* <TextField type='number' label="Meter Reading" variant="outlined" ref={meterReading} /> */}
                                                        <div>
                                                            <TextField
                                                                id="outlined-number"
                                                                label="Meter Reading"
                                                                type="number"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                inputRef={meterReading}
                                                                variant="outlined"
                                                                required
                                                            />
                                                        </div>
                                                        <div>                                                            
                                                                <TextField type='number' label="Fuel Rate" variant="outlined" InputLabelProps={{
                                                                    shrink: true,
                                                                }} onChange={(e) => { setfuelRate(e.target.value) }} required /> 

                                                            <div>
                                                                {fuelRate}
                                                            </div>

                                                        </div>

                                                        <div>
                                                            <TextField type='number' label="Fuel Total Rupees" variant="outlined" InputLabelProps={{
                                                                shrink: true,
                                                            }} onChange={(e) => { setfuelTotalRupees(e.target.value) }} />
                                                            <div>{fuelTotalRupees}</div>
                                                        </div>
                                                        <div>

                                                            <TextField type='number' label="Fuel in liters" variant="outlined" InputLabelProps={{
                                                                shrink: true,
                                                            }} onChange={(e) => { setfuelInLiters(e.target.value) }} />
                                                            <div>{fuelInLiters}</div>
                                                        </div>
                                                    </form>

                                                    <div className={classes.root} style={{ textAlign: 'center' }}>

                                                        <Button variant="contained" color="primary" type='submit'>
                                                            Submit
                                                        </Button>

                                                    </div>

                                                </form>
                                            </TableCell>


                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )
            })}
        </>


    )












}
