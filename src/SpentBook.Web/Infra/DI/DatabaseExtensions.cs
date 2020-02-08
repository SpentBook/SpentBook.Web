using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
namespace SpentBook.Web.Infra.DI
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddAndConfigureDatabase(this IServiceCollection services, IConfiguration configuration) 
        {
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("ApplicationDbContext")));
            return services;
        }
    }
}