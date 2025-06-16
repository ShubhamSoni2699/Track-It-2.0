// import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useLtp(tickers = []) {
  console.log(tickers);

  // const [prices, setPrices] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
      // ws.send(JSON.stringify({ tickers }));
      console.log("connection open");
    };

    ws.onmessage = (event) => {
      const prices = JSON.parse(event.data);
      console.log(prices);

      queryClient.invalidateQueries({
        queryKey: ["ltp"],
      });
      return () => {
        ws.close();
      };
    };
  }, [queryClient]);

  // if (tickers.length === 0) return;

  // const ws = new WebSocket("ws://localhost:8765");

  // ws.onmessage = (event) => {
  //   const prices = JSON.parse(event.data);
  //   console.log(prices);

  //   queryClient.invalidateQueries({
  //     queryKey: ["ltp"],
  //   });

  // Update React Query cache for each ticker
  // Object.entries(newPrices).forEach(([ticker, price]) => {
  //   queryClient.setQueryData(["stockPrice", ticker], price);
  // });
  //   return prices;
  // };

  // return "null";

  // return () => ws.close();
}


// // Ensure you have socket.io-client installed:
// // npm install socket.io-client
// // or
// // yarn add socket.io-client

// import { useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import io from 'socket.io-client'; // Import socket.io-client

// // Define a type for the prices if you are using TypeScript
// // interface StockPrice {
// //   [ticker: string]: number;
// // }

// export default function useLtp(tickers = []) {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     // Prevent connection if there are no tickers.
//     if (tickers.length === 0) {
//       // Optionally, you might want to clean up any existing query data
//       // or set it to a default state here if tickers become empty.
//       // For example:
//       // queryClient.setQueryData(['ltp'], {}); // Or null, or an empty object
//       console.log("No tickers provided, not connecting to Socket.IO.");
//       return;
//     }

//     // Connect to the Socket.IO server.
//     // Replace 'http://localhost:8765' with your Socket.IO server URL.
//     // The native WebSocket API uses 'ws://' or 'wss://'.
//     // Socket.IO typically uses 'http://' or 'https://' and handles the WebSocket upgrade.
//     useEffect(() => {
//   // ...
//   // CORRECT: Connect to the base HTTP URL. Socket.IO client handles the rest.
//   const socket = io("http://localhost:8765", {
//     // transports: ['websocket'], // You can optionally try forcing WebSocket,
//                                // but it should still work over the /socket.io/ path.
//                                // Often not needed.
//     // path: "/socket.io/" // This is the default, usually not needed to specify
//   });
//   // ...
//     // Event listener for successful connection
//     socket.on("connect", () => {
//       console.log("Socket.IO connected:", socket.id);
//       // Emit an event to the server with the tickers array
//       // The server should be set up to listen for this 'subscribeToTickers' event
//       socket.emit("subscribeToTickers", { tickers });
//       console.log("Subscribed to tickers:", tickers);
//     });

//     // Event listener for receiving price updates
//     // The server should emit a 'priceUpdate' event with the prices object
//     socket.on("priceUpdate", (newPrices /*: StockPrice */) => {
//       console.log("Received prices via Socket.IO:", newPrices);

//       // Option 1: Invalidate a general query (less efficient if you have many unrelated queries)
//       // queryClient.invalidateQueries({ queryKey: ["ltp"] });

//       // Option 2: Update the React Query cache more directly and granularly.
//       // This is generally more efficient.
//       // You can update a single query holding all LTPs:
//       queryClient.setQueryData(["ltp"], (oldData) => {
//         // If oldData is undefined, initialize it
//         const currentPrices = oldData || {};
//         return { ...currentPrices, ...newPrices };
//       });

//       // Or, if you store each ticker's price in a separate query:
//       // Object.entries(newPrices).forEach(([ticker, price]) => {
//       //   queryClient.setQueryData(["ltp", ticker], price);
//       // });
//     });

//     // Event listener for disconnection
//     socket.on("disconnect", (reason) => {
//       console.log("Socket.IO disconnected:", reason);
//     });

//     // Event listener for connection errors
//     socket.io.on("error", (error) => {
//       console.error("Socket.IO connection error:", error);
//     });

//     // Event listener for reconnect attempts
//     socket.io.on("reconnect_attempt", (attempt) => {
//       console.log("Socket.IO reconnect attempt:", attempt);
//     });


//     // Cleanup function: This will be called when the component unmounts
//     // or when any dependency in the dependency array changes (tickers, queryClient).
//     return () => {
//       console.log("Cleaning up Socket.IO connection.");
//       // Leave the room or unsubscribe from tickers if your server supports it
//       // This is good practice to avoid unnecessary server processing
//       if (socket.connected && tickers.length > 0) {
//          socket.emit("unsubscribeFromTickers", { tickers }); // Example custom event
//       }
//       socket.disconnect();
//     };

//     // Dependencies for the useEffect hook:
//     // - queryClient: To ensure we're using the correct client instance.
//     // - tickers: Crucially, we need to stringify tickers or use a memoized version
//     //   if it's an array/object that might be recreated on every render,
//     //   causing unnecessary effect re-runs. JSON.stringify is a common way.
//   }, [queryClient, JSON.stringify(tickers)]); // Stringify tickers to ensure effect runs if content changes

//   // This hook doesn't return data directly.
//   // Components should use useQuery(['ltp']) or useQuery(['ltp', tickerName])
//   // to get the latest prices from the React Query cache.
//   // For example:
//   // const { data: allPrices } = useQuery({ queryKey: ['ltp'], initialData: {} });
//   // const { data: specificPrice } = useQuery({ queryKey: ['ltp', 'RELIANCE'], enabled: !!tickerName });

//   return null; // Or you could return the socket instance if needed elsewhere, though generally not recommended.
// }