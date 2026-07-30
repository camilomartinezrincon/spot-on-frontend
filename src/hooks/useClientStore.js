import { useDispatch, useSelector } from "react-redux";
import { onDeleteClient, onLoadClients, onUpdateClient } from "../store";
import { spotOnApi } from "../api";
import Swal from "sweetalert2";
import { useCallback } from "react";

export const useClientStore = () => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.client);

  const startSavingClient = async (clientData) => {
    try {
      const { data } = await spotOnApi.put(
        `/auth/update/user/${clientData._id}`,
        {
          fullName: clientData.fullName,
          email: clientData.email,
          status: clientData.status,
        },
      );
      dispatch(onUpdateClient(data.userId));
      await Swal.fire({
        title: "Client updated",
        icon: "success",
        confirmButtonText: "Back to clients",
      });
    } catch (error) {
      Swal.fire(
        "Error updating client",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startDeletingClient = async (clientId) => {
    try {
      await spotOnApi.delete(`/auth/delete/user/${clientId}`);
      dispatch(onDeleteClient(clientId));
    } catch (error) {
      Swal.fire(
        "Error deleting client",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startLoadingClients = useCallback(async () => {
    try {
      const { data } = await spotOnApi.get("/auth/users");
      const clientUsers = (data.usr || []).filter((u) => u.role === "CLIENT");
      dispatch(onLoadClients(clientUsers));
      return clientUsers;
    } catch (error) {
      Swal.fire(
        "Error loading clients",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  }, [dispatch]);

  return {
    clients,
    startSavingClient,
    startDeletingClient,
    startLoadingClients,
  };
};
