submitBtn = document.getElementById('submitBtn')

submitBtn.addEventListener('click', () => {
    sendMail()
    clearField()
    success()
})

function sendMail() {
    var tempParams = {
        name: document.getElementById('name').value,
        user_email: document.getElementById('user_email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
    }
    console.log(tempParams)
    emailjs.send('service_n076dvx','template_tvkawyb', tempParams, 'QvQhpUv1vzpBZoh5e')
    .then(function(res){
        console.log('success',res.status)
    })
}

function clearField() {
    document.getElementById('name').value = ""
    document.getElementById('user_email').value = ""
    document.getElementById('subject').value = ""
    document.getElementById('message').value = ""
}

function success() {
    Swal.fire({
      icon: "success",
      title: "Thank you...",
      text: "We'll get back to you shortly!",
    });
}