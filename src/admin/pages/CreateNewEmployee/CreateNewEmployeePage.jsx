import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { spotOnApi } from "../../../api";
import Swal from "sweetalert2";
import "./CreateNewEmployeePage.css";

const statusOptions = ["ACTIVE", "INACTIVE"];

export const CreateNewEmployeePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditing = Boolean(userId);
  const [isLoading, setIsLoading] = useState(isEditing);

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    status: "ACTIVE",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await spotOnApi.get("/auth/users");
        const employee = (data.usr || []).find((u) => u._id === userId);
        if (!employee) {
          Swal.fire(
            "Not found",
            "This staff member no longer exists.",
            "error",
          );
          navigate("/admin/staff");
          return;
        }
        setFormValues({
          fullName: employee.fullName,
          email: employee.email,
          password: employee.password,
          role: employee.role,
          status: employee.status || "ACTIVE",
        });
      } catch (error) {
        Swal.fire(
          "Error loading staff member",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (isEditing) fetchEmployee();
  }, [userId, isEditing, navigate]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isEditing) {
        await spotOnApi.put(`/auth/update/user/${userId}`, {
          fullName: formValues.fullName,
          email: formValues.email,
          status: formValues.status,
        });
      } else {
        await spotOnApi.post("/auth/new/employee", {
          fullName: formValues.fullName,
          email: formValues.email,
          password: formValues.password,
        });
      }
      await Swal.fire({
        title: isEditing ? "Staff member updated" : "Staff member created",
        icon: "success",
        confirmButtonText: "Back to staff",
      });
      navigate("/admin/staff");
    } catch (error) {
      Swal.fire(
        isEditing
          ? "Error updating staff member"
          : "Error creating staff member",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
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
        {isEditing ? "Edit staff member" : "Add staff member"}
      </h1>
      <p className="text-muted mb-4">
        {isEditing
          ? "Update this staff member's information."
          : "Give a staff member access to a restaurant's schedule."}
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
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

        <div className="form-group mb-3">
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

        {isEditing ? (
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={formValues.password}
              readOnly
            />
            <button
              type="button"
              className="btn btn-link p-0 mt-1 small"
              onClick={() => navigate(`/admin/staff/${userId}/change-password`)}
            >
              Change password
            </button>
          </div>
        ) : (
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Set a temporary password"
              name="password"
              value={formValues.password}
              onChange={onInputChanged}
              required
            />
          </div>
        )}

        <div className="form-group mb-3">
          <label>Role</label>
          <input
            type="text"
            className="form-control"
            value={
              formValues.role.charAt(0) + formValues.role.slice(1).toLowerCase()
            }
            readOnly
          />
        </div>

        <div className="row mb-4">
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

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-danger employee-form-cancel-btn"
            onClick={() => navigate("/admin/staff")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Save changes" : "Save staff member"}
          </button>
        </div>
      </form>
    </>
  );
};
