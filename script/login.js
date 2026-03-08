document.getElementById("btn-login")
    .addEventListener('click', function () {
        const  inputUsername = document.getElementById("username")
        const  username= inputUsername.value;
        const inputPassword = document.getElementById("password")
        const  password= inputPassword.value;
        if (username == "admin" && password == "admin123") {
            alert("Login Successful");
            window.location.assign("home.html")
        }
        else {
            alert("Login Failed");
            return;
        }
    });