import React, { useEffect, useState } from "react";
import WindalsNav from './navbar';
import Footer from './footer';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import toast, { Toaster } from "react-hot-toast";
import { getAllStationNames, logout, verifyLogin, getProductNames,getOneProductStationNames } from "../helper/helper";
import StationCard from "./stationcards";
import { getCurrentShift, getWorkAtStationInDay } from "../helper/helper";
import Select from 'react-select';

function Admin() {

    const [currentActiveShift, setCurrentActiveShift] = useState("")
    const [stationNames, setStationNames] = useState([])
    const [workAtStationInDay, setWorkAtStationInDay] = useState([])
    const [productNames, setProductNames] = useState([]);
    const [productSelected, setproductSelected] = useState(false)
    

    useEffect(() => {
        const verifyLoginPromise = verifyLogin()
        verifyLoginPromise.then((result) => {
            console.log(result);
            const getCurrentShiftPromise = getCurrentShift()
            getCurrentShiftPromise.then((result) => {
                console.log(result.shift_id);
                setCurrentActiveShift(result.shift_id)
            }).catch((err) => {
                toast.error(err.msg)
            })
            return null
        }).catch((err) => {
            toast.error(err.msg)
            if (err.redirectUrl) {
                logout()
            }
        })
    }, [])

    /*useEffect(() => {
        const getStationNamesPromise = getAllStationNames()
        getStationNamesPromise.then((result) => {
            setStationNames(result)
        }).catch((err) => {
            toast.error(err.msg)
        })
    }, [currentActiveShift])*/

    useEffect(() => {
        //console.log("Hello in Station")
        //console.log({ParameterReceived:opr})
        
        const getProductNamesPromise = getProductNames()
        getProductNamesPromise.then(async (result) => {
            console.log("Fetching Product Names");
            console.log(result);
            const productnames = await result.map((product) => product)
            setProductNames(productnames)
        }).catch((err) => { })
    }, [])

    console.log({ currentActiveShift: currentActiveShift, stationNames: stationNames });

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        console.log("Model opening")
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    async function fetchStationStatus(info)
    {
        setproductSelected(true)
        console.log(info);
        const stationNames = await getOneProductStationNames(info.value)
        console.log("Got Station List")
        console.log(stationNames)
        setStationNames(stationNames)
        console.log(productSelected)
    }
    return (
        <div>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="dashboard">
                {
                    productNames.length>0?
                    <div>

                        <div className="d-flex justify-content-center align-items-center">
                            <Select
                                options={productNames.map((product) => ({ label: product.product_name, value: product.product_name }))}
                                name="productName"
                                onChange={(data) => fetchStationStatus(data)}
                                isSearchable={true}
                                placeholder="Select Product"
                            />
                            {/* <button style={{marginLeft:20}}>Refresh</button> */}
                        </div>
                        <div>
                            {
                                productSelected===true?
                                    <div>
                                        <div className="cards" >
                                            {
                                            stationNames.length > 0 ?
                                                stationNames.map((station, index) => (
                                                    <div>
                                                        <StationCard stationInfo={station} number={index + 1} worker="abc" shift="2" 
                                                        />
                                                    </div>
                                                ))
                                            : 
                                                <div>
                                                    <h2 style={{marginTop:20}}>No Stations Configured for this Product</h2>
                                                </div>
                                            }
                                        </div>
                    
                                        <Modal show={showModal} onHide={closeModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>{ } </Modal.Title>
                                            </Modal.Header>
                    
                    
                                        <Modal.Body>
                                            <table style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Job Id</th>
                                                        <th>Job Name</th>
                                                        <th>Product Name</th>
                                                        <th>Status</th>
                                                        <th>Reason</th>
                                                        <th>Parameter values</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>xyz</td>
                                                        <td>axel</td>
                                                        <td>done</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={closeModal}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                        </Modal>
                                        <br />
                                        <br />
                                    </div>
                                :
                                <div>
                                    <h2 style={{marginTop:20}}>Please Select Product</h2>
                                </div>
                            }
                        </div>
                    </div>
                    :
                    <div>
                        <h2 style={{marginTop:20}}>No Product Information Available</h2>
                    </div>
                }
            </div>
            <Footer />
        </div>
    )
}

export default Admin