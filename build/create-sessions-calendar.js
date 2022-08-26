// grab elements
createNowDiv = document.getElementById("createBtnDiv")
createBtn = document.getElementById("createNowBtn")
timeDiv = document.getElementById("timeDiv")
times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']

// main functionality
function getCalendarDayDivs() {
    let days = document.getElementsByClassName('react-calendar__month-view__days__day')
    days = [...days]
    return days
}

function getAvailableDates(renderCalendar) {
    let days = getCalendarDayDivs()
    styleDayDivs(days)
    renderCalendar()
}

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
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function styleDayDivs (days) {
    let dayAsString
    let todaysDate = new Date().toISOString().split('T')[0]
    days.forEach(day => {
        day.style.backgroundColor = "white"
        day.style.color = "black"
        dayAsString = new Date(day.children[0].ariaLabel).toISOString().substring(0,10)
        if (dayAsString == todaysDate) {
            day.style.backgroundColor = "#c8a2c8"  
        }
    })
    selectedDateAction(days)
}

function selectedDateAction(days) {
    let selectedDate
    let selectedTimes = []
    days.forEach(day => day.addEventListener('click', (evt) => {
        if (evt.target.children[0]) {
            selectedDate = new Date(evt.target.children[0].ariaLabel)
        } else {
            selectedDate = new Date(evt.target.ariaLabel)
        }
        days.forEach(day => day.style.backgroundColor = "white")
        day.style.backgroundColor = "#c8a2c8"
        selectedTimes = renderTimes(selectedDate, selectedTimes)
        } 
    ))
}

function createSessions(selectedDate, selectedTimes) {
    createBtn.value = JSON.stringify([selectedDate, selectedTimes])
}

function renderTimes(selectedDate, selectedTimes) {
    timeDiv.innerHTML = ""
    times.forEach(time => {
        let timeChildDiv = document.createElement('div')
        timeChildDiv.innerHTML = time
        timeDiv.appendChild(timeChildDiv)    
    })
    Array.from(timeDiv.children).forEach(child => {
        child.addEventListener('click', () => {
            child.style.backgroundColor = "pink"
            child.style.color = "black"
            selectedTimes.push(child.innerHTML)
            createSessions(selectedDate, selectedTimes)
        })
    })
    return selectedTimes
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