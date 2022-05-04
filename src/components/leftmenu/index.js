import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import $ from "jquery";
import MenuSuperUser from "./menuSuperUser.js";
import MenuAdmin from "./menuAdmin.js";
import MenuCoach from "./menuCoach.js";
import MenuStudent from "./menuStudent.js";
import { setShowLeftMenu } from "../../actions/";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Menu = (props) => {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const showLeftMenu = useSelector(state => state.showLeftMenu);

  useEffect(() => {
    if(typeof props.showMenu != "undefined"){
      if(props.showMenu == true){
        toggleMenu()
        props.setShowMenu(false)
      }
    }
    /// leftMenu is voor studenten enkel te bereiken op obiel via balk onderaan de toggle knop more staat ergens anders in de componenten structuur middels redux wordt deze getoggeld
    if(auth.userType == 'student'){
      if(showLeftMenu){
        if (document.getElementById("menu_left").style.marginRight !== "0px"){
          toggleMenu()
        }
      } else {
        if (document.getElementById("menu_left").style.marginRight == "0px"){
          toggleMenu()
        }
      }
    }

  }, [props, showLeftMenu]);

  const toggleMenu = (event) => {
    if (document.getElementById("menu_left").style.marginRight !== "0px") {
      $('body').addClass('menuIsVisible');
      $("#menu_left").animate(
        {
          marginRight: "0px"
        },
        600
      );
      $("#nav-icon-wrapper, #menu_left").addClass("open");
      $(".overlay").fadeIn().unbind().bind('click', function(){
        $("#menu_left").animate(
          {
            marginRight: "-100%"
          },
          600
        );
        $('body').removeClass('menuIsVisible');
        $("#nav-icon-wrapper, #menu_left").removeClass("open");
        $(".overlay").fadeOut();
        if(auth.userType == 'student'){
          dispatch(setShowLeftMenu(false) )
        }
      });
      //$("body").addClass("menu_left_open");
    } else {
      $('body').removeClass('menuIsVisible');
      $("#menu_left").animate(
        {
          marginRight: "-100%"
        },
        600
      );
      $("#nav-icon-wrapper, #menu_left").removeClass("open");
      $(".overlay").fadeOut();
      if(auth.userType == 'student'){
        dispatch(setShowLeftMenu(false) )
      }
      //$("body").removeClass("menu_left_open");
    }
  };

  const selectMenu = userType => {
    switch (userType) {
      case "superuser":
        return <MenuSuperUser />;
        break;
      case "admin":
        return <MenuAdmin />;
        break;
      case "coach":
        return <MenuCoach />;
        break;
      case "student":
        return <MenuStudent setActivePart={props.setActivePart} />;
        break;
      default:
        return <div></div>;
    }
  };

  return (
    <>
      <span id="nav-icon-wrapper" className="menu_nav phone">
        <div id="nav-icon" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </span>
      <div id="menu_left">
        <div className="menu_left_inner">{selectMenu(auth.userType)}</div>
      </div>
    </>
  );
};

export default Menu;
