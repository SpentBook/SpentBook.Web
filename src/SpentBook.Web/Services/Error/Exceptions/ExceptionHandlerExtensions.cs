using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SpentBook.Web.Error
{
    /// <summary>
    /// ExceptionHandlerExtensions
    /// TEST: https://localhost:5001/api/ErrorSamples/Exception
    /// </summary>
    public static class ExceptionHandlerExtensions
    {
        private const string ACTION_NAME = "/api/Error/500";

        /// <summary>
        /// ErrorMechanism
        /// </summary>
        public enum ErrorMechanism
        {
            UseDeveloperExceptionPage,
            UseExceptionHandlerWithCustomAction,
            UseExceptionHandlerWithProblemDetails,
            UseExceptionCustomMiddleware
        }

        public static ErrorMechanism ErrorMechanismSelected { get; set; } = ErrorMechanism.UseExceptionHandlerWithProblemDetails;

        public static void UseMiddlewareProblemDetails(this IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            switch (ErrorMechanismSelected)
            {
                case ErrorMechanism.UseDeveloperExceptionPage:
                    app.UseDeveloperExceptionPage();
                    break;
                case ErrorMechanism.UseExceptionHandlerWithCustomAction:
                    app.UseExceptionHandler(ACTION_NAME);
                    break;
                case ErrorMechanism.UseExceptionHandlerWithProblemDetails:
                    UseExceptionHandlerWithProblemDetails(app, loggerFactory);
                    break;
                case ErrorMechanism.UseExceptionCustomMiddleware:
                    UseExceptionCustomMiddleware(app);
                    break;
            }
        }

        /// <summary>
        /// UseExceptionHandlerWithProblemDetails
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        private static void UseExceptionHandlerWithProblemDetails(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            app.UseExceptionHandler(builder =>
            {
                builder.Run(async context =>
                {
                    var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>();

                    if (exceptionHandlerFeature != null)
                    {
                        var exception = exceptionHandlerFeature.Error;

                        if (loggerFactory != null)
                        {
                            var logger = loggerFactory.CreateLogger("GlobalExceptionHandler");
                            logger.LogError($"Unexpected error: {exception}");
                        }

                        var problemDetails = new ProblemDetailsFactory(context.Request.Path, context.TraceIdentifier).GetInternalServerError(exception);
                        context.Response.StatusCode = problemDetails.Status.Value;
                        context.Response.ContentType = "application/problem+json";
                        var json = JsonConvert.SerializeObject(problemDetails);
                        await context.Response.WriteAsync(json);
                    }
                });
            });
        }

        /// <summary>
        /// UseCustomMiddleware
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        private static void UseExceptionCustomMiddleware(IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (Exception ex)
                {
                    // código para fins de estudos
                    // Esse código faz o mesmo que app.UseExceptionHandler(ACTION_NAME);
                    // porém, é menos cuidadoso que esse método que é nativo
                    var exceptionHandlerFeature = new ExceptionHandlerFeature()
                    {
                        Error = ex,
                        Path = context.Request.Path,
                    };

                    context.Features.Set<IExceptionHandlerFeature>(exceptionHandlerFeature);
                    context.Features.Set<IExceptionHandlerPathFeature>(exceptionHandlerFeature);
                    context.Request.Path = ACTION_NAME;
                    await next();
                }
            });
        }
    }
}