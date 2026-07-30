import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useRestaurantStore, useStaffStore } from "../../../hooks";
import "./CreateNewEmployeePage.css";

export const CreateNewEmployeePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditing = Boolean(userId);
  const { startSavingStaff, startLoadingStaff } = useStaffStore();
  const { restaurants, startLoadingRestaurants } = useRestaurantStore();
  const [isLoading, setIsLoading] = useState(isEditing);
  const [showPassword, setShowPassword] = useState(false);

  const statusOptions = ["ACTIVE", "INACTIVE"];

  const generateSixDigitPassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    status: "ACTIVE",
    restaurant: "",
  });

  //INFO: Load restaurants info
  useEffect(() => {
    startLoadingRestaurants();
  }, [startLoadingRestaurants]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employees = await startLoadingStaff();
        const employee = employees.find((u) => u._id === userId);
        if (!employee) {
          Swal.fire(
            "Not found",
            "This staff member no longer exists.",
            "error",
          );
          navigate("/admin/staff");
          return;
        }
        setFormValues({ ...employee });
      } catch (error) {
        console.error({ error });
      } finally {
        setIsLoading(false);
      }
    };
    if (isEditing) fetchEmployee();
  }, [userId, isEditing, startLoadingStaff, navigate]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onGeneratePassword = () => {
    setFormValues({
      ...formValues,
      password: generateSixDigitPassword(),
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!isEditing && !formValues.password) {
      Swal.fire(
        "Missing password",
        "Generate a temporary password before saving.",
        "error",
      );
      return;
    }

    if (!isEditing && !formValues.restaurant) {
      Swal.fire(
        "Missing restaurant",
        "Select which restaurant this employee is assigned to.",
        "error",
      );
      return;
    }

    try {
      await startSavingStaff(formValues);
      navigate("/admin/staff");
    } catch (error) {
      console.error({ error });
    }
  };

  if (isLoading) {
    return <p className="text-muted">Loading staff member...</p>;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-link p-0 mb-3 text-muted text-decoration-none"
        onClick={() => navigate("/admin/staff")}
      >
        <i className="fa fa-arrow-left me-1"></i> Back to staff
      </button>

      <h1 className="fw-bold mb-1">
        {isEditing ? "Edit Employee" : "Add new employee"}
      </h1>
      <p className="text-muted mb-4">
        {isEditing
          ? "Update this employee's information."
          : "Give an employee access to a restaurant's schedule."}
      </p>

      <form onSubmit={onSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Full name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Maria Gomez"
              name="fullName"
              value={formValues.fullName}
              onChange={onInputChanged}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@restaurant.com"
              name="email"
              value={formValues.email}
              onChange={onInputChanged}
              required
            />
          </div>
        </div>

        {isEditing ? (
          <>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Restaurant</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    restaurants.find((r) => r._id === formValues.restaurant)
                      ?.restaurantName || ""
                  }
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label>Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={formValues.status}
                  onChange={onInputChanged}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Role</label>
                <input
                  type="text"
                  className="form-control"
                  value="Employee"
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value="••••••"
                  readOnly
                />
                <Link
                  to={`/admin/staff/${userId}/change-password`}
                  className="small text-decoration-none"
                >
                  Change password
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="row mb-4">
            <div className="col-md-6">
              <label>Restaurant</label>
              <select
                className="form-control"
                name="restaurant"
                value={formValues.restaurant}
                onChange={onInputChanged}
                required
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.restaurantName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label>Password</label>
              <div className="d-flex align-items-center">
                <div className="employee-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control employee-password-input"
                    value={formValues.password}
                    placeholder="Not generated yet"
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-link employee-password-toggle"
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
                  className="btn btn-outline-secondary employee-generate-btn"
                  onClick={onGeneratePassword}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-danger employee-form-cancel-btn"
            onClick={() => navigate("/admin/staff")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Save Changes" : "Save Employee"}
          </button>
        </div>
      </form>
    </>
  );
};
