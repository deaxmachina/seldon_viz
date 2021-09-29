import React from 'react';
import DatePicker from 'react-date-picker';
import "./DatePicker.css";

function DateSlider({ selectedDate, setSelectedDate, setAllTime }) {
  return (
    <div className="date-options-wrapper">
      <button onClick={() => setAllTime(true)}>all time</button>
      <div className="date-picker-wrapper">
        <DatePicker
          onChange={(e) => {
            setSelectedDate(e)
            setAllTime(false)
          }}
          value={selectedDate}
        />
      </div>
    </div>
  );
}

export default DateSlider;