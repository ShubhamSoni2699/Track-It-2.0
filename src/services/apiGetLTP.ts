// export default function getLTP(setPrices, tickers) {
//   //old code if something breaks in new code
//   // const ws = new WebSocket('ws://localhost:8765');

//   // ws.onopen = () => {
//   //   // ws.send(JSON.stringify({ tickers }));
//   //   console.log('connection open');
//   //   const sendData = { tickers: tickers };
//   //   ws.send(JSON.stringify(sendData));
//   // };

//   // ws.onmessage = (event) => {
//   //   const prices = JSON.parse(event.data);
//   //   setPrices(prices);
//   //   return () => {
//   //     ws.close();
//   //   };
//   // };

//   //New code Comment this if something breaks

//   const connectWebSocket = () => {
//     ws.onopen = () => {
//       console.log('Connection open');
//       const sendData = { tickers: tickers };
//       ws.send(JSON.stringify(sendData));
//     };

//     ws.onmessage = (event) => {
//       const prices = JSON.parse(event.data);
//       setPrices(prices);
//     };

//     ws.onclose = (event) => {
//       console.log(`WebSocket closed: ${event.reason}`);
//       reconnect(); // Attempt to reconnect when the connection closes
//     };

//     ws.onerror = (err) => {
//       console.error('WebSocket error:', err);
//       ws.close(); // Close the WebSocket in case of error, triggering onclose
//     };

//     const reconnect = () => {
//       console.log(
//         `Attempting to reconnect in ${reconnectInterval / 1000} seconds...`
//       );
//       setTimeout(() => {
//         connectWebSocket();
//       }, reconnectInterval);
//     };
//   };

//   const reconnectInterval = 5000; // 5 seconds between reconnect attempts
//   const ws = new WebSocket('ws://localhost:8765'); // WebSocket variable

//   // Initial WebSocket connection
//   connectWebSocket();
//   // Return cleanup function when the component unmounts (important in React)
//   return () => {
//     if (ws) {
//       ws.close(); // Close WebSocket when component unmounts
//     }
//   };
// }

import { io } from 'socket.io-client';

// Define the server URL
// Use http or https depending on your server setup.
// Socket.IO typically upgrades to WebSocket if available.
const SERVER_URL = 'http://localhost:8765'; // Or 'ws://localhost:8765' if strictly WebSocket

export default function getLTP(setPrices, tickers) {
  // Create a new Socket.IO client instance
  // Configure reconnection options for better resilience
  const socket = io(SERVER_URL, {
    // Optional configuration for automatic reconnection
    reconnection: true, // Enable reconnection
    reconnectionAttempts: Infinity, // Try to reconnect forever
    reconnectionDelay: 1000, // Start with 1 second delay
    reconnectionDelayMax: 5000, // Max delay between retries
    randomizationFactor: 0.5, // Add random jitter to delay
    // If your server is strictly WS and doesn't support HTTP polling fallback
    // transports: ['websocket'],
  });

  // Event handler for successful connection
  socket.on('connect', () => {
    console.log('Socket.IO connected:', socket.id);

    // Send the initial list of tickers to the server
    // Use a specific event name like 'initTickers' or 'subscribe'
    // The server should listen for this event upon a new connection
    socket.emit('subscribeToTickers', { tickers: tickers });
    console.log('Sent initial tickers:', tickers);
  });

  // Event handler for receiving price updates
  // The server should emit an event (e.g., 'priceUpdate') with the price data
  socket.on('priceUpdate', (prices) => {
    // The data received should be the parsed prices object
    console.log('Received price update:', prices);
    setPrices(prices);
  });

  // Event handler for disconnection
  socket.on('disconnect', (reason) => {
    console.log('Socket.IO disconnected:', reason);
    // Socket.IO will automatically attempt to reconnect unless the reason is 'io client disconnect'
  });

  // Event handler for connection errors
  socket.on('connect_error', (err) => {
    console.error('Socket.IO connection error:', err.message);
    // Socket.IO will automatically attempt to reconnect after a connect_error
  });

  // Optional: Add handlers for reconnection process
  socket.on('reconnecting', (attemptNumber) => {
    console.log('Attempting to reconnect:', attemptNumber);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Successfully reconnected after', attemptNumber, 'attempts');
    // Re-send tickers after successful reconnection? Depends on server logic.
    // If the server remembers subscriptions, you don't need to.
    // If not, uncomment the line below:
    // socket.emit('initTickers', { tickers: tickers });
  });

   socket.on('reconnect_error', (err) => {
    console.error('Reconnection error:', err.message);
  });

   socket.on('reconnect_failed', () => {
    console.error('Reconnection failed permanently.');
    // Maybe show an error message to the user or try manual reconnection later
  });


  // This function is typically used in React's useEffect cleanup.
  // It will disconnect the socket when the component unmounts or dependencies change.
  return () => {
    console.log('Disconnecting Socket.IO...');
    // Use socket.disconnect() to initiate a clean disconnect
    socket.disconnect();
    // Remove all listeners to prevent memory leaks, though disconnect() often helps
    socket.removeAllListeners();
  };
}
