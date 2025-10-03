import { useEffect } from "react";

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showResetPassword("#authentication-reset-password");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30">
      <div id="authentication-reset-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-xl shadow-lg border border-slate-200"></div>
    </div>
  );
};

export default ResetPassword;