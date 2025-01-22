import { getProfile } from "./dashboard.js";
import { response } from "./gateway.js"; 


    document.addEventListener("DOMContentLoaded", (e) => {
        let loginForm = document.querySelector(".login100-form.validate-form");
        let loginPassword = document.querySelector(".input100.password");
        let submitBtn = document.querySelector(".login100-form-btn");
        let registerBTN = document.querySelector("#create-account");
                
        let loginUserName = document.querySelector(".input100.email");
        let email = localStorage.getItem('registeredEmail');
        if(email)
        {
            console.log(email);
            loginUserName.value = email;
            localStorage.removeItem('registeredEmail'); 
        }

        loginUserName.addEventListener('input', () =>{
            const emailValue = loginUserName.value;
            const emailError = document.querySelector("#emailError");

            if(!validateEmail(emailValue)){
                emailError.textContent = "Enter email in the format abc@xyz.com";
                emailError.style.color = "red";
                emailError.style.display = "block";
                submitBtn.disabled = true;
            }
            else
            {
                emailError.textContent = "";
                emailError.style.display = "none";
                submitBtn.disabled = false;

            }
        });
        
        if(loginForm)
            {
                loginForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const loginObj = {
                        email: loginUserName.value,
                        password: loginPassword.value
                    };
                    
                    const shareData = await response(loginObj);
                    
                    if(shareData.ok)
                    {
                        const response = await shareData.json();
                        console.log(response)
                        localStorage.removeItem('jwt');
                        localStorage.setItem('jwt', response.data.accessToken.result);
                       //Check if the user has a e
                       const token = response.data.accessToken.result;
                       const userProfile = await getProfile(token);
                       console.log(userProfile);
                        if(userProfile){
                            Swal.fire({
                                title: 'Welcome!',
                                text: `Welcome ${userProfile.data.firstName}`,
                                icon: 'success',
                                confirmButtonText: 'OK',
                                timer: 3000,  // Close modal after 3 seconds
                                willClose: () => {
                                   location.href = '/Web/dashboard.html';  // Redirect after modal closes
                                }
                            });          
                        } 
                        else
                        {
                            Swal.fire({
                                title: 'Welcome!',
                                text: `Welcome ${loginUserName.value}`,
                                icon: 'success',
                                confirmButtonText: 'OK',
                                timer: 3000,  // Close modal after 3 seconds
                                willClose: () => {
                                    location.href = '/Web/create-profile.html';  // Redirect after modal closes
                                }
                            });   // Redirect to the profile creation page                             
                        }

                    }
                    else if(shareData.statusCode === 401 || !shareData.ok)
                    {
                        Swal.fire({
                            title: 'Oops...',
                            text: 'Sorry!\nEmail or Password not valid',
                            icon: 'error',
                            confirmButtonText: 'Try again',
                            timer: 3000,  // Close modal after 3 seconds
                            willClose: () => {
                            }
                        });   
                    }

        
                });
                
            }
            else
            {
                console.error("Login form not found");
            }
        
            registerBTN.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = "/Web/registration.html"
            });
    })

    let validateEmail = (email) =>{
        const regexCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexCheck.test(email);
    }





