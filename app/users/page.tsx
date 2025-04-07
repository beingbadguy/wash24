import { UsersTable } from "@/components/UsersTable";
import React from "react";

const UserPage = () => {
  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4 text-[#9D215D]">Users</h1>
      <UsersTable />
    </div>
  );
};

export default UserPage;
