// Define the dimensions for the small line charts
const smallLineChartWidth = 170;
const smallLineChartHeight = 200;

// Load the data from the CSV file
d3.csv("stockdata-2.csv").then(function (data) {
    // Parse date and convert numeric values to numbers
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.Apple = +d.Apple;
        d.Google = +d.Google;
        d.Amazon = +d.Amazon;
        d.Microsoft = +d.Microsoft;
        d.IBM = +d.IBM;
        d.Facebook = +d.Facebook;
    });

    // Create an array of objects for each company's data
    const companies = [
        { name: "Apple", data: data.map(d => ({ date: d.date, value: d.Apple })) },
        { name: "Google", data: data.map(d => ({ date: d.date, value: d.Google })) },
        { name: "Amazon", data: data.map(d => ({ date: d.date, value: d.Amazon })) },
        { name: "Microsoft", data: data.map(d => ({ date: d.date, value: d.Microsoft })) },
        { name: "IBM", data: data.map(d => ({ date: d.date, value: d.IBM })) },
        { name: "Facebook", data: data.map(d => ({ date: d.date, value: d.Facebook })) },
    ];

    // Create a function to draw a small line chart for each company
    function createSmallLineChart(containerId, companyName, companyData, lineColor) {
        const margin = { top: 20, right: 10, bottom: 30, left: 35 };
        const width = smallLineChartWidth - margin.left - margin.right;
        const height = smallLineChartHeight - margin.top - margin.bottom;

        const svg = d3
            .select(`#${containerId}`)
            .append("svg")
            .attr("width", smallLineChartWidth)
            .attr("height", smallLineChartHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const line = d3
            .line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        x.domain(d3.extent(companyData, d => d.date));
        y.domain([
            d3.min(companyData, d => d.value),
            d3.max(companyData, d => d.value)
        ]);

        svg
            .append("path")
            .datum(companyData)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", lineColor);
         // X-axis label
         svg
         .append("text")
         .attr("x", width / 2)
         .attr("y", height + margin.bottom)
         .style("text-anchor", "middle")
         .style("font-size", "10px")
         .text("Year");

        // Y-axis label
        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - height / 2)
            .attr("y", 0- 35)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .text("Price($)");

        svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5))
            .style("font-size", "6px");

        svg
            .append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y))
            .style("font-size", "6px");

        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text(companyName);

        svg
            .selectAll(".dot")
            .data(companyData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value));
    }

    // Create small line charts for each company with different colors
    const colors = ["steelblue", "#699950", "#5B2E48", "#EE2E31", "#FFD400", "#DF57BC"];
    companies.forEach((company, index) => {
        createSmallLineChart(
            `line_${company.name.toLowerCase()}`,
            company.name,
            company.data,
            colors[index % colors.length]
        );
    });
});