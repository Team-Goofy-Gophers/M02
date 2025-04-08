import { FileText } from "lucide-react";
import CONSTANTS from "~/constants";
import SignInCard from "~/components/auth/signInCard";

const Page = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-8 flex items-center gap-2">
        <FileText className="text-primary h-6 w-6" />
        <span className="text-xl font-semibold">{CONSTANTS.APP_NAME}</span>
      </div>

      <SignInCard />
    </div>
  );
};

export default Page;
