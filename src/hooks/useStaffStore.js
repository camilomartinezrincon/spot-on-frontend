import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewStaff,
  onDeleteStaff,
  onLoadStaff,
  onUpdateStaff,
} from "../store";
import { spotOnApi } from "../api";
import Swal from "sweetalert2";
import { useCallback } from "react";

export const useStaffStore = () => {
  const dispatch = useDispatch();
  const { staff } = useSelector((state) => state.staff);

  const startSavingStaff = async (staffData) => {
    try {
      if (staffData._id) {
        const { data } = await spotOnApi.put(
          `/auth/update/user/${staffData._id}`,
          {
            fullName: staffData.fullName,
            email: staffData.email,
            status: staffData.status,
          },
        );
        console.log({ data });
        dispatch(onUpdateStaff(data.userId));
        await Swal.fire({
          title: "Staff member updated",
          icon: "success",
          confirmButtonText: "Back to staff",
        });
      } else {
        const { data } = await spotOnApi.post("/auth/new/employee", {
          fullName: staffData.fullName,
          email: staffData.email,
          password: staffData.password,
          restaurant: staffData.restaurant,
        });
        dispatch(
          onAddNewStaff({
            _id: data.uid,
            fullName: staffData.fullName,
            email: staffData.email,
            role: "EMPLOYEE",
            status: "ACTIVE",
          }),
        );
        await Swal.fire({
          title: "Staff member created",
          html: `Share this temporary password with them: <b>${staffData.password}</b>`,
          icon: "success",
          confirmButtonText: "Back to staff",
        });
      }
    } catch (error) {
      Swal.fire(
        staffData._id
          ? "Error updating staff member"
          : "Error creating staff member",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startDeletingStaff = async (staffId) => {
    try {
      await spotOnApi.delete(`/auth/delete/user/${staffId}`);
      dispatch(onDeleteStaff(staffId));
    } catch (error) {
      Swal.fire(
        "Error deleting staff member",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startLoadingStaff = useCallback(async () => {
    try {
      const { data } = await spotOnApi.get("/auth/users");
      const employees = (data.usr || []).filter((u) => u.role === "EMPLOYEE");
      dispatch(onLoadStaff(employees));
      return employees;
    } catch (error) {
      Swal.fire(
        "Error loading staff",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  }, [dispatch]);

  return {
    staff,
    startSavingStaff,
    startDeletingStaff,
    startLoadingStaff,
  };
};
