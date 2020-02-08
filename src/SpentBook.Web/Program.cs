using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace SpentBook.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("VAR 'ASPNETCORE_URLS': {0}", Environment.GetEnvironmentVariable("ASPNETCORE_URLS"));
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    config.Sources.Clear();
                    config.AddJsonFile("appsettings.json", optional: false);
                    config.AddJsonFile($"appsettings.{environmentName?.ToLower()}.json", optional: true);
                    config.AddEnvironmentVariables();
                })
                // .UseUrls()
                .UseKestrel()
                .UseStartup<Startup>();
    }
}
