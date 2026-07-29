import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./StaffPage.css";
import { spotOnApi } from "../../../api";

export const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStaffAndRestaurants = async () => {
      try {
        const [usersRes, restaurantsRes] = await Promise.all([
          spotOnApi.get("/auth/users"),
          spotOnApi.get("/restaurants/restaurants"),
        ]);
        setStaff(
          (usersRes.data.usr || []).filter((u) => u.role === "EMPLOYEE"),
        );
        setRestaurants(restaurantsRes.data.restaurant || []);
      } catch (error) {
        Swal.fire(
          "Error loading staff",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaffAndRestaurants();
  }, []);

  const restaurantNameById = useMemo(() => {
    const map = {};
    restaurants.forEach((r) => {
      map[r._id] = r.restaurantName;
    });
    return map;
  }, [restaurants]);

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const filteredStaff = useMemo(() => {
    return staff.filter((member) =>
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [staff, searchTerm]);

  const onDelete = (member) => {
    Swal.fire({
      title: "Delete staff member?",
      text: `This will permanently delete ${member.fullName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await spotOnApi.delete(`/auth/delete/user/${member._id}`);
        setStaff((prev) => prev.filter((s) => s._id !== member._id));
      } catch (error) {
        Swal.fire(
          "Error deleting staff member",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      }
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-1">
        <div>
          <h1 className="fw-bold mb-1">Staff</h1>
          <p className="text-muted mb-4">
            People with access to a restaurant's schedule.
          </p>
        </div>
        <Link to="/admin/staff/new" className="btn btn-primary">
          <i className="fas fa-plus me-1"></i> Add staff
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "400px" }}
          placeholder="Search staff"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-muted">Loading staff...</p>}

      {!isLoading && filteredStaff.length === 0 && (
        <p className="text-muted">No staff match your search.</p>
      )}

      <div className="card staff-card">
        <div className="list-group list-group-flush p-2">
          {filteredStaff.map((member) => (
            <div
              key={member._id}
              className="list-group-item staff-list-item d-flex align-items-center justify-content-between"
            >
              <div>
                <p className="mb-0 fw-semibold">
                  {member.fullName} ·{" "}
                  <span className="text-muted fw-normal">
                    {formatRole(member.role)}
                  </span>
                </p>
                <p className="text-muted small mb-0">
                  {member.email}
                  {restaurantNameById[member.restaurant] &&
                    ` · ${restaurantNameById[member.restaurant]}`}
                </p>
              </div>
              <div className="d-flex align-items-center">
                <span className="staff-status-badge staff-badge-active staff-badge-spacing">
                  Active
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger p-0 staff-delete-btn"
                  onClick={() => onDelete(member)}
                >
                  Delete
                </button>
                <Link
                  to={`/admin/staff/${member._id}`}
                  className="small text-decoration-none"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
