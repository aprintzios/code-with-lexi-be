var express = require('express');
var router = express.Router();
const Session = require("../models/session")

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
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

router.post('/create', async function(req, res, next) {
    console.log("in api sessions create", req.body)
    let newSessions = req.body;
    //parse them to add to db
    //get start and end date
    let startDate = new Date(newSessions.startDate);
    let endDate = new Date(newSessions.endDate);
    //get start and end time
    let startTime = parseInt(newSessions.startTime.substring(0, 2));
    let endTime = parseInt(newSessions.endTime.substring(0, 2));
    let dates = getDates(startDate, endDate);
    let times = getTimes(startTime, endTime);
    let readableTimes = times.map(time => toReadableTime(time))
    dates.forEach(date => {
        readableTimes.forEach(time => {
            Session.create({date: date, time: time})
        })
    })
    res.status(200).send("NICE")
});

module.exports = router;
