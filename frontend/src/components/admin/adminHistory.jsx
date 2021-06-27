import React, { useEffect, useState } from 'react';
import axios from 'axios'
import url from '../BaseUrl';
import './adminDashboard.css';
import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';

// const useStyles = makeStyles({
//     table: {
//         minWidth: 650,
//     },
// });


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

const useStyles = makeStyles(({ spacing }) => ({
    card: {
        marginTop: 40,
        borderRadius: spacing(0.5),
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



function AdminDashboard() {
    const classes = useStyles();
    const [imageUrl, setURL] = useState([]);
    const cardHeaderStyles = useContainedCardHeaderStyles();
    const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
    const cardHeaderShadowStyles = useFadedShadowStyles();


    useEffect(() => {
        axios({
            method: "get",
            url: url + "/adminHistory",
            withCredentials: true
        }).then((res) => {
            console.log("getHistory ===> : ", res.data.data);
            setURL(res.data.data)
        }).catch((err) => {
            console.log(err)
        })
        return () => {
            console.log("cleanup");
        }
    }, [])

    return (


        // <div>

        //     <h1 style={{ textAlign: "center", marginBottom: "50px" }}>Admin History</h1>
        //     {imageUrl.map((eachItem, index) => {
        //         return (
        //             <div style={{padding:"30px"}}>
        //             <TableContainer component={Paper}>
        //                 <Table className={classes.table} aria-label="simple table">
        //                     <TableHead>
        //                         <TableRow>
        //                             <TableCell><b>Meter Photo</b></TableCell>
        //                             <TableCell><b>Fuel Photo</b></TableCell>

        //                             <TableCell align="right"><b>Meter Reading</b></TableCell>
        //                             <TableCell align="right"><b>Fuel Rate</b></TableCell>
        //                             <TableCell align="right"><b>Fuel Rupees</b></TableCell>
        //                             <TableCell align="right"><b>Fuel In Liters</b></TableCell>
        //                         </TableRow>
        //                     </TableHead>
        //                     <TableBody>

        //                         <TableRow key={index}>
        //                             <TableCell component="th" scope="row">
        //                                 <img
        //                                     width={64}
        //                                     height={64}
        //                                     className="mr-3"
        //                                     src={eachItem.meterReadingImage}
        //                                     alt={""}
        //                                 />
        //                             </TableCell>
        //                             <TableCell component="th" scope="row">
        //                                 <img
        //                                     width={64}
        //                                     height={64}
        //                                     className="mr-3"
        //                                     src={eachItem.fuelReadingImage}
        //                                     alt={""}
        //                                 />
        //                             </TableCell>
        //                             <TableCell align="right">{eachItem.meterReading}</TableCell>
        //                             <TableCell align="right">{eachItem.fuelPricePerLiter}</TableCell>
        //                             <TableCell align="right">{eachItem.fuelRupees}</TableCell>
        //                             <TableCell align="right">{eachItem.fuelInLiters}</TableCell>
        //                         </TableRow>

        //                     </TableBody>
        //                 </Table>
        //             </TableContainer>
        //             </div>
        //         )
        //     })}


        // </div>

        <>
            <h1 style={{ textAlign: "center", marginBottom: "50px" }}>Admin History</h1>

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
                                            <TableCell align="right"><b>Meter Reading</b></TableCell>
                                            <TableCell align="right"><b>Fuel Rate</b></TableCell>
                                            <TableCell align="right"><b>Fuel Rupees</b></TableCell>
                                            <TableCell align="right"><b>Fuel In Liters</b></TableCell>
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
                                            <TableCell align="right">{eachItem.meterReading}</TableCell>
                                            <TableCell align="right">{eachItem.fuelPricePerLiter}</TableCell>
                                            <TableCell align="right">{eachItem.fuelRupees}</TableCell>
                                            <TableCell align="right">{eachItem.fuelInLiters}</TableCell>
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
};

export default AdminDashboard;






