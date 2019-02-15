using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SpentBook.Web.ViewsModels
{
    public partial class ErrorViewModel
    {
        public IReadOnlyDictionary<string, ModelStateEntry> Validations { get; }
        public string ErrorType { get; }
        public string RequestId { get; }
        public string Message { get; }

        public ErrorViewModel(Controller controller, ErrorType errorType = ViewsModels.ErrorType.InvalidForm, string message = null)
        {
            this.RequestId = controller.HttpContext.TraceIdentifier;
            this.Message = message;
            this.Validations = controller.ModelState;
            this.ErrorType = errorType.ToString();
        }

        public ErrorViewModel(Controller controller, IdentityResult identityResult, ErrorType errorType)
        {
            this.RequestId = controller.HttpContext.TraceIdentifier;
            this.Message = null;
            this.Validations = controller.ModelState;
            this.ErrorType = errorType.ToString();

            foreach (var e in identityResult.Errors)
                controller.ModelState.TryAddModelError(e.Code, e.Description);
        }

        public ErrorViewModel(string requestId, string message, ErrorType errorType)
        {
            this.RequestId = requestId;
            this.Message = message;
            this.Validations = null;
            this.ErrorType = errorType.ToString();
        }
    }
}