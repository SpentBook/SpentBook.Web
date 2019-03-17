using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SpentBook.Web.Error
{
    public class ProblemDetailsBuilder
    {
        private const string STATUS_CODE_TYPE_URI = "https://httpstatuses.com/{0}";
        private const string TRACE_IDENTIFIER_KEY = "traceId";

        private readonly HttpContext _context;
        private readonly Exception _exception;
        // protected MediaTypeCollection _mediaTypeError = new MediaTypeCollection() { "application/problem+json", "application/problem+xml" };
        protected MediaTypeCollection _mediaTypeError = new MediaTypeCollection() { "application/problem+json" };

        public ProblemDetailsBuilder(HttpContext context, Exception exception) 
        {
            this._context = context;
            this._exception = exception;
        }
        
        public async void SetInternalServerError()
        {
            var statusCode = StatusCodes.Status500InternalServerError;
            var problemDetails = new ProblemDetails
            {
                Instance = _context.Request.Path,
                Title = ReasonPhrases.GetReasonPhrase(statusCode),
                Status = statusCode,
                Detail = _exception.Message,
                Type = string.Format(STATUS_CODE_TYPE_URI, statusCode),                
            };

            this.SetTraceId(problemDetails);

            // if (exception is BadHttpRequestException badHttpRequestException)
            // {
            //     problemDetails.Title = "The request is invalid";
            //     problemDetails.Status = StatusCodes.Status400BadRequest;
            //     problemDetails.Detail = badHttpRequestException.Message;
            // }

            _context.Response.StatusCode = statusCode;
            _context.Response.ContentType = string.Join(",", _mediaTypeError);
            var json = JsonConvert.SerializeObject(problemDetails);
            await _context.Response.WriteAsync(json);
        }

        private void SetTraceId(ProblemDetails problemDetails)
        {
            var traceId = Activity.Current?.Id ?? this._context.TraceIdentifier;
            problemDetails.Extensions[TRACE_IDENTIFIER_KEY] = traceId;
        }
    }
}
