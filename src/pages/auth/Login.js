import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, FormGroup, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import LogoLight2x from "../../images/dk_logo.jpeg";

async function getPre(file) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch("/roles/"+file, {
    mode: 'cors',
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
})
            .then(response => response.text())
            .then(result => {
              console.log(result.cabinet_tab);
            })
            .catch(error => console.log('error', error));
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");

  const onFormSubmit = (formData) => {
    setLoading(true);
    const loginName = "admin@gmail.com";
    const pass = "admin123";
    var status ;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "email": formData.name,
      "password": formData.passcode
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };


    fetch("/users/login", requestOptions)
      .then(response => {
        console.log(response.status);
        status = response.status; // Will show you the status
    if (!response.ok) {
        throw new Error("HTTP status " + response.status);
    }
    return response.json();

      })
  .then((result) => {
        // console.log(response.status);
        if (status == 200) {
          localStorage.setItem("accessToken", result.id);
          localStorage.setItem("id", result.id);
          localStorage.setItem("name", result.username);
          localStorage.setItem("email", result.email);
          localStorage.setItem("privilege", result.privilege);
          // localStorage.setItem('user', result.data)
          var requestOptions1 = {
            method: 'GET',
            redirect: 'follow'
          };
          fetch("/roles/"+result.privilege+"", requestOptions1)
          .then(response => response.json())
          .then(result => {
            console.log(result.cabinet_tab);
            localStorage.setItem("p_name", result.privilege);
          localStorage.setItem("cabinet_tab", result.cabinet_tab);
          localStorage.setItem("folder_tab", result.folder_tab);
          localStorage.setItem("acl_tab", result.acl_tab);
          localStorage.setItem("custom_tab", result.custom_tab);
          localStorage.setItem("user_tab", result.user_tab);
          localStorage.setItem("roles", result.roles);
          })
          .catch(error => console.log('error', error));
          // let obj_res = {
          //   "id": 1,
          //   "privilege": "Administrator",
          //   "cabinet_tab": '{"create":"1","update":"1","deleted":"1","view":"1"}',
          //   "folder_tab": "{'create':'1','update':'1','deleted':'1','view':'1'}",
          //   "acl_tab": "{'create':'1','update':'1','deleted':'1','view':'1'}",
          //   "custom_tab": "{'create':'1','update':'1','deleted':'1','view':'1'}",
          //   "user_tab": "{'create':'1','update':'1','deleted':'1','view':'1'}",
          //   "roles": "{'create':'1','update':'1','deleted':'1','view':'1'}",
          //   "create_at": "2022-08-22",
          //   "create_by": 1
          // };



          // // console.log(JSON.parse(obj_res.cabinet_tab));

          
          
          // localStorage.setItem("accessToken", "token");
          
          

          
          setTimeout(() => {
            window.history.pushState(
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
              "auth-login",
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/org"}`
            );
            window.location.reload();
          }, 2000);
        }
        else {
            setError("Cannot login with credentials");
            setLoading(false);
          
        }
      })
      .catch(error => console.log('error', error));
  };

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={LogoLight2x} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoLight2x} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                <BlockDes>
                  <p>Access CSS OMetaVersa using your email and passcode.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> Unable to login with credentials{" "}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email or Username
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="default-01"
                    name="name"
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your email address or username"
                    className="form-control-lg form-control"
                  />
                  {errors.name && <span className="invalid">{errors.name.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Passcode
                  </label>
                  {/* <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Code?
                  </Link> */}
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="passcode"
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your passcode"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </FormGroup>
            </Form>
            {/* <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div> */}
            {/* <div className="text-center pt-4 pb-3">
              <h6 className="overline-title overline-title-sap">
                <span>OR</span>
              </h6>
            </div> */}
            {/* <ul className="nav justify-center gx-4">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Facebook
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Google
                </a>
              </li>
            </ul> */}
          </PreviewCard>
        </Block>
        {/* <AuthFooter /> */}
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
