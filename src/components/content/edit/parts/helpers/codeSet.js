import React, {useState} from 'react';
import t from "../../../../translate";

const CodeSet = (props) => {

  //////////////////////
  ///Toggle showCode
  function toggleShowCode(){
    let toggle = showCode ? false:true;
    setShowCode(toggle)
  }

  //////////////////////
  ///Code
  const [showCode, setShowCode] = useState(false);

  return(
    <span>
      <span className={"btn grey" + (showCode == true ? ' active':' hide')} onClick={()=>toggleShowCode()} data-tip={t("Code")}>
        <i className="fas fa-code"></i>
      </span>
      <input type="text" className={'code' + (showCode == true ? ' active':' hide')} placeholder="code" onChange={e => props.updatePart(props.index, 'code', e.target.value)} value={props.part.code} />
    </span>
  )
}

export default CodeSet
