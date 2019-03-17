using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SpentBook.Web.Error
{
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

    public static class ProblemDetailsExtensions
    {
        private const string ACTION_NAME = "/api/Error/500";
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

        public static IServiceCollection ConfigureProblemDetailsModelState(this IServiceCollection services)
        {
            
            return services;
            return services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Instance = context.HttpContext.Request.Path,
                        Status = StatusCodes.Status400BadRequest,
                        Detail = "Please refer to the errors property for additional details"
                    };

                    return new BadRequestObjectResult(problemDetails)
                    {
                        ContentTypes = { "application/problem+json", "application/problem+xml" }
                    };
                };

            });
        }

        /// <summary>
        /// UseFilterInvalidModelState
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static void UseFilterInvalidModelState(this MvcOptions mvcOptions)
        {
            mvcOptions.Filters.Add(typeof(ValidateModelAttribute));
        }

        public class ValidateModelAttribute : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext context)
            {
                if (!context.ModelState.IsValid)
                {
                    context.Result = new BadRequestObjectResult(context.ModelState);
                }
            }

            public override void OnActionExecuted(ActionExecutedContext context)
            {

            }

            //
            public override void OnResultExecuted(ResultExecutedContext context)
            {

            }

            public override void OnResultExecuting(ResultExecutingContext context)
            {

            }

            // public override Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
            // {
            //     return null;
            // }

            // public override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
            // {
            //     return null;
            // }
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

                        new ProblemDetailsBuilder(context, exception).SetInternalServerError();
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

    /// <summary>
    /// ErrorController
    /// </summary>
    public class ErrorController : Controller
    {
        [Route("api/Error/500")]
        public IActionResult Error500()
        {
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            return new JsonResult(exceptionFeature);
        }
    }
}