import { useGlobalContext } from "../context";
import api from "../services/api";

export default function Header() {
  const { setCustomerInfo, customerInfo } = useGlobalContext();
  return (
    <div>
      <div className="w-full h-[73px] flex items-center bg-[#1b1c1d] justify-between px-10">
        <a href="/">
          <img src="/assets/images/logo.png" alt="logo" />
        </a>
        {customerInfo ? (
          <div>
            <button
              className="art-btn-yellow-content px-5 py-2 rounded"
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                setCustomerInfo(null);
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <button
              className="art-btn-red-content mr-2 px-5 py-2 rounded"
              onClick={() =>
                api.register().then((res) => {
                  setCustomerInfo(res.customerInfo);
                })
              }
            >
              Register
            </button>
            <button
              className="art-btn-yellow-content px-5 py-2 rounded"
              onClick={() =>
                api.login().then((res) => {
                  setCustomerInfo(res.customerInfo);
                })
              }
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
