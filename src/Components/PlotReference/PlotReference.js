import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";

const ScatterPlot = ({ referenceData, selectedItem, uniqueLabels }) => {

  const width = 700;
  const height = 600; 
  const margin = {top: 20, right: 20, bottom: 20, left: 20}

  const svgRef = useRef();

  useEffect(() => {

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    /// Scales ///
    const xScale = d3.scaleLinear()
      .domain(d3.extent(referenceData, d => d['0']))
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(referenceData, d => d['1']))
      .range([height - margin.bottom, margin.top])

    /// Scatterplot ///
    const g = svg.selectAll("g").data([null]).join('g')
      .attr("cursor", "grab");
    const scatter = g.selectAll("circle")
      .data(_.sampleSize(referenceData, 5000))
      //.data(referenceData.filter(d => d.label === selectedItem))
      .join("circle")
      .attr("cx", d => xScale(d['0']))
      .attr('cy', d => yScale(d['1']))
      .attr("r", 5)
      .attr("opacity", d => selectedItem === 'all' ? 0.3 
      : d.label === selectedItem ? 0.3 : 0.03
      )
      .attr("fill", d => selectedItem === 'all' ? '#ebebeb' 
        : d.label === selectedItem ? '#ff006e' : '#ebebeb'
      )

      function zoomed({transform}) {
        g.attr("transform", transform)
      }
      svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed))

  }, [selectedItem])

  return (
    <>
      <div>
        <svg ref={svgRef}></svg>
      </div>
    </>
  )
};

export default ScatterPlot;