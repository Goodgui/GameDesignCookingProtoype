const tooltip = document.getElementById("tooltip");
let tooltipTimeout;


function showTooltip(event) {
    const item = event.currentTarget; // Get the hovered item
    const properties = JSON.parse(item.dataset.fullItemData);

    tooltipTimeout = setTimeout(() => {
        // Clear previous content
        tooltip.innerHTML = "";

        // Convert object properties to an HTML string with line breaks
        let propertiesString = Object.entries(properties)
            .map(([key, value]) => `${key}: ${value}`)
            .join("<br>");

        // tooltip.innerHTML = propertiesString;
        tooltip.innerHTML = "Name: " + properties.Name + " | Type: " + properties.Type;
        tooltip.style.minWidth = "350px";
        tooltip.style.minHeight = "300px";

        // Make the tooltip visible
        tooltip.style.visibility = "visible";

        // const tasteLabels = Object.keys(properties).slice(3, 12);
        const tasteLabels = Object.keys(properties).slice(3, 9);
        const healthLabels = Object.keys(properties).slice(12, 17);

        const tasteChart = generateRadarChart(tasteLabels, properties);
        tooltip.appendChild(tasteChart);

        const healthChart = generateRadarChart(healthLabels, properties);
        tooltip.appendChild(healthChart);
    }, 200);
}


function moveTooltip(event) {
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;

    // Adjust tooltip position if it overflows the bottom of the window
    const tooltipRect = tooltip.getBoundingClientRect();
    const bottomOverflow = tooltipRect.bottom - window.innerHeight;
    const rightOverflow = tooltipRect.right - window.innerWidth;

    if (bottomOverflow > 0) {
        tooltip.style.top = `${event.clientY + 10 - bottomOverflow}px`;
    }

    // Adjust tooltip position if it overflows the right side flip it to the left
    if (rightOverflow > 0) {
        tooltip.style.left = `${event.clientX - tooltipRect.width - 10}px`;
    }
}

function hideTooltip() {
    clearTimeout(tooltipTimeout); // Clear the timeout if the mouse leaves before it triggers
    tooltip.style.visibility = "hidden";
}

function generateRadarChart(values, data) {
    const chartDiv = document.createElement('canvas');
    chartDiv.width = 50;
    chartDiv.height = 50;

    const dataValues = values.map(value => data[value]);

    const index = values.indexOf("Carbohydrates");
    if (index !== -1) {
        values[index] = "Carbs";
    }

    const data2 = {
        labels: values,
        datasets: [{
            label: '',
            data: dataValues,
            fill: true,
        }]
    };

    const config = {
        type: 'radar',
        data: data2,
        options: {
            animation: false,
            tension: 0.0,
            elements: {
                line: {
                    borderWidth: 5,
                    borderColor: 'rgb(255, 255, 255)',
                },
                point: {
                    display: false,
                    radius: 0,
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.84)',
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
                subtitle: {
                    display: false,
                },
            },
            scales: {
                r: {
                    ticks: {
                        display: true,
                        color: 'rgb(255, 255, 255)',
                        backdropColor: 'rgba(255, 255, 255, 0)',
                        precision: 0,
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.55)',
                        // circular: true,
                        lineWidth: 1,
                    },
                    pointLabels: {
                        color: 'rgb(255, 255, 255)',
                    },
                    max: 10,
                },
            },
        },
    };

    new Chart(chartDiv, config);

    return chartDiv;
}
