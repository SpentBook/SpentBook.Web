using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SpentBook.Web.Extensions
{
    public static class ModelStateExtensions
    {
        public static ModelStateDictionary AddIdentityErrors(this ModelStateDictionary modelState, IdentityResult identityResult)
        {
            foreach (var e in identityResult.Errors)
            {
                modelState.TryAddModelError(e.Code, e.Description);
            }

            
            return modelState;
        }

        public static ModelStateDictionary AddError(this ModelStateDictionary modelState, string code, string description)
        {
            modelState.TryAddModelError(code, description);
            return modelState;
        }
    }
}

