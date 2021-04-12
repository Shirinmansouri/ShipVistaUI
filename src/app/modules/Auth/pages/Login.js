import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import axios from 'axios';
import {AdminUserLoginApi} from '../../../pages/commonConstants/apiUrls';
import * as Token from '../../../pages/_redux/Actions/TokenActions';
import { useDispatch, useSelector } from 'react-redux';
import WrongPasswordModal from './WrongPasswordModal';
const initialValues = {
  userName: "",
  password: "",
};

export function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const tokenDispatch = useDispatch();
  const [showModal,setShowModal] = useState(false);
  const [errorMessage,setErrorMessage]=useState("");
  const LoginSchema = Yup.object().shape({
    userName:Yup.string()
      .min(3,"Minimum 3 characters")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setTimeout(() => {
        var data ={
          "UserName":values.userName,
          "Password":values.password
        }
        let axiosConfig = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": true,
              "Access-Control-Allow-Credentials": true,
          }
      };
        axios.post(AdminUserLoginApi,data,axiosConfig).then((response)=>{
          if(response.data.hasError==false){
            disableLoading();
            tokenDispatch(Token.Save_Token(response.data));
            setShowModal(false);
          }else{
            setErrorMessage("Wrong Username or Password");
            disableLoading();
            setShowModal(true);
            setSubmitting(false);
          }
        }).catch(() => {
          disableLoading();
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN",
            })
          );
        });
      }, 1000);
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
      <h3 _ngcontent-ndw-c159=""  class="font-weight-bolder text-dark text-center font-size-h1 font-size-h1-lg mb-4"> Login </h3>
        <span _ngcontent-ndw-c159="" class="font-weight-bold font-size-h6 text-dark-50">Please Enter Username and Password</span>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {/* {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : (
          <div className="mb-10 alert alert-custom alert-light-info alert-dismissible">
            <div className="alert-text ">
              Use account <strong>admin@demo.com</strong> and password{" "}
              <strong>demo</strong> to continue.
            </div>
          </div>
        )} */}
        {
          showModal==true?
            <WrongPasswordModal errorMessage={errorMessage} setShowModal={setShowModal} showModal={showModal}></WrongPasswordModal>
          :<></>
        }
        <div className="form-group fv-plugins-icon-container">
          <label _ngcontent-ndw-c159="" style={{float: 'left'}} for="username" class="font-size-h6 font-weight-bolder text-dark">Username</label>
          <input
            placeholder=""
            type="userName"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "userName"
            )}`}
            name="userName"
            {...formik.getFieldProps("userName")}
          />
          {formik.touched.userName && formik.errors.userName ? (
            <div className="fv-plugins-message-container" style={{float: 'left'}}>
                            <div className="fv-help-block">Enter UserName</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
        <label _ngcontent-ndw-c159="" style={{float: 'left'}} for="password" class="font-size-h6 font-weight-bolder text-dark pt-5">Password</label>
          <input
            placeholder=""
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container" style={{float: 'left'}}>
              <div className="fv-help-block">Enter Password</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            style={{backgroundImage: 'linear-gradient(to right, #6a75ca, #9666f7)'}}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Login</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
