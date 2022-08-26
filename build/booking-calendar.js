// grab elements
sessions = document.getElementById("sessions").value
bookNowDiv = document.getElementById("bookBtnDiv")
bookNowBtn = document.getElementById("bookNowBtn")
// main functionality
function getCalendarDayDivs() {
    let days = document.getElementsByClassName('react-calendar__month-view__days__day')
    // let days = document.getElementsByClassName('react-calendar__tile')
    days = [...days]
    return days
}

function getAvailableDates(renderCalendar) {
    sessions = JSON.parse(sessions)
    let allAvailableDates = sessions.map(elem => elem.date.split('T')[0]) // get available dates (exclude time)
    let uniqueAvailableDates = allAvailableDates.filter(onlyUnique)
    //get all calendar days elements
    let days = getCalendarDayDivs()
    styleDayDivs(days, uniqueAvailableDates)
    renderCalendar()
}

function styleDayDivs (days, uniqueAvailableDates) {
    let dayAsString
    let todaysDate = new Date().toISOString().split('T')[0]
    days.forEach(day => {
        day.style.backgroundColor = "white"
        day.style.color = "black"
        dayAsString = new Date(day.children[0].ariaLabel).toISOString().substring(0,10)
        if (dayAsString == todaysDate) {
            day.style.backgroundColor = "#c8a2c8"  
        }
        if (uniqueAvailableDates.includes(dayAsString)) day.style.color = "magenta"
    })
    selectedDateAction(days)
}

function selectedDateAction(days) {
    let selectedDate
    days.forEach(day => day.addEventListener('click', (evt) => {
        days.forEach(day => day.style.backgroundColor = "white")
        day.style.backgroundColor = "#c8a2c8"
        if (evt.target.children[0]) {
            selectedDate = new Date(evt.target.children[0].ariaLabel).toISOString().substring(0,10)
        } else {
            selectedDate = new Date(evt.target.ariaLabel).toISOString().substring(0,10)
        }
        console.log(selectedDate)
        let calendarObj = formCalendarObject()
        renderTimes(calendarObj, selectedDate)
    }))
}

function formCalendarObject() {
    let calendarObj = {};
    let formattedDateKey
    sessions.forEach(session => {
        formattedDateKey = session.date.split('T')[0]
        if (!calendarObj[formattedDateKey]) {
            calendarObj[formattedDateKey] = [];
            calendarObj[formattedDateKey].push(session.time)
        } else {
            calendarObj[formattedDateKey].push(session.time)
        }
    })
    return calendarObj
}

function renderTimes(calendarObj, selectedDate) {
    let timeDiv = document.getElementById("timeDiv")
    timeDiv.innerHTML = ""
    console.log(calendarObj)
    let selectedTimes = calendarObj[selectedDate]
    if (!selectedTimes) timeDiv.innerHTML = "No Available Times :("
    else {
        selectedTimes = selectedTimes.sort()
        selectedTimes.forEach(time => {
            let timeChildDiv = document.createElement('div')
            timeChildDiv.innerHTML = time
            timeDiv.appendChild(timeChildDiv)
        })
        selectedTimeAction(timeDiv, selectedDate)
    }
}

function selectedTimeAction(timeDiv, selectedDate) {
    timeDiv.childNodes.forEach(child => {
        child.addEventListener('click', (e) => {
            restyleTimeChildDivs(timeDiv)
            child.style.backgroundColor = "pink"
            child.style.color = "black"
            bookNowDiv.style.display = "block"
            let selectedTime = e.target.innerHTML
            bookNowBtn.value = JSON.stringify([selectedDate, selectedTime])
            console.log(bookNowBtn)
        })
    })
}

function restyleTimeChildDivs(timeDiv) {
    timeDiv.childNodes.forEach(child => {
        child.style.backgroundColor = "white"
        child.style.color = "magenta"
    })
}

function renderCalendar() {
    let calWrapperElem = document.getElementById('calWrapper')
    calWrapperElem.style.display = "flex"
}

// helper functions
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// initialize
getAvailableDates(renderCalendar)