import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import LeftMenu from "../../dashboard/leftmenu";
import t from "../../translate";
//bootstrap Components
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const UserEdit = () => {

  let { user_id } = useParams({ user_id });

  const [user, setUser] = useState({
    id: 0,
    firstname: "",
    insertion: "",
    lastname: "",
    email: "",
    phone: "",
    organisation_id: 0,
    type: "",
    login: "",
    password: "",
    password_check: "",
    rights: {
      config_access: false, 
      coaches_access: false, 
      data_access: false
    }
  })
  const [organisations, setOrganisations] = useState([]);
  const types = ["superuser", "admin"];
  const [showPassword, setShowPassword] = useState(false);
  const [removeUser, setRemoveUser] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);

  useEffect(() => {

    if (typeof user_id !== 'undefined' && Number.isInteger(parseInt(user_id)) && user_id > 0)
    {
      apiCall({
        action: "get_admin",
        token: auth.token,
        data: {
          user_id
        }
      }).then(resp => {
        if (typeof resp.user !== 'undefined') {
          setUser(resp.user);
        }
        if (typeof resp.organisations !== 'undefined') {
          setOrganisations(resp.organisations);
        }
      });
    }

  }, [user_id]);

  const toggleRights = (e, accessType) => {
    const newUser = {...user};
    if (e.target.id.substr(-2) === "ja") {
      newUser.rights[accessType + "_access"] = true;
    } else {
      newUser.rights[accessType + "_access"] = false;
    }
    setUser(newUser);
  }

  const onChange = e => {
    e.preventDefault();
    const newUser = {...user};
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
    setErrorMessage("");
  }

  const saveUser = () => {}

  return (
    <div className="whiteWrapper">
      <LeftMenu />
      <Container style={{padding:'20px',width:'960px'}}>

        <h2>
          <i className="fas fa-users"></i> {parseInt(user_id) === 0 ? t('Toevoegen admin') : t('Wijzigen admin') } &nbsp; 
        </h2>

        <Alert className={message.length < 1 ? "hidden" : ""}  variant="success">
          {message}
        </Alert>

        <Alert className={errorMessage.length < 1 ? "hidden" : ""}  variant="danger">
          <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
        </Alert>

        <Form>
          {/* <div className="form-row align-items-center"> */}
          <Form.Row>
            <Col lg="5">
              <Form.Label htmlFor="firstname">{t("Voornaam")}</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="firstname"
                name="firstname"
                aria-describedby="firstname"
                placeholder=""
                value={user.firstname}
                onChange={onChange}
              />
            </Col>
            <Col lg="2">
              <Form.Label htmlFor="insertion">{t("Tussenvoegsel")}</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="insertion"
                name="insertion"
                aria-describedby="insertion"
                placeholder=""
                value={user.insertion}
                onChange={onChange}
              />
            </Col>
            <Col lg="5">
              <Form.Label htmlFor="lastname">{t("Achternaam")}</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="lastname"
                name="lastname"
                aria-describedby="lastname"
                placeholder=""
                value={user.lastname}
                onChange={onChange}
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Label htmlFor="email">{t("E-mail")}</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="email"
                name="email"
                aria-describedby="email"
                placeholder=""
                value={user.email}
                onChange={onChange}
              />
            </Col>
            <Col>
              <Form.Label htmlFor="phone">{t("Telefoonnummer")}</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                aria-describedby="phone"
                placeholder=""
                value={user.phone}
                onChange={onChange}
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Label htmlFor="type">{t("Type")}</Form.Label>
              <select
                id="type"
                name="type"
                className="form-control"
                value={user.type}
                disabled={user_id != 0 ? "disabled" : ""}
                onChange={onChange}
              >
                <option value=""></option>
                {types.map(type => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Col>
            <Col>
              <Form.Label htmlFor="organisation_id">{t("Organisatie")}</Form.Label>
              <select
                id="organisation_id"
                name="organisation_id"
                className="form-control"
                value={user.organisation_id}
                disabled={user_id != 0 ? "disabled" : ""}
                onChange={onChange}
              >
                <option value="0"></option>
                {organisations.map(org => (
                  <option value={org.id} key={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </Col>
          </Form.Row>

          <div className={user.type == 'admin' != 0 ? "form-group" : "hidden"}>
            
            <Form.Label>{t("Toegang tot")}</Form.Label>

            <div className="form-check">
              <Form.Label>Configureren interventie </Form.Label><br />
              <Form.Check
                className="form-check-input"
                type="radio"
                name="config_access"
                id="config_access_ja"
                onChange={(e) => toggleRights(e, 'config')}
                checked={user.rights.config_access}
              /> 
              <Form.Label className="form-check-label" htmlFor="config_access_ja">
                {t("Ja")}
              </Form.Label>
              <Form.Check
                className="form-check-input"
                type="radio"
                name="config_access"
                id="config_access_nee"
                onChange={(e) => toggleRights(e, 'config')}
                checked={!user.rights.config_access}
              />
              <Form.Label className="form-check-label" htmlFor="config_access_nee">
                {t("Nee")}
              </Form.Label>
            </div>

            <div className="form-check">
              <Form.Label>Managen coaches </Form.Label><br />
              <Form.Check
                className="form-check-input"
                type="radio"
                name="coaches_access"
                id="coaches_access_ja"
                onChange={(e) => toggleRights(e, 'coaches')}
                checked={user.rights.coaches_access}
              />
              <Form.Label className="form-check-label" htmlFor="coaches_access_ja">
                {t("Ja")}
              </Form.Label>
              <Form.Check
                className="form-check-input"
                type="radio"
                name="coaches_access"
                id="coaches_access_nee"
                onChange={(e) => toggleRights(e, 'coaches')}
                checked={!user.rights.coaches_access}
              />
              <Form.Label className="form-check-label" htmlFor="coaches_access_nee">
                {t("Nee")}
              </Form.Label>
            </div>

            <div className="form-check">
              <Form.Label>Onderzoeks data </Form.Label><br />
              <Form.Check
                className="form-check-input"
                type="radio"
                name="data_access"
                id="data_access_ja"
                onChange={(e) => toggleRights(e, 'data')}
                checked={user.rights.data_access}
              />
              <Form.Label className="form-check-label" htmlFor="data_access_ja">
                {t("Ja")}
              </Form.Label>
              <Form.Check
                className="form-check-input"
                type="radio"
                name="data_access"
                id="data_access_nee"
                onChange={(e) => toggleRights(e, 'data')}
                checked={!user.rights.data_access}
              />
              <Form.Label className="form-check-label" htmlFor="data_access_nee">
                {t("Nee")}
              </Form.Label>
            </div>
                
          </div>

          <div className="form-group">
            <Form.Label htmlFor="login">{t("Gebruikersnaam")}</Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              id="login"
              name="login"
              aria-describedby="login"
              placeholder=""
              value={user.login}
              onChange={onChange}
            />
          </div>
          <Form.Group className={user_id != 0 ? "form-check" : "hidden"}>
          {/* <div className={user_id != 0 ? "form-check" : "hidden"}> */}
            
            <Form.Check
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
              checked={showPassword}
              label={t("Wachtwoord wijzigen")}
            />     
    
              
            <br />
            <br />
          </Form.Group>
          <div
            className={
              showPassword ? "form-row align-items-center" : "hidden"
            }
          >
            <div className="col">
              <Form.Label htmlFor="login">{t("Wachtwoord")}</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                id="password"
                name="password"
                aria-describedby="password"
                placeholder=""
                value={user.password}
                onChange={onChange}
              />
            </div>
            <div className="col">
              <Form.Label htmlFor="login">{t("Wachtwoord ter controle")}</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                id="password_check"
                name="password_check"
                aria-describedby="password_check"
                placeholder=""
                value={user.password_check}
                onChange={onChange}
              />
            </div>
          </div>
          <div className={ auth.user_id === user_id || user_id === 0 ? "hidden" : "form-check" }>
            <Form.Check
              className="form-check-input"
              type="checkbox"
              id="remove"
              name="remove"
              onChange={() => setRemoveUser(!removeUser)}
              checked={user.removeUser}
            />
            <Form.Label className="form-check-label" htmlFor="remove">
              {t("Verwijder gebruiker")}
            </Form.Label>
          </div>
        </Form>

      </Container>

      {/* <Modal {...state.modalState} /> */}
    </div>
  );
};

export default UserEdit;
