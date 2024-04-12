import Router from "express"
import { insertInProductMaster, getInfoFromProductMaster, deleteProductMasterParameter, updateProductMaster, getOneProductAllParametersInfoFromProductMaster, getOneProductOneParameterInfoFromProductMaster, getProductNames,getParameterStatus,getProductParameterById,getProductStationParameters } from "../Controllers/productMasterController.js";
import {insertIntoStationMaster,deleteFromStationMaster,getInfoFromStationMaster,getOneStationFromStationMaster,getOneStationOneProductFromStationMaster,updateStationMaster,getStationNamesFromStationMaster, getStationNamesForOneProduct,addNextStationInStationMaster,mobileGetOneStationOneProductFromStationMaster,getStationAndMachinesInfo, copyStationNamesFromOneProduct, getProductStationsDetails, deleteStation} from "../Controllers/stationMasterController.js";
import {insertInProductyyyy} from "../Controllers/productyyyyController.js";
import {insertIntoEmployeeMaster,getAllFromEmployee,getOneFromEmployee,updateEmployeeMaster, deleteFromEmployeeMaster, resetPassword} from "../Controllers/employeeMasterController.js"
import {insertInStationyyyyFirst, insertInStationyyyyFirstNextStation,updateInStationyyyy,jobsAtStation,stationJobsStats,workAtStationInDay,getJobesSubmitedAtStation,productReport,jobDetailsReport,insertInStationyyyySameStation,jobsAtReworkStation,updateInStationyyyyrework,undoJobs,updateJobStatus,dailyProductionReport,trackingUserReport,completedJobsReport,scrapJobsReport,targetVsActualJobQntReport,targetVsActualJobCycleTimeReport} from "../Controllers/stationyyyyController.js"
import { login,getNamesFromEmployeeMaster,logOut } from "../Controllers/employeeMasterController.js";
import {getOneWorkerStation, insertIntoStationAllocation,getStationAllocated, getStationAllocatedToProduct, copyStationAllocation} from "../Controllers/stationAllocationController.js"
import {getAllFromShiftConfig,insertIntoShiftConfig,deleteFromShiftConfig,updateShiftConfig,getActiveShiftNames,getCurrentShift} from "../Controllers/shiftConfigController.js";
import { insertInLoginLog,getFromLoginLog } from "../Controllers/loginlogController.js";
import { deleteMachineFromMachineMaster, getMachineDataForStation, getInfoFromStationMasterWithMachine,getOneStationMachinesData } from "../Controllers/machineMasterController.js";
import { auth } from "../Middleware/auth.js";

const router = Router()

/**POST MEATHODS */
router.route("/ProductMasterInsert").post(auth,insertInProductMaster)
router.route("/StationMasterInsert").post(auth,insertIntoStationMaster)
router.route("/EmployeeMasterInsert").post(auth,insertIntoEmployeeMaster)
router.route("/login").post(login)
router.route("/logOut").post(logOut)
router.route("/ProductyyyyInsert").post(insertInProductyyyy);
router.route("/StationyyyyInsertFirst").post(insertInStationyyyyFirst);
router.route("/StationyyyyInsertFirstNextStation").post(insertInStationyyyyFirstNextStation);
router.route("/StationAllocationInsert").post(auth,insertIntoStationAllocation)
router.route("/StationyyyyShowJob").post(jobsAtStation);
//router.route("/StationyyyyCountAtStation").post(countOfWorkAtStation)
router.route("/StationyyyyProductReport").post(productReport)
router.route("/StationyyyyJobReport").post(jobDetailsReport)
router.route("/GetParameterStatus").post(getParameterStatus)
router.route("/StationyyyyInsertSameStation").post(insertInStationyyyySameStation)
// router.route("/StationyyyyWorkInDay").post(workAtStationInDay)
router.route("/ShiftConfigInsert").post(auth,insertIntoShiftConfig)
router.route("/loginLogInsert").post(insertInLoginLog)
router.route("/MachineMasterGetMachine").get(getMachineDataForStation)
router.route("/UndoJobsinStation").post(undoJobs)
router.route("/jobDone").post(updateJobStatus)




/**GET MEATHODS */
router.route('/ProductMasterGet').get(getInfoFromProductMaster)
router.route('/ProductMasterGetOneProductAllParameters').get(getOneProductAllParametersInfoFromProductMaster)
router.route('/ProductMasterGetOneProductOneParameter').get(getOneProductOneParameterInfoFromProductMaster)
router.route("/StationMasterGet").get(getInfoFromStationMaster)
router.route('/ProductMasterGetProductNames').get(getProductNames)
router.route('/StationMasterGetOneStation').get(getOneStationFromStationMaster)
router.route('/StationMasterGetOneStationOneProduct').get(getOneStationOneProductFromStationMaster)
router.route('/MobileStationMasterGetOneStationOneProduct').get(mobileGetOneStationOneProductFromStationMaster)
router.route('/EmployeeMasterGet').get(getAllFromEmployee)
router.route('/EmployeeMasterGetOne').get(getOneFromEmployee)
router.route('/EmployeeMasterGetNames').get(getNamesFromEmployeeMaster)
router.route('/StationMasterGetNames').get(getStationNamesFromStationMaster)
router.route('/StationMasterGetNamesForOneProduct').get(getStationNamesForOneProduct)
router.route('/getOneWorkerStation').get(getOneWorkerStation)
router.route("/StationyyyyWorkAtStationInDay").get(workAtStationInDay)
router.route('/StationyyyyGetJobsSubmitted').get(getJobesSubmitedAtStation)
router.route('/StationyyyyGetCountOfWorkAtStation').get(stationJobsStats)
router.route('/StationyyyyReworkJob').get(jobsAtReworkStation)
router.route("/ShiftConfigGet").get(getAllFromShiftConfig)
router.route("/ShiftConfigGetActiveShiftNames").get(getActiveShiftNames)
router.route("/ShiftConfigGetCurrentShift").get(getCurrentShift)
router.route('/WorkerAllocation').get(getStationAllocated)
router.route('/productStationAllocation').get(getStationAllocatedToProduct)
router.route('/copyStationAllocation').get(copyStationAllocation)
router.route('/GetStationAndMachinesInfo').get(getStationAndMachinesInfo)
router.route('/copyProductStations').get(copyStationNamesFromOneProduct)
router.route("/MachineMasterGetOneStationMachinesData").get(getOneStationMachinesData)
router.route("/loginLogGet").get(getFromLoginLog)
router.route("/StationMasterInfoWithMachine").get(getInfoFromStationMasterWithMachine)
router.route("/getProductStationsDetails").get(getProductStationsDetails)
router.route("/getProductParameterById").get(getProductParameterById)
router.route("/GetDailyProductionReport").get(dailyProductionReport)
router.route("/GetTrackingUserReport").get(trackingUserReport) 
router.route("/GetCompletedJobsReport").get(completedJobsReport)
router.route("/GetScrapJobsReport").get(scrapJobsReport)
router.route("/GetTargetVsActualJobQntReport").get(targetVsActualJobQntReport)
router.route("/GetTargetVsActualJobCycleTimeReport").get(targetVsActualJobCycleTimeReport)
router.route("/getProductStationParameters").get(getProductStationParameters)
router.route('/verifyLogin').get(auth,(req,res)=>{
    const {userId} = req.body.token
    try{
        if(!userId || userId===null || userId===undefined){
            return res.status(401).send({msg:"Authorization Failed",redirectUrl:"http://localhost:3000"})
        }
        res.status(200).end()
    }catch(err){
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
})



/**DELETE MEATHODS */
router.route('/ProductMasterDeleteParameter').delete(auth,deleteProductMasterParameter)
router.route('/StationMasterDelete').delete(auth,deleteFromStationMaster)
router.route('/EmployeeMasterDelete').delete(auth,deleteFromEmployeeMaster)
router.route("/ShiftConfigDelete").delete(auth,deleteFromShiftConfig)
router.route("/MachineMasterDelete").delete(auth,deleteMachineFromMachineMaster)
router.route('/deleteStation').delete(auth,deleteStation)

/**PUT MEATHOD */
router.route('/ProductMasterUpdate').put(auth,updateProductMaster);
router.route('/StationMasterUpdate').put(auth,updateStationMaster)
router.route('/EmployeeMasterUpdate').put(auth,updateEmployeeMaster)
router.route('/StationMasterAddNextStation').put(auth,addNextStationInStationMaster)
router.route('/Stationyyyyupdate').put(updateInStationyyyy)
router.route('/StationyyyyupdateRework').put(updateInStationyyyyrework)
router.route("/ShiftConfigUpdate").put(auth,updateShiftConfig)
router.route('/ResetPassword').put(auth,resetPassword)

export default router;