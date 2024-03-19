import React, { useEffect, useState } from "react";
import './nextStationAllocation.css'
import Select from 'react-select'
import { getProductNames, getOneProductStationNames, configureNextStation } from "../../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from "formik";
import WindalsNav from "../navbar";
import * as Yup from 'yup';
import { Alert } from "react-bootstrap";
import Footer from '../footer';
import { faL } from "@fortawesome/free-solid-svg-icons";
import {useLocation } from 'react-router-dom';

function NextStationAllocation() {
    const location = useLocation()
    const { userInfo } = location.state;

    let shouldSubmit = true;

    const [stationList, updateStationList] = useState([]);
    const [stationSequence, updateStationSequence] = useState([]);
    // const [condition,setCondition] = useState(false);
    const nextStationAllocationSchema = Yup.object().shape({
        productName: Yup.object().required("Required")

    })
    const formik = useFormik({
        initialValues: {
            productName: "",
            firstStation: null,
            lastStation: null,
            nextStationAllocation: [],
        },
        // validationSchema: nextStationAllocationSchema,
        onSubmit: (values) => {
            console.log("Result")
            console.log(values);
            console.log(stationSequence);
            var nextStations=[]
            console.log("Station Sequence:",stationSequence)
            console.log("Available List:",stationList)
            stationSequence.forEach((element)=>{
                stationList.forEach((station)=>{
                    if(element.value==station.name)
                        nextStations.push(station)
                })
            })
            console.log("Prepared Sequence:",nextStations)
            //setNextStationAllocation(stationSequence)
            //formik.setFieldValue("nextStationAllocation", nextStationAllocation);
            //formik.setFieldValue("firstStation", stationSequence[0]);
            //formik.setFieldValue("lastStation", stationSequence[stationSequence.length-1]);
            values.firstStation=stationSequence[0]
            values.lastStation=stationSequence[stationSequence.length-1]
            values.NextStationAllocation=stationSequence

            const nextStationAllocation = values.nextStationAllocation.map((value)=>{
                if(value.currentStation == values.lastStation.label){
                    value = {
                        ...value,
                        nextStation:{ 
                            label:"Null",
                            value:null
                        }
                    }
                }
                return value
            })
            // const newValues = {
            //     ...values,
            //     nextStationAllocation:stationSequence
            // }
            const newValues = {
                productName:values.productName.label,
                nextStationAllocation:stationSequence,
                stationSequence:nextStations
            }
            
            // newValues.nextStationAllocation.map((value) => {
            //     if (value.nextStation == -1) {
            //         alert("Few fields are not filled")
            //         shouldSubmit = false;
            //     }
            // })
            console.log("Final Values")
            console.log(shouldSubmit)
            console.log(newValues);
            
            if (shouldSubmit) {
                console.log("Saving now")
                const configureNextStationPromise = configureNextStation(newValues)
                toast.promise(configureNextStationPromise, {
                    loading: "Saving configuration",
                    success: (result) => {
                        //formik.resetForm()
                        //updateStationSequence("")
                        return result.msg
                    },
                    error: (err) => err.msg

                })
            }
        }
    });

    const [productNames, setProductNames] = useState([]);
    const [nextStationAllocation, setNextStationAllocation] = useState([]);



    useEffect(() => {
        const getProductNamesPromise = getProductNames();
        getProductNamesPromise.then((result) => {
            const productNames = result.map((product) => product.product_name);
            setProductNames(productNames);
        }).catch((err) => {
            toast.error(err.msg);
        });
    }, []);

    useEffect(() => {
        if (formik.values.productName !== "") {
            console.log("Fetching Data")
            stationSequence.splice(0,stationSequence.length)
            updateStationSequence([...stationSequence])
            nextStationAllocation.splice(0,nextStationAllocation.length)
            setNextStationAllocation([...nextStationAllocation])
            const getStationNamesPromise = getOneProductStationNames(formik.values.productName.label);
            getStationNamesPromise.then((result) => {
                console.log("Result")
                updateStationSequence([])
                console.log(result)
                if (result.length <= 0) {
                    toast.error("There is no station configuration done for this product.")
                }
                var stationList=[]
                var stationInfo=[]
                var doneWork=true;
                var counter=0;
                do
                {
                    result.map((record)=>{
                        stationInfo.push({id:record.station_id,name:record.station_name})

                        console.log("adding",record.station_name,record.position,stationList.length)
                        if(record.position===1 && stationList.length===0)
                        {
                            stationList.push({label:record.station_name,value:record.station_name})
                            if (record.nextStationId>0)
                            {
                                console.log("Searching ID")
                                result.map((copyStation)=>{
                                    if(copyStation.station_id==record.nextStationId)
                                    {
                                        stationList.push({label:copyStation.next_station_name,value:copyStation.next_station_name})
                                    }
                                })
                            }
                            else
                                stationList.push({label:record.next_station_name,value:record.next_station_name})
    
                            console.log("adding1",record.station_name,record.next_station_name)
                            //updateStationSequence([...stationSequence,{label:record.station_name,value:record.station_name}])
                            //updateStationSequence([...stationSequence,{label:record.next_station_name,value:record.next_station_name}])
                            //updateStationSequence([...stationSequence,record.next_station_name])
                        } else if(stationList.length>1)
                        {
                            console.log("Status:",record.station_name,stationList[stationList.length-1],record.station_name==stationList[stationList.length-1].label,record.position===0)
                            if(record.station_name==stationList[stationList.length-1].label && record.position===0)
                            {
                                if (record.nextStationId>0)
                                {
                                    console.log("Searching ID")
                                    result.map((copyStation)=>{
                                        if(copyStation.station_id==record.nextStationId)
                                        {
                                            stationList.push({label:copyStation.next_station_name,value:copyStation.next_station_name})
                                        }
                                    })
                                }
                                else
                                    stationList.push({label:record.next_station_name,value:record.next_station_name})
                                    // stationList.push({label:record.next_station_name,value:record.next_station_name})
                                console.log("adding2",record.next_station_name)
    
                            }else if(record.station_name==stationList[stationList.length-1].label && record.position==-1)
                            {
                                doneWork=false
                            }
                        }
                    })
                    // counter+=1
                    // console.log("Counter:",counter)
                    // if(counter>10) doneWork=false
                    if(stationList.length===0)  doneWork=false
                }while(doneWork)
                console.log("Station List:",stationList)
                updateStationList(stationInfo)
                updateStationSequence(stationList)
                const stationNames = result.map((station) => station.station_name);
                // Initialize nextStationAllocation based on stationNames
                const nextStationAllocation = stationNames.map((stationName) => ({
                    currentStation: stationName,
                    allocated:false,
                    nextStation: -1 // Initialize as null
                }));
                setNextStationAllocation(nextStationAllocation);
                formik.setFieldValue("nextStationAllocation", nextStationAllocation); // Update formik value
                console.log("new")
                console.log(stationSequence)
            }).catch((err) => {
                toast.error(err.msg);
            });
        }
    }, [formik.values.productName]);

    console.log({ formik: formik.values });

    //firststation
    const [firstStation, setFirstStation] = useState(null);
    
    //laststation
    const [lastStation, setLastStation] = useState(null);

    return (
        <>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="product-select">
                <div >
                    <h1 className="heading" style={{marginBottom:'40px'}}>Station Sequencing</h1>
                    <Select
                        options={productNames.map((product) => ({ label: product, value: product }))}
                        value={formik.values.productName}
                        name="productName"
                        onChange={(data) => formik.setFieldValue("productName", data)}
                        isSearchable={true}
                        placeholder="Select Product"
                    />
                    {formik.errors.productName && formik.touched.productName ? (
                        <Alert variant="danger" className="error-message">{formik.errors.productName}</Alert>
                    ) : null}
            <div style={{height:40}}>
            </div>
            {nextStationAllocation.map((allocation, index) => (
            <div className="d-flex" style={{marginTop:3}}>
                                             {/* <div style={{ borderTop: "2px solid #800080 ", marginLeft: 20, marginRight: 20, marginTop:10,marginBottom:10}}></div> */}
                <div style={{paddingTop:12,height:53,backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10}} className="col col-lg-2 align-self-center justify-content-center">
                    {index+1}
                </div>
                <div style={{marginLeft:2,paddingTop:5,paddingBottom:5,backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10}} className="col-md-auto align-self-center justify-content-start flex-grow-1">
                    <Select
                            options={[
                                ...nextStationAllocation
                                    .filter((station) => (station.allocated !== true))
                                    .map((station) => ({
                                        label: station.currentStation,
                                        value: station.currentStation
                                    })),
                            ]}
                            key={'SJT'+index}
                            placeholder="Select Next Station"
                            value={stationSequence[index]}
                            onChange={(data) => {
                                const tempStationAllocation = [...stationSequence];
                                if(tempStationAllocation.length>index)
                                {
                                    tempStationAllocation[index] = data
                                    updateStationSequence(tempStationAllocation);

                                }
                                else
                                {
                                    updateStationSequence([...stationSequence,data])
                                }
                            }}
                            isSearchable={true}
                        />
                </div>
            </div>
            ))}
                    <button onClick={formik.handleSubmit} className="buttoncss" style={{marginTop:'25px'}}>SAVE</button>
            </div>
            </div>

            <Footer />
        </>
    );
}

export default NextStationAllocation;
