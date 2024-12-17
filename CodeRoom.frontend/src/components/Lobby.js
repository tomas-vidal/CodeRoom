import React, { useState } from "react";

function Lobby({ joinRoom }) {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();

  return (
    <form
      className="flex flex-col justify-center items-center gap-1 bg-white w-1/4 py-5 px-4 rounded-md"
      onSubmit={(e) => {
        e.preventDefault();
        joinRoom(user, room);
      }}
    >
      <h1 className="text-2xl font-bold mb-2">CodeRoom</h1>
      <input
        className="border-2 p-2 w-full bg-gray-200 rounded-sm"
        placeholder="name"
        type="text"
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        className="border-2 p-2 w-full bg-gray-200 rounded-sm"
        placeholder="room"
        type="text"
        onChange={(e) => setRoom(e.target.value)}
      />
      <button
        className="bg-indigo-400 w-full text-white font-bold rounded-sm p-2 mt-1"
        type="submit"
        disabled={!user || !room}
      >
        Join
      </button>
    </form>
  );
}

export default Lobby;
