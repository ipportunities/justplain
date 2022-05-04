import React from 'react';
import parse from 'html-react-parser';

const Divider = (props) => {

  //////////////////////
  ///Build divders
  function endPage(){
    return (
      <div className="end_page">
        Einde pagina
      </div>
    );
  }

  function beginSection() {
    return (
      <div className="begin_section end_page">
        <table>
          <tbody>
            <tr>
              <td>
                <b>Begin section</b>
              </td>
              <td>
                {parse(props.part.question)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function endSection(){
    return (
      <div className="end_section end_page">
        Einde sectie
      </div>
    );
  }

  return (
    <div>
      <div className='center'>
        {props.part.subtype == "begin sectie" ? beginSection():''}
        {props.part.subtype == "einde sectie" ? endSection():''}
        {props.part.subtype == "einde pagina" ? endPage():''}
      </div>
    </div>
  );
}

export default Divider;
