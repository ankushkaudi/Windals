import db from "../Database/connection.js";

async function insertIntoStationAllocation(req,res){
    //console.log(req.body);
    const {date,shift,productId,stationAllocations} = req.body
    //console.log(stationAllocations.removed);
    try {
        // const selectQuery = "SELECT employee_id FROM station_allocation WHERE fromDate = ? AND shift_id = ? AND productId=?"
        // const [selectResult] = await db.promise().query(selectQuery,[date,shift,productId])
        // if(selectResult.length>0){
        //     res.status(501).send({msg:`Workers already allocated to stations for this shift_id and this date:${date}`})
        // }
        // else{
            const insertQuery = "INSERT INTO station_allocation (fromDate,shift_id,station_name,stationId,employee_id) VALUES (?, ?, ?, ?, ?)"
            const removeQuery = "UPDATE station_allocation SET toDate=? Where shift_id=? AND stationId=? AND employee_id=?"
            const selectQuery = "SELECT employee_id FROM station_allocation WHERE stationId = ? AND shift_id = ? AND employee_id=? AND toDate='0000-00-00'"
            for(const stationAllocation of stationAllocations)
            {
                console.log(stationAllocation);
                const {station,stationId,workers,removed} = stationAllocation
                for(const workerID of workers){
                    const [selectResult] = await db.promise().query(selectQuery,[stationId,shift,workerID])
                    if(selectResult.length==0)
                    {
                        try{
                            const [insertResult] = await db.promise().query(insertQuery,[date,shift,station,stationId,workerID])
                        }
                        catch(Error)
                        {
                            const [insertResult] = await db.promise().query(removeQuery,['0000-00-00',shift,stationId,workerID])
                        }
                    }
                }
                console.log("Removing")
                for(const workerID of removed){
                    const [insertResult] = await db.promise().query(removeQuery,[date,shift,stationId,workerID])
                }
            }
            res.status(201).send({msg:"Stations allocated to workers successfully."})
        //}
    } catch (error) {
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
} 

async function getOneWorkerStation(req,res){
    const {employeeId,date,shift} = req.query
    console.log("One Worker Info")
    console.log(req.query);
    try {
        //const selectQuery = "SELECT DISTINCT sa.station_name, sm.position,sm.station_id,sm.multiple_machine,sm.product_name, sm.station_parameters FROM station_allocation AS sa INNER JOIN station_master AS sm ON sa.station_name = sm.station_name WHERE employee_id=? AND toDate='0000-00-00' AND shift_id=?"
        //const selectQuery = "SELECT DISTINCT sa.station_name, sm.position,sm.station_id,sm.multiple_machine,sm.product_name FROM station_allocation AS sa INNER JOIN station_master AS sm ON sa.stationId = sm.station_id WHERE employee_id=? AND toDate='0000-00-00' AND shift_id=?"
        const selectQuery = "SELECT * FROM station_master Where station_id in (Select stationId From station_allocation WHERE employee_id=? AND toDate='0000-00-00' AND shift_id=?)"

        const [selectResult] = await db.promise().query(selectQuery,[employeeId,shift])
        console.log(selectResult);

        if(selectResult.length<=0)
        {
            res.status(501).send({msg:"No station has been allocated to you."})
        }
        else
        {
            console.log(selectResult);
            res.status(201).send(selectResult)
        }
    } catch (error) {
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}

async function getStationAllocated(req,res){
    const {date} = req.query
    // console.log(date);
    try{
        const selectQuery= "SELECT station_allocation.station_name ,station_allocation.fromDate, employee_master.first_name, employee_master.last_name, employee_master.user_name,shift_config.shift_name FROM station_allocation JOIN employee_master ON station_allocation.employee_id = employee_master.employee_id JOIN shift_config ON station_allocation.shift_id = shift_config.shift_id WHERE station_allocation.toDate = '0000-00-00'"
        const [selectResult] = await db.promise().query(selectQuery,[date])
        // console.log(selectResult);
        if(selectResult.length<=0)
        {
            res.status(501).send({msg:"No station has been allocated to any worker yet."})
        }
        else{
            res.status(201).send(selectResult)
        }
    }
    catch(error){
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}


async function getStationAllocatedToProduct(req,res){
    console.log(req.query);
    const {productId,shiftId} = req.query
    // console.log(date);
    try{
        const selectQuery="SELECT station_allocation.station_name ,station_allocation.stationId ,station_allocation.fromDate, employee_master.first_name, employee_master.last_name, employee_master.user_name,shift_config.shift_name FROM station_allocation JOIN employee_master ON station_allocation.employee_id = employee_master.employee_id JOIN shift_config ON station_allocation.shift_id = shift_config.shift_id WHERE station_allocation.stationId IN (SELECT station_master.station_id FROM station_master WHERE station_master.product_name = ?) AND station_allocation.shift_Id = ? AND toDate='0000-00-00'"
        //const selectQuery= "SELECT station_allocation.station_name ,station_allocation.stationId ,station_allocation.fromDate, employee_master.first_name, employee_master.last_name, employee_master.user_name,shift_config.shift_name FROM station_allocation JOIN employee_master ON station_allocation.employee_id = employee_master.employee_id JOIN shift_config ON station_allocation.shift_id = shift_config.shift_id WHERE station_allocation.productId = ? AND station_allocation.shift_Id = ? AND toDate='0000-00-00'"
        const [selectResult] = await db.promise().query(selectQuery,[productId, shiftId])
        // console.log(selectResult);
        if(selectResult.length<=0)
        {
            res.status(202).send({msg:"No station has been allocated to any worker yet."})
        }
        else{
            res.status(201).send(selectResult)
        }
    }
    catch(error){
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}

async function copyStationAllocation(req,res){
    console.log("Copying Allocation1111")
    console.log(req.query);
    const {srcProductName,destProductName} = req.query
    //console.log(stationAllocations.removed);
    try {
        const insertQuery = "INSERT INTO station_allocation (fromDate,shift_id,station_name,stationId,employee_id) VALUES (?, ?, ?, ?, ?)"
        //const selectQuery = "SELECT * FROM station_allocation WHERE productId=? AND toDate='0000-00-00'"
        //const selectQuery = "SELECT station_allocation.employee_id,station_allocation.fromDate,station_allocation.toDate,station_allocation.shift_Id,station_master.station_id,station_master.station_name FROM station_allocation LEFT JOIN station_master ON station_allocation.stationId=station_master.station_id WHERE station_allocation.product_name=? and station_allocation.toDate='0000-00-00'"
        const selectQuery ="SELECT station_allocation.employee_id,station_allocation.fromDate,station_allocation.toDate,station_allocation.shift_Id,station_allocation.stationId,station_allocation.station_name FROM station_allocation WHERE station_allocation.stationId IN (Select station_master.station_id From station_master WHERE station_master.product_name=?) AND station_allocation.toDate='0000-00-00'"
        const [selectResult] = await db.promise().query(selectQuery, [srcProductName])
        const stationMasterQuery = "SELECT station_id,station_name FROM station_master WHERE product_name=?"
        const [stationMasterSelectResult] = await db.promise().query(stationMasterQuery, [destProductName])
        if (selectResult.length > 0) {
            if(stationMasterSelectResult.length>0)
            {
                stationMasterSelectResult.forEach(async (destData)  =>{
                    console.log(destData)
                    selectResult.forEach(async (srcData)  =>
                    {
                        console.log(srcData)
                        console.log(srcData.shift_Id)
                        if(destData.station_name==srcData.station_name)
                        {
                            const [insertResult] = await db.promise().query(insertQuery,[srcData.fromDate,srcData.shift_Id,destData.station_name,destData.station_id,srcData.employee_id])

                        }
                    })
        
                })
            }
        }
        //res.status(500).send({ msg: `Internal server error: ${error}` });
        res.status(201).send({msg:"Done"})
    } catch (error) {
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
} 

    
export {insertIntoStationAllocation,getOneWorkerStation, getStationAllocated,getStationAllocatedToProduct,copyStationAllocation}