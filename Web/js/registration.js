
document.addEventListener("DOMContentLoaded", (e) => {
    let registrationForm = document.querySelector("#form");
    let email = document.querySelector("#email");
    let pwd = document.querySelector("#pwd");
    let comparePassword = document.querySelector("#pass");
    let errorMessage = document.querySelector("#error");
    let btn = document.querySelector("#reg-btn");
    let emailError = document.querySelector("#email-error");


    // Add event listener to email input for real-time validation
    email.addEventListener("input", async () => {
        const emailValue = email.value;
        emailError.textContent = "";
        var emailValidation = await emailCheck(emailValue);
        if(!emailValidation)
        {
            emailError.textContent = "Enter email in abc@xyz.com";
            emailError.style.color = "red";
            emailError.style.display = "block";
        }
        else
        {
            emailError.textContent = "";
            emailError.style.display = "none"; // Hide error message
        }
    })

    comparePassword.addEventListener("input", async () =>{
        if(pwd.value !== comparePassword.value)
        {
            errorMessage.textContent = "Password doesn't match";
            errorMessage.style.color = "red";
            btn.removeAttribute('disabled');
        }
        else
        {
            errorMessage.textContent = "";

        }
    })
    


    if(registrationForm)
    {
        registrationForm.addEventListener("submit", async (e) =>{
            errorMessage.textContent = "";

            let registrationDetails = {
                email : `${email.value}`,
                password : `${pwd.value}`,
                comparePassword : `${comparePassword.value}`
            }
            btn.setAttribute('disabled', 'true');
            e.preventDefault();
            regResponse(registrationDetails);
        })
    }

})


let regResponse = async (registrationDetails) => {
    const resp = await fetch("https://localhost:7173/api/auth/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationDetails),
    });
    console.log("Request sent now");

    if(resp.ok)
    {
        const data = await resp.json();
        localStorage.setItem('registeredEmail', data.data.email); //This is to save the user the stress of inputting email in the login page
        window.location.href = "/Web/login.html";
    }
    else if(resp.ok === 400)
    {
        const errorData = await response.json()
        console.log("Registration not successfull", errorData.message)
    }
    else
    {
        console.log(resp.message);
    }

}