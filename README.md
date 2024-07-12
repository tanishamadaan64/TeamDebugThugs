# Chat Application

This project is a real-time chat application built with Node.js, Express, and Socket.IO. It allows users to join chat rooms, send messages, and share their location with others in the room. The application also filters out profanity from messages.

## Features

- **Real-time Chat**: Users can send messages to all members of the room in real-time.
- **Location Sharing**: Users can share their current location with the chat room.
- **Profanity Filter**: Messages containing profanity are automatically filtered out.
- **User Management**: Users can join and leave chat rooms, and the application keeps track of users in each room.

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.14.0 or later)

### Installation

1. Clone the repository.
2. Navigate to the project directory: Chat-app
3. Install dependencies: npm install
4. Start the server: npm run start:dev


   The server will start on `http://localhost:3000`.

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Enter a username and room name, then click "Join Room".
3. Start chatting with other users in the room.
4. To share your location, click the "Send Location" button.

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [bad-words](https://www.npmjs.com/package/bad-words) - For profanity filtering.


## Acknowledgments

- Thanks to the Socket.IO team for their amazing library.
- Thanks to the creators of bad-words for the profanity filtering feature.

