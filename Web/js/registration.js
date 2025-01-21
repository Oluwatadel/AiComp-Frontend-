import { showModal } from "./utils.js";
import {registration, emailCheck} from "./gateway.js"
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


async function regResponse(registrationDetails) {
    const resp = await registration(registrationDetails);
    console.log(resp);

    if(resp.status)
    {
        const data = resp.data
        localStorage.setItem('registeredEmail', data.data.email); //This is to save the user the stress of inputting email in the login page
        showModal(true, "Registration successful");
        window.location.href = "/Web/login.html";
    }
    else
    {
        const errorData = resp.error;
        showModal(false, errorData.message);
    }

}