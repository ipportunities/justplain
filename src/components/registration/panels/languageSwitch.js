import React from 'react';

const LanguageSwitch = (props) => {
  return(
    <div className="languageSwitch">
      <span className={props.language === 1 ? 'active pointer' : 'pointer'} onClick={() => props.changeLanguage(1)}>NL</span> | <span className={props.language === 2 ? 'active pointer' : 'pointer'} onClick={() => props.changeLanguage(2)}>EN</span>
    </div>
  )
}

export default LanguageSwitch;
