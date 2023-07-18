import Header from "@/components/Header";
import AccountContent from "./components/AccountContent";

const Account = () => {
  return (
    <div className="bg-neutral-900 h-full w-full overflow-hidden overflow-y-auto rounded-lg">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Configuración de cuenta
          </h1>
        </div>
      </Header>
      <AccountContent />
      Account
    </div>
  );
};

export default Account;
