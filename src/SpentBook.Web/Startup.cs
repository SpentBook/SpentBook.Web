using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;

// using FluentValidation.AspNetCore;

using SpentBook.Web.Infra.DI;
using SpentBook.Web.Services.Error;
using SpentBook.Web.Services.Config;
using System;
using SpentBook.Web.Services.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SpentBook.Web;
using AutoMapper;
using Microsoft.AspNetCore.Identity.UI.Services;
using SpentBook.Web.Services.Email;
using System.Collections.Generic;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace SpentBook.Web
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                .AddMvcOptions(ops => {
                    ops.SuppressOutputFormatterBuffering = true;
                })
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                });
                // .AddFluentValidation(fv =>
                // {
                //     fv.RegisterValidatorsFromAssemblyContaining<Startup>();
                // });

            services
                .AddAndConfigureDatabase(Configuration)
                .AddProblemDetailsForInvalidModelState();

            // Get/Set JwtIssuerOptions from configuration
            var appConfig = new AppConfig();
            Configuration.GetSection(nameof(AppConfig)).Bind(appConfig);
            appConfig.Jwt.ValidFor = TimeSpan.FromMinutes(appConfig.TimeoutTokenLogin);
            services.AddSingleton(appConfig);

            // JWT (tem que ser scoped devido ao UserManager que é scoped)
            services.AddScoped<IJwtFactory, JwtFactory>();

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

            // Sem esse código, não é possível utilizar Roles na aplicação.
            // Depois de varias pesquisas, essa é a única forma que fez funcionar. 
            // A função "AddRoles<IdentityRole>()" não serve pra nada
            builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services);

            builder
                .AddSignInManager()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                // .AddRoles<IdentityRole>()
                .AddDefaultTokenProviders();

            // Email
            services.AddScoped<IEmailSender, SendGridService>();
            services.AddScoped<EmailService>();

            // Add AutoMapper
            services.AddAutoMapper(typeof(Startup));

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Spentbook Api", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Description = "Authorization header using the Bearer scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header
                });

                // var security = new Dictionary<string, IEnumerable<string>>
                // {
                //     {"Bearer", new string[] { }},
                // };

                // c.AddSecurityRequirement(security);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ApplicationDbContext context, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            if (!env.IsDevelopment())
                app.UseHsts();

            // 2) VER type para data invalida, antes do fluentvalidation
            // 4) Ver os links gerais de cada erro e trocar tudo lá
            // 5) Testar redirect
            app.UseProblemDetailsForExceptionsMiddleware(env, loggerFactory);

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Spentbook Api");
            });

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                // endpoints.MapControllerRoute(
                //     name: "default",
                //     pattern: "{controller}/{action=Index}/{id?}");
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

            try
            {
                context.Database.Migrate();
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger("Startup");
                logger.LogError($"Unexpected error: {ex}");
            }
        }
    }
}
