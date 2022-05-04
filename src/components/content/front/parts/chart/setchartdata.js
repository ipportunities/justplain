import React, {useState, useEffect} from 'react';

const SetChartData = (props) => {

  const [draggedElIndex, setDraggedElIndex] = useState('');
  const [droppedElIndex, setDroppedElIndex] = useState('');



  return (
    <div>
        {(props.items.length > 0) ? props.items.map((item, index) =>
          <div className="item" id={"item_" + index} key={index} draggable="true" onDragStart={(e) => dragStart(e)} onDragEnd={(e) => drop(e)} onDrop={(e) => drop(e)} onDragOver={(e) => dragOver(e)} index={index} >
          <table>
            <tbody>
              <tr>
                <td>
                  <label>
                    <ContentEditable
                        html={item.content}
                        placeholder="Label"
                        disabled={false}
                        onChange={(e) => updateItem(index, e.target.value, 'content')}
                        className="input_no_bg"
                        type="number"
                      />
                    </label>
                </td>

                <td>
                <label>
                  <ContentEditable
                      html={item.value}
                      placeholder="Waarde"
                      disabled={false}
                      onChange={(e) => updateItem(index, e.target.value, 'value')}
                      className="input_no_bg"
                    />
                  </label>
                </td>
                <td>
                <span className="btn handle">
                  <i className="fas fa-expand-arrows-alt"></i>
                </span>
                </td>
                <td>
                  <span className="delete btn" onClick={(e) => removeItem(index, e)} ><i className="fa fa-minus"></i></span>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        ):''}
      </div>
      <br/>
      <span className="btn btn-primary add" onClick={() => addItem()}>Add item<i className="fa fa-plus"></i></span>
    </div>
  );
}

export default SetChartData;
