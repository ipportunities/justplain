import React, { useState } from 'react';

const Footer = (props) => {

  return (
    <div className="footer">
      <div className="container">
        <div className="title">Contact</div>
        <div className="row">
          {/*
            <div className="column">
              Kopopouders<br />

            </div>
            <div className="column">

            </div>
            */}
          <div className="column">
            <a href="mailto:kopopouders@trimbos.nl">kopopouders@trimbos.nl</a><br />
            <a href="https://kopopouders.nl/" target="_blank">Meer informatie</a><br />
            <a href="https://kopopouders.nl/site/Privacy%20statement/" target="_blank">Privacy Statement</a><br />
            &copy; Copyright Trimbos Instituut
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;
