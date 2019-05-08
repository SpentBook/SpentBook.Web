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

namespace SpentBook.Web.Services.Error
{
    public class ModelStateBuilder<T>
    {
        private readonly ControllerBase _controller;
        private readonly IdentityResult _identityResult;

        public ModelStateBuilder(ControllerBase controller, IdentityResult identityResult = null)
        {
            this._controller = controller;
            this._identityResult = identityResult;
        }

        public ModelStateBuilder<T> SetIdentityErrorPassword(Expression<Func<T, object>> expression)
        {
            foreach (var e in this._identityResult.Errors)
            {
                switch (e.Code)
                {
                    case "PasswordTooShort":
                        this.SetFieldError(expression, ProblemDetailsFieldType.PasswordTooShort, e.Description);
                        break;
                    case "PasswordRequiresLower":
                        this.SetFieldError(expression, ProblemDetailsFieldType.PasswordRequiresLower, e.Description);
                        break;
                    case "PasswordRequiresUpper":
                        this.SetFieldError(expression, ProblemDetailsFieldType.PasswordRequiresUpper, e.Description);
                        break;
                    case "PasswordRequiresNonAlphanumeric":
                        this.SetFieldError(expression, ProblemDetailsFieldType.PasswordRequiresNonAlphanumeric, e.Description);
                        break;
                }
            }

            return this;
        }

        public ModelStateBuilder<T> SetIdentityErrorEmail(Expression<Func<T, object>> expression)
        {
            foreach (var e in this._identityResult.Errors)
            {
                switch (e.Code)
                {
                    case "DuplicateUserName":
                        this.SetFieldError(expression, ProblemDetailsFieldType.DuplicateUserName, e.Description);
                        break;
                }
            }

            return this;
        }

        public bool HasProblem(Expression<Func<T, object>> expression, ProblemDetailsFieldType errorType)
        {
            string typeName = Enum.GetName(typeof(ProblemDetailsFieldType), errorType);
            var fieldName = GetFieldName(expression);
            if (this._controller.ModelState.ContainsKey(fieldName))
            {
                foreach (var e in this._controller.ModelState[fieldName].Errors)
                    if (e.ErrorMessage.StartsWith(typeName))
                        return true;
            }

            return false;
        }

        private ModelStateBuilder<T> SetFieldError(Expression<Func<T, object>> expression, ProblemDetailsFieldType errorType, string message = null)
        {
            var fieldName = GetFieldName(expression);
            this._controller.ModelState.TryAddModelError(fieldName, ProblemDetailsFactory.GetComposeTypeAndErrorMessage(errorType, message));
            return this;
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
