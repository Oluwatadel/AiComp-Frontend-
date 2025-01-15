/**
 * Creates a chart dynamically and appends it to a container.
 * @param {string} containerId - The name of the container div.
 * @param {string} chartId - The ID for the canvas element.
 * @param {string} chartType - The type of chart (e.g., 'bar', 'line', 'pie').
 * @param {Array} labels - The labels for the chart (e.g., ['Monday', 'Tuesday']).
 * @param {Array} data - The data points for the chart.
 * @param {string} chartLabel - The label for the dataset.
 * @param {object} [options={}] - Additional chart options.
 * @returns {HTMLElement} - The container element with the chart.
 */
export function createChart(container, chartId, chartType, labels, data, chartLabel, options = {}) {
    
    // Create the chart dynamically
    new Chart(container, {
        type: chartType, // Use the dynamic chartType parameter
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            ...options, // Merge additional options
        },
    });

    // return the chart canvas
    return container

    // Return the container so it can be appended to a specific parent
    // return container;
}