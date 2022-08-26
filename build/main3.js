selectedDateObj = {};

function loaderStyle(){
    loaderDiv = document.getElementById("loader");
    calDiv = document.getElementById("calWrapper");
    timeDiv = document.getElementById("timeDiv");
    bookNowBtn = document.getElementById("bookNowBtn")
    calDiv.style.display = 'flex';
    loaderDiv.style.display = 'none';  
}

function resetStyle(){
    calDiv.style.display = 'none';
    loaderDiv.style.display = 'flex';  
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function renderAvailableTimes(days) {
    days.forEach(elem => {
        elem.style.color = "black"
        elem.addEventListener('click', (e) => {
            selectedDate = e.target.ariaLabel;
            selectedDate = new Date(selectedDate).toISOString().substring(0,10);
            let selectedTime;
            console.log(selectedDateObj[selectedDate], "selectedDateObj at selected date")
            let availableTimes = selectedDateObj[selectedDate]
            if (!availableTimes) { 
                timeDiv.innerHTML = "No Available Times :(" 
            }
            if (timeDiv.innerHTML) timeDiv.innerHTML = ""
            availableTimes.forEach(time => {
                let childDiv = document.createElement('div')
                childDiv.onclick = (e) => {
                    timeDiv.childNodes.forEach(node => {
                        node.style.backgroundColor = "white"
                        node.style.color = 'magenta'
                    })
                    e.target.style.backgroundColor = 'pink'
                    e.target.style.color = 'white'
                    selectedTime = e.target.innerHTML
                    bookNowBtn.value = JSON.stringify([selectedDate, selectedTime])
                }
                childDiv.innerHTML = time
                childDiv.className="availableTimes"
                timeDiv.appendChild(childDiv)
            })
        })
    })
}

function organizeTimes(availableDays, sessionDateandTime, cb, param) {
    availableDays.forEach(elem => {
        selectedDateObj[elem.substring(0,10)] = []
    })
    sessionDateandTime.map(elem => selectedDateObj[elem.date.substring(0,10)].push(elem.time))
    for (let key in selectedDateObj) {
        selectedDateObj[key] = selectedDateObj[key].sort()
    }
    availableDays = availableDays.map(elem => elem.substring(0,10));
    cb(param)
}

// setTimeout(() => {
//     let navArrows = document.getElementsByClassName('react-calendar__navigation__arrow');
//     navArrows = [...navArrows]
//     navArrows.forEach(arrow => arrow.addEventListener('click', () => {
//         timeDiv.innerHTML = ""
//         resetStyle();
//         loaderStyle();
//         styleCalendar();
//     }))
// }, 500)

function init() {
    let navArrows = document.getElementsByClassName('react-calendar__navigation__arrow');
    navArrows = [...navArrows]
    navArrows.forEach(arrow => arrow.addEventListener('click', () => {
        timeDiv.innerHTML = ""
        resetStyle();
        styleCalendar(loaderStyle)
    }))
    // styleCalendar(loaderStyle)
    styler = setInterval(()=> {
        styleCalendar(loaderStyle)
        if (styleCalendar(loaderStyle)) clearInterval(styler)
    }, 200)
}

load = setInterval(() => {
    if (document.readyState == "complete") {
        init()
        clearInterval(load)
    }
}, 100)

function styleCalendar(cb){
    let finishedStyling = false
    let count = 0
    let days = document.getElementsByClassName('react-calendar__month-view__days__day')
    days = [...days];
    console.log(days)
    let sessionEl = document.getElementById('sessions')
    //get unique days from sessions
    sessionDateandTime = JSON.parse(sessionEl.value);
    sessionDays = sessionDateandTime.map(elem => elem.date)
    availableDays = sessionDays.filter(onlyUnique);
    
    organizeTimes(availableDays, sessionDateandTime, renderAvailableTimes, days)
    
    days.forEach(day => {
        if (availableDays.includes(new Date([...day.children][0].ariaLabel).toISOString().substring(0,10))) {
            day.style.color = 'magenta';
            day.style.fontWeight = 'bold';
        }
        count++
    })
    if (count == days.length) {
        finishedStyling = true
        cb()
    }
    return finishedStyling
}