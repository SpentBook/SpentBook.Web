using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Options;

namespace SpentBook.Web.Services.Error
{
    /// <summary>
    /// ValidateModelFilter
    /// </summary>
    public class ModelStateInvalidFilter : IActionFilter, IOrderedFilter, IAlwaysRunResultFilter
    {
        private readonly ApiBehaviorOptions _options;
        public int Order => -2000;

        public ModelStateInvalidFilter(IOptions<ApiBehaviorOptions> options)
        {
            this._options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.Result == null && !context.ModelState.IsValid)
            {
                var problemDetails = new ProblemDetailsFactory
                    (
                        context.HttpContext.Request.Path,
                        context.HttpContext.TraceIdentifier
                    ).GetClientError(context.ModelState, StatusCodes.Status400BadRequest);

                context.Result = ModelStateInvalidExtensions.GetObjectResult(problemDetails);
            }
        }

        public void OnResultExecuting(ResultExecutingContext context)
        {
            if (!(context.Result is IClientErrorActionResult clientError))
                return;

            // We do not have an upper bound on the allowed status code. This allows this filter to be used
            // for 5xx and later status codes.
            if (clientError.StatusCode < 400)
                return;

            var problemDetails = new ProblemDetailsFactory
                (
                    context.HttpContext.Request.Path,
                    context.HttpContext.TraceIdentifier
                ).GetClientError(context.ModelState, clientError.StatusCode.Value);

            context.Result = ModelStateInvalidExtensions.GetObjectResult(problemDetails);
        }

        public void OnResultExecuted(ResultExecutedContext context)
        {
        }
    }
}