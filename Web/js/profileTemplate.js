const profileClick = document.querySelector("#profile-display");

//===========================================Profile================================================
profileClick.addEventListener("click", async () =>{
    console.log("Enter the profile");   
    await loadProfileTemplate('/Web/templates/profile-template.html');
    populateProfileTemplate();         


})

//====================================================Load Profile template to the dashBoard=================================
async function loadProfileTemplate(templatePath)
{
    const container = document.querySelector(".container");
    const main = document.querySelector("main");
    const right = document.querySelector(".right");

    await fetch(templatePath)
        .then(response => response.text())
        .then(html => {
            container.style.gridTemplateColumns = "14rem auto";
            main.innerHTML = "";
            main.innerHTML = html;
            const date = document.querySelector("#date");
            date.value = dateTime();
            
        })
        .catch(error => console.error('Errorloading Template', error));
}
//============================================================================================================================

async function populateProfileTemplate () {
    
    const profileImage = document.querySelector("#profile-img");
    const email = document.querySelector("#email");
    const phonenumber = document.querySelector("#phonenumber");
    const nokFullName = document.querySelector("#nok-fullName");
    const nokPhoneContact = document.querySelector("#nok-contact");
    const age = document.querySelector("#age");
    const gender = document.querySelector("#gender");
    const occupation = document.querySelector("#occupation");
    const address = document.querySelector("#address");
    const userFullName = document.querySelector("#fullname");
    
    let profile = await getProfile();

    

    profileImage.src = await getProfilePic(await getToken());
    profileImage.style.width = "200px";
    profileImage.style.borderRadius = "50px";



    console.log(profile.data);
    email.textContent = profile.data.email;
    phonenumber.textContent = profile.data.phoneNumber;
    nokFullName.textContent = profile.data.nokFullName;
    console.log(nokFullName);
    nokPhoneContact.textContent = profile.data.nokPhoneNumber
    age.textContent = profile.data.age;
    gender.textContent = profile.data.gender;
    occupation.textContent = profile.data.occupation
    address.textContent = profile.data.address
    userFullName.textContent = `${profile.data.lastName} ${profile.data.firstName}`

}
