import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";

const colourLive = "#3a86ff"
const colourReference = "#ff006e"

const PlotAnimated = ({ liveData, referenceData, selectedItem }) => {

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
      .domain(d3.extent(liveData, d => d['0']))
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(liveData, d => d['1']))
      .range([height - margin.bottom, margin.top])

    /// Scatterplot for the reference data ///
    const gRef = svg.selectAll("g").data([null]).join('g')
    const scatterRef = gRef.selectAll("circle")
      .data(_.sampleSize(referenceData, 2000))
      .join("circle")
      .attr("cx", d => xScale(d['0']))
      .attr('cy', d => yScale(d['1']))
      .attr("r", 5)
      .attr("opacity", d => selectedItem === 'all' ? 0.3 
      : d.label === selectedItem ? 0.3 : 0.03
      )
      .attr("fill", d => selectedItem === 'all' ? '#ebebeb' 
        : d.label === selectedItem ? colourReference : '#ebebeb'
      )

    /// Scatterplot for the live data ///
    d3.selectAll('.g-scatter').remove()
    const gLive = svg.selectAll(".g-scatter").data([null]).join('g').classed('g-scatter', true)
    const scatterLive = gLive.selectAll("circle")
      .data(liveData.filter(d => d.prediction === selectedItem).sort((a, b) => b.date - a.date))
      .join("circle")
      .attr("cx", d => xScale(d['0']))
      .attr('cy', d => yScale(d['1']))
      .attr("r", 0)
      .attr("opacity", d => d.prediction === selectedItem ? 0.3 : 0)
      .attr("fill", colourLive)
      .transition().ease(d3.easeLinear)
        .delay(function(d, i) { return i * 20 })
          .attr("r", 5)

  }, [selectedItem, liveData])

  return (
    <>
      <div>
        <svg ref={svgRef}></svg>
      </div>
    </>
  )
};

export default PlotAnimated;