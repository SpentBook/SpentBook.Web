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

namespace SpentBook.Web.Services.Error
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
        private static MediaTypeCollection _mediaTypeError = new MediaTypeCollection() { Constants.CONTENT_TYPE_JSON, Constants.CONTENT_TYPE_XML };
        private static bool UseCustomErrorLinks { get; set; } = true;

        public static IServiceCollection AddProblemDetailsForInvalidModelState(this IServiceCollection services)
        {   
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(typeof(ModelStateInvalidFilter));
            });

            services.Configure<ApiBehaviorOptions>(options =>
            {
                // Disable default aspnetcore validation AFTER action call
                // Disable "options.InvalidModelStateResponseFactory" if set
                options.SuppressModelStateInvalidFilter = true;
                
                // Disable default aspnetcore validation BEFORE action call
                options.SuppressMapClientErrors = true;

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
            });

            return services;
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
    }
}