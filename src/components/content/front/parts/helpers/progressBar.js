import React from 'react';

const ProgressBar = (props) => {

  function buildBar(){
    const steps = [];
    for (let i = 1; i <= props.nrPages; i++) {
      steps.push(<div className={"step" + (i <= props.currentPageIndex + 1 ? ' done':'')} style={{width:(100 /props.nrPages)+"%"}}></div>);
    }
    return steps;
  }

  return(
    <div className='center'>
      <div className='progressBar'>
        {buildBar()}
      </div>
    </div>
  )
}

export default ProgressBar;
