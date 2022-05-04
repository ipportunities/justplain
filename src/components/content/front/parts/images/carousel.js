import React, {useState, useEffect} from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import parse from 'html-react-parser';
import {checkIfVariableExistAndReturn} from "../../../../helpers/returnVariable";

import $ from "jquery";

const Carousel = (props) => {

  function getCaption(content){
    if(checkIfVariableExistAndReturn(content) != ""){
      return <div className="caption">{parse(checkIfVariableExistAndReturn(content))}</div>
    }
  }
  function getCaptionAbove(content){
    if(checkIfVariableExistAndReturn(content) != ""){
      return <div className="caption above">{parse(checkIfVariableExistAndReturn(content))}</div>
    }
  }

  //////////////////////
  ///Carousel
  function PrevButton({ onClick }) {
    return <i className="fas fa-chevron-left" onClick={onClick}></i>;
  }
  function NextButton({ onClick }) {
    return <i className="fas fa-chevron-right" onClick={onClick}></i>;
  }
  const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: <PrevButton />,
      nextArrow: <NextButton />,
    };

  const [widthSlide, setWidthSlide] = useState($(".right .content").width())

  useEffect(() => {
    window.addEventListener('resize', setWidthSlide($(".right .content").width()))
  }, []);

  const asBg = true;

  return(
    <>
      {(props.images.length > 0) && props.part.subtype == "carousel" ?
          <Slider {...sliderSettings}>
            {props.images.map((image, index) =>
              <div key={index}>
                {getCaptionAbove(props.images[index].captionAbove)}
                {asBg ?
                  <div  className="imageHolder" style={{width:widthSlide}}>
                    {props.buildImage(image.url)}
                  </div>
                  :
                  <>
                    <img src={image.url}/>
                  </>
                }
                {getCaption(props.images[index].caption)}
              </div>
            )}
          </Slider>
      :''}
    </>
  )
}

export default Carousel;
