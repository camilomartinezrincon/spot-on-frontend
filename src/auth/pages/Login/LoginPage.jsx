import { Link } from "react-router-dom";
import "./LoginPage.css";
import { useAuthStore, useForm } from "../../../hooks";
import { useEffect } from "react";
import Swal from "sweetalert2";

const loginFormFields = {
  loginEmail: "",
  loginPassword: "",
};

export const LoginPage = () => {
  const { loginEmail, loginPassword, onInputChange } = useForm(loginFormFields);
  const { startLogin, errorMessage } = useAuthStore();

  const loginOnSubmit = (event) => {
    event.preventDefault();
    startLogin({ email: loginEmail, password: loginPassword });
  };

  useEffect(() => {
    if (errorMessage) {
      Swal.fire("Authentication Error", errorMessage, "error");
    }
  }, [errorMessage]);

  return (
    <div className="container login-container">
      <div className="login-form">
        <h3>Login</h3>
        <form onSubmit={loginOnSubmit}>
          <div className="form-group mb-2 ">
            <input
              type="text"
              className="form-control input-box"
              placeholder="Email"
              name="loginEmail"
              value={loginEmail}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control input-box"
              placeholder="Password"
              name="loginPassword"
              value={loginPassword}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2 d-flex flex-column align-items-center">
            <input type="submit" className="btnSubmit" value="Login" />
            <p className="sing-in-page-paragraph">
              Don't have an account?{" "}
              <Link className="register-link" to="/auth/register">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
