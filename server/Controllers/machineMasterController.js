import db from "../Database/connection.js";

async function getMachineDataForStation(req, res) {
    const { stationId } = req.query
    console.log("getMachineDataForStation", stationId)
    try {
        const searchQuery = "SELECT * FROM machine_master WHERE station_id = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationId])
        console.log(searchResult)
        res.status(201).send(searchResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

async function deleteMachineFromMachineMaster(req,res){
    const {machineId} = req.query
    console.log(machineId);
    try{
        const deleteQuery = "DELETE FROM machine_master WHERE machine_id = ?"
        const [deleteResult] = await db.promise().query(deleteQuery,[machineId])
        res.status(201).send({msg:"Machine deleted successfully"})
    }catch(error)
    {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

async function getInfoFromStationMasterWithMachine(req, res) {
    try {
        console.log(req.query)
        const {productName} = req.query
        //var query = "select station_master.process_number,station_master.station_name, station_master.product_name, station_master.report, station_master.station_parameters, machine_master.machine_name, cycle_time, daily_count, product_per_hour, next_station_name from machine_master inner join station_master on station_master.station_id=machine_master.station_id"
        var query = "Select station_master.process_number,station_master.station_name, station_master.product_name, station_master.report, station_master.station_parameters,'NA' as machine_name, station_master.cycle_time, station_master.daily_count, station_master.product_per_hour, station_master.next_station_name FROM station_master WHERE product_name=? AND station_master.multiple_machine=0 UNION Select station_master.process_number,station_master.station_name, station_master.product_name, station_master.report, station_master.station_parameters, machine_master.machine_name, machine_master.cycle_time, machine_master.daily_count, machine_master.product_per_hour, station_master.next_station_name from station_master inner join machine_master on station_master.station_id=machine_master.station_id where station_master.product_name=? and station_master.multiple_machine=1"
        const [result] = await db.promise().query(query,[productName,productName])
        if (result.length === 0) {
            res.status(409).send({ msg: "No infomation about stations exist in database." })
        }
        else {
            res.status(201).send(result)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}`})
    }
}

async function getOneStationMachinesData(req, res) {
    const {stationId} = req.query
    console.log(stationId);
    try {
        var query = "SELECT machine_id, machine_name, cycle_time, daily_count, product_per_hour FROM machine_master WHERE station_id = ? "
        const [result] = await db.promise().query(query,stationId)
        if (result.length === 0) {
            res.status(409).send({ msg: "Machines Information Not Available." })
        }
        else {
            res.status(201).send(result)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}`})
    }
}

export {getMachineDataForStation,deleteMachineFromMachineMaster, getInfoFromStationMasterWithMachine,getOneStationMachinesData}