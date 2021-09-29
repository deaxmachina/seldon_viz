import React, { useState } from "react";
import "./ClothesMenu.css";
import * as d3 from 'd3';

import ankleBoot from "../../data/img/ankleBoot.png";
import bag from "../../data/img/bag.png";
import coat from "../../data/img/coat.png";
import dress from "../../data/img/dress.png";
import pullover from "../../data/img/pullover.png";
import sandal from "../../data/img/sandal.png";
import shirt from "../../data/img/shirt.png";
import sneaker from "../../data/img/sneaker.png";
import trouser from "../../data/img/trouser.png";
import tShirt from "../../data/img/tShirt.png";


const imgLookup = {
  'ankle boot': ankleBoot,
  'bag': bag,
  'coat': coat,
  'dress': dress,
  'pullover': pullover,
  'sandal': sandal,
  'shirt': shirt,
  'sneaker': sneaker,
  'trouser': trouser,
  't-shirt': tShirt
}

const ClothesMenu = ({ uniqueLabels, setSelectedItem }) => {

  const handleItemClick = (label, e) => {
    setSelectedItem(label)
    d3.selectAll('.clothes-menu-img').style('border', '3px solid white')
    d3.select(e.target).style('border', '4px solid #ffbe0b')
  }

  return (
    <>
      <div className="clothes-menu-container">
        
        {
          uniqueLabels.map((label, idx) => (
            <div className="clothes-menu-item" key={idx}>
              <div className="clothes-menu-label">{label}</div>
              <img 
                onClick={(e) => handleItemClick(label, e)}  
                className='clothes-menu-img' 
                src={imgLookup[label]}
              /> 
            </div>
          ))
        }
      </div>
    </>
  )
};

export default ClothesMenu;