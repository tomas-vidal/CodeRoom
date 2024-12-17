import { useState } from "react";
import Lobby from "./components/Lobby";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Editor from "@monaco-editor/react";

function App() {
  const [connection, setConnection] = useState();
  const [currentRoom, setCurrentRoom] = useState();
  const [code, setCode] = useState();

  const handleEditorChange = (value, event) => {
    sendCode(value);
  };

  const joinRoom = async (user, room) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:5000/code")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (user, message) => {
        console.log("message received: ", message);
      });

      connection.on("ReceiveCode", (user, codeReceived) => {
        setCode(codeReceived);
      });

      connection.onclose((e) => {
        setConnection();
        setCode();
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user, room });

      setCurrentRoom(room);

      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const sendCode = async (codeSend) => {
    try {
      await connection.invoke("SendCode", codeSend);
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-slate-900">
      {!connection ? (
        <Lobby joinRoom={joinRoom}></Lobby>
      ) : (
        <section className="flex flex-col h-full w-full">
          <header className="flex items-center h-16 text-white mx-2">
            <span>Room: {currentRoom}</span>
            <button
              className="bg-red-700 w-36 p-2 rounded-sm text-white font-bold ml-auto"
              onClick={closeConnection}
            >
              Leave room
            </button>
          </header>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            onChange={handleEditorChange}
            value={code}
          />
        </section>
      )}
    </div>
  );
}

export default App;
