import { Link } from "react-router-dom";
import "./LoginPage.css";

export const LoginPage = () => {
  return (
    <div className="container login-container">
      <div className="login-form">
        <h3>Login</h3>
        <form>
          <div className="form-group mb-2 ">
            <input
              type="text"
              className="form-control input-box"
              placeholder="Email"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control input-box"
              placeholder="Password"
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
