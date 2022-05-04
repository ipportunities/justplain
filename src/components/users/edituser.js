import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {useSelector} from 'react-redux';
//import {user_reset, user_set} from '../../actions';
import apiCall from "../api";
import { getClone } from "../utils";

//let rendercount = 0;

const Edituser = forwardRef((props, ref) => {

    const [state, setState] = useState({
        user: {
            id: 0,
            firstname: '',
            insertion: '',
            lastname: '',
            email: '',
            phone: '',
            organisation_id: 0,
            type: '',
            login: '',
            password: '',
            password_check: '',
        },
        organisations: [],
        types:[],
        message: '',
    });

    //laden state met data uit props
    useEffect(() => {
        const newState = getClone(state);
        newState.user = props.user;
        newState.user.password = '';
        newState.user.password_check = '';
        newState.organisations = props.organisations;
        newState.types = props.types;
        setState(newState);
    }, [props.user])

    const auth = useSelector(state => state.auth);
    //const user = useSelector(state => state.user);


    const onChange = (e) => {

        e.preventDefault(); 
        const newState = getClone(state);
        newState.user[e.target.name] = e.target.value;
        newState.message = '';
        setState(newState);

      }
    
      //deze functie wordt aangeroepen door button in component Modal -> ref functie koppelt 
      //componenten aan elkaar
      useImperativeHandle(ref, () => ({

        submitHandler() {

          saveUserApi(auth.token, state.user).then(resp => {
            if (resp.error === 0)
            {
              if (resp.save_user === true)
              {
                props.closeModal();
              }
              else
              {
                const newState = getClone(state);
                state.message = resp.msg;
                setState(newState);
              }
            }
            else
            {
              alert(resp.msg); //todo -> message in erorbox weergeven
            }
          }).catch(() => {
            alert("something went wrong..."); //todo
          });

        }
    
      }));

    return (
        <div>
            <div className={(state.message.length < 1) ? 'hidden' : 'alert alert-danger'} role="alert"><i className="fas fa-exclamation-circle"></i> {props.message}</div>
            <form>
                <div className="form-group">
                    <label htmlFor="firstname">{t("Voornaam")}</label>
                    <input type="text" className="form-control" id="firstname" name="firstname" aria-describedby="firstname" placeholder="" value={state.user.firstname} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="insertion">{t("Tussenvoegsel")}</label>
                    <input type="text" className="form-control" id="insertion" name="insertion" aria-describedby="insertion" placeholder="" value={state.user.insertion} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">{t("Achternaam")}</label>
                    <input type="text" className="form-control" id="lastname" name="lastname" aria-describedby="lastname" placeholder="" value={state.user.lastname} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">{t("E-mail")}</label>
                    <input type="text" className="form-control" id="email" name="email" aria-describedby="email" placeholder="" value={state.user.email} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">{t("Telefoonnummer")}</label>
                    <input type="text" className="form-control" id="phone" name="phone" aria-describedby="phone" placeholder="" value={state.user.phone} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="login">{t("Gebruikersnaam")}</label>
                    <input type="text" className="form-control" id="login" name="login" aria-describedby="login" placeholder="" value={state.user.login} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="login">{t("Wachtwoord")}</label>
                    <input type="password" className="form-control" id="password" name="password" aria-describedby="password" placeholder={(state.user.id == 0) ? '' : 'Vul dit veld alleen indien u het wachtwoord wenst te wijzigen'} value={state.user.password} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="login">{t("Wachtwoord ter controle")}</label>
                    <input type="password" className="form-control" id="password_check" name="password_check" aria-describedby="password_check" placeholder={(state.user.id == 0) ? '' : 'Vul dit veld alleen indien u het wachtwoord wenst te wijzigen'} value={state.user.password_check} onChange={onChange} />
                </div>
                
                <div className={(auth.user_id === props.user.id || props.user.id === 0) ? 'hidden' : 'form-check'}>
                    <input className="form-check-input" type="checkbox" id="remove" name="remove"/>
                    <label className="form-check-label" htmlFor="remove">
                    {t("Verwijder gebruiker")}
                    </label>
                </div>

            </form>
        </div>
    )
});

export default Edituser;

//gebruiker opslaan
function saveUserApi(token, user) {

    let apiMsg = {
        action: 'save_user',
        token: token,
        data: {
            user
        }
    }
  
    return new Promise((resolve, reject) => {
  
        apiCall(apiMsg).then(resp => {
          try {
            resolve(JSON.parse(resp));
          } catch(e) {
            resolve(false); //todo nonvalid json
          }
            resolve(resp);
        }).catch(() => {
            resolve(false);
        });
    });
  
  }
