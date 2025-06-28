const cron = require('node-cron');
const { subDays ,startOfDay,endOfDay} = require("date-fns");
const connectionRequest=require('../models/connectionRequest');
const sendmail=require('../utils/sendmail');

cron.schedule('54 17 * * *',async () => {
  try{

    const today=subDays(Date(),0)
    const start=startOfDay(today);
    const end=endOfDay(today);

    const pendingRequests= await connectionRequest.find({
        status:"interested",
        createdAt: {
            $gte: start,
            $lt: end
        }
    }).populate("fromUserId toUserId")

    const emails=[...new Set(pendingRequests.map(req => req.toUserId.email))];

    console.log(emails);

    for(const email of emails){

        try {
            await sendmail(`"Pending Connection Requests for  " ${email}`,
                 "You have pending connection requests. Please review them.");
        }
        catch (error) {
            console.log("Failed to send email to ${email}: ", error);
        }
    }
  }
  catch(err){
    console.log("Error in cron job: ", err);
  }
});