import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";

const colourLive = "#3a86ff"
const colourReference = "#ff006e"

const PlotLive = ({ 
  referenceData, liveData, selectedItem, uniqueLabels, selectedDate,
  allTime
}) => {

  const width = 650;
  const height = 550; 
  const margin = {top: 20, right: 30, bottom: 20, left: 30}

  const svgRef = useRef();

  useEffect(() => {

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
    const g = svg.selectAll("g").data([null]).join('g')
      .attr("cursor", "grab");

    /// Scales ///
    const xScale = d3.scaleLinear()
      .domain(d3.extent(referenceData, d => d['0']))
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(referenceData, d => d['1']))
      .range([height - margin.bottom, margin.top])

    /////////////////////////////////////////////////
    ////////////// Reference Data Plot //////////////
    /////////////////////////////////////////////////
    const referenceG = g.selectAll(".reference-g").data([null]).join('g')
      .classed("reference-g", true)

    const scatterReference = referenceG.selectAll("circle")
      .data(_.sampleSize(referenceData, 8000))
      .join("circle")
      .attr("cx", d => xScale(d['0']))
      .attr('cy', d => yScale(d['1']))
      .attr("r", 5)
      .attr("opacity", d => d.label === selectedItem ? 0.1 : 0.005)
      .attr("fill", colourReference)

    /////////////////////////////////////////////////
    ///////////////// Live Data Plot ////////////////
    /////////////////////////////////////////////////
    const liveG = g.selectAll(".live-g").data([null]).join('g')
      .classed("live-g", true)

    const selectionCondition = d => (d.prediction === selectedItem) 
    && (d.date.getTime() == selectedDate.getTime())

    const scatterLive = liveG.selectAll("circle")
      .data(_.sampleSize(liveData, 8000))
      .join("circle")
      .attr("cx", d => xScale(d['0']))
      .attr('cy', d => yScale(d['1']))
      .attr("r", 5)
      //.attr("opacity", d => selectionCondition(d) ? 0.4 : 0.005)
      .attr("fill", colourLive)
      .attr("opacity", d => allTime 
      ? d.prediction === selectedItem ? 0.4 : 0.005
      :selectionCondition(d) ? 0.4 : 0.005
      )


  /// Zoom and Pan ///
  function zoomed({transform}) {
    g.attr("transform", transform)
  }
  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 8])
    .on("zoom", zoomed))

     

  }, [selectedItem, selectedDate, allTime])

  return (
    <>
      <div>
        <svg ref={svgRef}></svg>
      </div>
    </>
  )
};

export default PlotLive;