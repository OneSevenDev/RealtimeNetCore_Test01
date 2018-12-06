using Microsoft.AspNetCore.SignalR;
using SignalRChat.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public static List<Client> ConnectedUsers { get; set; } = new List<Client>();
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Connect(string username){
            Client client = new Client() {
                Username = username,
                Id = Context.ConnectionId
            };
            ConnectedUsers.Add(client);
            await Clients.All.SendAsync("UpdateUsers",
                        ConnectedUsers.Count(),
                        ConnectedUsers.Select(u => u.Username));
        }
        public async Task OnDisconnect(){
            Client clientRemove = ConnectedUsers.Single(u => u.Id == Context.ConnectionId);
            ConnectedUsers.Remove(clientRemove);
            await Clients.All.SendAsync("UpdateUsers",
                        ConnectedUsers.Count(),
                        ConnectedUsers.Select(u => u.Username));
        }
    }
}