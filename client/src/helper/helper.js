import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//const proxy = "http://192.168.0.40:8080/"
//const logOutLoc="http://192.168.0.40:3000"
const proxy = "http://127.0.0.1:8080/"
const logOutLoc="http://localhost:3000"

export async function addProduct(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/ProductMasterInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function updateProducts(productName,existingParameters){
    const values = {productName:productName,parameters:existingParameters}
    const token = localStorage.getItem("token")
    try {
        const {data,status} = await axios.put(`${proxy}api/ProductMasterUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function deleteProductParameter(parameterId){
    try{
        const token = localStorage.getItem("token")
        const {data,status} = await axios.delete(`${proxy}api/ProductMasterDeleteParameter`,{params:{parameterId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    }catch(error){
        return Promise.reject(error.response.data);
    }
}

export async function getAllProducts(){
    try{
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGet`)
        return Promise.resolve(data)
    } catch(error){
        return Promise.reject(error.response.data);
    }
}

export async function getOneProductAllParameters(productName){
    try {
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGetOneProductAllParameters`,{params:{productName:productName}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function getProductParameterById(productName,parameterId){
    try {
        const {data,status} = await axios.get(`${proxy}api/getProductParameterById`,{params:{productName:productName, parameterId:parameterId}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function getOneProductOneParameter(values){
    const {productName,productParameter} = values
    try {
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGetOneProductOneParameter`,{params:{productName:productName,productParameter:productParameter}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function getProductNames(){
    try {
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGetProductNames`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function addStation(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/StationMasterInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getStations(){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGet`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getOneStation(stationName){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetOneStation`,{params:{stationName}})
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function getOneStationOneProduct(values){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetOneStationOneProduct`,{params:{values}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function deleteStation(values){
    try {
        const token = localStorage.getItem("token")
        //const {data,status} = await  axios.delete(`${proxy}api/StationMasterDelete`,{params:{values},headers:{"Authorization":`Bearer ${token}`}})
        const {data,status} = await  axios.delete(`${proxy}api/deleteStation`,{params:{stationId:values},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateStation(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/StationMasterUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllStationNames(){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetNames`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllStationsAndMachinesInfo(){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetStationAndMachinesInfo`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function copyProductStations(srcProduct,destProduct){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/copyProductStations`,{params:{srcProduct:srcProduct,destProduct:destProduct},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function copyStationAllocation(srcProductId,destProductId){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/copyStationAllocation`,{params:{srcProductId:srcProductId,destProductId:destProductId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getOneProductStationNames(productName){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetNamesForOneProduct`,{params:{productName:productName}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getProductStationsDetails(productName){
    try {
        const {data,status} = await axios.get(`${proxy}api/getProductStationsDetails`,{params:{productName:productName}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}


export async function registerUser(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/EmployeeMasterInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllUsers(){
    try {
        const {data,status} = await axios.get(`${proxy}api/EmployeeMasterGet`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllWorkerNames(){
    try {
        const {data,status} = await axios.get(`${proxy}api/EmployeeMasterGetNames`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getOneEmployee(userName){
    try {
        const {data,status} = await axios.get(`${proxy}api/EmployeeMasterGetOne`,{params:{userName}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateEmployee(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/EmployeeMasterUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function deleteEmployee(employeeId){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.delete(`${proxy}api/EmployeeMasterDelete`,{params:{employeeId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function addStationAllocation(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/StationAllocationInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getWorkerAllocation(){
    const currentDate = new Date();

  // Get year, month, and day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  // Create the yyyy-mm-dd formatted date string
  const formattedDate = `${year}-${month}-${day}`;
    try{
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/WorkerAllocation`,{params:{date:formattedDate},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch(error){
        return Promise.reject(error.response.data)
    }
}

export async function getProductStationAllocation(productId,shiftId){
    try{
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/productStationAllocation`,{params:{productId:productId,shiftId:shiftId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch(error){
        return Promise.reject(error.response.data)
    }
}

export async function createJobId(values){
    try {
        const {data,status} = await axios.post(`${proxy}api/ProductyyyyInsert`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function configureNextStation(values){
    // const newValues = {
    //     productName : values.productName.value,
    //     firstStation : values.firstStation.value,
    //     lastStation : values.lastStation.value,
    //     nextStationAllocation: values.nextStationAllocation.map((station)=>{
    //         return ({
    //             currentStation: station.currentStation,
    //             nextStation: station.nextStation.value
    //         })
    //     })
    // }
    const token = localStorage.getItem("token")
    try {
        const {data,status} = await axios.put(`${proxy}api/StationMasterAddNextStation`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function insertInStationyyyyFirst(values){
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyInsertFirst`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function insertInStationyyyyFirstNextStation(values){
    console.log({"this":values});
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyInsertFirstNextStation`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function insertInStationyyyySameStation(values){
    console.log({"this":values});
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyInsertSameStation`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getJobesAtStation(stationId,productName){
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyShowJob`,{station_id:stationId,product_name:productName})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateJobesAtStation(values,stationId,employeeId,machine_id){
    let formattedString = '';
    // console.log(":test");
    if (values.reason!=="") {
        // Append the reason to the string if it exists
         if(values.status == -1){
            formattedString += "Not-Okay-"
         }
         else if(values.status == 0){
            formattedString += "Rework-"
         }
          formattedString += "Reason:";
          formattedString += values.reason;
          formattedString += ";"
      }
    
    if (values.parameterValues!==null && values.parameterValues!={}) {
        // Convert parameterValues object to a string
        formattedString += "Parameters:"
        const parameterString = Object.entries(values.parameterValues)
          .map(([key, value]) => `${key},${value}`)
          .join(';');
    
        formattedString += parameterString;
      }
    
      // If neither reason nor parameters exist, set the string to null
      if (formattedString.length === 0) {
        formattedString = null;
      }
    
    const newValues = {
        product_name:values.selectedJob.product_name,
        job_name:values.selectedJob.job_name,
        status:values.status,
        parameters:formattedString,
        station_id:stationId,
        employee_id:employeeId,
        machine_id:machine_id
    }
    console.log({"newValues":newValues});
    try {
       
        const {data,status} = await axios.put(`${proxy}api/Stationyyyyupdate`,newValues)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateJobStatus(info){
    try {
       console.log("Data Received at Helper:", info)
        const {data,status} = await axios.post(`${proxy}api/jobDone`,info)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateJobsfromSupervisorDash(values){
    
    
    // const newValues = {
    //     product_name:values.product_name,
    //     job_name:values.job_name,
    //     status:values.status,
    //     parameters:values.parameters,
    //     station_id:values.stationId,
    //     employee_id:values.employeeId,
    //     machine_id:values.machine_id
    // }
    // console.log({"newValues":newValues});
    console.log(values);
    try {
       
        const {data,status} = await axios.put(`${proxy}api/StationyyyyupdateRework`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getWorkAtStationInDay(stationId,empID){
    const currentDate = new Date();

  // Get year, month, and day
  //const year = currentDate.getFullYear();
  //const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
  //const day = String(currentDate.getDate()).padStart(2, '0');

  // Create the yyyy-mm-dd formatted date string
  //const formattedDate = `${year}-${month}-${day}`;
    try {
        //const {data,status} = await axios.get(`${proxy}api/StationyyyyWorkAtStationInDay`,{params:{stationId,date:formattedDate,empID}})
        const {data,status} = await axios.get(`${proxy}api/StationyyyyWorkAtStationInDay`,{params:{stationId,empID}})
        //console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function loginUser(values){
    try{
        const {data:loginData,status:loginStatus} = await axios.post(`${proxy}api/login`,values)
        const {token} = loginData
        if(loginStatus===201)
        {
            console.log("data:",loginData,":",loginData.employeeId)
            localStorage.setItem("id",loginData.employeeId)
            localStorage.setItem("access",loginData.access)
            localStorage.setItem("token",token)
            return Promise.resolve(loginData)
        }
        // else if(loginStatus===201 && loginData.userName!=="admin")
        // {
        //     const currentDate = new Date();
        //     const year = currentDate.getFullYear();
        //     const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
        //     const day = String(currentDate.getDate()).padStart(2, "0");
        //     const formattedDate = `${year}-${month}-${day}`;
        //     const {data:workerStationData,status} = await axios.get(`${proxy}api/getOneWorkerStation`,{params:{employeeId:loginData.employeeId,date:formattedDate,shift:values.shift}})
        //     const finalData = {
        //         ...loginData,
        //         ...workerStationData
        //     }
        //     localStorage.setItem("token",token)
        //     return Promise.resolve(finalData)
        // }
    }catch(error){
        return Promise.reject(error.response.data)
    }
}

export async function verifyLogin(){
    const token = localStorage.getItem("token")
    console.log(token);
    try {
        const {status} = await axios.get(`${proxy}api/verifyLogin`,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(status)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function addShift(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/ShiftConfigInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getShift(){
    try {
        const {data,status} = await axios.get(`${proxy}api/ShiftConfigGet`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function deleteShift(shiftId){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await  axios.delete(`${proxy}api/ShiftConfigDelete`,{params:{shiftId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateShift(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/ShiftConfigUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getActiveShiftNames(){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/ShiftConfigGetActiveShiftNames`,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getCurrentShift(){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/ShiftConfigGetCurrentShift`,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function logout(){
    
    const empId=localStorage.getItem("id")
    console.log("Logout:",empId)
    const token = localStorage.getItem("token")
    const {data,status} = await axios.post(`${proxy}api/logOut`,{employeeId:empId},{headers:{"Authorization":`Bearer ${token}`}})
    localStorage.removeItem("token");
    window.location.href = logOutLoc;
}

export async function resetPassword(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/ResetPassword`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }

}

export async function insertInLoginLog({userName,stationName}){
    try {
        const {data,status} = await axios.post(`${proxy}api/loginLogInsert`,{userName,stationName})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
} 

export async function getJobReport(jobName){
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyJobReport`,{jobName:jobName})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
} 

export async function getCountOfWorkAtStation(stationID){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/StationyyyyGetCountOfWorkAtStation`,{params:{stationID},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function getLoginLogInfo(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/loginLogGet`,{params:{values},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function getInfoFromStationMasterWithMachine(productName){
    try {
        
        const {data,status} = await axios.get(`${proxy}api/StationMasterInfoWithMachine`,{params:{productName:productName}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function getParameterStatus(parameterName,product_name){
    try {
        
        const {data,status} = await axios.post(`${proxy}api/GetParameterStatus`,{parameterName:parameterName,product_name:product_name})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}


export async function getOneWorkerStation(employeeId,shift){
    // const token = localStorage.getItem("token")
    // console.log(token);
    try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;
            const {data,status} = await axios.get(`${proxy}api/getOneWorkerStation`,{params:{employeeId:employeeId,date:formattedDate,shift:shift}})
            return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}
export async function deleteMachine(machineId){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.delete(`${proxy}api/MachineMasterDelete`,{params:{machineId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function getStationRework(values){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationyyyyReworkJob`)
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function getOneStationOneProductMachinesData(stationId){
    try {
        const {data,status} = await axios.get(`${proxy}api/MachineMasterGetOneStationMachinesData`,{params:{stationId}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function stationMachines(stationId){
    try {
        const {data,status} = await axios.get(`${proxy}api/MachineMasterGetMachine`,{params:{stationId}})
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}
export async function GetDailyProductionReport(value){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetDailyProductionReport`,{params:{value}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function GetTrackingUserReport(value){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetTrackingUserReport`,{params:{value}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function GetCompletedJobsReport(value){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetCompletedJobsReport`,{params:{value}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function GetScrapJobsReport(value){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetScrapJobsReport`,{params:{value}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
} 

export async function GetTargetVsActualJobQntReport(value){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetTargetVsActualJobQntReport`,{params:{value}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function GetTargetVsActualJobCycleTimeReport(value){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetTargetVsActualJobCycleTimeReport`,{params:{value}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

//added by SJT on 09-03-2024
export async function getProductStationParameters(productName,stationId){
    try {
        //const {data,status} = await axios.get(`${proxy}api/StationyyyyWorkAtStationInDay`,{params:{stationId,date:formattedDate,empID}})
        const {data,status} = await axios.get(`${proxy}api/getProductStationParameters`,{params:{productName,stationId}})
        //console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}
