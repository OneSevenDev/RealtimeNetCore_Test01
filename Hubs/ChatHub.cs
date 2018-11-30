using Microsoft.AspNetCore.SignalR;
using SignalRChat.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        // public static List<Client> ConnectedUsers { get; set; } = new List<Client>();
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        // public async Task UpdateUsers(string user){
        //     await Clients.All.SendAsync("UpdateUsers", user;
        // }
    }
}