import React, { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";
import _ from "lodash";
import liveDataLoad from "./data/live.csv";
import ScatterPlot from "./Components/PlotReference/PlotReference";
import referenceDataLoad from "./data/reference.csv";
import ClothesMenu from "./Components/ClothesMenu/ClothesMenu";
import DateSlider from "./Components/DatePicker/DatePicker";
import PlotLive from "./Components/PlotLive/PlotLive";
import PlotAnimated from "./Components/PlotAnimated/PlotAnimated"

/////////////////////////////
/// Explore training data ///
/////////////////////////////
const ExploreTrainingData = ({ 
  uniqueLabels, selectedItem, setSelectedItem, referenceData
}) => {
  return (
    <>
      <h2 className="section-title">Explore Training Data</h2>
      <p className="instructions clothes-menu-instructions">
        * Click on an item to highlight data for just this item.
        You can zoom in and out of the graph and hold to move around.
      </p>
      <ClothesMenu uniqueLabels={uniqueLabels} setSelectedItem={setSelectedItem}/>
      <ScatterPlot referenceData={referenceData} selectedItem={selectedItem} uniqueLabels={uniqueLabels} /> 
    </>
  )
}

/////////////////////////////
//// Explore Predictions ////
/////////////////////////////
const ExplorePredictions = ({
  uniqueLabels, referenceData, liveData,
  selectedDate, setSelectedDate,
  selectedItem, setSelectedItem, 
  allTime, setAllTime
}) => {
  return (
    <>          
      <h2 className="section-title">Explore Predictions</h2>
      <p className="instructions clothes-menu-instructions instructions-long">
        * Click on an item to highlight data for just this item.
        You can zoom in and out of the graph and hold to move around.
        <br/>
        Colours: <span className="ref-data-col">reference data</span> and <span className="live-data-col">live data</span>.
        <br />
        Select item and date to show live data for that date and item and reference data for the item (without date). Note: currently only dates between 3rd-7th Sept have live data.
        <br />
        The default selection is 'all time' i.e. once you click an item, all the live data will be shown together with the reference data. 
      </p>
      <ClothesMenu uniqueLabels={uniqueLabels} setSelectedItem={setSelectedItem}/>
      <DateSlider 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        setAllTime={setAllTime}
      />
      <br/><br/>
      <PlotLive 
        referenceData={referenceData}
        liveData={liveData} 
        selectedItem={selectedItem} 
        uniqueLabels={uniqueLabels} 
        selectedDate={selectedDate} 
        allTime={allTime}
      />
    </>
  )
}

const AnimationExample = ({ 
  uniqueLabels, setAnimationSelectedItem, liveData, referenceData, animationSelectedItem
}) => {
  return (
    <>
      <h2 className="animation-example-text">Simple Animation Example</h2>
      <p className="animation-example-text">
        Below is a simple example of what an animation might look like. Click on an item to see
        predictions over time in blue, on top of reference data in pink.  
      </p>
      <ClothesMenu uniqueLabels={uniqueLabels} setSelectedItem={setAnimationSelectedItem}/>
      <PlotAnimated 
        liveData={liveData}
        referenceData={referenceData}
        selectedItem={animationSelectedItem}
      />
    </>
  )
}


/////////////////////////////
////////// Notes ////////////
/////////////////////////////
const NotesSection = () => {
  return (
    <div className="notes-wrapper">
      <p>
        My approach was simple due to time constraints. Everything took me about 4-5 hours. 
      </p>
      <h3>Concept</h3>
      <ul>
        <li>
          Use the training data as a ‘guide’ in space about where the preds should be. In particular, use semi-transparent circles to create a coloured space where each item should be. This should make it easy to see, once the training data is placed on top, using a different colour, if there are any stark differences. 
        </li>
        <li>
          For example, select pullover and 6th September. We can see a big blue cluster that doesn’t overlap with a pink cluster, so the live data is different from the training data. At the same time, we can easily see that the overall model performance is quite good, as there is a lot of blue-pink overlap for all the items. 
        </li>
      </ul>

      <h3>Not quite ready</h3>
      <ul>
        <li>
          The current menu for filtering data is finicky. How it works now: By default all the data is visualized with very low opacity. The user has to first select an item by clicking on it, which will display the data for that item with higher opacity. Then the user can select a date to filter the live data, or click on ‘all time’ to view all the data for the item again. 
        </li>
        <li>
          The date picker should reset when ‘all time’ is clicked, and the ‘all time button’ should stay highlighted while we are displaying all the data. 
        </li>
        <li>
          The loading is slow, especially when dates are selected. This is because we are displaying thousands of SVGs (although I do some data sampling). Further clever data sampling would speed it up. Alternatively, if all the data has to be displayed, we can switch to Canvas. 
        </li>
      </ul>

      <h3>If I had more time, I’d explore the following</h3>
      <ul>
        <li>
          Animate the timeline, with the option to stop the animation. This would make it a lot easier to see the evolution of preds over time and/if any of the items start diverging from some date onwards. The calendar view that I implemented is just a first pass. 
        </li>
        <li>
          Have a more granular time view, e.g. down to the hour or even minutes. It would also be useful to aggregate based on larger time intervals if data is available. 
        </li>
        <li>
          Instead of a scatterplot, for the training data create a space like a Voronoi diagram, where whole regions of the space are coloured based on the cluster that is that space. This should make it easier to plot dots on top with the live data and see if there are discrepancies. 
        </li>
      </ul>
    </div>
  )
}


const App = () => {

  const [liveData, setLiveData] = useState(null)
  const [referenceData, setReferenceData] = useState(null)
  const [uniqueLabels, setUniqueLabels] = useState(null)
  const [selectedItem, setSelectedItem] = useState("all")
  const [animationSelectedItem, setAnimationSelectedItem] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [allTime, setAllTime] = useState(true)

  /// Load in the data ///
  useEffect(() => {
    // load the live data into state to hold it
    d3.csv(liveDataLoad, d3.autoType).then(data => {         
      data.forEach(d => d.date = d3.timeParse("%d-%m-%Y")(d.timestamp.split(' ')[0]))
      setLiveData(data)
    })
    // load the reference data into state to hold it
    d3.csv(referenceDataLoad, d3.autoType).then(data => {
      const uniqueLabel = _.uniqBy(data, d => d.label).map(d => d.label)
      setUniqueLabels(uniqueLabel)
      setReferenceData(data)
    })

  }, [])

  return (
    <>
      {
        referenceData && uniqueLabels && liveData ? 
          <div className='wrapper'>
            <ExploreTrainingData
              uniqueLabels={uniqueLabels}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              referenceData={referenceData}
            />
            <ExplorePredictions 
              uniqueLabels={uniqueLabels}
              referenceData={referenceData}
              liveData={liveData}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              allTime={allTime}
              setAllTime={setAllTime}
            />
            <br/><br/><br/>
            <NotesSection />
            <AnimationExample 
              uniqueLabels={uniqueLabels}
              setAnimationSelectedItem={setAnimationSelectedItem}
              liveData={liveData}
              referenceData={referenceData}
              animationSelectedItem={animationSelectedItem}
            />
          </div>
        : null
      }
    </>
  )
};

export default App;