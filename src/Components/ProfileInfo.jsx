import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center just gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {userInfo ? getInitials(userInfo.name) : "?"}
      </div>
      {/* <p className="text-sm font-medium">
        {userInfo ? userInfo.name : "Guest"}
      </p> */}
      <button
        className="px-4 py-1 rounded-lg bg-purple-600 text-white text-sm font-semibold shadow hover:bg-purple-800 transition duration-200"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileInfo;
