// src/hooks/useLtp.js (or your preferred path)

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client'; // Ensure you've run: npm install socket.io-client

const SOCKET_SERVER_URL = "http://localhost:8765"; // Your server URL
const LTP_QUERY_KEY = ['ltp']; // Central query key for all LTP data

/**
 * Custom React hook to subscribe to Last Traded Prices (LTP) via Socket.IO.
 *
 * @param {Array<{symbol: string, exchange: string}>} tickers - An array of ticker objects to subscribe to.
 * Example: [{ symbol: "RELIANCE", exchange: "NSE" }, { symbol: "TCS", exchange: "BSE" }]
 * If the array is empty, any existing connection will be closed and no new connection attempted.
 */
export default function useLtp(tickers = []) {
  const queryClient = useQueryClient();
  const socketRef = useRef(null);

  // Using JSON.stringify for the tickers in the dependency array
  // ensures the effect re-runs if the content of the tickers array changes,
  // not just its reference.
  const tickersString = JSON.stringify(tickers);

  useEffect(() => {
    const currentTickers = JSON.parse(tickersString); // Get the actual array for use in this effect

    // If no tickers are provided, disconnect any existing socket and clean up.
    if (!currentTickers || currentTickers.length === 0) {
      if (socketRef.current && socketRef.current.connected) {
        console.log("useLtp: No tickers. Disconnecting existing socket.");
        socketRef.current.disconnect();
      }
      socketRef.current = null;
      // Optionally, clear the LTP data in React Query cache
      queryClient.setQueryData(LTP_QUERY_KEY, {});
      return; // Exit early
    }

    // If a socket connection already exists (e.g., from a previous set of tickers),
    // it will be cleaned up by the return function of the *previous* effect run
    // before this new effect run establishes a new connection.

    console.log(`useLtp: Initializing socket connection for tickers:`, currentTickers);
    const newSocket = io(SOCKET_SERVER_URL, {
      // forceNew: true, // Can be useful for debugging, forces a new connection
      reconnectionAttempts: 5, // Example: configure reconnection behavior
    });
    socketRef.current = newSocket; // Store the new socket instance

    newSocket.on("connect", () => {
      console.log(`useLtp: Socket.IO connected successfully (ID: ${newSocket.id})`);
      // Emit the event to subscribe to the specified tickers.
      // The server expects a payload like: { tickers: [{symbol, exchange}, ...] }
      if (currentTickers.length > 0) {
        console.log(`useLtp: Emitting 'subscribeToTickers' for:`, currentTickers);
        newSocket.emit("subscribeToTickers", { tickers: currentTickers });
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.warn(`useLtp: Socket.IO disconnected. Reason: ${reason}`);
      // Socket.IO client will attempt to reconnect automatically by default
      // if the disconnection was not initiated by a client-side socket.disconnect() call.
    });

    newSocket.on("connect_error", (error) => {
      console.error("useLtp: Socket.IO connection error:", error.message, error);
    });

    // Listen for price updates from the server
    // Server emits 'priceUpdate' with an object like: { "SYMBOL1": price1, "SYMBOL2": price2 }
    newSocket.on("priceUpdate", (updatedPrices) => {
      // console.log("useLtp: Received 'priceUpdate':", updatedPrices);
      queryClient.setQueryData(LTP_QUERY_KEY, (oldData) => {
        const currentLtpData = oldData || {};
        // Merge new prices into the existing LTP data
        return { ...currentLtpData, ...updatedPrices };
      });
    });

    // Listen for subscription status messages from the server
    newSocket.on("subscriptionSuccess", (data) => {
      console.info("useLtp: 'subscriptionSuccess':", data.message);
    });

    newSocket.on("subscriptionError", (data) => {
      console.error("useLtp: 'subscriptionError':", data.error);
    });

    // Cleanup function: This is crucial.
    // It runs when the component unmounts or when dependencies (tickersString, queryClient) change
    // BEFORE the effect runs again.
    return () => {
      console.log(`useLtp: Cleaning up effect. Disconnecting socket (ID: ${newSocket.id}).`);
      // Optional: If your server has an 'unsubscribeFromTickers' event, you can emit it here.
      // The current Python server's 'unsubscribeFromTickers' doesn't require specific tickers,
      // it unsubscribes the entire client. Disconnecting is often sufficient.
      // if (newSocket.connected && currentTickers && currentTickers.length > 0) {
      //   newSocket.emit("unsubscribeFromTickers", { tickers: currentTickers });
      // }
      newSocket.disconnect();
      // If this socket instance was the one in socketRef, clear the ref.
      // This helps prevent using a stale disconnected socket if the cleanup
      // is somehow manually triggered or if the effect logic changes.
      if (socketRef.current === newSocket) {
        socketRef.current = null;
      }
    };

  }, [tickersString, queryClient]); // Effect dependencies

  // This hook's primary role is to manage the WebSocket connection and update
  // the React Query cache. Components will use `useQuery` to consume the data.
  // Example in a component: const { data: ltpData } = useQuery({ queryKey: ['ltp'], initialData: {} });
  return null; // Or you could return connection status if needed by components
}