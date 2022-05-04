import React from "react";
import john from "../../images/john.jpg";
import t from "../translate";
import Logout from "../logout";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const ProfileLinkBox = () => {

  const history = useHistory();
  const auth = useSelector(state => state.auth);

  function openSettings()
  {
    history.push(
      "/settings/"
    );
  }

  return(
    <div className="profileLinkBox">
      <table>
        <tbody>
          <tr>
            <td>
              <img src={john} />
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

export default ProfileLinkBox;
