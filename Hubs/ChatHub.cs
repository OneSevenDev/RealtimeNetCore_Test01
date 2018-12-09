using Microsoft.AspNetCore.SignalR;
using SignalRChat.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public static List<Users> ListUsers { get; set; } = new List<Users>();
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Connect(string username){
            if (Context.UserIdentifier != null && ListUsers.Exists(u => u.Id.Equals(Context.UserIdentifier))){
                username = $"{username}1";
            }
            Users user = new Users() {
                Username = username,
                Id = Context.ConnectionId
            };
            ListUsers.Add(user);
            await Clients.All.SendAsync("UpdateUsers",
                        ListUsers.Count(),
                        ListUsers.Select(u => u.Username));
        }
        public async Task OnDisconnect(){
            Users userRemove = ListUsers.Single(u => u.Id == Context.ConnectionId);
            ListUsers.Remove(userRemove);
            await Clients.All.SendAsync("UpdateUsers",
                        ListUsers.Count(),
                        ListUsers.Select(u => u.Username));
        }
    }
}