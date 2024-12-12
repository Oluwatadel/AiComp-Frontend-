const profileClick = document.querySelector("#profile-display");

//===========================================Profile================================================
profileClick.addEventListener("click", async () =>{
    console.log("Enter the profile");   
    await loadProfileTemplate('/Web/templates/profile-template.html');
            

})

//====================================================Load Profile template to the dashBoard=================================
async function loadProfileTemplate(templatePath)
{
    const container = document.querySelector(".container");
    const main = document.querySelector("main");
    const right = document.querySelector(".right");

    fetch(templatePath)
        .then(response => response.text())
        .then(html => {
            container.style.gridTemplateColumns = "14rem auto";
            main.innerHTML = "";
            main.innerHTML = html;
            const date = document.querySelector("#date");
            populateProfileTemplate();
            date.value = dateTime();
            
        })
        .catch(error => console.error('Errorloading Template', error));
}
//============================================================================================================================

async function populateProfileTemplate () {
    
    const profileImage = document.querySelector("profile-pics-img");
    const email = document.querySelector("#email");
    const phonenumber = document.querySelector("#phonenumber");
    const nokFullName = document.querySelector("#nok-fullName");
    const nokPhoneContact = document.querySelector("#nok-contact");
    const age = document.querySelector("#age");
    const gender = document.querySelector("#gender");
    const occupation = document.querySelector("#occupation");
    const address = document.querySelector("#address");
    
    let profile = await getProfile();

    console.log(profile)

    profileImage.src = profile.data.profilePics;
    email.textContent = profile.data.email;
    phonenumber = profile.data.phoneNumber;
    nokFullName = profile.data.fullNameNOK;
    nokPhoneContact = profile.data.contactOfNOK
    age = profile.data.age;
    gender = profile.data.gender;
    occupation = profile.data.occupation
    address = profile.data.address

}
