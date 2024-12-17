using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading.Tasks;

namespace CodeRoom.backend.Hubs
{
    public class CodeHub : Hub
    {
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;
        private readonly IDictionary<string, string> _roomsCodes;

        public CodeHub(IDictionary<string, UserConnection> connections, IDictionary<string, string> roomsCodes) 
        {
            _botUser = "MyChat Bot";
            _connections = connections;
            _roomsCodes = roomsCodes;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                bool usersInRoom = _connections.Values.Where(c => c.Room == userConnection.Room).ToList().Any();

                if (!usersInRoom)
                {
                    _roomsCodes.Remove(userConnection.Room);
                }
            }

            return base.OnDisconnectedAsync(exception);
        }


        public async Task SendCode(string code)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.GroupExcept(userConnection.Room, Context.ConnectionId)
                .SendAsync("ReceiveCode", userConnection.User, code);

                _roomsCodes[userConnection.Room] = code;
            }
        }
        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections[Context.ConnectionId] = userConnection;

            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", $"{userConnection.User} has joined {userConnection.Room}");

            if (_roomsCodes.TryGetValue(userConnection.Room, out string code))
            {
                await Clients.Group(userConnection.Room).SendAsync("ReceiveCode", userConnection.User, code);
            }
        }
    }
}
