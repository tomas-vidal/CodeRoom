using CodeRoom.backend.Hubs;

namespace CodeRoom.backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSignalR();
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
            builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());
            builder.Services.AddSingleton<IDictionary<string, string>>(opts => new Dictionary<string, string>());

            var app = builder.Build();



            app.UseCors();

            app.MapHub<CodeHub>("/code");

            app.Urls.Add("https://localhost:5000");

            app.Run();
        }
    }
}
