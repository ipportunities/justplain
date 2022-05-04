import React from "react";

const SortObjectArray = (key, order = 'asc') => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    let varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    let varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if(varA % 1 === 0 && varB % 1 === 0){
      varA = parseInt(varA)
      varB = parseInt(varB)
    }
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}
export default SortObjectArray;
