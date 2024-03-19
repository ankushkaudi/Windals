import React, { useEffect, useState } from 'react';
import {getInfoFromStationMasterWithMachine, getProductNames} from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../table';
import WindalsNav from '../navbar';
import Footer from '../footer';
import Select from 'react-select';
import {useLocation } from 'react-router-dom';

function ViewStation() {
  const location = useLocation()
  const { userInfo } = location.state;

  const [stations, setStations] = useState([]);
  const columns = [
    { field: 'product_name', label: 'Product Name' },
    { field: 'process_number', label: 'Process Number' },
    { field: 'station_name', label: 'Process Name' },
    { field: 'report', label: 'Report' },
    { field: 'station_parameters', label: 'Station Parameters' },
    { field: 'machine_name', label: 'Machine Name' },
    { field: 'cycle_time', label: 'Cycle Time' },
    { field: 'daily_count', label: 'Daily Count' },
    { field: 'product_per_hour', label: 'Product per hour' },
    { field: 'next_station_name', label: 'Next Station Name' },
    // { field: 'multiple_machine', label: 'Multiple Machine' },
  ];
  console.log(stations);

  const [productnames, setProductNames] = useState([]);
  useEffect(() => {
      const getProductNamesPromise = getProductNames()
      stations.splice(0,stations.length)
      setStations([...stations])
  
      //productnames.splice(0,productnames.length)
      //setProductNames([...productnames])
      const arr = [];
      getProductNamesPromise.then(async (result) => {
        console.log("Product Names Received:",result)
        const productnames = await result.map((product) => product)
        setProductNames(productnames)
        //console.log("Product Names:",arr)
        //setproductnames(arr)
        console.log("Product Names:",productnames)
      }).catch((err) => { })
  }, [])




  // useEffect(() => {
  //   // Fetch stations data
  //   const fetchData = async () => {
  //     try {
  //       // const result = await getStations();
  //       const result = await getInfoFromStationMasterWithMachine(1);
  //       const modifiedStations = result.map((station) => {
  //         if (station.report === 1) {
  //           station.report = "parameters";
  //         } else if (station.report === 0) {
  //           station.report = "Ok/NotOk";
  //         }
  //         if(station.next_station_name===null){
  //           station.next_station_name = "Not configured"
  //         }

  //         if(station.multiple_machine === 1){
  //           station.multiple_machine = "Yes"
  //         }

  //         else if(station.multiple_machine === 0){
  //           station.multiple_machine = "No"
  //         }
  //         return station;
  //       });
  //       setStations(modifiedStations);
  //       toast.success(<b>Data fetched successfully</b>);
  //     } catch (error) {
  //       toast.error(error.message || 'An error occurred');
  //     }
  //   };

  //   // Call the fetchData function
  //   fetchData();
  // }, []); // Empty dependency array to run only once

  async function fetchDetails(data)
  {
    stations.splice(0,stations.length)
    setStations([...stations])

    console.log("Fetching Data for product:",data)
    const result = await getInfoFromStationMasterWithMachine(data.value);
    const modifiedStations = result.map((station) => {
      if (station.report === 1) {
        station.report = "parameters";
      } else if (station.report === 0) {
        station.report = "Ok/NotOk";
      }
      if(station.next_station_name===null){
        station.next_station_name = "Not configured"
      }

      if(station.multiple_machine === 1){
        station.multiple_machine = "Yes"
      }

      else if(station.multiple_machine === 0){
        station.multiple_machine = "No"
      }
      return station;
    });
    setStations(modifiedStations);
  }
  
  return (
    <>
    <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div style={{marginTop:'15vh'}}>
        <h1 className='heading'>Station Details</h1>
        <div className='row' style={{marginTop:30}}>
          <div className='col'>
            
          </div>
          <div className='col'>
          <Select
              options={productnames.map((product) => ({ label: product.product_name, value: product.product_name }))}
              //value={addFormFormik.values.productName}
              name="productName"
              onChange={(data) => fetchDetails(data)}
              isSearchable={true}
              placeholder="Select Product"
          />
          </div>
          <div className='col'>
            
          </div>
        </div>
        {stations.length>0 && 
          <Table columns={columns} data={stations} />
        }
      </div>
      <br />
      <br />
      <Footer/>
    </>
  );
}

export default ViewStation;
