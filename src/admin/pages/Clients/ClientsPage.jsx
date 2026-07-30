import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useClientStore } from "../../../hooks";
import "./ClientsPage.css";

export const ClientsPage = () => {
  const { clients, startLoadingClients, startDeletingClient } =
    useClientStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const clientStatusClass = {
    ACTIVE: "clients-badge-active",
    INACTIVE: "clients-badge-inactive",
  };

  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  useEffect(() => {
    const load = async () => {
      await startLoadingClients();
      setIsLoading(false);
    };
    load();
  }, [startLoadingClients]);

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
    }).then((result) => {
      if (result.isConfirmed) startDeletingClient(client._id);
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
                <p className="mb-0 fw-semibold">
                  {client.fullName} ·{" "}
                  <span className="text-muted fw-normal">
                    {formatRole(client.role)}
                  </span>
                </p>
                <p className="text-muted small mb-0">{client.email}</p>
              </div>
              <div className="d-flex align-items-center">
                <span
                  className={`clients-status-badge clients-badge-spacing ${clientStatusClass[client.status?.toUpperCase()]}`}
                >
                  {formatStatus(client.status)}
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
