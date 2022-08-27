
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 80,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);



// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

 
 
// Setting x - X-SCALE FUNCTION
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(smokeData, chosenXAxis) {
   
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(smokeData, d => d[chosenXAxis]) * 0.8,
        d3.max(smokeData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }



  // Setting x - Y-SCALE FUNCTION
  var chosenYAxis = "healthcare";

  // function used for updating x-scale var upon click on axis label
  function yScale(smokeData, chosenYAxis) {
    
        // Create y scale function
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(smokeData, d =>  d[chosenYAxis])*0.8, 
                 d3.max(smokeData, d =>  d[chosenYAxis])*1.1])
        .range([height, 0]);

      console.log("Max height for chosen is  "+d3.max(smokeData, d =>  d[chosenYAxis]))  
      return yLinearScale;
    
    }




 /*
  * ON CLICK EVENT FUNCTIONS
  */

  // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}



  // function used for updating xAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftYAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftYAxis);
  
      console.log("renderYAxes CALL ")

    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {


  console.log("renderCircles")
  console.log("chosenXAxis  "+chosenXAxis)
  console.log("chosenYAxis  "+chosenYAxis)


  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]))
    .attr("cx", d => newXScale(d[chosenXAxis]));


  return circlesGroup;
}




/* 
 *   READING DATA
 */


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(smokeData, err) {

    if (err) throw err;
  
    // parse data
    smokeData.forEach(function(data) {

      data.poverty    = +data.poverty;
      data.age        = +data.age;
      data.income     = +data.income;

      data.healthcare = +data.healthcare;
      data,obesity    = +data.obesity;
      data.smokes     = +data.smokes;

    });


    // xLinearScale function above csv import
    var xLinearScale = xScale(smokeData, chosenXAxis);
  
 
    // Create y scale function
    var yLinearScale = yScale(smokeData, chosenYAxis);

   
   
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    console.log("leftAxis")
    console.log(leftAxis)


      // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


    yAxis =  chartGroup.append("g")
    .call(leftAxis);


      // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(smokeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "teal")
    .attr("opacity", ".5");


    /*
     *  Create group for two x-axis labels
     */
 
    var x_labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);


    var povertyLabel = x_labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = x_labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");


    var incomeLabel = x_labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");



    /*
     *  Create group for two y-axis labels
     */


    var y_labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width}, ${height / 20})`);


    var healthcareLabel = y_labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -1*height/2)
    .attr("y", -1*width-40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");


    var smokeLabel = y_labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -1*height/2)
    .attr("y", -1*width-60)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smoke (%)");


    var obeseLabel = y_labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -1*height/2)
    .attr("y", -1*width-80)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");



  /*
  *
  */

   // x axis labels event listener
   x_labelsGroup.selectAll("text").on("click", function() {

     // get value of selection
     var value = d3.select(this).attr("value");

     console.log("Selected value:")
     console.log(value)
     console.log("Y Axis")
     console.log(chosenYAxis)

     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

       // updates x scale for new data
       xLinearScale = xScale(smokeData, chosenXAxis);

       // updates x axis with transition
       xAxis = renderAxes(xLinearScale, xAxis);

       // updates circles with new x,y values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);



       // events = income, age, poverty
       // povertyLabel, ageLabel, incomeLabel

       if (chosenXAxis === "income") {
        
          incomeLabel
          .classed("active", true)
          .classed("inactive", false);
          
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);

          ageLabel
          .classed("active", false)
          .classed("inactive", true);

      }

      else if (chosenXAxis === "age") {

          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
          
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);

          ageLabel
          .classed("active", true)
          .classed("inactive", false);
      
      
      }

      else if (chosenXAxis === "poverty") {

        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
        
        povertyLabel
        .classed("active", true)
        .classed("inactive", false);

        ageLabel
        .classed("active", false)
        .classed("inactive", true);
    
    }

    } // outside IF

     
   });  //x_label change


      // x axis labels event listener
  y_labelsGroup.selectAll("text").on("click", function() {


      var value = d3.select(this).attr("value");
   
      console.log("y Selected value:")
      console.log(value)

      console.log('chosenXAxis')
      console.log(chosenXAxis)


      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

       // healthcareLabel - smokeLabel - obeseLabel
       // healthcare - smoke - obese

       // updates x scale for new data
       yLinearScale = yScale(smokeData, chosenYAxis);

       // updates x axis with transition
       yAxis = renderYAxes(yLinearScale, yAxis);

       // updates circles with new x,y values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        

        
        if (chosenYAxis === "healthcare") {
          
            healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
            
            smokeLabel
            .classed("active", false)
            .classed("inactive", true);

            obeseLabel
            .classed("active", false)
            .classed("inactive", true);

        }

        else if (chosenYAxis === "smokes") {

          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
          
          smokeLabel
          .classed("active", true)
          .classed("inactive", false);

          obeseLabel
          .classed("active", false)
          .classed("inactive", true);

        }

        else if (chosenYAxis === "obesity") {

          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
          
          smokeLabel
          .classed("active", false)
          .classed("inactive", true);

          obeseLabel
          .classed("active", true)
          .classed("inactive", false);

        }




      } //if 1

  });    



  }).catch(function(error) {
    console.log("Error")
    console.log(error);
  });