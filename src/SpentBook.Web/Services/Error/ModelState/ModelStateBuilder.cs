﻿using System;
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
        public ModelStateBuilder(ControllerBase controller)
        {
            this._controller = controller;
        }
        public ModelStateBuilder(ControllerBase controller, IdentityResult identityResult)
        {
            this._controller = controller;
            this._identityResult = identityResult;
            foreach (var e in identityResult.Errors)
            {
                this.SetFieldError("*", ProblemDetailsFieldType.Unknown, $"{e.Code}/{e.Description}");
            }
        }

        public ModelStateBuilder<T> SetIdentityErrorPassword(Expression<Func<T, object>> expression, Func<ProblemDetailsFieldType, bool> addOnly = null)
        {
            void set(ProblemDetailsFieldType type, string desc)
            {
                if (addOnly == null || addOnly(type))
                    this.SetFieldError(expression, type, desc);
            }

            foreach (var e in this._identityResult.Errors)
            {
                switch (e.Code)
                {
                    case "PasswordMismatch":
                        set(ProblemDetailsFieldType.PasswordMismatch, e.Description);
                        break;
                    case "PasswordNotMatch":
                        set(ProblemDetailsFieldType.PasswordNotMatch, e.Description);
                        break;
                    case "PasswordTooShort":
                        set(ProblemDetailsFieldType.PasswordTooShort, e.Description);
                        break;
                    case "PasswordRequiresLower":
                        set(ProblemDetailsFieldType.PasswordRequiresLower, e.Description);
                        break;
                    case "PasswordRequiresUpper":
                        set(ProblemDetailsFieldType.PasswordRequiresUpper, e.Description);
                        break;
                    case "PasswordRequiresNonAlphanumeric":
                        set(ProblemDetailsFieldType.PasswordRequiresNonAlphanumeric, e.Description);
                        break;
                }
            }

            return this;
        }

        public ModelStateBuilder<T> SetIdentityErrorCode(Expression<Func<T, object>> expression)
        {
            foreach (var e in this._identityResult.Errors)
            {
                switch (e.Code)
                {
                    case "InvalidToken":
                        this.SetFieldError(expression, ProblemDetailsFieldType.Invalid, e.Description);
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

        public ModelStateBuilder<T> SetFieldError(Expression<Func<T, object>> expression, ProblemDetailsFieldType errorType, string message = null)
        {
            var fieldName = GetFieldName(expression);
            return SetFieldError(fieldName, errorType, message);
        }

        public ModelStateBuilder<T> SetFieldError(string fieldName, ProblemDetailsFieldType errorType, string message = null)
        {
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
