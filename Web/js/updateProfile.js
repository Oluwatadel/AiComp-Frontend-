import {getToken, getProfile, getProfilePic} from './dashboard.js';
document.addEventListener("DOMContentLoaded", async () => {
    const profileImageInput = document.querySelector("#profilePicInput");
    const profileImage = document.querySelector("#profileImage");
    const surName = document.querySelector("#surname");
    const firstName = document.querySelector("#firstname");
    const addressofUser = document.querySelector("#address");
    const phoneNumber = document.querySelector("#phonenumber");
    // const profilePics = document.querySelector("#profilePicInput");
    const genderOfUser = document.querySelector("#gender");
    const occupationOfUser = document.querySelector("#occupation");
    const fullnameNok = document.querySelector("#fullnamenok");
    const nokPhonenumber = document.querySelector("#nokphonenumber");
    const submitBtn = document.querySelector("#reg-btn");
    const form = document.querySelector("#form");
    const errorDisplay = document.querySelector("#error");


    const token = await getToken();
    console.log(`the token is ${token}`);
    const profile = await getProfile(token);
    if(profile)
    {
        console.log(profile);
        firstName.value = profile.data.firstName;
        surName.value = profile.data.lastName;
        addressofUser.value = profile.data.address;
        phoneNumber.value = profile.data.phoneNumber;

        const dob = new Date(profile.data.age).toISOString().split('T')[0];
        const profilePics = await getProfilePic(token);

        genderOfUser.value = profile.data.gender;
        occupationOfUser.value = profile.data.occupation;
        fullnameNok.value = profile.data.nokFullName;
        nokPhonenumber.value = profile.data.nokPhoneNumber;
        profileImage.src = profilePics;

        
    }


    form.addEventListener("submit", (e) =>{
        console.log("Entered");
        e.preventDefault();
        console.log(token);
//formData should be used because JsonStrigify() wont work on file so formData should be created instead of object

        const formData = new FormData(form);
        formData.append("FirstName", firstName.value);
        formData.append("LastName", surName.value);
        formData.append("Gender", genderOfUser.value);
        formData.append("Occupation", occupationOfUser.value);
        formData.append("Address", addressofUser.value);
        formData.append("PhoneNumber", phoneNumber.value);
        // formData.append("FullNameOfNextOfKin", fullnameNok.value);
        // formData.append("ContactOfNextOfKin", nokPhonenumber.value);

        //Adding profile image to formData
        console.log(profileImageInput);
        if(profileImageInput.files[0])
        {
            formData.append("ProfilePicture", profileImageInput.files[0]);
            console.log(profileImageInput.files[0])
            
        }
        fetch("https://localhost:7173/api/p/profile",{
            method: "PUT",
            headers: {
                'Authorization':`Bearer ${token}`
            },
            body: formData,
        }).then(resp => {
            console.log(`Bearer ${token}`);

            if(!resp.ok)
            {
                return resp.json().then(errorData => {
                    Swal.fire({
                        title: 'Oops...',
                        text: errorData.message,
                        icon: 'error',
                        confirmButtonText: 'Try again',
                        timer: 3000,  // Close modal after 3 seconds
                        willClose: () => {
                        }
                    }); 
                });
            }
            return resp.json(); // Parse response JSON on success
        })
        .then(data => {
            Swal.fire({
                title: 'Success!',
                text: `${data.message}`,
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,  // Close modal after 3 seconds
                willClose: () => {
                   location.href = '/Web/dashboard.html';  // Redirect after modal closes
                }
        })
        .catch(error => {
            errorDisplay.textContent = error.message;
            errorDisplay.style.color = "red";
            Swal.fire({
                title: 'Oops...',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Try again',
                timer: 3000,  // Close modal after 3 seconds
                willClose: () => {
                }
            });
        });
    })


    profileImageInput.addEventListener("change", function(){
        const file = this.files[0];
        if(file)
        {
            const reader = new FileReader();
            reader.onload = function(e){
                profileImage.src = e.target.result
            }

            reader.readAsDataURL(file)
        }
    })
})
})