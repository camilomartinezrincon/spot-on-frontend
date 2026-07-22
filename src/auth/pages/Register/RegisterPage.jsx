import { Link } from "react-router-dom";
import "./RegisterPage.css";

export const RegisterPage = () => {
  return (
    <div className="container register-container">
      <div className="col-md-6 register-form">
        <h3>Register</h3>
        <form>
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control input-box"
              placeholder="Full Name"
            />
          </div>
          <div className="form-group mb-2">
            <input type="email" className="form-control" placeholder="Email" />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control input-box"
              placeholder="Password"
            />
          </div>

          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control input-box"
              placeholder="Confirm Password"
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
