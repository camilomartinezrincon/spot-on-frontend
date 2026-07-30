import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthStore } from "../../../hooks";
import "./EditPasswordPage.css";

export const EditPasswordPage = ({ backPath, label, singularLabel }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { startChangingPassword } = useAuthStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const generateSixDigitPassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const onGeneratePassword = () => {
    setPassword(generateSixDigitPassword());
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!password) {
      Swal.fire(
        "Missing password",
        "Generate a new password before saving.",
        "error",
      );
      return;
    }

    try {
      await startChangingPassword(userId, password);
      navigate(backPath);
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-link p-0 mb-3 text-muted text-decoration-none"
        onClick={() => navigate(backPath)}
      >
        <i className="fa fa-arrow-left me-1"></i> Back to {label}
      </button>

      <h1 className="fw-bold mb-1">Change Password</h1>
      <p className="text-muted mb-4">
        Generate a new temporary password for this {singularLabel}.
      </p>

      <form onSubmit={onSubmit}>
        <div className="row mb-4">
          <div className="col-md-6">
            <label>New password</label>
            <div className="d-flex align-items-center">
              <div className="change-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control change-password-input"
                  value={password}
                  placeholder="Not generated yet"
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-link change-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary change-password-generate-btn"
                onClick={onGeneratePassword}
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-danger change-password-cancel-btn"
            onClick={() => navigate(backPath)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Password
          </button>
        </div>
      </form>
    </>
  );
};
