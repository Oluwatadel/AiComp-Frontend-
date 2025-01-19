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
    const url = "https://localhost:7173/api/Journal"
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error(`${response.message}. Failed to fetch notifications.`);
    }
}

export async function JournalFetchandPopulation(token) {
    const journalsFetched = await fetchJournals(token)

            if(journalsFetched && Array.isArray(journalsFetched.data))
            {
                const journals = journalsFetched.data
                const journalList = document.querySelector(".journal-list");


                journalList.innerHTML = "";

                for(let i = 0; i < journals.length; i++)
                {
                    console.log(journals[i]);
                    const journalEntries = document.createElement("div");
                    journalEntries.classList.add("journal-entry");
                    journalEntries.id = "journalEntries";
                    journalEntries.dataset.id = journals[i].id;

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
            }
}