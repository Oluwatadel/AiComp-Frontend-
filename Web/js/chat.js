//=================================onclick companion load chat===================================
const chatTemplate = "./templates/chat.html";




chat.addEventListener("click", async() => {
    const token = await getToken();

    await loadChat(chatTemplate);
    const chatContainer = document.querySelector("#mainchat-window");
    chatContainer.innerHTML = "";


    const chats = await fetchChats(token);
    const profileImage = await getProfilePic(token);
    if(chats.status === 204 || !chats.data || chats.data.length == 0 || !chats.status)
    {
        const errorMessage = "No conversation with comapnion yet";
        createErrorDiv(errorMessage, chatContainer);
    }

    if (!chats.status || !Array.isArray(chats.data) || chats.data.length === 0) {
        const errorMessage = "No conversation with companion yet";
        createErrorDiv(errorMessage, chatContainer);
    }

    if(chats.data)
    {
        chats.data.forEach(element => {
            
            createRightUserMessage(chatContainer,element.prompt.chatPromptToAi, profileImage, element.prompt.timeCreated)
    //==================================================================ai message================================================
            createLeftAiMessage(chatContainer, element.response.aiResponse,element.response.timeCreated)    
        });

        const scrollElementHTML = "<main></main>";
        chatContainer.insertAdjacentHTML("beforeend", scrollElementHTML);
        const scrollElement = chatContainer.querySelector("main");
        scrollElement.scrollIntoView();

        if(chats.data.length == 8)
        {
            const mood = await AnalyseUsersMood(token);
            console.log(mood)
            if(mood.ok && mood.data)
            {
                const leftMessageForUser = document.createElement("div");
                leftMessageForUser.classList.add("mainmessage", "left");
        
                const leftImage = document.createElement("div");
                leftImage.className = "left-chatImg";
        
                const aiProfileImage = document.createElement("img");
                aiProfileImage.src = "/Web/images/AiComp.png";
                leftImage.appendChild(aiProfileImage);
        
                const aiResponse = document.createElement("p");
                aiResponse.textContent = mood.data; // Start with an empty string for the typing effect
        
                const aiTimestamp = document.createElement("span");
                aiTimestamp.className = "timestamp";
                aiTimestamp.textContent = formatDate(new Date());
        
                leftMessageForUser.appendChild(leftImage);
                leftMessageForUser.appendChild(aiResponse);
                leftMessageForUser.appendChild(aiTimestamp);
        
                chatContainer.appendChild(leftMessageForUser);

        
            }
        }
    }
    
    const messageInput = document.querySelector("#message-input");
    const sendBtn = document.querySelector("#send-btn");
    

    if(messageInput && sendBtn)
    {
        sendBtn.addEventListener("click", async () => {
            if(messageInput.value)
            {
                await sendButtonFunction(chatContainer, messageInput.value, token, profileImage);
                messageInput.value = "";

            }
        });

        messageInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                    event.preventDefault(); // Prevents default behavior of form submission if inside a form
                    await sendButtonFunction(chatContainer, messageInput.value, token, profileImage);
                    messageInput.value = "";
                }
        });
    }
})
            
async function sendButtonFunction(chatContainer, messageInput, token, profilePics) {
    try {
        const response = await fetch("https://localhost:7173/api/chat/chatstream", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body:  JSON.stringify({
                prompt: messageInput
            }), // Fixed property name
        });

        createRightUserMessage(chatContainer, messageInput, profilePics, new Date());

        const leftMessageForUser = document.createElement("div");
        leftMessageForUser.classList.add("mainmessage", "left");

        const leftImage = document.createElement("div");
        leftImage.className = "left-chatImg";

        const aiProfileImage = document.createElement("img");
        aiProfileImage.src = "/Web/images/AiComp.png";
        leftImage.appendChild(aiProfileImage);

        const aiResponse = document.createElement("p");
        aiResponse.textContent = ""; // Start with an empty string for the typing effect

        const aiTimestamp = document.createElement("span");
        aiTimestamp.className = "timestamp";
        aiTimestamp.textContent = formatDate(new Date());

        leftMessageForUser.appendChild(leftImage);
        leftMessageForUser.appendChild(aiResponse);
        leftMessageForUser.appendChild(aiTimestamp);

        chatContainer.appendChild(leftMessageForUser);

        // Handle server response
        if (!response.ok) {
            const errorText = await response.text();
            createErrorDiv(errorText, chatContainer);
            console.error(`Error: ${errorText}`);
            return;
        }

        // Read the complete string response
        const responseData = await response.text();
        const responseJson = JSON.parse(responseData)
        const data = responseJson.data
        console.log(data.length)
        console.log(typeof(data))

        let currentIndex = 0;
        if (data && data.length > 0) {
            const typingSpeed = 5; // Adjust typing speed here
            function typeCharacter() {
                if (currentIndex < data.length) {
                    const nextChar = data[currentIndex];
                    aiResponse.textContent += nextChar;
                    currentIndex++;

                    // Continue typing the next character
                    setTimeout(typeCharacter, typingSpeed);
                }
            }

            typeCharacter();
            const scrollElementHTML = "<main></main>";
            chatContainer.insertAdjacentHTML("beforeend", scrollElementHTML);
            const scrollElement = chatContainer.querySelector("main");
            scrollElement.scrollIntoView()
        }

        

         
    } catch (error) {
        console.error("Error fetching chat completion:", error);
    }
}

document.querySelectorAll(".mainmessage p").forEach((message) => {
    message.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const text = message.textContent;

        // Copy text to clipboard
        navigator.clipboard.writeText(text).then(() => {
            console.log("Text copied to clipboard:", text);
        }).catch(err => {
            console.error("Failed to copy text:", err);
        });
    });
});

// async function typeEffect(aiResponse, message, typingSpeed)
// {
//     let currentIndex = 0;
//     typeCharacter(aiResponse, currentIndex, message, typingSpeed);

// }

function typeCharacter(aiResponse,  datastring, typingSpeed) {
    if (!datastring || datastring.length === 0) {
        console.error("Message is invalid or empty");
        return;
    }
    let currentIndex = 0;
    if (currentIndex < datastring.length) {
        const nextChar = datastring[currentIndex];
        aiResponse.textContent += nextChar;
        currentIndex++;

        // Continue typing the next character
        setTimeout(typeCharacter, typingSpeed);
    }
}

async function loadChat(templatePath) {
    try {
        const template = await fetch(templatePath);

        if (!template.ok) throw new Error("Failed to load template");

        const html = await template.text();

        const container = document.querySelector(".container");
        const main = document.querySelector("main");

        container.style.gridTemplateColumns = "14rem auto";
        main.innerHTML = "";
        main.innerHTML = html;

        const date = document.querySelector("#date");
        if (date) date.value = dateTime();
    }
    catch (error) {
        console.error("Error loading template:", error);
    }
}

    //========================================================fetch chats===============================================================
    let fetchChats = async(token) =>
    {
        const url = "https://localhost:7173/api/chat/chats"

       try
       {
            const resp = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resp.status === 204) {
                return { status: 204, data: null };
            }
    

            if(resp.ok)
            {
                const data = await resp.json();
                return data
            }
            else {
                // Handle errors when the response is not OK
                const data = await resp.json();
                console.error(data.message);
                return { status: 'error', message: data.message };
            }
       }
       catch(error)
        {
            console.error("Network error:", error);
        }
    }
    

function createErrorDiv(errorMessageParam, chatContainer)
{
    if (!chatContainer) {
        console.error("Chat container not found!");
        return;
    }

    let existingErrorMessage = document.querySelector("#error-message");
    if (existingErrorMessage && chatContainer.contains(existingErrorMessage)) {
        chatContainer.removeChild(existingErrorMessage); // Remove old error
    }

    const errorMessage = document.createElement("p");
    errorMessage.id = "error-message";
    errorMessage.textContent = errorMessageParam;
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";

    chatContainer.appendChild(errorMessage);

}

function createLeftAiMessage(chatContainer,paragraphContent,timestamp)
{
    const leftMessageForUser = document.createElement("div");
    leftMessageForUser.classList.add("mainmessage", "left");

    const leftImage = document.createElement("div");
    leftImage.className = "left-chatImg";

    const aiProfileImage = document.createElement("img");
    aiProfileImage.src = "/Web/images/AiComp.png";
    leftImage.appendChild(aiProfileImage);

    const aiResponse = document.createElement("p");
    aiResponse.textContent = paragraphContent

    const aiTimestamp = document.createElement("span");
    aiTimestamp.className = "timestamp";
    aiTimestamp.textContent = formatDate(timestamp);

    leftMessageForUser.appendChild(leftImage);
    leftMessageForUser.appendChild(aiResponse);
    leftMessageForUser.appendChild(aiTimestamp);

    chatContainer.appendChild(leftMessageForUser);
}

function createRightUserMessage(chatContainer,usermessage,profileImage,userMessageTimestamp)
{
    const rightMessageForUser = document.createElement("div");
    rightMessageForUser.classList.add("mainmessage", "right");

    const rightImage = document.createElement("div");
    rightImage.className = "right-chatImg";
        //image
    const userProfileImage = document.createElement("img");
    userProfileImage.src = profileImage;
    rightImage.appendChild(userProfileImage);

    const userPrompt = document.createElement("p");
    userPrompt.textContent = usermessage;

    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    timestamp.textContent = formatDate(userMessageTimestamp);

    rightMessageForUser.appendChild(rightImage);
    rightMessageForUser.appendChild(userPrompt);
    rightMessageForUser.appendChild(timestamp);

    chatContainer.appendChild(rightMessageForUser);

}
