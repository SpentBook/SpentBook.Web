using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FluentValidation.AspNetCore;
using AutoMapper;
using Swashbuckle.AspNetCore.Swagger;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;
using SpentBook.Web.Services.Jwt;
using SpentBook.Web.Services.Config;
using SpentBook.Web.Services.Email;
using SpentBook.Web.Services.Error;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

namespace SpentBook.Web
{
    public class Startup
    {
        // 1) Melhorar forma para limpar o startu, deixar modular

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connection = Configuration.GetConnectionString("ApplicationDbContext");

            // Add MVC
            services.AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                })
                .AddFluentValidation(fv =>
                {
                    fv.RegisterValidatorsFromAssemblyContaining<Startup>();
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // Add problem details for model state
            services.AddProblemDetailsForInvalidModelState();

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Spentbook Api", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new ApiKeyScheme()
                {
                    Description = "Authorization header using the Bearer scheme",
                    Name = "Authorization",
                    In = "header"
                });

                var security = new Dictionary<string, IEnumerable<string>>
                {
                    {"Bearer", new string[] { }},
                };

                c.AddSecurityRequirement(security);
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist/ClientApp";
            });

            // Add DbContext
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connection));

            // Get/Set JwtIssuerOptions from configuration
            var appConfig = new AppConfig();
            Configuration.GetSection(nameof(AppConfig)).Bind(appConfig);
            appConfig.Jwt.ValidFor = TimeSpan.FromMinutes(appConfig.TimeoutTokenLogin);
            services.AddSingleton(appConfig);

            // JWT
            services.AddSingleton<IJwtFactory, JwtFactory>();

            // Add authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = null;
                options.DefaultScheme = null;
                options.DefaultSignInScheme = null;
                options.DefaultSignOutScheme = null;
            })
            .AddCookie(IdentityConstants.ApplicationScheme)
            .AddJwtBearer(configureOptions =>
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = appConfig.Jwt.Issuer,

                    ValidateAudience = true,
                    ValidAudience = appConfig.Jwt.Audience,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = appConfig.Jwt.SigningKey,

                    RequireExpirationTime = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                configureOptions.ClaimsIssuer = appConfig.Jwt.Issuer;
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
            });

            // api user claim policy
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Constants.PolicyName, policy => policy.RequireClaim(Constants.Rol, Constants.ApiAccess));
            });

            // add identity
            var builder = services.AddIdentityCore<ApplicationUser>(o =>
            {
                // configure identity options
                o.Password.RequireDigit = false;
                o.Password.RequireLowercase = false;
                o.Password.RequireUppercase = false;
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequiredLength = 3;
                o.Password.RequiredUniqueChars = 1;

                // Quando true, os usuarios só vão logar quando aprovarem via e-mail
                // a parte ruim é que se eu quiser ligar depois de já existir usuário na base, esses usuários não
                // vão mais conseguir logar até aprovarem
                o.SignIn.RequireConfirmedEmail = appConfig.RequireConfirmedEmail;
                o.Lockout = new LockoutOptions()
                {
                    MaxFailedAccessAttempts = appConfig.MaxFailedAccessAttempts,

                    // Sempre TRUE, quando false, os novos usuários nunca serão bloqueados por 
                    // limite de erros de senha
                    AllowedForNewUsers = true,

                    DefaultLockoutTimeSpan = TimeSpan.FromMinutes(appConfig.TimeoutUserBlocked),
                };
            });

            // Tempo dos tokens de confirmação de email e etc
            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromMinutes(appConfig.TimeoutTokenEmailConfirmation);
            });

            //builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services)
            builder
                .AddSignInManager()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Email
            services.AddScoped<IEmailSender, SendGridService>();
            services.AddScoped<EmailService>();

            // Add AutoMapper
            services.AddAutoMapper();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ApplicationDbContext context, ILoggerFactory loggerFactory)
        {
            if (!env.IsDevelopment())
                app.UseHsts();

            // 2) VER type para data invalida, antes do fluentvalidation
            // 4) Ver os links gerais de cada erro e trocar tudo lá
            // 5) Testar redirect
            app.UseProblemDetailsForExceptionsMiddleware(env, loggerFactory);

            // Expose the members of the 'Microsoft.AspNetCore.Http' namespace 
            // at the top of the file:
            // using Microsoft.AspNetCore.Http;
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Spentbook Api");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            context.Database.Migrate();
        }
    }
}
