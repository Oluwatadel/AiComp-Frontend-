import { getToken, dateTime } from "./dashboard.js";
import { createChart } from './chartUtils.js'

const moodTemplate = "./templates/mood.html";
const mood = document.querySelector("#mood");


mood.addEventListener("click", async() => {
    const token = await getToken();
    await loadMoodTemplate(moodTemplate);
    const moodlogs = await getWeeklyMoodLogs(token);
    const emotionalData = [];
    const intensityData = [];
    const date = [];

    if(moodlogs.data && Array.isArray(moodlogs.data))
    {
        const data = moodlogs.data;
        for (let i = 0; i < data.length; i++) {
          const log = data[i];
          const inf = await mappEmotiontoAValue(log.emotion);
          console.log(inf);
          emotionalData[i] = inf;
          intensityData[i] = log.intensity;
          date[i] = await formatDateToShort(log.timestamp);
      }
    }
    const weeklychart = document.querySelector(".weekly-chart");
    const LineChart = document.querySelector("#emotion-Chart");
    const chartLabel = 'Emotion';
    const EmotionlineGraph = createChart(LineChart, "emotionalChart",'line',date, emotionalData,chartLabel)    

    EmotionlineGraph.style.height = "260px";
    

    //=================================weekly intensity barchart=========================================================

    const EmotionBarchart = document.createElement("div");
    EmotionBarchart.className = "chart-Div";
    EmotionBarchart.id = "chart2";
    const weeklyIntensityCanvas = document.createElement('canvas');
    const weeklyIntensityBarchart = createChart(weeklyIntensityCanvas, "emotionalChart",'bar',date, intensityData,"intensity")
    weeklyIntensityBarchart.id = "intensitychart";
    EmotionBarchart.appendChild(weeklyIntensityBarchart);
    weeklychart.appendChild(EmotionBarchart);


//===================================================Monthly Emotion line graph===============================================================
    const secondChartDiv = document.querySelector(".monthly-chart");
    const monthlyLineGraphy = document.createElement("div");
    const moodlogsForAMonth = await getMonthlyMoodLogs(token);
    const emotionalDataForTheMonth = [];
    const intensityDataFroTheMont = [];
    const listOfEmotionExperienceInAMonth = {};
    const dateofData = [];

    if(moodlogsForAMonth.data && Array.isArray(moodlogsForAMonth.data))
    {
        const data = moodlogsForAMonth.data;
        for (let i = 0; i < data.length; i++) {
          const log = data[i];
          const inf = await mappEmotiontoAValue(log.emotion);
          emotionalDataForTheMonth[i] = inf;
          intensityDataFroTheMont[i] = log.intensity;
          if(!listOfEmotionExperienceInAMonth[log.emotion])
          {
              listOfEmotionExperienceInAMonth[log.emotion] = 1
          }
          else
          {
              listOfEmotionExperienceInAMonth[log.emotion] += 1;
          }
          dateofData[i] = await formatDateToShort(log.timestamp);
      }
    }


    monthlyLineGraphy.className = "chart-Div2";
    monthlyLineGraphy.id = "chart3";
    const monthlyLineChart = document.createElement('canvas');
    const monthlyEmotionLineGraph = createChart(monthlyLineChart, "monthlyEmotionLineGraph",'line',dateofData, emotionalDataForTheMonth,"Occurence of Emotion");
    monthlyEmotionLineGraph.id = "monthlyEmotionLineGraph";
    


    monthlyLineGraphy.appendChild(monthlyEmotionLineGraph);

    monthlyEmotionLineGraph.style.width = '600px';
    monthlyEmotionLineGraph.style.height = '260px';

//=======================================================pie chart Monthly===========================================
const monthlyPieChart = document.createElement("div");
monthlyPieChart.className = "chart-Div2";
monthlyPieChart.id = "piechart";
const monthlyEmotionPieChart = document.createElement('canvas');
const monthlyEmotionPieGraph = createChart(monthlyEmotionPieChart, "monthlyEmotionPieGraph",'doughnut',dateofData, emotionalDataForTheMonth,"Emotion");
monthlyEmotionPieGraph.id = "monthlyEmotionPieGraph";


monthlyPieChart.appendChild(monthlyEmotionPieGraph);

monthlyEmotionPieGraph.style.width = '300px';
monthlyEmotionPieGraph.style.height = '250px';


secondChartDiv.appendChild(monthlyLineGraphy);
secondChartDiv.appendChild(monthlyPieChart);

})


async function loadMoodTemplate(moodTemplate)
{
    const moodHtml = await fetch(moodTemplate);

    if (!moodHtml.ok) throw new Error("Failed to load template");

    const html = await moodHtml.text();

    const container = document.querySelector(".container");
    const main = document.querySelector("main");

    container.style.gridTemplateColumns = "14rem auto";
    // main.innerHTML = "";
    main.innerHTML = html;

        const date = document.querySelector("#date");
    if (date) date.value = dateTime();
}


export async function getAllMoodLogs(token)
{
    const response = await fetch("https://localhost:7173/api/moods/all", {
    method: "Get",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    });

    if(!response.ok)
    {
        const resp = await response.json();
        console.error("error", resp)
        return resp;
    }

    const data = await response.json();
    console.log(data)
    return data;
}
//================================================================Weekly==========================================================
export async function getWeeklyMoodLogs(token)
{
    const response = await fetch("https://localhost:7173/api/moods/weekly", {
    method: "Get",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    });

    if(!response.ok)
    {
        const resp = await response.json();
        console.error("error", resp)
        return resp;
    }

    const data = await response.json();
    return data;
}

//================================================================Monthly==========================================================
export async function getMonthlyMoodLogs(token)
{
    const response = await fetch("https://localhost:7173/api/moods/weekly", {
    method: "Get",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    });

    if(!response.ok)
    {
        const resp = await response.json();
        console.error("error", resp)
        return resp;
    }

    const data = await response.json();
    return data;
}


export async function formatDateToShort(date) {
  const newDate = new Date(date);
  // Format to show abbreviated month and numeric day
  return newDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
  

async function mappEmotiontoAValue(emotionalData) {
    const emotionCategories = {
        positive: ['joy', 'love', 'happiness', 'happy', 'gratitude', 'pride', 'relief', 'calm', 'relaxed'],
        negative: ['sadness', 'sad', 'stressed', 'fear', 'anger', 'angry', 'disgust', 'shame', 'jealousy', 'stress', 'anxious', 'anxiety'],
        neutral: ['neutrality', 'neutral', 'confusion', 'acceptance', 'boredom', 'equanimity'],
        mixed: ['bittersweet', 'nostalgia', 'ambivalence', 'empathy', 'suspense'],
        surprise: ['surprise', 'curiosity', 'amazement', 'wonder', 'uncertainty']
    };

    // Define the values to be assigned for each category
    const categoryValues = {
        positive: 5,
        negative: 0.5,
        neutral: 2,
        mixed: 3,
        surprise: 4
    };

    // Initialize the variable that will hold the mapped value
    let emotionValue = null;
    const lowercasedEmotion = emotionalData.toLowerCase();

    // Check which category the emotion belongs to
    for (const [category, emotions] of Object.entries(emotionCategories)) {
      for (const emotion of emotions) {
          if (lowercasedEmotion.includes(emotion) || emotion.includes(lowercasedEmotion))
          {
              console.log(categoryValues[category])
              emotionValue = categoryValues[category];
              return emotionValue;
          }
      }
  }
    return emotionValue;
}