function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var dataarrays = data.samples;
    //console.log(dataarrays);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var currentsample = dataarrays.filter(sampleObj => sampleObj.id == sample)
    //console.log(currentsample)
    //  5. Create a variable that holds the first sample in the array.
    //idk what's being asked here.
    //var currentfirst = dataarrays[0];
    //console.log(currentfirst);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    sampleotu_ids = currentsample.map(otu => otu.otu_ids);
    sampleotu_ids = sampleotu_ids[0]
    sampleotu_ids = sampleotu_ids.map(String);
    sampleotu_idsL = sampleotu_ids.map(str => 'OTU ' + str);
    sampleotu_labels = currentsample.map(otu => otu.otu_labels);
    sampleotu_labels = sampleotu_labels[0]
    sampleotu_values = currentsample.map(otu => otu.sample_values);
    sampleotu_values = sampleotu_values[0]
    //console.log(sampleotu_ids,sampleotu_labels,sampleotu_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = 4;
    tensampleotu_ids = sampleotu_idsL.slice(0,10);
    tensampleotu_labels = sampleotu_labels.slice(0,10);
    tensampleotu_values = sampleotu_values.slice(0,10);
    //console.log(sampleotu_ids,sampleotu_labels,sampleotu_values);
    tensampleotu_ids = tensampleotu_ids.reverse()
    tensampleotu_labels = tensampleotu_labels.reverse()
    tensampleotu_values = tensampleotu_values.reverse()
    //console.log(sampleotu_ids,sampleotu_labels,sampleotu_values);
    // 8. Create the trace for the bar chart.
    var barTrace = {
      x: tensampleotu_values,
      y: tensampleotu_ids,
      text: tensampleotu_labels,
      orientation: 'h',
      type:"bar"
    } 
    var barData = [barTrace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);
    // Function increase scale.
    // Realizing multiplication didn't scale well, so I'm using exponential powers
    var sampleotu_size = sampleotu_values.map(function(num){
      return Math.pow(num,1.75);
    });
    // 1. Create the trace for the bubble chart.
    // DON'T FORGETT TO COLOR.
    var bubbleTrace = {
      x: sampleotu_ids,
      y: sampleotu_values,
      mode: 'markers',
      marker: {
        size: sampleotu_size,
        sizemode: 'area',
        color: sampleotu_ids
      },
      text: sampleotu_labels,
      type: "bubble",
      opacity: .75
    };
    var bubbleData = [bubbleTrace]
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      hovermode:'closest',
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //console.log(resultArray);
    samplewashing = resultArray.map(sample => sample.wfreq);
    var washfreq = samplewashing[0];
    //console.log(samplewashing);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0,1], y:[0,1] },
      value: washfreq,
      title: 
      {
        text: "Belly Button Washing Frequency"
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: 
        {
          range: [null, 10],
          dtick: 2
        },
        bar: {color: 'black'},
        steps: [
          {range: [0,2], color: 'red'},
          {range: [2,4], color: 'orange'},
          {range: [4,6], color: 'yellow'},
          {range: [6,8], color: 'limegreen'},
          {range: [8,10], color: 'green'}
        ]
      }
    }];
    var gaugeLayout = {
      margin: {t: 0, b: 0},
      //xaxis: {title: "scrubs per week"}
    }
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
