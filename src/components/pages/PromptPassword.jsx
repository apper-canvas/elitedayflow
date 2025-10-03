import { useEffect } from "react";

const PromptPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showPromptPassword("#authentication-prompt-password");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30">
      <div id="authentication-prompt-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-xl shadow-lg border border-slate-200"></div>
    </div>
  );
};

export default PromptPassword;