import React from "react";
import parse from 'html-react-parser';

const ErrorPage = props => {
  return(
    <div className="errorPage">
      <div className="center">
        {!props.text ? parse("<h1>Oeps...</h1> pagina niet gevonden<br/><br/><a href='/' className='btn btn-primary'>Naar je dashboard</a>"):props.text}
      </div>
    </div>
  )
}
export default ErrorPage;
