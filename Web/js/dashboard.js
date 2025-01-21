import { getWeeklyMoodLogs, formatDateToShort, mappEmotiontoAValue } from './mood.js';
import { createChart } from './chartUtils.js';
import { loadJournalTemplate,fetchJournals,journalFetchandPopulation,addJournal } from './journal.js';

document.addEventListener("DOMContentLoaded", async () => {
    const logout = document.querySelector("#logout");
    const dashboardLink = document.querySelector(".sidebar a.active");
    const name = document.querySelector("#name");
    const profilePics = document.querySelector(".profile-photo img");
    const date = document.querySelector("#date");
    const chatWindow = document.querySelector("#chat-window");
    const messageInput = document.querySelector("#message-input");
    const send = document.querySelector("#send-btn");
    const dateofLastMoodLog = document.querySelector(".last-log");
    const update = document.querySelector("#updateContainer");
    const journal = document.querySelector("#journal");


    try {
        // Set current date
        if(date)
            date.textContent = dateTime();

        // Retrieve token
        const token = await getToken();
        const moodLogs = await getWeeklyMoodLogs(token);
        if (moodLogs?.data && Array.isArray(moodLogs.data) && moodLogs.data.length > 0) {
            // Access the last mood log
            const lastMood = moodLogs.data[moodLogs.data.length - 1];
            if(dateofLastMoodLog)
                dateofLastMoodLog.textContent = await formatDateToShort(lastMood.timestamp);
        }
        // Fetch user profile details
        const profileDetails = await getProfile(token);
        if(name)
            if (profileDetails && profileDetails.data) {
                name.textContent = profileDetails.data.firstName;
            }

        // Fetch user profile picture
        const profPics = await getProfilePic(token);
        if (profPics && profilePics) {
            profilePics.src = profPics;
        }

        //=====================================================graphs===============================================
        const insight = document.querySelector(".insights");
        if(insight)
        {
            insight.innerHTML = "";
            const weeklychart = document.createElement("div");
            weeklychart.className = "logs";
            const moodlogs = await getWeeklyMoodLogs(token);
            const weeklyPiechart = document.createElement("div");
            weeklyPiechart.className = "pielog";
            if(moodlogs.status)
            {
                const moodLogData = moodlogs.data.data; 
                const emotionalData = [];
                const intensityData = [];
                const dateOfEmotion = [];
                const listOfEmotionExperienceForTheWeek = {};
                let properties = Object.keys(listOfEmotionExperienceForTheWeek);
                let values = Object.values(listOfEmotionExperienceForTheWeek);
            
                if(moodLogData && Array.isArray(moodLogData))
                {
                    const data = moodLogData;
                    for (let i = 0; i < data.length; i++) {
                    const log = data[i];
                    const inf = await mappEmotiontoAValue(log.emotion);
                    console.log(inf);
                    emotionalData[i] = inf;
                    intensityData[i] = log.intensity;
                    if(!listOfEmotionExperienceForTheWeek[log.emotion])
                    {
                        listOfEmotionExperienceForTheWeek[log.emotion] = 1
                    }
                    else
                    {
                            listOfEmotionExperienceForTheWeek[log.emotion] += 1;
                    }
                    dateOfEmotion[i] = await formatDateToShort(log.timestamp);
                    properties = Object.keys(listOfEmotionExperienceForTheWeek);
                    values = Object.values(listOfEmotionExperienceForTheWeek);
                }
                }

                
                const LineChart = document.createElement("canvas");
                const chartLabel = 'Emotion';
                const EmotionlineGraph = createChart(LineChart, "emotionalChart",'line',dateOfEmotion, emotionalData,chartLabel);
                const textSpan = document.createElement("span");
                textSpan.className = "text-muted"
                textSpan.textContent = "Weekly emotion"

                LineChart.style.width = "445px"
                textSpan.style.borderRadius = 0;
                textSpan.style.fontSize = "1rem";
                textSpan.style.display = "block";
                textSpan.style.textAlign = "center";
                textSpan.style.background = "none";
                textSpan.style.color = "#03115a";

                weeklychart.appendChild(EmotionlineGraph);
                weeklychart.appendChild(textSpan);


                
                const pieChart = document.createElement("canvas");
                const graphLabel = 'Occurence of Emotion';
                const EmotionpieGraph = createChart(pieChart, "emotionalPieChart",'doughnut',properties, values, graphLabel);
                const textSpan2 = document.createElement("span");
                textSpan2.className = "text-muted"
                textSpan2.textContent = "Weekly emotion"

                EmotionpieGraph.style.width = "270px";
                EmotionpieGraph.style.height = "250px";

                weeklyPiechart.appendChild(EmotionpieGraph)
                insight.appendChild(weeklychart);
                insight.appendChild(weeklyPiechart);
            }   
            else
            {

                const weeklychartMessage = document.createElement("h3");
                weeklychartMessage.className = "span-message";
                weeklychartMessage.textContent = "No Mood Log yet";

                const weeklyPiechartMessage = document.createElement("h3");
                weeklyPiechartMessage.className = "span-message";
                weeklyPiechartMessage.textContent = "No Mood Log yet";

                weeklychart.appendChild(weeklychartMessage);
                weeklyPiechart.appendChild(weeklyPiechartMessage);

                insight.appendChild(weeklychart);
                insight.appendChild(weeklyPiechart);

                insight.style.gridTemplateColumns = "none"
            }   
        }



        // Fetch daily mood messages
        if(chatWindow)
        {
            await fetchMoodMessages(token, profPics, chatWindow, messageInput);
            messageInput.setAttribute("autocomplete", "off"); //Suggestion of previous input not needed
        if(messageInput.value === "")
            send.disabled = true;
        if(messageInput && send)
        {
            send.disabled = false;

            send.addEventListener("click", () => {
                handleSend(chatWindow, messageInput, token, profPics);
            });

            messageInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevents default behavior of form submission if inside a form
                    handleSend(chatWindow, messageInput, token, profPics);
                }
            });

            const scrollElementHTML = "<main></main>";
            chatWindow.insertAdjacentHTML("beforeend", scrollElementHTML);
            const scrollElement = chatWindow.querySelector("main");
            scrollElement.scrollIntoView();
        }
        

    //==========================================================Update section=====================================================
            update.innerHTML = "";
            const notifications = await LoadNotifications(token);
            console.log(notifications)
            if(!notifications.status)
            {
                const innermessage = document.createElement("p");
                innermessage.textContent = "No update";
                update.appendChild(innermessage);
            }
            else
            {
                if(notifications.data && Array.isArray(notifications.data))
                {
                    const userNotifications = notifications.data                        
                    for(let i = 0; i < userNotifications.length; i++)
                    {
                        const innerUpdateContainer = document.createElement("div");
                        innerUpdateContainer.className = "update";
                    //=========================recent update profile pic========================= 
                        const profilePicture = document.createElement("div");
                        profilePicture.className = "profile-photo";
        
                        const profileImg = document.createElement("img");
                        profileImg.src = profPics;
                    //=================Append the profileImg in the div profilepicture=====
                        profilePicture.appendChild(profileImg);
        
                    //=========================recent update message========================= 
                        const message = document.createElement("div");
                        message.className = "message";
        
                        const messageTag = document.createElement("p");
                            // messageTag.className = "messageTag";
                        messageTag.textContent = userNotifications[i].description;
                        message.appendChild(messageTag);
        
                        const textMuted = document.createElement("small");
                        textMuted.className = "text-muted";
                        textMuted.textContent = await presentTimeAgo(userNotifications[i].timestamp);
                        message.appendChild(textMuted);
        
                     //=============================Append all child to outer contaier==============================
                        innerUpdateContainer.appendChild(profilePicture);
                        innerUpdateContainer.appendChild(message);
        
                    //=========================Append inner container to the inner container========================= 
                        update.appendChild(innerUpdateContainer);
                    }
                }
            }        
        }
        //==================================================journal ======================================================
        if (journal) {
            journal.addEventListener("click", async () => {
                await loadJournalTemplate();
                await journalFetchandPopulation(token);
        
                const journalTitle = document.querySelector("#journalTitle");
                const addJournalBtn = document.querySelector("#addJournalBtn");
                const deleteJournalBtn = document.querySelector("#deleteJournalBtn");
                const journalContent = document.querySelector("#journalTextArea");
        
                if (journalContent && journalTitle && addJournalBtn) {
                    journalContent.addEventListener("input", () => {
                        addJournalBtn.disabled = !(journalTitle.value.trim() && journalContent.value.trim());
                    });
        
                    journalTitle.addEventListener("input", () => {
                        addJournalBtn.disabled = !(journalTitle.value.trim() && journalContent.value.trim());
                    });
        
                    addJournalBtn.addEventListener("click", async () => {
                        const journalRequest = {
                            title: journalTitle.value,
                            content: journalContent.value
                        };
        
                        const response = await addJournal(token, journalRequest);
        
                        if (response.status) {
                            Swal.fire({
                                title: 'Success!',
                                text: 'Journal added successfully',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                timer: 3000,  // Close modal after 3 seconds
                            });
                            await journalFetchandPopulation(token);
                        }
                        else
                        {
                            console.log(response)
                            const errorMessage = response.data.message;
                            Swal.fire({
                                title: 'Oops...',
                                text: errorMessage,
                                icon: 'error',
                                confirmButtonText: 'Try again',
                                timer: 3000,  // Close modal after 3 seconds
                                willClose: () => {
                                }
                            });
                        }
                    });
                }
            });
        }
        
    } catch (error) {
        console.error("Error during page initialization:", error);
    }
});

//================================================== Helper Functions ============================================

// Get token from local storage
export async function getToken() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("No token found in local storage.");
    }
    return token;
}

export async function presentTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000); // Difference in seconds

    if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}
//==================================================================================================================

// Fetch profile details
export async function getProfile(token) {
    const resp = await fetch("https://localhost:7173/api/p/p", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (resp.ok) {
        return await resp.json();
    } else {
        console.error("Failed to fetch profile details");
    }
}

// Fetch profile picture
export async function getProfilePic(token) {
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
async function fetchMoodMessages(token, profilePics, chatWindow, messageInput) {
    const moodMessagesForTodayUrl = "https://localhost:7173/api/message/moodmessages";

    const todaysMood = await fetch(moodMessagesForTodayUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (todaysMood.ok) {
        const data = await todaysMood.json();
        console.log(data);

        // Clear the chat window
        if(chatWindow)
        {
            chatWindow.innerHTML = "";
            chatWindow.style.flex = "1";
            chatWindow.style.padding = "20px";
            chatWindow.style.overflowY = "auto";
            chatWindow.style.backgroundColor = "#e5ddd5";
            chatWindow.style.borderTopLeftRadius = "var(--card-border-radius)";
            chatWindow.style.borderTopRightRadius = "var(--card-border-radius)";
            chatWindow.style.height = "28vh";
        }
        

        // Check if data exists
        if (Array.isArray(data.data) && data.data.length > 0)
        {
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
                if(chatWindow)
                    chatWindow.appendChild(messageDiv);
            }
            else if(inf.role == 0 )
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

                if(chatWindow)
                    chatWindow.appendChild(messageDiv);
            }
            });
            
            const lastItem = data.data[data.data.length - 1]
            if((data.data.length > 0 || data.data.length < 8) && lastItem.role == 1)
            {
                const question = await getMoodQuestion(token);
                if(question.status == "Error" || question.status == "Unsuccessful")
                {
                    const questionErrorMessage = question.message;
                    const errorMessage = document.createElement("p");
                    errorMessage.id="error-message";
                    errorMessage.textContent = `${questionErrorMessage}`;
                    if(chatWindow)
                        chatWindow.appendChild(errorMessage);
                    errorMessage.style.color = "red";
                    errorMessage.style.textAlign = "center";

                }
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
            
//===============================================
            if(data.data.length === 8)
            {
                messageInput.disabled = true;
                const returnedResult = await AnalyseUsersMood(token);
                console.log(returnedResult)
                
                if(returnedResult && (returnedResult.status || returnedResult.data))
                {
                    const dataReturned = returnedResult.data
                    const messageDiv = document.createElement("div");
                    messageDiv.className = "message left";
                    messageDiv.style.backgroundColor = "#fff";
                    messageDiv.style.alignSelf = "flex-start";
                    messageDiv.style.marginRight = "auto";
                    messageDiv.style.textAlign = "left";
                    messageDiv.style.marginBottom = "1.5rem";
                    messageDiv.innerHTML = `<p id="message-left">${dataReturned}</p>
                        <img id="left-img" src="./images/AiComp.png" alt="" />
                        <span class="timestamp" id="timespan-left">${formatDate(new Date())}</span>`;
                    chatWindow.appendChild(messageDiv)
                }
            }
        }
        else
        {
            try
            {
                const question = await getMoodQuestion(token);
                const questionData = question.data
                // console.log(question);
                const messageDiv = document.createElement("div");
                messageDiv.className = "message left";
                messageDiv.style.backgroundColor = "#fff";
                messageDiv.style.alignSelf = "flex-start";
                messageDiv.style.marginRight = "auto";
                messageDiv.style.textAlign = "left";
                messageDiv.style.marginBottom = "1.5rem";
                messageDiv.innerHTML = `<p id="message-left">${questionData}</p>
                <img id="left-img" src="./images/AiComp.png" alt="" />
                <span class="timestamp" id="timespan-left">${formatDate(new Date())}</span>`;
                chatWindow.appendChild(messageDiv);
            }
            catch (error)
            {
                const questionErrorMessage = error;
                const errorMessage = document.createElement("p");
                errorMessage.id="error-message";
                errorMessage.textContent = `${questionErrorMessage}`;
                chatWindow.appendChild(errorMessage);
                errorMessage.style.color = "red";
                errorMessage.style.textAlign = "center";
            }
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
            <span class="timestamp" id="timespan-left">${formatDate(questionData.timestamp)}</span>`;
        chatWindow.appendChild(messageDiv);

        
    }
        const scrollElementHTML = "<main></main>";
        chatWindow.insertAdjacentHTML("beforeend", scrollElementHTML);
        const scrollElement = chatWindow.querySelector("main");
        scrollElement.scrollIntoView()
}



// Helper to get the current date in yyyy-MM-dd format
export function dateTime() {
    const newDate = new Date();
    return newDate.toISOString().split("T")[0];
}


export function formatDate(date)
{
    const newDate = new Date(date);
    const time = newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return time;

}

async function respondToMoodAnalysisQuestion(response, token)
{
    try
    {
        const data = await fetch("https://localhost:7173/api/chat/userresponse", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(response)
        });

        if(!data.ok)
        {
            const resp = await data.json();
            console.error("error", resp)
            return resp;
        }

        const resp = await data.json();
        console.log(resp);
        return resp;
    }
    catch (error) {
        console.error("An error occurred:", error);
      }
}


 async function handleSend(chatWindow, messageInput, token, profPics) {
    if(!messageInput.value)
    {
        const errorData = "Input cannot be empty"
        createErrorDiv("Input cannot be empty", chatWindow);
        
    }
    else
    {
        const error = document.querySelector("#error-message");
        if(error)
        {
            chatWindow.removeChild(error);
        }
        const response = await respondToMoodAnalysisQuestion(messageInput.value, token);
        
        console.log(response);

        if (response && (response.status == "Unsuccessful" ||
            (response.message == "Today's mood has been analysed! Come back tomorrow tomorrow" || response.message == "Response cannot be empty")))
        {
            createErrorDiv(response.message, chatWindow);


            // Disable the input
            if(response.message == "Today's mood has been analysed! Come back tomorrow tomorrow" || response.message == "Mood Analysis done already! Come back tomorrow")
            {
                messageInput.disabled = true;
            }

        }
        else
        {
            console.log(response);
//=================================================== User message============================================================================
            const rightMessageDiv = document.createElement("div");
            rightMessageDiv.className = "message right";
            rightMessageDiv.style.backgroundColor = "#dcf8c6";
            rightMessageDiv.style.alignSelf = "flex-end";
            rightMessageDiv.style.marginLeft = "auto";
            rightMessageDiv.style.textAlign = "left";
            rightMessageDiv.style.marginTop = "1.5rem";
            rightMessageDiv.style.marginBottom = "1.5rem";


            const userMessage = document.createElement("p");
            userMessage.id = "message";
            userMessage.textContent = response.data.userResponse;

            const userImage = document.createElement("img");
            userImage.id = "right-img";
            userImage.src = profPics;

            const timestampRight = document.createElement("span");
            timestampRight.className = "timestamp";
            timestampRight.id = "timespan-right";
            timestampRight.textContent = formatDate(response.data.timestamp);

            rightMessageDiv.appendChild(userMessage);
            rightMessageDiv.appendChild(userImage);
            rightMessageDiv.appendChild(timestampRight);

            chatWindow.appendChild(rightMessageDiv);

            messageInput.value = "";


//===========================================================Ai response======================================================================
            const question = await getMoodQuestion(token);
            if(question.data && question.status != "Unsuccessful")
            {
                const questionData = question.data;

                const leftMessageDiv = document.createElement("div");
                leftMessageDiv.className = "message left";
                leftMessageDiv.style.backgroundColor = "#fff";
                leftMessageDiv.style.alignSelf = "flex-start";
                leftMessageDiv.style.marginRight = "auto";
                leftMessageDiv.style.textAlign = "left";
                leftMessageDiv.style.marginBottom = "1.5rem";

                const aiResponse = document.createElement("p");
                aiResponse.id = "message-left";
                aiResponse.textContent = questionData.question;

                const aiProfilePic = document.createElement("img");
                aiProfilePic.id = "left-img";
                aiProfilePic.src = "./images/AiComp.png";

                const aiTimestampLeft = document.createElement("span");
                aiTimestampLeft.className = "timestamp";
                aiTimestampLeft.id = "timespan-right";
                aiTimestampLeft.textContent = formatDate(questionData.timestamp);

                leftMessageDiv.appendChild(aiResponse);
                leftMessageDiv.appendChild(aiProfilePic);
                leftMessageDiv.appendChild(aiTimestampLeft);

                chatWindow.appendChild(leftMessageDiv);
            }
        }
    }
    
}

async function AnalyseUsersMood(token)
{
    const data = fetch("https://localhost:7173/api/chat/analysemood", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if(data.ok)
    {
        const resp = await data.json();
        console.log(resp)
        return resp;
    }
}

function createErrorDiv(errorMessageParam, chatWindow)
{
    let existingErrorMessage = document.querySelector("#error-message");
    if (existingErrorMessage && chatWindow.contains(existingErrorMessage)) {
        chatWindow.removeChild(existingErrorMessage); // Remove the existing error message
    }
    // Create a new error message element
    const errorMessage = document.createElement("p");
    errorMessage.id = "error-message";
    errorMessage.textContent = errorMessageParam;
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";

    if (chatWindow.children.length > 0) {
        // Insert as the last child
        chatWindow.appendChild(errorMessage);
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

export async function LoadNotifications(token) {
    const url = "https://localhost:7173/api/Notification"
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.ok) {
        console.log(response)
        if(response.status === 204)
        {
            return {status: false};
        }
        const data = await response.json();
        return {status: true, data};
    } else {
        const data = await response.json();
        console.error(`${response.message}. Failed to fetch notifications.`);
        return {status: false, data}
    }
}



