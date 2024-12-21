document.addEventListener("DOMContentLoaded", async () => {
    const mood = document.querySelector("#mood");
    const logout = document.querySelector("#logout");
    const mainContent = document.querySelector("#main-content");
    const dashboardLink = document.querySelector(".sidebar a.active");
    const name = document.querySelector("#name");
    const profilePics = document.querySelector(".profile-photo img");
    const date = document.querySelector("#date");
    const chatWindow = document.querySelector("#chat-window");
    const messageInput = document.querySelector("#message-input");
    const send = document.querySelector("#send-btn");

    


    try {
        // Set current date
        date.value = dateTime();

        // Retrieve token
        const token = await getToken();
        console.log("Token:", token);

        // Fetch user profile details
        const profileDetails = await getProfile(token);
        if (profileDetails && profileDetails.data) {
            name.textContent = profileDetails.data.firstName;
        }

        // Fetch user profile picture
        const profPics = await getProfilePic(token);
        if (profPics) {
            profilePics.src = profPics;
        }

        messageInput.setAttribute("autocomplete", "off"); //Suggestion of previous input not needed

        // Fetch daily mood messages
        await fetchMoodMessages(token, profPics, chatWindow);
        send.addEventListener("click", () => {
            handleSend(messageInput, token);
        });

        messageInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevents default behavior of form submission if inside a form
                handleSend(messageInput, token);
            }
        });

    } catch (error) {
        console.error("Error during page initialization:", error);
    }


});

//================================================== Helper Functions ============================================

// Get token from local storage
async function getToken() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("No token found in local storage.");
    }
    return token;
}
//==================================================================================================================

// Fetch profile details
async function getProfile(token) {
    const resp = await fetch("https://localhost:7173/api/p/p", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (resp.ok) {
        return await resp.json();
    } else {
        console.error("Failed to fetch profile details");
    }
}

// Fetch profile picture
async function getProfilePic(token) {
    const resp = await fetch("https://localhost:7173/api/p/profilephoto", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (resp.ok) {
        const imageBlob = await resp.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        return imageUrl;
    } else {
        console.error("Failed to fetch profile picture");
        return "./images/defaultProfile.png"; // Fallback image
    }
}

// Fetch mood messages
async function fetchMoodMessages(token, profilePics, chatWindow) {
    const moodMessagesForTodayUrl = "https://localhost:7173/api/message/moodmessages";

    const todaysMood = await fetch(moodMessagesForTodayUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (todaysMood.ok) {
        const data = await todaysMood.json();
        console.log(data);

        // Clear the chat window
        chatWindow.innerHTML = "";

        chatWindow.style.flex = "1";
        chatWindow.style.padding = "20px";
        chatWindow.style.overflowY = "auto";
        chatWindow.style.backgroundColor = "#e5ddd5";
        chatWindow.style.borderTopLeftRadius = "var(--card-border-radius)";
        chatWindow.style.borderTopRightRadius = "var(--card-border-radius)";
        chatWindow.style.height = "28vh";

        // Check if data exists
        if (data.data.length > 0 && Array.isArray(data.data)) 
        {
            // const messageDiv = document.createElement("div");
            //     messageDiv.className = "message right";
            //     messageDiv.style.backgroundColor = "#dcf8c6";
            //     messageDiv.style.alignSelf = "flex-end";
            //     messageDiv.style.marginLeft = "auto";
            //     messageDiv.style.textAlign = "left";
            //     messageDiv.style.marginTop = "2.5rem";
            //     messageDiv.style.marginBottom = "1.5rem";
            data.data.forEach((inf) => {
            if(inf.role == 1)
            {
                const messageDiv = document.createElement("div");
                messageDiv.className = "message right";
                messageDiv.style.backgroundColor = "#dcf8c6";
                messageDiv.style.alignSelf = "flex-end";
                messageDiv.style.marginLeft = "auto";
                messageDiv.style.textAlign = "left";
                messageDiv.style.marginTop = "1.5rem";
                messageDiv.style.marginBottom = "1.5rem";

                const message = `<p id="message">${inf.messageContent}</p>
                <img id="right-img" src=${profilePics} alt="" />
                <span class="timestamp" id="timespan-right">${formatDate(inf.date)}</span>`;

                messageDiv.innerHTML = message;                
                chatWindow.appendChild(messageDiv);
            }
            else if(inf.role == 0)
            {
                const messageDiv = document.createElement("div");
                messageDiv.className = "message left";
                messageDiv.style.backgroundColor = "#fff";
                messageDiv.style.alignSelf = "flex-start";
                messageDiv.style.marginRight = "auto";
                messageDiv.style.textAlign = "left";
                messageDiv.style.marginBottom = "1.5rem";

                
                messageDiv.innerHTML = `<p id="message-left">${inf.messageContent}</p>
                <img id="left-img" src="./images/AiComp.png" alt="" />
                <span class="timestamp" id="timespan-left">${formatDate(inf.date)}</span>`;

                
                // messageTag.style.color = "black";

                
                chatWindow.appendChild(messageDiv);
            }         
            });
            const question = await getMoodQuestion(token);
            if(question.status == "Error" || question.status == "Unsuccessful")
            {
                const questionErrorMessage = question.message;
                const errorMessage = document.createElement("p");
                errorMessage.id="error-message";
                errorMessage.textContent = `${questionErrorMessage}`;
                chatWindow.appendChild(errorMessage);
                errorMessage.style.color = "red";
                errorMessage.style.textAlign = "center";

            }
            console.log(question);
            if(question && question.data && question.data.question)
            {
                const questionData = question.data;
                const messageDiv = document.createElement("div");
                messageDiv.className = "message left";
                messageDiv.style.backgroundColor = "#fff";
                messageDiv.style.alignSelf = "flex-start";
                messageDiv.style.marginRight = "auto";
                messageDiv.style.textAlign = "left";
                messageDiv.style.marginBottom = "1.5rem";
                messageDiv.innerHTML = `<p id="message-left">${questionData.question}</p>
                <img id="left-img" src="./images/AiComp.png" alt="" />
                <span class="timestamp" id="timespan-left">${formatDate(questionData.timestamp)}</span>`;
            }
        }
        else 
        {
            console.log("No messages found for today.");
            const question = await getMoodQuestion(token);
            const questionData = question.data
            console.log(question);
            const messageDiv = document.createElement("div");
            messageDiv.className = "message left";
            messageDiv.style.backgroundColor = "#fff";
            messageDiv.style.alignSelf = "flex-start";
            messageDiv.style.marginRight = "auto";
            messageDiv.style.textAlign = "left";
            messageDiv.style.marginBottom = "1.5rem";
            messageDiv.innerHTML = `<p id="message-left">${questionData.question}</p>
            <img id="left-img" src="./images/AiComp.png" alt="" />
            <span class="timestamp" id="timespan-left">${formatDate(questionData.timestamp)}</span>`;
        }
    } else {
        console.error("Failed to fetch mood messages");
        const question = await getMoodQuestion(token);
        const questionData = question.data
        console.log(question);
        const messageDiv = document.createElement("div");
        messageDiv.className = "message left";
        messageDiv.style.backgroundColor = "#fff";
        messageDiv.style.alignSelf = "flex-start";
        messageDiv.style.marginRight = "auto";
        messageDiv.style.textAlign = "left";
        messageDiv.style.marginBottom = "1.5rem";
        messageDiv.innerHTML = `<p id="message-left">${questionData.question}</p>
            <img id="left-img" src="./images/AiComp.png" alt="" />
            <span class="timestamp" id="timespan-left">${formatDate(questionData.timestamp)}</span>`
    }
}

// Fetch mood question if no messages are found
async function getMoodQuestion(token) {
    const moodAnalysisQuestionUrl = "https://localhost:7173/api/chat/questions";

    const resp = await fetch(moodAnalysisQuestionUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (resp.ok) {
        const data = await resp.json();
        return data;
    } else {
        console.error("Failed to fetch mood question.");
    }
}

// Helper to get the current date in yyyy-MM-dd format
function dateTime() {
    const newDate = new Date();
    return newDate.toISOString().split("T")[0];
}


function formatDate(date)
{
    const newDate = new Date(date);
    const time = newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return time;
    
}

async function respondToMoodAnalysisQuestion(response, token)
{
    const data = fetch("https://localhost:7173/api/chat/userresponse", {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(response.value) 
    });

    if(data.ok) 
    {
        const resp = await data.json();
        console.log(resp)
        return resp;
    }
    console.log("error")
}

async function handleSend(messageInput, token) {
    const response = await respondToMoodAnalysisQuestion(messageInput, token);
    if (response.status == "Unsuccessful" && response.message == "Today's mood has been analysed! Come back tomorrow tomorrow") {
        messageInput.disabled = true;
    }
    console.log(response);
    messageInput.value = "";

    // User message
    const messageDiv = document.createElement("div");
    messageDiv.className = "message right";
    messageDiv.style.backgroundColor = "#dcf8c6";
    messageDiv.style.alignSelf = "flex-end";
    messageDiv.style.marginLeft = "auto";
    messageDiv.style.textAlign = "left";
    messageDiv.style.marginTop = "1.5rem";
    messageDiv.style.marginBottom = "1.5rem";

    const message = `<p id="message">${response.data.userResponse}</p>
        <img id="right-img" src=${profPics} alt="" />
        <span class="timestamp" id="timespan-right">${response.data.timespan}</span>`;
    messageDiv.innerHTML = message;
    chatWindow.appendChild(messageDiv);

    // AI question
    const question = getMoodQuestion(token);
    const questionData = question.data;
    console.log(question);

    const questionDiv = document.createElement("div");
    questionDiv.className = "message left";
    questionDiv.style.backgroundColor = "#fff";
    questionDiv.style.alignSelf = "flex-start";
    questionDiv.style.marginRight = "auto";
    questionDiv.style.textAlign = "left";
    questionDiv.style.marginBottom = "1.5rem";

    const questionMessage = `<p id="message-left">${questionData.question}</p>
        <img id="left-img" src="./images/AiComp.png" alt="" />
        <span class="timestamp" id="timespan-left">${formatDate(questionData.timestamp)}</span>`;
    questionDiv.innerHTML = questionMessage;
    chatWindow.appendChild(questionDiv);
}