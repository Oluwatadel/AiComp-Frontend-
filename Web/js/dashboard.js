document.addEventListener("DOMContentLoaded", async () => {
    const mood = document.querySelector("#mood");
    const chat = document.querySelector("#chat");
    const logout = document.querySelector("#logout");
    const mainContent = document.querySelector("#main-content");
    const dashboardLink = document.querySelector(".sidebar a.active");
    const name = document.querySelector("#name");
    const profilePics = document.querySelector(".profile-photo img");
    const date = document.querySelector("#date");
    
    //=======================================Chat To get Mood========================================
    const chatWindow = document.querySelector(".window-chat");
    const token = await getToken();

    //===============================================================================================
    date.value = dateTime(date);
    
    //======================================Name================================================
    let profileDetails = await getProfile();
    console.log(profileDetails.data);
    name.textContent = profileDetails.data.firstName;   

    //======================================Profile pics=========================================
    await getProfilePic(profilePics, token);
    

    //===============================================================================================
})


//=====================================================================================================================
async function getProfile(){
    let token = await getToken();
    console.log(token);
    const resp = await fetch("https://localhost:7173/api/p/p", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }            
    });
    const data = await resp.json();
    return data;
}



//=======================================================Load Chat================================================================

let getToken = async () => {
    const token = localStorage.getItem('jwt');
    return token;
}
//============================================================================================================================

async function getProfilePic(profilepic, token){
    console.log(token);
    const resp = await fetch("https://localhost:7173/api/p/profilephoto", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }            
    });

    if(resp.ok)
    {
        const imageBlob = await resp.blob();
        const imageUrl = await URL.createObjectURL(imageBlob);
        console.log(imageUrl);
        profilepic.src = imageUrl;
    }
    else
    {
        console.error('Failed to fetch image');
    }
}

//==================================================================Start of the Day===================================================
var startOfDay = async () => {
    var today = new Date().toISOString().split('T')[0];
    
}

//=========================================================================================================
function dateTime() {
    const newDate = new Date();
    // const formattedDate = 
    return newDate.toISOString().split('T')[0]; // This will give you the date in the format of yyyy-MM-dd;
}