import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import parse from 'html-react-parser';
import { setActivePage } from "../../actions";
import GetPart from '../content/front/get_part.js';
import { useLocation } from "react-router-dom";


const Single = () => {
  let location = useLocation();

  const dispatch = useDispatch();

  const activePage = useSelector(state => state.activePage);
  const intervention = useSelector(state => state.intervention);

  const [pageNotFound, setPageNotFound] = useState(false);
  const [page, setPage] = useState({
    title: "",
    parts: []
  });

  //key in pages array bepalen van page met page_id...
  const determinPageKey = (activePageId) => {
    intervention.settings.pages.forEach((page, key) => {
      if (parseInt(page.id) === parseInt(activePageId))
      {
        setPage({
          title: page.title,
          parts: page.settings.parts
        })
      }
    });
  }

  useEffect(() => {

    let querystring = location.pathname.split("/");
    //hebben we een page_id in de querystring?
    if (querystring.length > 6 && querystring[4].length > 0)
    {
      //is het een integer?
      if (!isNaN(querystring[4]))
      {
        //ongelijk aan de activePage in de redux store?
        if (activePage !== parseInt(querystring[4]))
        {
          //komt het page_id voor in intervention.settings.pages ?
          let pageExists = intervention.settings.pages.find((page) => {
            return parseInt(page.id) === parseInt(querystring[4])
          });
          if (pageExists)
          {
            //pagina bestaat, vastleggen als activePage in redux store
            dispatch(
              setActivePage(
                parseInt(querystring[4])
              )
            );
            setPageNotFound(false);
            determinPageKey(parseInt(querystring[4]));
          }
          else
          {
            //pagina bestaat niet
            setPageNotFound(true);
          }
        }
        else
        {
          //page_id in url is zelfde als activePage in redux store
          setPageNotFound(false);
        }
      }
      else
      {
        //page_id in url is geen integer...
        setPageNotFound(true);
      }
    }
    else //geen page_id in url???, was er een eerdere active page
    {
      if (activePage !== 0)
      {
        //voor de zekerheid checken of deze wel bestaat
        let pageExists = intervention.settings.pages.find((page) => {
          return parseInt(page.id) === parseInt(activePage)
        });
        if (!pageExists)
        {
          //activePage bestaat niet...
          dispatch(
            setActivePage(
              parseInt(0)
            )
          );
          setPageNotFound(true);
        }
        else
        {
          //activePage bestaat
          setPageNotFound(false);
          intervention.settings.pages.forEach((page, key) => {
            if (parseInt(page.id) === parseInt(activePage))
            {
              setPage({
                title: page.title,
                parts: page.settings.parts
              })
            }
          });
        }
      }
      else
      {
        //geen page_id in url en niet in redux store -> activePage
        setPageNotFound(true);
      }
    }

  }, [intervention, activePage]);

  return(
    <div className='page'>

      {
      !pageNotFound ?

        <div>
          <div className="dashboard lessoncontent front included">
            <div className="holder clearfix">
              <div className="right">
                <h1>{parse(page.title)}</h1>

                {
                  page.parts.map((part, index) => {
                    return (
                    <div key={index} className="component_holder">
                      <GetPart part={part} />
                    </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      :
        <div className="not_found">
          <h1>Oeps</h1>
          Deze pagina bestaat niet...
        </div>
      }

    </div>
  )
}

export default Single;
