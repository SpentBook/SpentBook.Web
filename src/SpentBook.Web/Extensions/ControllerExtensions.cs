using Microsoft.AspNetCore.Mvc;

namespace SpentBook.Web.Extensions
{
    public static class ControllerExtensions
    {
        public static StatusCodeResult Locked(this Controller controller)
        {
            return new StatusCodeResult((int)System.Net.HttpStatusCode.Locked);
        }

        public static ObjectResult OkCreated(this Controller controller, object model)
        {
            return new ObjectResult(model)
            {
                StatusCode = (int)System.Net.HttpStatusCode.Created
            };
        }
    }
}

