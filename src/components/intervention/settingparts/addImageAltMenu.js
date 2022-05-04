import React, {useEffect}  from 'react';

const AddImageAltMenu = (props) => {

  return(
    <span className='btn edit disabled' style={{backgroundImage: (props.image.length > 0) ? 'url("'+props.image+'")' : '', backgroundSize: 'cover', border: '1px solid #afb1b1', backgroundColor: (props.image.length > 0) ? 'transparent' : ''}} onClick={() => props.showMediaLibrary(props.index)}><i className="fa fa-image"></i></span>
  )

}

export default AddImageAltMenu;
