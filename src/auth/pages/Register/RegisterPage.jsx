import { Link } from "react-router-dom";
import "./RegisterPage.css";
import { useAuthStore, useForm } from "../../../hooks";
import Swal from "sweetalert2";

const registerFormFields = {
  registerFullName: "",
  registerEmail: "",
  registerPassword: "",
  registerRepeatPassword: "",
};

export const RegisterPage = () => {
  const {
    registerFullName,
    registerEmail,
    registerPassword,
    registerRepeatPassword,
    onInputChange,
  } = useForm(registerFormFields);

  const { startRegister } = useAuthStore();

  const registerOnSubmit = (event) => {
    event.preventDefault();
    if (registerPassword !== registerRepeatPassword) {
      Swal.fire("Register Error", "Passwords do not match", "error");
      return;
    }
    startRegister({
      fullName: registerFullName,
      email: registerEmail,
      password: registerPassword,
    });
  };

  return (
    <div className="container register-container">
      <div className="col-md-6 register-form">
        <h3>Register</h3>
        <form onSubmit={registerOnSubmit}>
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control input-box"
              placeholder="Full Name"
              name="registerFullName"
              value={registerFullName}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="registerEmail"
              value={registerEmail}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control input-box"
              placeholder="Password"
              name="registerPassword"
              value={registerPassword}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control input-box"
              placeholder="Confirm Password"
              name="registerRepeatPassword"
              value={registerRepeatPassword}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2 d-flex flex-column align-items-center">
            <input type="submit" className="btnSubmit" value="Register" />
            <p className="register-page-paragraph">
              Do you have an account?{" "}
              <Link className="sing-in-link" to="/auth/login">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
