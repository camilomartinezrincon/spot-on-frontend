import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useClientStore } from "../../../hooks";
import "./EditClientPage.css";

const statusOptions = ["ACTIVE", "INACTIVE"];

export const EditClientPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { startSavingClient, startLoadingClients } = useClientStore();
  const [isLoading, setIsLoading] = useState(true);

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clients = await startLoadingClients();
        const client = clients.find((u) => u._id === userId);
        if (!client) {
          Swal.fire("Not found", "This client no longer exists.", "error");
          navigate("/admin/clients");
          return;
        }
        setFormValues({ ...client });
      } catch (error) {
        console.error({ error });
      } finally {
        setIsLoading(false);
      }
    };
    fetchClient();
  }, [userId, startLoadingClients, navigate]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await startSavingClient(formValues);
      navigate("/admin/clients");
    } catch (error) {
      console.error({ error });
    }
  };

  if (isLoading) {
    return <p className="text-muted">Loading client...</p>;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-link p-0 mb-3 text-muted text-decoration-none"
        onClick={() => navigate("/admin/clients")}
      >
        <i className="fa fa-arrow-left me-1"></i> Back to clients
      </button>

      <h1 className="fw-bold mb-1">Edit Client</h1>
      <p className="text-muted mb-4">Update this client's information.</p>

      <form onSubmit={onSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Full name</label>
            <input
              type="text"
              className="form-control"
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
              name="email"
              value={formValues.email}
              onChange={onInputChanged}
              required
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label>Role</label>
            <input
              type="text"
              className="form-control"
              value="Client"
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
        <div className="row mb-4">
          <div className="col-md-6">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value="••••••"
              readOnly
            />
            <Link
              to={`/admin/clients/${userId}/change-password`}
              className="small text-decoration-none"
            >
              Change password
            </Link>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-danger client-form-cancel-btn"
            onClick={() => navigate("/admin/clients")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
};
