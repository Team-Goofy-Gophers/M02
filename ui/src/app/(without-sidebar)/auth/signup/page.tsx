import { FileText } from "lucide-react";
import CONSTANTS from "~/constants";
import SignUpCard from "~/components/auth/signUpCard";

const Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-8 flex items-center gap-2">
        <FileText className="text-primary h-6 w-6" />
        <span className="text-xl font-semibold">{CONSTANTS.APP_NAME}</span>
      </div>

      <SignUpCard />
    </div>
  );
};

export default Page;
