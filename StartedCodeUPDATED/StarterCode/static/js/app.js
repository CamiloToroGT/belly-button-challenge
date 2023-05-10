const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
  console.log(data);
});

function init() {

    // dropdown select
    var selector = d3.select("#selDataset");
    
    
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    
      // build the initial plots
      const firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);
    });


    } 


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var sampleResults= metadata.filter(sampleobject => 
        sampleobject.id == sample);
      var result= sampleResults[0]
      var panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h5").text(`${key}: ${value}`);
      });
  
   });
  }
  
function buildCharts(sample) {
  
  // use d3 to get data for charts
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var sampleResults= samples.filter(sampleobject => 
        sampleobject.id == sample);
    var result= sampleResults[0]
  
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
  
 
  // build bubble chart
    var layout = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
  
      var bubbleData = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];
  
    Plotly.newPlot("bubble", bubbleData, layout);
  
  
// build bar chart 
    var barData =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
  
    var layout = {
      margin: { t: 50, l: 175 }
    };
  
    Plotly.newPlot("bar", barData, layout);
  });
  }


  // create function to change sample when selected  
  function sampleChange(newSample) {
  
  buildMetadata(newSample);
  buildCharts(newSample);
  }
  
  
  
  // Initialize 
  init();