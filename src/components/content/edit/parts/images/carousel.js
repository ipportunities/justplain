import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ContentEditable from 'react-contenteditable'
import t from "../../../../translate";
import {appSettings} from "../../../../../custom/settings";

const Carousel = (props) => {

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

  return(
    <>
      {props.part.subtype == "carousel" ?
      <div className={appSettings.captionAboveImages == true ? 'captionAboveImages':''}>
        {(props.images.length > 0) ?
            <Slider {...sliderSettings}>
              {props.images.map((image, index) =>
                <div key={index}>
                  {appSettings.captionAboveImages == true ?
                    <ContentEditable
                        html={typeof props.images[index].captionAbove != "undefined" ? props.images[index].captionAbove:""}
                        disabled={false}
                        onChange={(e) => props.updateCaptionAbove(e.target.value, index)} // handle innerHTML change
                        className="caption above"
                        placeholder={t("Caption")}
                      />
                    :''}
                  <div className="imageHolder">
                    {props.buildImage(image.url)}
                  </div>
                  <ContentEditable
                      html={typeof props.images[index].caption != "undefined" ? props.images[index].caption:""}
                      disabled={false}
                      onChange={(e) => props.updateCaption(e.target.value, index)} // handle innerHTML change
                      className="caption"
                      placeholder={t("Caption")}
                    />
                </div>
              )}
            </Slider>
        :''}
      </div>
      :''}
    </>
  )
}

export default Carousel;
