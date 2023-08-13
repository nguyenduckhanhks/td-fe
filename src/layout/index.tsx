import { useEffect } from "react";
import { useGlobalContext } from "../context";
import Header from "./header";
import api from "../services/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setCustomerInfo } = useGlobalContext();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }
    loadUserInfo().then((res) => {
      setCustomerInfo(res.customerInfo);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUserInfo() {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }
    let rs = await api.post("/customer/get-customer-info", {});
    return rs;
  }
  return (
    <div>
      <Header />
      <div className="main-layout">
        <div className="main-container">{children}</div>
      </div>  
    </div>
  );
}
