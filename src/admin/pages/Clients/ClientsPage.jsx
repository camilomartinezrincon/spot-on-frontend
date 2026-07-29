import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./ClientsPage.css";
import { spotOnApi } from "../../../api";

export const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await spotOnApi.get("/auth/users");
        setClients((data.usr || []).filter((u) => u.role === "CLIENT"));
      } catch (error) {
        Swal.fire(
          "Error loading clients",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [clients, searchTerm]);

  const onDelete = (client) => {
    Swal.fire({
      title: "Delete client?",
      text: `This will permanently delete ${client.fullName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await spotOnApi.delete(`/auth/delete/user/${client._id}`);
        setClients((prev) => prev.filter((c) => c._id !== client._id));
      } catch (error) {
        Swal.fire(
          "Error deleting client",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      }
    });
  };

  return (
    <>
      <h1 className="fw-bold mb-1">Clients</h1>
      <p className="text-muted mb-4">Everyone who can book a reservation.</p>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "400px" }}
          placeholder="Search clients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-muted">Loading clients...</p>}

      {!isLoading && filteredClients.length === 0 && (
        <p className="text-muted">No clients match your search.</p>
      )}

      <div className="card clients-card">
        <div className="list-group list-group-flush p-2">
          {filteredClients.map((client) => (
            <div
              key={client._id}
              className="list-group-item clients-list-item d-flex align-items-center justify-content-between"
            >
              <div>
                <p className="mb-0 fw-semibold">{client.fullName}</p>
                <p className="text-muted small mb-0">{client.email}</p>
              </div>
              <div className="d-flex align-items-center">
                <span className="clients-status-badge clients-badge-active clients-badge-spacing">
                  Active
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger p-0 clients-delete-btn"
                  onClick={() => onDelete(client)}
                >
                  Delete
                </button>
                <Link
                  to={`/admin/clients/${client._id}`}
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
