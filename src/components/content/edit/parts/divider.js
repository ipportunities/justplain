import React, {useState, useEffect} from 'react';
import {componentOptions} from "./helpers/options.js";
import InputTextfield from './input_textfield.js';
import Routing from "./helpers/routing.js";
import t from "../../../translate";

const Divider = (props) => {

  const [routing, setRouting] = useState(false);
  const [routingOn, setRoutingOn] = useState(true);
  const [routingAvailable, setRoutingAvailable] = useState(false);

  useEffect(() => {
    if(props.part.routing != ""){
      setRouting(props.part.routing)
    }

  }, []);

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Verdeler");
  });
  const available_subtypes = this_componentOptions[0].subtypes;

  //////////////////////
  ///Update routing
  function updateRouting(routing, item_id){
    props.updatePart(props.index, 'routing', routing)
    setRouting(routing)
  }

  //////////////////////
  ///Build divders
  function endPage(){
    return (
      <div className="end_page">
        <table>
          <tbody>
            <tr>
              <td>
                Einde pagina
              </td>
              <td>
                <Routing routingOn={routingOn} updateRouting={updateRouting} parts={props.parts} index={props.index} setRoutingAvailable={setRoutingAvailable} item_id="0" routing={!routing ?"":routing} skipNext='true'/>
              </td>
              <td>

              </td>
            </tr>
          </tbody>
      </table>
      </div>
    );
  }

  function beginSection(){
    return (
      <div className="begin_section end_page">
        <table>
          <tbody>
            <tr>
              <td>
                <b>Begin section</b>
              </td>
              <td>
                <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder="Sectie naam"/>
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
      <select className="subtypeChanger" onChange={(e) => props.updatePart(props.index, 'subtype', e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{t(subtype.niceName)}</option>
        )}
      </select>
      <div className='center'>
        {props.part.subtype == "begin sectie" ? beginSection():''}
        {props.part.subtype == "einde sectie" ? endSection():''}
        {props.part.subtype == "einde pagina" ? endPage():''}
      </div>
    </div>
  );
}

export default Divider;
