//=================================onclick companion load chat===================================
const chatTemplate = "./templates/chat.html";
const sendBtn = document.querySelector("#send-btn");




chat.addEventListener("click", async() => {
    const token = await getToken();

    await loadChat(chatTemplate);
    const chatContainer = document.querySelector("#mainchat-window");
    // chatContainer.innerHTML = "";


    const chats = await fetchChats(token);
    const profileImage = await getProfilePic(token);
    console.log(chats);
    if(chats.data.length == 0 && chats.status)
    {
        const errorMessage = "No conversation with comapnion yet";
        createErrorDiv(errorMessage, chatContainer);
    }

    if(Array.isArray(chats.data) && chats.data.length > 0)
    {
        chats.data.forEach(element => {
            const rightMessageForUser = document.createElement("div");
            rightMessageForUser.classList.add("mainmessage", "right");

            const rightImage = document.createElement("div");
            rightImage.className = "right-chatImg";
        //image
            const userProfileImage = document.createElement("img");
            userProfileImage.src = profileImage;
            rightImage.appendChild(userProfileImage);

            const userPrompt = document.createElement("p");
            userPrompt.textContent = element.prompt.chatPromptToAi

            const timestamp = document.createElement("span");
            timestamp.className = "timestamp";
            timestamp.textContent = formatDate(element.prompt.timeCreated);

            rightMessageForUser.appendChild(rightImage);
            rightMessageForUser.appendChild(userPrompt);
            rightMessageForUser.appendChild(timestamp);
        
    //==================================================================ai message================================================
            const leftMessageForUser = document.createElement("div");
            leftMessageForUser.classList.add("mainmessage", "left");

            const aiProfileImage = document.createElement("img");
            // aiProfileImage.className = "left-chatImg";
            aiProfileImage.src = "/Web/images/AiComp.png";

            const aiResponse = document.createElement("p");
            aiResponse.textContent = element.response.aiResponse;

            const aiTimestamp = document.createElement("span");
            aiTimestamp.className = "timestamp";
            aiTimestamp.textContent = formatDate(element.response.timeCreated);

            leftMessageForUser.appendChild(aiProfileImage);
            leftMessageForUser.appendChild(aiResponse);
            leftMessageForUser.appendChild(aiTimestamp);

            chatContainer.appendChild(rightMessageForUser);
            chatContainer.appendChild(leftMessageForUser);

        });
        
        const messageInput = document.querySelector("#message-input");
    }
    




})


let loadChat = async (templatePath) =>
    {
        try
        {
            const template = await fetch(templatePath);
            
            if (!template.ok) throw new Error("Failed to load template");

            const html = await template.text();
            console.log(html);

            const container = document.querySelector(".container");
            const main = document.querySelector("main");

            container.style.gridTemplateColumns = "14rem auto";
            main.innerHTML = "";
            main.innerHTML = html;

            const date = document.querySelector("#date");
            if(date) date.value = dateTime();      
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


            if(resp.ok)
            {
                const data = await resp.json();
                return data
            }
            else
            {
                const data = await resp.json();
                console.error(data.message)
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
    if (existingErrorMessage) {
        chatContainer.removeChild(existingErrorMessage); // Remove old error
    }

    const errorMessage = document.createElement("p");
    errorMessage.id = "error-message";
    errorMessage.textContent = errorMessageParam;
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";

    chatContainer.appendChild(errorMessage);

}

