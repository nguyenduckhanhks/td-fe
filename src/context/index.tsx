import { createContext, useContext, useState } from "react";

enum AlertType {
  "success",
  "info",
  "warning",
  "error",
}

const initContext: {
  alerts: any[];
  addAlert: any;
  removeAlert: any;
  customerInfo: any;
  setCustomerInfo: any;
} = {
  alerts: [],
  addAlert: null,
  removeAlert: null,
  customerInfo: null,
  setCustomerInfo: null,
};
export const AppContext = createContext(initContext);

export const AppProvider = ({ children }: any) => {
  const [alerts, setAlerts] = useState<any>([]);
  const [customerInfo, setCustomerInfo] = useState(null);

  const addAlert = ({
    type = "success",
    showIcon = true,
    closable = true,
    message = "",
    description = "",
    action,
  }: {
    type: keyof typeof AlertType;
    showIcon?: boolean;
    closable?: boolean;
    message: string;
    description?: string;
    action?: any;
  }) => {
    const newAlerts = [
      ...alerts,
      { type, showIcon, closable, message, description, action },
    ];
    setAlerts(newAlerts);
  };
  const removeAlert = (index: number) => {
    if (index >= alerts.length) return;
    alerts.splice(index, 1);
  };
  return (
    <AppContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        customerInfo,
        setCustomerInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
