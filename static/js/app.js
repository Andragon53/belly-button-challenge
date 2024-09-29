// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadataA = metadata.filter((testSample) => {
      return testSample.id == sample;
    } )[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let dataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    dataPanel.html("");  

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let display = ``;
    for (const [key, value] of Object.entries(metadataA)) {
      let capsKey = key.toUpperCase();
      display = display + `${capsKey}: ${value} <br />`;
    };
    dataPanel.html(display);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleA = samples.filter((testSample) => {
      return testSample.id == sample;
    } )[0];
    
    // Get the otu_ids, otu_labels, and sample_values
    let IDs = sampleA.otu_ids;
    let labels = sampleA.otu_labels;
    let values = sampleA.sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: IDs,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: IDs
      }
    };
    
    let dataA = [trace1];
    let bubbleFormat = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: "Sample ID"},
      yaxis: {title: "Number of Bacteria"}
    };
    
    // Render the Bubble Chart
    Plotly.newPlot("bubble", dataA, bubbleFormat);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let IDstrings = IDs.map((ID) => {
      let label = "OTU " + ID;
      return label;
    });

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sortValues = values.sort(function sortData(a, b) {
      return b - a;
    });
    let top10 = sortValues.slice(0, 10);
    top10.reverse();
    
    let trace2 = {
      type: "bar",
      x: top10,
      y: IDstrings,
      text: labels,
      orientation: 'h'
    };
    
    let dataB = [trace2];
    let barFormat = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: "Number of Bacteria"}
    }
    
    // Render the Bar Chart
    Plotly.newPlot("bar", dataB, barFormat);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    let options = dropdown.selectAll("option").data(names);

    options.enter()
      .append('option')
      .attr('value', (data) => {return data;})
      .text( (data) => {return data;});

    // Get the first sample from the list
    let sample1 = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(sample1);
    buildMetadata(sample1);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
