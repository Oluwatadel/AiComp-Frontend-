import { dateTime } from "./dashboard.js";
import { formatDateToShort } from "./mood.js";
export async function loadJournalTemplate()
{
    const templatePath = "/Web/templates/journal.html";
    const template = await fetch(templatePath);

    if (!template.ok) throw new Error("Failed to load template");
    
    const htmltemplate = await template.text();

    const main = document.querySelector("main");
    const container = document.querySelector(".container");
    container.style.gridTemplateColumns = "14rem auto 23rem";
    main.innerHTML = "";
    main.innerHTML = htmltemplate;
    
    const date = document.querySelector("#date");
    if (date) date.value = dateTime();
}

export async function fetchJournals(token)
{
    const url = "https://localhost:7173/api/Journal/view/journals"
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.ok) {
        if(response.status === 204)
        {
            return {status: false, error:"error"};
        }
        const data = await response.json();
        return {status: true, data};
    } else {

        console.error(`${response.message}. Failed to fetch notifications.`);
        return {status: false, data};

    }
}

export async function journalFetchandPopulation(token) {
    const journalsFetched = await fetchJournals(token);
    const journalList = document.querySelector(".journal-list");


    if(journalsFetched.status)
    {
        journalList.innerHTML = "";
        if(journalsFetched && Array.isArray(journalsFetched.data.data))
        {
            const journals = journalsFetched.data.data  

            for(let i = 0; i < journals.length; i++)
            {
                const journalEntries = document.createElement("div");
                journalEntries.classList.add("journal-entry");
                journalEntries.id = "journalEntries";
                

                const journalContent = document.createElement("div");
                journalContent.id = "journal-content";

                const content = document.createElement("p");
                content.id = content;
                content.textContent = journals[i].content;
                
                const timestamp = document.createElement('span');
                timestamp.textContent = await formatDateToShort(journals[i].timestamp);

                journalContent.appendChild(content);
                journalContent.appendChild(timestamp);

                const deleteBtn = document.createElement("button");
                deleteBtn.id = "deleteJournalBtn";
                deleteBtn.textContent = "Delete";
                deleteBtn.dataset.id = journals[i].id;
                deleteBtn.dataset.type = "journal";


                journalEntries.appendChild(journalContent);
                journalEntries.appendChild(deleteBtn);
                journalEntries.style.borderRadius = "10px";
                journalEntries.style.marginTop = "10px";

                journalList.appendChild(journalEntries);

                if(i % 2 == 0)
                {
                    journalEntries.style.borderBottom = "2px solid #7d89eb";
                    journalEntries.style.backgroundColor = "#f0f0f0";
                }
            }
            const scrollElementHTML = "<main></main>";
            journalList.insertAdjacentHTML("beforeend", scrollElementHTML);
            const scrollElement = journalList.querySelector("main");
            scrollElement.scrollIntoView();
        }
    }
    else
    {
        const innerMessage = document.querySelector("#content");
        const timestamp = document.querySelector("#timestamp");
        const deleteBTN = document.querySelector("#delete");
        timestamp.style.display = "none";
        deleteBTN.style.display = "none";

        innerMessage.style.textAlign = "center";
        innerMessage.style.fontSize = "Large";
        innerMessage.style.color = "Black";


        innerMessage.textContent = "You are yet to add a journal"
        journalList.appendChild(innerMessage);
    }
}

export async function addJournal(token, journalObject)
{
    const response = await fetch("https://localhost:7173/api/Journal/add/journal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(journalObject)
    });
    if(response.ok)
    {
        const data = await response.json();
        return { status: true, data }; 
    }
    else
    {
        const error = await response.json();  // Parse the response
        return { status: false, error:error }
    }
}


export async function deleteJournal(token, journalId)
{
    const response = await fetch(`https://localhost:7173/api/Journal/delete/journal/?journalId=${journalId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();  // Parse the response
        return { status: false }
    }

    const data = await response.json();
    return { status: true, data };
}