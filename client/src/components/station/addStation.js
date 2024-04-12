import React, { useEffect } from "react";
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import './addStation.css'
import { useState} from "react";
import { Formik, useFormik, FormikProvider } from "formik";
import { addStation, deleteStation, getOneProductAllParameters, getOneStation, getOneStationOneProduct, getProductNames, updateStation, getAllStationNames, deleteMachine, copyProductStations, getInfoFromStationMasterWithMachine,getProductStationsDetails, stationMachines, getOneProductOneParameter, getProductParameterById} from "../../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faX } from '@fortawesome/free-solid-svg-icons';
import WindalsNav from "../navbar";
import * as Yup from "yup";
import Footer from '../footer';
import Select from 'react-select';
import { useLocation } from "react-router-dom";
import Table from '../table';
//import { useParams } from 'react-router-dom'

function AddStation() {
    //console.log("Received Values:",props)
    //const { state } = useParams()
    const location = useLocation()
    const { opr, userInfo } = location.state
    //const state = useLocation();
    console.log("Location:",opr)
    //const {opr}=useParams();
    //const stationOpr=1;
    //const { opr } = location.state
    //console.log(opr)
    const [currentOpr, setcurrentOpr] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [stationInfo, setStationInfo] = useState([]);
    const [productParameters, setProductParameters] = useState([]);
    const [stationId,setStationId] = useState("") //used when we have searched for a 
    //const [productNames, setProductNames] = useState([]);

    const [stations, setStations] = useState([]);
    const columns = [
        { field: 'sr_no', label: 'Sr No' },
        { field: 'process_number', label: 'Process Number' },
        { field: 'station_name', label: 'Station Name' },
        { field: 'station_parameters', label: 'Station Parameters' },
        { field: 'cycle_time', label: 'Cycle Time' },
        { field: 'daily_count', label: 'Daily Count' },
        { field: 'product_per_hour', label: 'Product per hour' },
        { field: 'next_station_name', label: 'Next Station Name' },
      // { field: 'multiple_machine', label: 'Multiple Machine' },
    ];
      var destProduct="";
    //const { userName } = useParams()

    const stationValidationSchema = Yup.object().shape({
        stationName: Yup.string().required("Required"),
        productName: Yup.string().required("Required"),
        reportType: Yup.string().required("Required"),
        //stationParameter:Yup.array().min(1, "At least one option must be selected").required("Required"),
        stationParameter:Yup.array(),
        parameters: Yup.array().of(
            Yup.object().shape({
                machineName: Yup.string()
                    .required('Required'),
                cycleTime: Yup.number()
                    .required('Required'),
                dailyCount: Yup.number()
                    .required('Required'),
                productPerHour: Yup.number().required('Required'),
            })
        ),
    })

    const addFormFormik = useFormik({
        initialValues: {
            process_number:'',
            stationName: '',
            productName: '',
            reportType: '',
            cycleTime:'',
            dailyCount:'',
            productPerHour:'',
            stationParameter: [],
            machines: [],
            multipleMachines:false,

        },
        // validationSchema: stationValidationSchema,
        onSubmit: async (values) => {
            console.log(values);
            values.productName=values.productName.value;
            var tempParameter="";
            var tempParameterIds=""
            values.stationParameter.forEach((element)=>{
                tempParameter=tempParameter+","+element.parameterName
                tempParameterIds=tempParameterIds+","+element.id
            })
            values.stationParameter=tempParameter.substring(1);
            values.paramIds=tempParameterIds.substring(1)

            console.log("Data For Server:",values)
            //console.log(values.productName.value)
            if(stationId==="")
            {
                const addStationPromise = addStation(values)
                toast.promise(
                    addStationPromise,
                    {
                        loading: 'Adding station',
                        success: (result) => {
                            addFormFormik.resetForm()
                            getStationNames()
                            return result.msg
                        },
                        error: (err) => {
                            return err.msg
                        }
                    }
                )
            }
            else
            {
                if(currentOpr==3)
                {
                    handleDeleteStation()
                }
                else
                {
                    console.log("Now updating")
                    const updatedValues = {...values,stationId}
                    const updateStationPromise = updateStation(updatedValues)
                    toast.promise(
                        updateStationPromise,
                        {
                            loading: "Updating data",
                            success: result => {
                                console.log("DoneUpdation");
                                handleClear()
                                getStationNames()
                                return <b>{result.msg}</b>; // Return a React element
                            },
                            error: err => <b>{err.msg}</b>, // Return a React element
                        }
                    )
                }
                setcurrentOpr(1)

            }
        }
    })

    const addRow = () => {
        addFormFormik.setFieldValue('machines', [
            ...addFormFormik.values.machines,
            { machineName: '', cycleTime: '', dailyCount: '', productPerHour: '' },
        ]);
    };

    const handleClearForm = () => {
        var tempProductName = addFormFormik.values.productName
        addFormFormik.resetForm()
        //searchFormFormik.resetForm()
        setStationId("")
        
        setTimeout(() => {
                console.log(addFormFormik.values)
                addFormFormik.setFieldValue("productName", tempProductName)
          }, 100);
          
        
        //stationInfo, setStationInfo
        //opr=temp
        
        //setStationInfo([])
    }

    const handleClear = () => {
        var tempProductName = addFormFormik.values.productName
        addFormFormik.resetForm()
        //searchFormFormik.resetForm()
        setStationId("")
        stationInfo.splice(0,stationInfo.length)
        setStationInfo([...stationInfo])
        
        setTimeout(() => {
                console.log(addFormFormik.values)
                addFormFormik.setFieldValue("productName", tempProductName)
          }, 100);
          
        
        //stationInfo, setStationInfo
        //opr=temp
        
        //setStationInfo([])
    }

    const handleMachineChange = (index, field, value) => {
        const updatedMachines = [...addFormFormik.values.machines];
        updatedMachines[index][field] = value;
        addFormFormik.setFieldValue('machines', updatedMachines);
      };

    const searchValidationSchema = Yup.object().shape({
        stationName: Yup.string().required("Required"),
        productName: Yup.string().required("Required")
    })

    // const searchFormFormik = useFormik({
    //     initialValues: {
    //         stationName: "",
    //         productName: "",
    //     },
    //     validationSchema: searchValidationSchema,
    //     onSubmit: (values) => {
    //         handleSearch()
    //     }
    // })

    useEffect(() => {
        //console.log("Hello in Station")
        //console.log({ParameterReceived:opr})
        const arr = [];
        setcurrentOpr(1)
        const getProductNamesPromise = getProductNames()
        getProductNamesPromise.then(async (result) => {
            const productnames = await result.map((product) => {
                return ({ value: product.product_name, label: product.product_name })
            })
            console.log("Recived Product Names : ", productnames)
            console.log(productnames[0].value)
            setProductNames(productnames)
        }).catch((err) => { })
        // getProductNamesPromise.then(async (result) => {
        //     console.log(result);
        //     const productnames = await result.map((product) => {
        //         return arr.push({ value: product.product_name, label: product.product_name })
        //     })
        //}).catch((err) => { })
    }, [])

    useEffect(() => {
        if (addFormFormik.values.productName !== "") {
            console.log("Fetcing Stations:",addFormFormik.values.productName)
            
            const productName = addFormFormik.values.productName.value;
            var paramArr=[]
            const getProductParametersPromise = getOneProductAllParameters(productName)
            getProductParametersPromise.then(async (result) => {
                console.log(result)
                // const parameters[] = await result.map((product) => {id:product.id,parameterName:product.parameter})
                
                // parameters.forEach((param)=>{
                //     paramArr.push(param.trim().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ' '))
                // })
                result.forEach((paramater)=>{
                    var temp={
                        id:paramater.id,
                        parameterName:paramater.parameter.trim().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ' '),
                        compulsory:paramater.compulsory,
                        assigned:0
                    }
                    paramArr.push(temp);
                })

                //productParameters.splice(0,productParameters.length)
                //setProductParameters([...productParameters])
        
                // setProductParameters(paramArr)
                console.log(paramArr)
            }).catch((err) => {console.log(err); })
            const getProductStationsPromise =getProductStationsDetails(productName)
            getProductStationsPromise.then(async (result) => {
                //{ field: 'sr_no', label: 'Sr No' },
                //const stations = await result.map((product) => product.parameter)
                //{ field: 'station_name', label: 'Process Name' },
                //{ field: 'station_parameters', label: 'Station Parameters' },
                //{ field: 'cycle_time', label: 'Cycle Time' },
                //{ field: 'daily_count', label: 'Daily Count' },
                //{ field: 'product_per_hour', label: 'Product per hour' },
                //{ field: 'next_station_name', label: 'Next Station Name' },
                var temp=[];
                var srNo=1;
                console.log("Showing Stations Data")
                // const flattenedMachines = result.machines.map((machine) => ({
                //     machineId: machine.machine_id,
                //     machineName: machine.machine_name,
                //     cycleTime: machine.cycle_time,
                //     dailyCount: machine.daily_count,
                //     productPerHour: machine.product_per_hour,
                // }));
                var assigned=[];
                result.forEach(data=>{
                    // console.log(data)
                    const info={
                        sr_no:srNo,
                        station_name:data.station_name,
                        station_parameters:"",
                        cycle_time:data.cycle_time,
                        daily_count:data.daily_count,
                        product_per_hour:data.product_per_hour,
                        next_station_name:data.next_station_name,
                        process_number:data.process_number,
                        report:data.report,
                        station_parameters:data.station_parameters,
                        multipleMachines: data.multiple_machine === 1 ? true : false,
                        //machines: flattenedMachines,
                        station_id:data.station_id,
                        parameterIds:data.parameterIds
                    }
                    temp.push(info);
                    srNo+=1;
                    // console.log(info.station_parameters);
                    if(info.station_parameters !== null)
                    {
                    const arr = info.station_parameters.split(',').map(item => item.trim());
                    // console.log(arr);

                    arr.forEach( item=>{
                        // console.log("Item:", item, typeof item); 
                        // const matchedParamIndex = productParameters.findIndex(param => {
                        //     console.log("Inside findIndex"); 
                        //     console.log("ParameterName:", param && param.parameterName, typeof (param && param.parameterName)); // Log the value of param.parameterName
                        //     return param.parameterName === item;
                        // });

                        assigned.push(item);
                        // console.log("MatchedParamIndex:", matchedParamIndex);
                        // if (matchedParamIndex !== -1) {
                        //     const matchedParam = productParameters[matchedParamIndex];
                        //     const updatedParam = { ...matchedParam, assigned: 1 }; 
                        //     // console.log(updatedParam);// Create a new object with updated assigned value
                        //     productParameters[matchedParamIndex] = updatedParam;
                        // }
                       
                    })
                    }
                })

                var newParamArr=[];
                paramArr.forEach(param=>{
                    const matchedId = assigned.find(p => p === param.parameterName);

                    if(matchedId)
                    {
                    const matchedParam = param;
                    const updatedParam = { ...matchedParam, assigned: 1 };
                    console.log(updatedParam.assigned);
                    newParamArr.push(updatedParam);
                    }
                    else{
                        newParamArr.push(param);
                    }
                    
                })

                // productParameters.splice(0,productParameters.length);
                // setProductParameters([...productParameters]);
                setProductParameters(newParamArr);
                console.log(newParamArr);
                console.log(productParameters);
                console.log(result);
                console.log("Stations Data Done")
                setStationInfo(temp)
            }).catch((err) => {console.log(err); })
        }
    }, [addFormFormik.values.productName])

    useEffect(() => {
        handleReportTypeChangeForAdd(addFormFormik.values.reportType)
    }, [addFormFormik.values.reportType])

    
    // useEffect(()  => {
    //     if (addFormFormik.values.productName !== "") {
    //         console.log("Fetching info:");
    //         console.log(addFormFormik.values.productName.label);
    //     }
    // }, [addFormFormik.values.productName]);

    const handleReportTypeChangeForAdd = (value) => {          //use to empty stationParameters if reportType changed to ok/notok
        if (value === "0") {
            addFormFormik.setFieldValue('stationParameter', [])
        }
    };
   
    // useEffect(() => {
    //     // Fetch stations data
    //     const fetchData = async () => {
    //       try {
    //         // const result = await getStations();
    //         const result = await getInfoFromStationMasterWithMachine();
    //         const modifiedStations = result.map((station) => {
    //           if (station.report === 1) {
    //             station.report = "parameters";
    //           } else if (station.report === 0) {
    //             station.report = "Ok/NotOk";
    //           }
    //           if(station.next_station_name===null){
    //             station.next_station_name = "Not configured yet"
    //           }
    
    //           if(station.multiple_machine === 1){
    //             station.multiple_machine = "Yes"
    //           }
    
    //           else if(station.multiple_machine === 0){
    //             station.multiple_machine = "No"
    //           }
    //           return station;
    //         });
    //         setStations(modifiedStations);
    //         toast.success(<b>Data fetched successfully</b>);
    //       } catch (error) {
    //         toast.error(error.message || 'An error occurred');
    //       }
    //     };
    
    //     // Call the fetchData function
    //     fetchData();
    //   }, []); // Empty dependency array to run only once
    
    // const handleSearch = async () => {
    //     try {
    //         let result;
    //         if (searchFormFormik.values.productName === "") {
    //             result = await getOneStation(searchFormFormik.values.stationName);
    //         } else {
    //             result = await getOneStationOneProduct(searchFormFormik.values);
    //         }
    //         console.log({SearchedData:result})
    //         if (result) {
    //             const flattenedMachines = result.machines.map((machine) => ({
    //                 machineId: machine.machine_id,
    //                 machineName: machine.machine_name,
    //                 cycleTime: machine.cycle_time,
    //                 dailyCount: machine.daily_count,
    //                 productPerHour: machine.product_per_hour,
    //             }));

    //             const updatedValues = {
    //                 process_number:result.process_number,
    //                 stationName: result.station_name,
    //                 productName: { label: result.product_name, value: result.product_name },
    //                 cycleTime:result.cycle_time,
    //                 dailyCount:result.daily_count,
    //                 productPerHour:result.product_per_hour,        
    //                 reportType: result.report === 1 ? "1" : "0",
    //                 stationParameter: result.station_parameters!==null ? result.station_parameters.split(', '):[],
    //                 multipleMachines: result.multiple_machine === 1 ? true : false,
    //                 machines: flattenedMachines,
    //             };
    //             addFormFormik.setValues(updatedValues);
    //             setStationId(result.station_id)
    //             // setUpdateMode(true);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.msg);
    //     }
    // };

    const handleMachineDelete = (index, machine) => {
        const {machineId} = machine
        const updatedMchines = [...addFormFormik.values.machines];
        updatedMchines.splice(index, 1);
        addFormFormik.setFieldValue('machines', updatedMchines);
        if(machineId!==undefined)
        {
            const deleteMachinePromise = deleteMachine(machineId)
            toast.promise(deleteMachinePromise,
                {
                    loading: "Deleteing Data",
                    success: result => {
                        return <b>{result.msg}</b>; // Return a React element
                    },
                    error: err => <b>{err.msg}</b>, // Return a React element
                }
            )
        }
        

    };

    const handleDeleteStation = () => {
        //const machineId = addFormFormik.values.machines.map((machine)=>{return machine.machineId})
        //const values = {stationId,machineId}
        console.log("Deleting:", stationId)
        const deleteStationPromise = deleteStation(stationId)
        toast.promise(
            deleteStationPromise,
            {
                loading: "Deleting data",
                success: result => {
                    console.log(result)
                    handleClear()
                    //getStationNames()
                    return result.msg
                },
                error: err => { 
                    console.log(err)
                    return err.msg }
            }
        )
    }

    const handleParameterTickBoxChangeForAdd = (parameterName) => {
        console.log("Parameter Ticked:", parameterName)
        console.log("is array:",Array.isArray(addFormFormik.values.stationParameter))
        //console.log(Object(parameterName).value);
        var dataPresent=false
        addFormFormik.values.stationParameter.some((data)=>
        {
            if (data.parameterName==parameterName.parameterName) dataPresent=true
            console.log(data.parameterName,":",parameterName.parameterName,":",data.parameterName==parameterName.parameterName)
            //data.parameterName==parameter.paramererName
        })
        if(dataPresent)
        {
            addFormFormik.setFieldValue(
                'stationParameter',
                addFormFormik.values.stationParameter.filter((name) => name.parameterName !== parameterName.parameterName)
            );
        }
        else
        {
            addFormFormik.setFieldValue(
                'stationParameter',
                [...addFormFormik.values.stationParameter, parameterName]
            );
        }
        // if (addFormFormik.values.stationParameter.includes(parameterName)) {
        //     addFormFormik.setFieldValue(
        //         'stationParameter',
        //         addFormFormik.values.stationParameter.filter((name) => name !== parameterName)
        //     );
        // } else {
        //     addFormFormik.setFieldValue(
        //         'stationParameter',
        //         [...addFormFormik.values.stationParameter, parameterName]
        //     );
        // }
        console.log("Station Parameters:",addFormFormik.values.stationParameter)
    };

    const [productnames, setproductnames] = useState([]);
    useEffect(() => {
        const getProductNamesPromise = getProductNames()
        const arr = [];
        getProductNamesPromise.then(async (result) => {
            const productnames = await result.map((product) => {
                return arr.push({ value: product.product_name, label: product.product_name })
            })
            setproductnames(arr)
        }).catch((err) => { })
    }, [])

    const [stationnames, setstationnames] = useState([]);
    useEffect(() => {
        getStationNames()
    }, [])

    const getStationNames = () => {
        const getStationNamesPromise = getAllStationNames();
        const arr = [];
        getStationNamesPromise.then(async (result) => {
            const stationnames = await result.map((station) => {
                return arr.push({ value: station.station_name, label: station.station_name })
            })
            setstationnames(arr)
        }).catch((err) => { })
    }
   
    function copyData(data)
    {
        destProduct=data;
        console.log(data,":",addFormFormik.values.productName);
        console.log("Machines:",addFormFormik.values.multipleMachines);
    }
    function getStationList()
    {
        console.log("Product Info:",addFormFormik.values.productName);
    }
    function addStations()
    {
        console.log("Copying Data")
        console.log(destProduct,":",addFormFormik.values.productName);
        
        const status = copyProductStations(destProduct,addFormFormik.values.productName);
        
        status.then(async (result) => {
            console.log("result:",result.msg);
            if(result.msg.includes("Done"))
            {
                toast.success(<b>Data Transfered successfully</b>);
            }
            else
            {
                toast.error(result.msg || 'An error occurred');
             
            }
            console.log(result)
        }).catch((err) => { })
    }
    const [searchItem, setSearchItem] = useState('')

  const handleInputChange = (e) => { 
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)
    addFormFormik.setFieldValue('stationName', searchTerm)
  }
  async function handleEdit(value) {
    console.log("Edit ", stationInfo[value])
    setcurrentOpr(2)
    handleClearForm()
    addFormFormik.setFieldValue('process_number', stationInfo[value].process_number)
    addFormFormik.setFieldValue('stationName', stationInfo[value].station_name)
    addFormFormik.setFieldValue('cycleTime', stationInfo[value].cycle_time)
    addFormFormik.setFieldValue('dailyCount', stationInfo[value].daily_count)
    addFormFormik.setFieldValue('productPerHour', stationInfo[value].product_per_hour)
    addFormFormik.setFieldValue('reportType', stationInfo[value].report === 1 ? "1" : "0")
    addFormFormik.setFieldValue("multipleMachines",stationInfo[value].multipleMachines)
    console.log("Station Parameters:",stationInfo[value].station_parameters)
    if(stationInfo[value].parameterIds.length>0)
    {
        //const parameterList=await getProductParameterById(addFormFormik.values.productName.value,stationInfo[value].parameterIds)
        //console.log("Parameters Fetched:",parameterList)
        console.log("Adding Data to Array")
        var parametersList=stationInfo[value].parameterIds.split(",")
        console.log(parametersList)
        var tempArr=[]
        parametersList.forEach((parameter)=>{
            //remove new line with blank, multiple spaces with single space
            //x = parameter.trim().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ' ');
            console.log(parameter)
            productParameters.forEach((parameterInfo)=>{
                console.log(parameterInfo)
                if(parameterInfo.id==parameter)
                {
                    console.log("Adding parameter:", parameterInfo)
                    var addRecord = true
                    tempArr.forEach((element)=>{
                        if (element.id==parameter)  addRecord=false
                    })
                    if(addRecord)  tempArr.push(parameterInfo)
                }
            })

            console.log("Edit Array:",tempArr)
            addFormFormik.setFieldValue(
                'stationParameter',
                tempArr
            );
        });
    }else if(stationInfo[value].station_parameters!==null)
    {
        var parametersList=stationInfo[value].station_parameters.split(",")
        console.log(parametersList)
        var tempArr=[]
        var x=""
        parametersList.forEach((parameter)=>{
            //remove new line with blank, multiple spaces with single space
            x = parameter.trim().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ' ');
            console.log(x)
            productParameters.forEach((parameterInfo)=>{
                if(parameterInfo.parameterName==x)
                {
                    var addRecord = true
                    tempArr.forEach((element)=>{
                        if (element.parameterName==x)  addRecord=false
                    })
                    if(addRecord)  tempArr.push(parameterInfo)
                }
            })
            // console.log(tempArr.indexOf(x))
            // if (tempArr.indexOf(x)==-1)
            // {
            //     tempArr.push(x)
            // }
        })
        console.log("Edit Array:",tempArr)
        addFormFormik.setFieldValue(
            'stationParameter',
            tempArr
        );
    }
    if (stationInfo[value].multipleMachines)
    {
        console.log("Fetching Machines")
        console.log(stationInfo[value].station_id)
        const result = await stationMachines(stationInfo[value].station_id);
        
        if (result) {
            console.log("Machines:",result)
            const machineInfo = result.map((machine) => ({
                machineId: machine.machine_id,
                machineName: machine.machine_name,
                cycleTime: machine.cycle_time,
                dailyCount: machine.daily_count,
                productPerHour: machine.product_per_hour,
            }));
            addFormFormik.setFieldValue('machines', machineInfo);
        }
    }
    setStationId(stationInfo[value].station_id)
  }

  function handleDelete(value) {
    
    console.log("Delete ", stationInfo[value])
    handleEdit(value);
    setcurrentOpr(3)
  }
  function handleMultipleMachines(e){
    addFormFormik.setFieldValue("multipleMachines",e.target.checked)
    if (!e.target.checked)
    {
        addFormFormik.setFieldValue('machines', []);
    }
  }
    return (
        <div >
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            {/* <div className="header-add-station">
                <h2 className="add-station-header">Add Station</h2>
            </div> */}
            <div className="add-station-container">
                <div className="add-station-inputs">
                    <FormikProvider value={addFormFormik}>
                    <Form>
                        {/* <h3>Add Station</h3> */}
                        {opr==1 &&  <><h3>Add Station</h3></>}
                        {opr==2 &&  <><h3>Update Station</h3></>}
                        {opr==3 &&  <><h3>Delete Station</h3></>}
                        {opr==4 &&  <><h3>View Stations</h3></>}
                        <div className="station-name-id " style={{marginTop:20}}>
                        {/* <label htmlFor="" style={{fontWeight:600, margin:0}} className="inplab">Select Product</label> */}
                        <div className="row">
                            <div className="col col-lg-5">
                            <Form.Group controlId="productName" >
                            <Select 
                        options={productNames}
                        value={addFormFormik.values.productName}
                        name="productName"
                        onChange={(data) => addFormFormik.setFieldValue("productName", data)}
                        isSearchable={true}
                        placeholder="Select Product"
                    />
                    {addFormFormik.errors.productName && addFormFormik.touched.productName ? (
                        <Alert variant="danger" className="error-message">{addFormFormik.errors.productName}</Alert>
                    ) : null}
                        </Form.Group>
                            </div>
                            {opr==1 && <div className="col align-self-center">
                                <div className="row">
                                    <div className="col-md-auto align-self-center">
                                    <label style={{fontWeight:600, margin:10}} className="inplab">Copy Stations From</label>
                                    </div>
                                    <div className="col align-self-center">
                                        <Select 
                                            options={[
                                                ...productNames
                                                .filter((product) => (addFormFormik.values.productName.value!==product.value))
                                                    .map((product) => ({
                                                        label: product.label,
                                                        value: product.value
                                                    })),
                                            ]}
                                            //options={productNames.map((product) => {if(addFormFormik.values.productName.label!==product.product_name){label: product.product_name, value: product.product_id} })}
                                            name="fetchProductName"
                                            onChange={(data) => copyData(data)}
                                            isSearchable={true}
                                            placeholder="Select Product"
                                        />
                                    </div>
                                    <div className="col-md-auto align-self-center">
                                        <Button variant="danger" type="button" className="add-button-stn" onClick={addStations}>COPY</Button>
                                    </div>
                                </div>
                            </div>}

                        </div>           
                        
                        {opr!=4 && 
                        <>

                            <div className="row">
                                <div className="col col-lg-2">
                                    {/* <label htmlFor="" style={{fontWeight:600, margin:0}} className="inplab">Process Number</label> */}
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control type="number" placeholder="Process Number" value={addFormFormik.values.process_number} name="process_number" onChange={addFormFormik.handleChange} />
                                        {addFormFormik.errors.process_number && addFormFormik.touched.process_number ? (
                                        <Alert variant="danger" className="error-message">{addFormFormik.errors.process_number}</Alert>) : null}
                                    </Form.Group>
                                </div>
                                <div className="col">
                                    {/* <label htmlFor="" style={{fontWeight:600, margin:0}} className="inplab">Process Name</label> */}
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control type="text" placeholder="Process Name" value={addFormFormik.values.stationName} name="stationName" onChange={addFormFormik.handleChange} list='suggestion' />
                                        <datalist id='suggestion' role="listbox">
                                        {stationnames.map((name,index) =>{
                                        //Parsing the array and displaying suggestion with option tag
                                            return (<option key={index} value={name.label}>{name.label}</option>)
                                        })}
                                        </datalist>
                                        {/* <Select
                                            className="select"
                                            options={stationnames}
                                            value={{
                                                value: addFormFormik.values.stationName,
                                                label: addFormFormik.values.stationName
                                            }}
                                            onChange={(selectedOption) =>
                                                addFormFormik.setFieldValue('stationName', selectedOption.value)
                                            }
                                            name="stationName"
                                            isSearchable={true}
                                        /> */}
                                        {/* <input
                                            type="text"
                                            value={searchItem}
                                            onChange={handleInputChange}
                                            placeholder='Product Name'
                                        />
                                        <ul>
                                            {stationnames.map((user) => <li key={user.value}>{user.label}</li>)}
                                        </ul> */}
                                        {addFormFormik.errors.stationName && addFormFormik.touched.stationName ? (
                                            <Alert variant="danger" className="error-message">{addFormFormik.errors.stationName}</Alert>) : null}
                                    </Form.Group>                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-auto align-items-start">
                                    <Form.Group className="mb-3" controlId="formBasicCheckbox" style={{ width: '12vw' }}>
                                        <input name="multipleMachines" checked={addFormFormik.values.multipleMachines} type="checkbox" id="formBasicCheckbox" onChange={(e)=> handleMultipleMachines(e)} className="form-check-input" style={{margin:3, border:'1px solid black'}}/>
                                        <label title="" for="formBasicCheckbox" className="form-check-label">Multiple Machines</label>
                                    </Form.Group>
                                </div>
                                {!addFormFormik.values.multipleMachines && 
                                <>
                                <div className="col d-flex align-items-center">
                                    {/* <label htmlFor="" style={{fontWeight:600, margin:0}} className="inplab">Cycle Time</label> */}
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control type="number" placeholder="Cycle Time" value={addFormFormik.values.cycleTime} name="cycleTime" onChange={addFormFormik.handleChange} />
                                        {addFormFormik.errors.cycleTime && addFormFormik.touched.cycleTime ? (
                                            <Alert variant="danger" className="error-message">{addFormFormik.errors.cycleTime}</Alert>) : null}
                                    </Form.Group>
                                </div>
                                
                                <div className="col d-flex align-items-center">
                                    {/* <label htmlFor="" style={{fontWeight:600, margin:0}} className="inplab">Daily Count</label> */}
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control type="text" placeholder="Daily Count" value={addFormFormik.values.dailyCount} name="dailyCount" onChange={addFormFormik.handleChange} />
                                        {addFormFormik.errors.dailyCount && addFormFormik.touched.dailyCount ? (
                                            <Alert variant="danger" className="error-message">{addFormFormik.errors.dailyCount}</Alert>) : null}
                                    </Form.Group>                                    
                                </div>
                                <div className="col d-flex align-items-center">
                                    {/* <label htmlFor="" style={{fontWeight:600, margin:0}} className="inplab">Product Per Hour</label> */}
                                    <Form.Group  controlId="formBasicEmail">
                                        <Form.Control type="text" placeholder="Products/Hour" value={addFormFormik.values.productPerHour} name="productPerHour" onChange={addFormFormik.handleChange} />
                                        {addFormFormik.errors.productPerHour && addFormFormik.touched.productPerHour ? (
                                            <Alert variant="danger" className="error-message">{addFormFormik.errors.productPerHour}</Alert>) : null}
                                    </Form.Group>                                    
                                </div>
                                </>
                                }
                                {addFormFormik.values.multipleMachines && 
                                <div className="col d-flex justify-content-start">
                                    <Button variant="success" type="button" className="add-button-stn" onClick={addRow}>Add Machine</Button>
                                </div>
                                }
                            </div>
                            <div className="machinetab">

                                <br />
                                { addFormFormik.values.machines.length>0 &&
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{width:30}}>#</th>
                                                <th style={{width:350}}>Machine Name</th>
                                                <th style={{width:150}}>Cycle time</th>
                                                <th style={{width:150}}>Daily Count</th>
                                                <th style={{width:150}}>Product per hour</th>
                                                <th style={{width:30}}>Delete</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {/* <tr>
                                                <td><input type="text" /></td>
                                                <td><input type="number" /></td>
                                                <td><input type="number" /></td>
                                                <td><input type="number" /></td>
                                            </tr> */}

                                            {addFormFormik.values.machines.map((machine, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'light-red-row' : 'red-row'}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={machine.machineName}
                                                            onChange={(e) =>
                                                                handleMachineChange(index, 'machineName', e.target.value)
                                                            }
                                                            name={`machines[${index}].machineName`}
                                                        />
                                                        {addFormFormik.touched.machines && addFormFormik.touched.machines[index] && addFormFormik.errors.machines?.[index]?.machineName && (
                                                            <Alert variant="danger" className="error-message">
                                                                {addFormFormik.errors.machines[index].machineName}
                                                            </Alert>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            value={machine.cycleTime}
                                                            onChange={(e) =>
                                                                handleMachineChange(index, 'cycleTime', e.target.value)
                                                            }
                                                            name={`machines[${index}].cycleTime`}
                                                        />
                                                        {addFormFormik.touched.machines && addFormFormik.touched.machines[index] && addFormFormik.errors.machines?.[index]?.maxVal && (
                                                            <Alert variant="danger" className="error-message">
                                                                {addFormFormik.errors.machines[index].cycleTime}
                                                            </Alert>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            value={machine.dailyCount}
                                                            onChange={(e) =>
                                                                handleMachineChange(index, 'dailyCount', e.target.value)
                                                            }
                                                            name={`machines[${index}].dailyCount`}
                                                        />
                                                        {addFormFormik.touched.machines && addFormFormik.touched.machines[index] && addFormFormik.errors.machines?.[index]?.minVal && (
                                                            <Alert variant="danger" className="error-message">
                                                                {addFormFormik.errors.machines[index].dailyCount}
                                                            </Alert>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={machine.productPerHour}
                                                            onChange={(e) =>
                                                                handleMachineChange(index, 'productPerHour', e.target.value)
                                                            }
                                                            name={`machines[${index}].productPerHour`}
                                                        />
                                                        {addFormFormik.touched.machines && addFormFormik.touched.machines[index] && addFormFormik.errors.machines?.[index]?.unit && (
                                                            <Alert variant="danger" className="error-message">
                                                                {addFormFormik.errors.machines[index].productPerHour}
                                                            </Alert>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={() => handleMachineDelete(index, machine)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                            <div clasName="row">
                                <div className="col">
                                    <label htmlFor="" style={{fontWeight:600, margin:0}} className="inplab">Report Type</label>
                                </div>
                                <div className="col" style={{width:300}}>
                                    <Form.Select className="mb-3 select-param" aria-label="Default select example" value={addFormFormik.values.reportType} name="reportType" onChange={addFormFormik.handleChange}>
                                        <option value=''>--Select Report Type--</option>
                                        <option value="0">Okay/Not okay</option>
                                        <option value="1">Parameters</option>
                                    </Form.Select>
                                </div>
                            </div>
                            {addFormFormik.errors.reportType && addFormFormik.touched.reportType ? (
                                <Alert variant="danger" className="error-message">{addFormFormik.errors.reportType}</Alert>) : null}
                            {
                                (addFormFormik.values.reportType === "1" && Array.isArray(addFormFormik.values.stationParameter)) &&
                                <>
                                    <h3>Select Parameters</h3>
                                    {/* {productParameters.map((parameter, index) => (
                                        <div key={index} className="d-flex justify-content-start align-self-center" style={{marginTop:1, alignContent:'flex-start',backgroundColor:'white',height:35,paddingLeft:10,borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10}}>
                                                <input
                                                    type="checkbox"
                                                    // addFormFormik.values.stationParameter.some((data)=>data.parameterName==parameter.parameterName)
                                                    checked={addFormFormik.values.stationParameter.some((data)=> data.parameterName== parameter.parameterName)}
                                                    onChange={() => handleParameterTickBoxChangeForAdd(parameter)}
                                                />
                                            <label class="d-flex align-self-center" style={{marginLeft:10}}>
                                                {parameter.parameterName}
                                            </label>
                                            {addFormFormik.errors.stationParameter && addFormFormik.touched.stationParameter ? (
                                                <Alert variant="danger" className="error-message">{addFormFormik.errors.stationParameter}</Alert>) : null}
                                        </div>
                                    ))} */}
                                    <div>
    <div>
        <h3>Compulsory Parameters</h3>
        {productParameters.map((parameter, index) => (
            parameter.compulsory === 1 && (
                <div key={index} className="d-flex justify-content-start align-self-center" style={{marginTop:1, alignContent:'flex-start',backgroundColor: parameter.assigned === 1 ? 'green' : 'white' ,height:35,paddingLeft:10,borderStyle:"solid",borderWidth:2,borderColor:'purple', borderRadius:10}}>
                    <input
                        type="checkbox"
                        checked={addFormFormik.values.stationParameter.some((data)=> data.parameterName === parameter.parameterName)}
                        onChange={() => handleParameterTickBoxChangeForAdd(parameter)}
                    />
                    <label className="d-flex align-self-center" style={{marginLeft:10}}>
                        {parameter.parameterName}
                    </label>
                    {addFormFormik.errors.stationParameter && addFormFormik.touched.stationParameter ? (
                        <Alert variant="danger" className="error-message">{addFormFormik.errors.stationParameter}</Alert>
                    ) : null}
                </div>
            )
        ))}
    </div>
    <div>
        <h3>Non-Compulsory Parameters</h3>
        {productParameters.map((parameter, index) => (
            parameter.compulsory === 0 && (
                <div key={index} className="d-flex justify-content-start align-self-center" style={{marginTop:1, alignContent:'flex-start',backgroundColor: parameter.assigned === 1 ? 'green' : 'white',height:35,paddingLeft:10,borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10}}>
                    <input
                        type="checkbox"
                        checked={addFormFormik.values.stationParameter.some((data)=> data.parameterName === parameter.parameterName)}
                        onChange={() => handleParameterTickBoxChangeForAdd(parameter)}
                    />
                    <label className="d-flex align-self-center" style={{marginLeft:10}}>
                        {parameter.parameterName}
                    </label>
                    {addFormFormik.errors.stationParameter && addFormFormik.touched.stationParameter ? (
                        <Alert variant="danger" className="error-message">{addFormFormik.errors.stationParameter}</Alert>
                    ) : null}
                </div>
            )
        ))}
    </div>
</div>

                                </>
                            }
                        </>
                        }

                        </div>
                        <br />
                        {opr==1 &&
                        <div className="add-station-button">
                            <Button variant={currentOpr===3?"danger":"success"} type="button" className="add-button-stn" onClick={addFormFormik.handleSubmit}>{stationId==="" ?"Add Station":currentOpr===3?"Delete Station":"Update Station"}</Button>
                        </div>}
                        {(opr==2 && stationId!=="") &&
                        <div className="add-station-button">
                            <Button variant="success" type="button" className="add-button-stn" onClick={addFormFormik.handleSubmit}>Update Station</Button>
                        </div>}
                        {(opr==3 && stationId!=="") &&
                        <div className="add-station-button">
                            <Button variant="danger" className="search-station-button" type="button" onClick={handleDeleteStation}>Delete Station</Button>
                        </div>}
                        {/* {opr==1 &&
                        <div className="add-station-button">
                            <Button variant="success" type="button" className="add-button-stn" onClick={addFormFormik.handleSubmit}>{stationId==="" ?"Add Station":"Update Station"}</Button>
                        </div>} */}
                    </Form>
                    </FormikProvider>

                </div>
                {/* <div className="search-station-form">
                    <h4>Search station </h4>
                    <br />
                    <h5>Enter Station Name</h5>
                    <Select
                        className="select"
                        options={stationnames}
                        value={{
                            value: searchFormFormik.values.stationName,
                            label: searchFormFormik.values.stationName
                        }}
                        onChange={(selectedOption) =>
                            searchFormFormik.setFieldValue('stationName', selectedOption.value)
                        }
                        name="stationName"
                        isSearchable={true}
                    />
                    <br />
                    <h5>Enter product name</h5>
                    <Select
                        className="select"
                        options={productnames}
                        value={{
                            value: searchFormFormik.values.productName,
                            label: searchFormFormik.values.productName
                        }}
                        onChange={(selectedOption) =>
                            searchFormFormik.setFieldValue('productName', selectedOption.value)
                        }
                        name="productName"
                        isSearchable={true}
                    />
                    <br />
                    <Button variant="danger" className="search-station-button" onClick={searchFormFormik.handleSubmit}>Search</Button>
                    
                    <Button variant="danger" className="search-station-button" onClick={handleClear}>Clear</Button>
                    {stationId!=="" && <Button variant="danger" className="search-station-button" onClick={handleDeleteStation}>Delete Station</Button>}
                </div> */}
            </div>
            {(opr==1 && stationInfo.length>0) && <Table columns={columns} data={stationInfo} showEdit={true} showTrash={true} handleEdit={handleEdit} handleDelete={handleDelete}/>}
            {(opr==2 && stationInfo.length>0) && <Table columns={columns} data={stationInfo} showEdit={true} showTrash={false} handleEdit={handleEdit}/>}
            {(opr==3 && stationInfo.length>0) && <Table columns={columns} data={stationInfo} showEdit={false} showTrash={true} handleDelete={handleDelete}/>}
            {(opr==4 && stationInfo.length>0) && <Table columns={columns} data={stationInfo}/>}
            {/* <div style={{marginTop:'15vh'}}>
                <h1 className='heading'>Station Details</h1>
                <Table columns={columns} data={stations} />
            </div> */}
            {/* added for giving some space below table */}
            <div style={{height:30}}>
            </div>
            <Footer />
        </div>
    )
}

export default AddStation;


