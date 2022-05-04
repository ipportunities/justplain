import standardAvatar from "../../images/course/standard/avatar.png";

export const getProfileImage = (user, url) => {
  let profile_url = standardAvatar;
  if(user.profile_pic != ""){
    profile_url = url+"/uploads/user/"+ user.user_id + "/" + user.profile_pic + "?"+new Date().getTime()
  }

  return profile_url;
}
