using System;
using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.WebUtilities;

namespace SpentBook.Web.Services.Error
{
    public class ProblemDetailsFactory
    {
        protected const string CLIENT_VALIDATION_ERROR_DETAIL = "One or more validation errors occurred. Please refer to the errors property for additional details";
        private const string STATUS_CODE_TYPE_URI = "https://httpstatuses.com/{0}";
        private const string TRACE_IDENTIFIER_KEY = "traceId";

        public string _traceId { get; }
        public string _requestPath { get; }

        public static IDictionary<int, ClientErrorData> ClientErrorMapping { get; }
            = new Dictionary<int, ClientErrorData>();

        static ProblemDetailsFactory()
        {
            for (var i = 400; i < 600; i++)
            {
                ClientErrorMapping.Add(i, new ClientErrorData
                {
                    Link = string.Format(STATUS_CODE_TYPE_URI, i),
                    Title = ReasonPhrases.GetReasonPhrase(i)
                });
            }
        }

        public ProblemDetailsFactory(string requestPath, string traceId)
        {
            this._traceId = traceId;
            this._requestPath = requestPath;
        }

        public ProblemDetails GetInternalServerError(Exception exception)
        {
            var problemDetails = new ProblemDetails
            {
                Detail = exception.Message
            };

            this.SetProblemDetail(problemDetails, StatusCodes.Status500InternalServerError);
            return problemDetails;
        }

        public ProblemDetails GetClientError(ModelStateDictionary modelState, int statusCode)
        {
            var problemDetails = new ModelStateProblemDetails(modelState)
            {
                Detail = modelState.Count > 0 ? CLIENT_VALIDATION_ERROR_DETAIL : null
            };

            this.SetProblemDetail(problemDetails, statusCode);
            return problemDetails;
        }

        public void SetProblemDetail(ProblemDetails problemDetails, int statusCode)
        {
            problemDetails.Instance = this._requestPath;
            problemDetails.Status = statusCode;

            var traceId = Activity.Current?.Id ?? _traceId;
            problemDetails.Extensions[TRACE_IDENTIFIER_KEY] = traceId;

            if (ClientErrorMapping.TryGetValue(statusCode, out var errorData))
            {
                problemDetails.Title = errorData.Title;
                problemDetails.Type = errorData.Link;
            }
            else
            {
                problemDetails.Type = string.Format(STATUS_CODE_TYPE_URI, statusCode);
                problemDetails.Title = ReasonPhrases.GetReasonPhrase(statusCode);
            }
        }

        public static string GetComposeTypeAndErrorMessage(ProblemDetailsFieldType errorType, string message)
        {
            string typeName = Enum.GetName(typeof(ProblemDetailsFieldType), errorType);
            return $"{typeName}/{message}";
        }
    }
}
