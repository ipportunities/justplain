import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActivePart, setShowLeftMenu } from "../../actions/";
import t from "../translate";
import Logout from "../logout";
import { useHistory } from "react-router-dom";
import standardAvatar from "../../images/course/standard/avatar.png";

const LinkBox = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const url = useSelector(state => state.url);
  const activeIntervention = useSelector(state => state.activeIntervention);

  const [profileImage, setProfileImage] = useState(standardAvatar)

  useEffect(() => {
    if (auth != "") {
      if(auth.profile_pic != ""){
        setProfileImage(url+"/uploads/user/"+ auth.user_id + "/" +auth.profile_pic + "?"+new Date().getTime())
      }
    }
  }, [auth]);

  const changeActivePart = (activePart) => {
    dispatch(setActivePart(activePart));
    dispatch(setShowLeftMenu(false))
    history.push("/course/"+activeIntervention+"/"+activePart);
  }

  return(
    <div className="linkbox" onClick={()=>changeActivePart('settings')}>
      <table className={typeof props.highlightName != "undefined"?props.highlightName:''}>
        <tbody>
          <tr>
            <td>
              <div className="image" style={{ backgroundImage: "url("+ profileImage + ")" }}>

              </div>
            </td>
            <td>
              {auth.name}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default LinkBox;
