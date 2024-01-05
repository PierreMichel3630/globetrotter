import { AlertColor } from "@mui/material";
import { createContext, useContext, useState } from "react";
import { MessageSnackbar } from "src/components/Snackbar";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const MessageContext = createContext<{
  message: string;
  severity: AlertColor;
  setMessage: (value: string) => void;
  setSeverity: (value: AlertColor) => void;
}>({
  message: "",
  severity: "error",
  setMessage: (value: string) => {},
  setSeverity: (value: AlertColor) => {},
});

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }: Props) => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  return (
    <MessageContext.Provider
      value={{
        message,
        setMessage,
        severity,
        setSeverity,
      }}
    >
      {children}
      <MessageSnackbar
        autoHideDuration={600000}
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
        severity={severity}
      />
    </MessageContext.Provider>
  );
};
