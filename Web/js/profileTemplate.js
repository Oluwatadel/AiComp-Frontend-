const profileClick = document.querySelector("#profile-display");

//===========================================Profile================================================
profileClick.addEventListener("click", async () =>{
    console.log("Enter the profile");   
    const token = await getToken();
    console.log(token);
    await loadProfileTemplate('/Web/templates/profile-template.html');
    await populateProfileTemplate(token);         


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

async function populateProfileTemplate (token) {
    
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
    const profileEdit = document.querySelector("#profile-Edit");
    
    let profile = await getProfile(token);

    

    profileImage.src = await getProfilePic(token);
    profileImage.style.width = "260px";
    profileImage.style.borderRadius = "50px";



    console.log(profile.data);
    email.textContent = profile.data.email;
    phonenumber.textContent = profile.data.phoneNumber;
    nokFullName.textContent = profile.data.nokFullName;
    console.log(nokFullName);
    nokPhoneContact.textContent = profile.data.nokPhoneNumber;

    const dob = new Date(profile.data.age);
    age.textContent = `${dob.getFullYear()}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getDate().toString().padStart(2, '0')}`;

    gender.textContent = profile.data.gender;
    occupation.textContent = profile.data.occupation
    address.textContent = profile.data.address
    userFullName.textContent = `${profile.data.lastName} ${profile.data.firstName}`

    profileEdit.addEventListener("click", async () => {
        location.href = "./update-profile.html";
    })


    function CalculateAge(dob)
    {
        const today = new Date();
        const birthYear = today.getFullYear() - dob;

        return formattedDate;
    }

}
