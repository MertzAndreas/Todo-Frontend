"use client";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import useAuthContext from "@/providers/AuthProvider";

type SignalRContextType = {
  connection: HubConnection | null;
  isConnected: boolean;
};

const SignalRContext = createContext<SignalRContextType | null>(null);

const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
};

export const SignalRProvider = ({ children }: React.PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(false);
  const { getToken, isAuthenticated } = useAuthContext();
  const connectionRef = useRef<HubConnection | null>(null);

  let didInit = false;
  useEffect(() => {
    const initializeConnection = async () => {
      if (didInit || isAuthenticated !== true) return;

      didInit = true;

      try {
        const validToken = await getToken();

        const newConnection = new HubConnectionBuilder()
          .withUrl(`http://localhost:5040/hub`, {
            accessTokenFactory: () => validToken,
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        connectionRef.current = newConnection;

        newConnection.onreconnecting((error) => {
          console.log("Connection lost due to error. Reconnecting.", error);
        });

        newConnection.onreconnected((connectionId) => {
          console.log("Reconnected. Connection ID:", connectionId);
          setIsConnected(true);
        });

        newConnection.onclose((error) => {
          console.error("Connection closed due to error:", error);
          setIsConnected(false);
        });

        await newConnection.start();
        setIsConnected(true);
      } catch (error) {
        console.error("Error initializing connection:", error);
        setIsConnected(false);
      }
    };

    initializeConnection();

    return () => {
      if (connectionRef.current?.state === HubConnectionState.Connected) {
        connectionRef.current.stop();
      }
    };
  }, [getToken, isAuthenticated]);

  return (
    <SignalRContext.Provider
      value={{ connection: connectionRef.current, isConnected }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export default useSignalRContext;
