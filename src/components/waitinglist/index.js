import React from 'react';
import { useSelector } from "react-redux";
import LeftMenu from "../dashboard/leftmenu";

const Waitinglist = () => {


  const auth = useSelector(state => state.auth);

  const openSearch = false;

  return(
    <div className={"coachInterface coaches" + (openSearch ? ' openSearch':'') + " " + auth.userType}>
      Waitinglist...
      <LeftMenu />
    </div>
  )
}

export default Waitinglist;