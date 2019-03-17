using System;
using System.Collections.Generic;
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
    public class ProblemDetailsBuilder<T>
    {
        protected const string VALIDATIN_ERROR_DETAIL = "One or more validation errors occurred. Please refer to the errors property for additional details";
        protected const string STATUS_CODE_TYPE_URI = "https://httpstatuses.com/{0}";
        protected MediaTypeCollection _mediaTypeError = new MediaTypeCollection() { "application/problem+json", "application/problem+xml" };

        private readonly ControllerBase _controller;
        private readonly IdentityResult _identityResult;

        public ProblemDetailsBuilder(ControllerBase controller, IdentityResult identityResult = null)
        {
            this._controller = controller;
            this._identityResult = identityResult;
        }

        public BadRequestObjectResult BadRequest()
        {
            return new BadRequestObjectResult(GetValidationProblemDetails(StatusCodes.Status400BadRequest))
            {
                ContentTypes = _mediaTypeError
            };
        }

        public ConflictObjectResult Conflict()
        {
            return new ConflictObjectResult(GetValidationProblemDetails(StatusCodes.Status409Conflict))
            {
                ContentTypes = _mediaTypeError
            };
        }
        
        private ValidationProblemDetails GetValidationProblemDetails(int statusCode)
        {
            return new ValidationProblemDetails(this._controller.ModelState)
            {
                Title = ReasonPhrases.GetReasonPhrase(statusCode),
                Detail = VALIDATIN_ERROR_DETAIL,
                Instance = this._controller.HttpContext.Request.Path,
                Status = statusCode,
                Type = string.Format(STATUS_CODE_TYPE_URI, statusCode),
            };
        }

        public ProblemDetailsBuilder<T> SetIdentityErrorPassword(Expression<Func<T, object>> expression)
        {
            foreach (var e in this._identityResult.Errors)
            {
                switch (e.Code)
                {
                    case "PasswordRequiresLower":
                        this.SetFieldError(expression, ProblemDetailFieldType.PasswordRequiresLower, e.Description);
                        break;
                    case "PasswordRequiresUpper":
                        this.SetFieldError(expression, ProblemDetailFieldType.PasswordRequiresUpper, e.Description);
                        break;
                    case "PasswordRequiresNonAlphanumeric":
                        this.SetFieldError(expression, ProblemDetailFieldType.PasswordRequiresNonAlphanumeric, e.Description);
                        break;
                }
            }

            return this;
        }

        public ProblemDetailsBuilder<T> SetIdentityErrorEmail(Expression<Func<T, object>> expression)
        {
            foreach (var e in this._identityResult.Errors)
            {
                switch (e.Code)
                {
                    case "DuplicateUserName":
                        this.SetFieldError(expression, ProblemDetailFieldType.DuplicateUserName, e.Description);
                        break;
                }
            }

            return this;
        }

        public ProblemDetailsBuilder<T> SetFieldError(Expression<Func<T, object>> expression, ProblemDetailFieldType errorType, string message = null)
        {
            string typeName = Enum.GetName(typeof(ProblemDetailFieldType), errorType);
            var fieldName = GetFieldName(expression);
            this._controller.ModelState.TryAddModelError(fieldName, $"{typeName}/{message}");
            return this;
        }

        public bool HasProblem(Expression<Func<T, object>> expression, ProblemDetailFieldType errorType)
        {
            string typeName = Enum.GetName(typeof(ProblemDetailFieldType), errorType);
            var fieldName = GetFieldName(expression);
            if (this._controller.ModelState.ContainsKey(fieldName))
            {
                foreach (var e in this._controller.ModelState[fieldName].Errors)
                    if (e.ErrorMessage.StartsWith(typeName))
                        return true;
            }

            return false;
        }

        private string GetFieldName(Expression<Func<T, object>> expression)
        {
            if (expression.Body.NodeType == ExpressionType.Convert) //Value type
            {
                UnaryExpression body = expression.Body as UnaryExpression;
                MemberExpression operand = body?.Operand as MemberExpression;
                return operand?.Member.Name;
            }
            else if (expression.Body.NodeType == ExpressionType.MemberAccess) //Ref type
            {
                MemberExpression body = expression.Body as MemberExpression;
                return body?.Member.Name;
            }

            return null;
        }
    }
}
