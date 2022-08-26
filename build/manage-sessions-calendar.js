scriptAxios = document.createElement('script')
scriptAxios.src = "https://unpkg.com/axios/dist/axios.min.js"
document.body.appendChild(scriptAxios)
// grab elements
bookedSessions = JSON.parse(document.getElementById("bookedSessions").value)
availableSessions = JSON.parse(document.getElementById("availableSessions").value)
sessions = [bookedSessions, availableSessions].flat(Infinity)
createBtnDiv = document.getElementById("createBtnDiv")
createBtn = document.getElementById("createBtn")
deleteSessionButton = document.getElementById('deleteSessionButton')
jwt = document.getElementById("jwt").value


// main functionality
function deleteSession(sessionId) {
    axios.delete(`/api/sessions/delete?sessionId=${sessionId}&token=${jwt}`)
    document.getElementById(sessionId).remove()
    availableSessions = availableSessions.filter(session => session._id !== sessionId)
    sessions = [bookedSessions, availableSessions].flat(Infinity)
    getAvailableDates(renderCalendar)
}

function getCalendarDayDivs() {
    let days = document.getElementsByClassName('react-calendar__month-view__days__day')
    days = [...days]
    return days
}

function getAvailableDates(renderCalendar) {
    let allAvailableDates = sessions.map(elem => elem.date.split('T')[0]) // get available dates (exclude time)
    let uniqueAvailableDates = allAvailableDates.filter(onlyUnique)
    let days = getCalendarDayDivs()
    styleDayDivs(days, uniqueAvailableDates)
    renderCalendar()
}

function styleDayDivs(days, uniqueAvailableDates) {
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
        let calendarObj = formCalendarObject()
        renderTimes(calendarObj, selectedDate)
    }))
}

function renderTimes(calendarObj, selectedDate) {
    let bookedTimeDiv = document.getElementById("bookedTimeDiv")
    let availableTimeDiv = document.getElementById("availableTimeDiv")
    bookedTimeDiv.innerHTML = ""
    availableTimeDiv.innerHTML = ""
    let selectedTimes = calendarObj[selectedDate]
    if (!selectedTimes) bookedTimeDiv.innerHTML = "No Available Times :("
    if (!selectedTimes) availableTimeDiv.innerHTML = "No Available Times :("
    else {
        selectedTimes.forEach(session => {
            let timeChildDiv = document.createElement('div')
            if (session.booked) {
                timeChildDiv.style.backgroundColor = "pink"
                timeChildDiv.style.color = "black"
                timeChildDiv.innerHTML = `${session.time}`
                bookedTimeDiv.appendChild(timeChildDiv)
            }
            else {
                timeChildDiv.style.backgroundColor = "white"
                timeChildDiv.style.color = "magenta"

                //experiment
                timeChildDiv.style.display = "flex"
                timeChildDiv.style.gap = "20px"
                timeChildDiv.style.justifyContent = "center"

                timeChildDiv.id = session._id
                timeChildDiv.innerHTML = session.time
                addDeleteFunctionality(timeChildDiv, session)
                availableTimeDiv.appendChild(timeChildDiv)
            }
        })
    }
}

function addDeleteFunctionality(timeChildDiv, session) {
    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = "X"
    deleteBtn.value = session._id
    deleteBtn.className = "deleteBtn"
    timeChildDiv.appendChild(deleteBtn)
    deleteBtn.addEventListener('click', () => {
        deleteSession(session._id)
    })
}

function formCalendarObject() {
    let calendarObj = {};
    let formattedDateKey
    sessions.forEach(session => {
        formattedDateKey = session.date.split('T')[0]
        if (!calendarObj[formattedDateKey]) {
            calendarObj[formattedDateKey] = [];
            calendarObj[formattedDateKey].push({time: session.time, booked: !!session.user, _id: session._id})
        } else {
            calendarObj[formattedDateKey].push({time: session.time, booked: !!session.user, _id: session._id})
        }
    })
    return calendarObj
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