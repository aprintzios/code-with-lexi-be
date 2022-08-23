var express = require('express');
var router = express.Router();
const Session = require("../models/session")

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1)
        // currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function getTimes(startTime, endTime) {
    let timeArray = [];
    let currentTime = startTime;
    while (currentTime < endTime) {
        timeArray.push(currentTime);
        currentTime++;
    }
    return timeArray;
}

function toReadableTime(hrs) {
    let timeType = (hrs > 11 ? "PM" : "AM");
    if (hrs > 12)
        hrs = hrs - 12;
    if (hrs == 0)
        hrs = 12;
    return hrs + ":" + "00 " + timeType;
}

router.get('/available', async function(req, res, next){
    try{
        //retrieve all sessions from db
        let sessions = await Session.find({user: null});
        res.status(200).json(sessions);
    } catch(err){
        res.status(400).json(err);
    }
});

router.get('/booked', async function(req, res, next){
    try{
        //retrieve all sessions from db
        let sessions = await Session.find( { user: { $ne: null } } );
        res.status(200).json(sessions);
    } catch(err){
        res.status(400).json(err);
    }
});

router.post('/create', async function (req, res, next) {
    try {
        const [dates, times] = JSON.parse(req.body.sessions)
        console.log(dates, times)
        dates.forEach(date => {
            times.forEach(async time => {
                date = new Date(date)
                date.setUTCHours(0,0,0,0);
                console.log("time", time);
                const session = await Session.find({date: date, time: time})
                if (!session.length) {
                    await Session.create({ date: new Date(date), time: time })
                }
            })
        })
        // let newSessions = req.body;
        // let startDate = new Date(newSessions.startDate);
        // let endDate = new Date(newSessions.endDate);
        // let startTime = parseInt(newSessions.startTime.substring(0, 2));
        // let endTime = parseInt(newSessions.endTime.substring(0, 2));
        // let dates = getDates(startDate, endDate);
        // let times = getTimes(startTime, endTime);
        // let readableTimes = times.map(time => toReadableTime(time))
        // dates.forEach(date => {
        //     readableTimes.forEach(time => {
        //         Session.create({ date: date, time: time })
        //     })
        // })
        res.status(200).send("Done");
    }
    catch (err) {
        res.status(400).json(err);

    }

});

router.put('/update', async function(req, res, next){
    try{
        let bookedSession = JSON.parse(req.body.session)
        let bookedSessionDate = new Date(bookedSession[0])
        bookedSessionDate.setUTCHours(0,0,0,0);
        console.log("booked ses date", bookedSessionDate)
        let session = await Session.findOne({date: bookedSessionDate, time: bookedSession[1]})
        console.log("found my session", session);
        session.user = req.user._id;
        session.save()
        // const session = await Session.find()
        // // const session = await Session.findById(req.body.sessionId)
        // session.user = req.user._id
        // session.save()
        res.status(200).send("Done")
    }catch(err){
        res.status(400).json(err);
    }
});

router.delete('/delete', async function(req, res, next) {
    try{
        if (req.user?.isAdmin){
            await Session.findByIdAndDelete(req.query.sessionId)
            res.status(200).send("Done")
        }
    }catch(err){
        res.status(400).json(err);
    }
})

module.exports = router;
