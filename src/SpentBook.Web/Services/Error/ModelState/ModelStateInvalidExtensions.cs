using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SpentBook.Web.Error
{
    /// <summary>
    /// InvalidModelStateExtensions
    /// TEST: https://localhost:5001/api/ErrorSamples/InvalidModelBefore
    /// TEST: https://localhost:5001/api/ErrorSamples/InvalidModelAfter
    /// TEST: https://localhost:5001/api/ErrorSamples/InvalidModelAfterWithModelState
    /// TEST: https://localhost:5001/api/ErrorSamples/InvalidModelAfterWithCustomError
    /// </summary>
    public static partial class ModelStateInvalidExtensions
    {
        /// <summary>
        /// ErrorMechanism
        /// </summary>
        public enum ErrorMechanism
        {
            UseDefaultAspNetCoreFilterForInvalidModelBeforeAction,
            UseFullControlForInvalidModelBeforeAndAfterAction,
            UseProblemDetailsFactory
        }

        private static MediaTypeCollection _mediaTypeError = new MediaTypeCollection() { "application/problem+json", "application/problem+xml" };
        private static ErrorMechanism ErrorMechanismSelected { get; set; } = ErrorMechanism.UseFullControlForInvalidModelBeforeAndAfterAction;
        private static bool UseCustomErrorLinks { get; set; } = true;

        public static IServiceCollection ConfigureProblemDetailsModelState(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                switch (ErrorMechanismSelected)
                {
                    case ErrorMechanism.UseDefaultAspNetCoreFilterForInvalidModelBeforeAction:
                        options.InvalidModelStateResponseFactory = delegate (ActionContext context)
                        {
                            var problemDetails = new ProblemDetailsFactory
                                (
                                    context.HttpContext.Request.Path,
                                    context.HttpContext.TraceIdentifier
                                ).GetClientError(context.ModelState, StatusCodes.Status400BadRequest);

                            return GetObjectResult(problemDetails);
                        };
                        break;
                    case ErrorMechanism.UseFullControlForInvalidModelBeforeAndAfterAction:
                        break;
                    case ErrorMechanism.UseProblemDetailsFactory:
                        services.TryAddSingleton<IClientErrorFactory, ProblemDetailsClientErrorFactory>();
                        break;
                }

                //options.ClientErrorMapping
            });

            return services;
        }

        /// <summary>
        /// UseFilterInvalidModelState (Disable default API BEHAVIOR)
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static void UseFilterInvalidModelState(this ApiBehaviorOptions options)
        {
            switch (ErrorMechanismSelected)
            {
                case ErrorMechanism.UseDefaultAspNetCoreFilterForInvalidModelBeforeAction:
                    // Enable default aspnetcore validation AFTER action call
                    // Enable "options.InvalidModelStateResponseFactory" if set or use default
                    options.SuppressModelStateInvalidFilter = false;

                    // Disable default aspnetcore validation BEFORE action call
                    options.SuppressMapClientErrors = false;
                    break;
                case ErrorMechanism.UseFullControlForInvalidModelBeforeAndAfterAction:
                    // Disable default aspnetcore validation AFTER action call
                    // Disable "options.InvalidModelStateResponseFactory" if set
                    options.SuppressModelStateInvalidFilter = true;

                    // Disable default aspnetcore validation BEFORE action call
                    options.SuppressMapClientErrors = true;
                    break;
                case ErrorMechanism.UseProblemDetailsFactory:
                    break;
            }

            if (UseCustomErrorLinks)
            {
                foreach (var l in ProblemDetailsFactory.ClientErrorMapping)
                {
                    if (options.ClientErrorMapping.ContainsKey(l.Key))
                    {
                        options.ClientErrorMapping[l.Key].Link = l.Value.Link;
                        options.ClientErrorMapping[l.Key].Title = l.Value.Title;
                    }
                    else
                    {
                        options.ClientErrorMapping.Add(l.Key, l.Value);
                    }
                }
            }
        }

        /// <summary>
        /// UseFilterInvalidModelState (BEFORE ACTION)
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static void UseFilterInvalidModelState(this MvcOptions mvcOptions)
        {
            switch (ErrorMechanismSelected)
            {
                case ErrorMechanism.UseDefaultAspNetCoreFilterForInvalidModelBeforeAction:
                    break;
                case ErrorMechanism.UseFullControlForInvalidModelBeforeAndAfterAction:
                    mvcOptions.Filters.Add(typeof(ModelStateInvalidFilter));
                    break;
                case ErrorMechanism.UseProblemDetailsFactory:
                    break;
            }
        }

        /// <summary>
        /// GetObjectResult
        /// </summary>
        public static ObjectResult GetObjectResult(ProblemDetails problemDetails)
        {
            return new ObjectResult(problemDetails)
            {
                StatusCode = problemDetails.Status,
                ContentTypes = _mediaTypeError
            };
        }

        private class ProblemDetailsClientErrorFactory : IClientErrorFactory
        {
            public IActionResult GetClientError(ActionContext actionContext, IClientErrorActionResult clientError)
            {
                var problemDetails = new ProblemDetailsFactory
                     (
                         actionContext.HttpContext.Request.Path,
                         actionContext.HttpContext.TraceIdentifier
                     ).GetClientError(actionContext.ModelState, clientError.StatusCode.Value);

                return GetObjectResult(problemDetails);
            }
        }
    }
}