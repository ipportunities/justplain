import React, {useState} from 'react';

const SetImages = (props) => {

    //////////////////////
    ///Sorting
    const [draggedElIndex, setDraggedElIndex] = useState('');
    const [droppedElIndex, setDroppedElIndex] = useState('');

    function dragStart(e){
      setDraggedElIndex(e.target.getAttribute('index'));
      e.target.classList.add("isDragged")
    }
    function dragOver(e){
      if(e.target.getAttribute('index') == draggedElIndex){
        return false;
      }
      if(droppedElIndex != e.target.getAttribute('index'))
      {
        setDroppedElIndex(e.target.getAttribute('index'));
        removeDropClass()

        e.target.classList.add("drop_here")
      }
      let newImages = props.part.images;
      let element = newImages[e.target.getAttribute('index')];
      newImages.splice(e.target.getAttribute('index'), 1);
      newImages.splice(draggedElIndex, 0, element);
      props.setImages(newImages)
      setDraggedElIndex(e.target.getAttribute('index'));

      e.stopPropagation();
      e.preventDefault();
    }
    function drop(e){
      props.updatePart(props.index, 'images', props.images)
      removeDropClass()
    }
    function removeDropClass()
    {
      for(let i = 0 ; i < props.images.length ; i++)
      {
        var element = document.getElementById("image_" + i);
        element.classList.remove("drop_here");
      }
    }

  return(
    <>
    {props.part.subtype == "carousel" ?
      <div className="setImages center">
        <span className="btn btn-primary add" onClick={() => props.showMediaLibrary(props.index)}>Voeg afbeelding toe<i className="fa fa-plus"></i></span>
        <i className="fas fa-times close" onClick={() => props.closeEditContent()}></i>
        <br/><br/>
        <div>
          {(props.images.length > 0) ? props.images.map((image, index) =>
            <div id={"image_" + index} key={index} className="imageHolder" style={{ backgroundImage: "url("+image.url+")" }} draggable="true" onDragStart={(e) => dragStart(e)} onDragEnd={(e) => drop(e)} onDrop={(e) => drop(e)} onDragOver={(e) => dragOver(e)} index={index} >
              <i className="fas fa-trash" onClick={(e) =>props.deleteImage(index)}></i>
            </div>
          ):''}
        </div>
      </div>
    :''}
    </>
  )
}

export default SetImages;
