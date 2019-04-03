using System;
using FluentValidation;

namespace SpentBook.Web.Services.Error
{
    public static class FluentValidationModelStateExtensions
    {
        public static IRuleBuilderOptions<T, TProperty> WithMessage<T, TProperty>(this IRuleBuilderOptions<T, TProperty> rule, ProblemDetailsFieldType type, string errorMessage) 
        {
            rule.WithMessage(ProblemDetailsFactory.GetComposeTypeAndErrorMessage(type, errorMessage));
            return rule;
        }
    }
}