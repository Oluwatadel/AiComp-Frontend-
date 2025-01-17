import { dateTime } from "./dashboard.js";
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