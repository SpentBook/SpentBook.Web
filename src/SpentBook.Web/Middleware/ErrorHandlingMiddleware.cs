using System;
using System.Diagnostics;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using SpentBook.Web.ViewsModels;

namespace SpentBook.Web.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            string message = null;
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                // erro 500 (erro não tratado em qualquer lugar)
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                message = ex.Message;
            }
            finally
            {
                // caso não seja um erro 500 (exception) e nenhuma action foi executada (!context.Response.HasStarted)
                // então é possível que o aspnet core tenha gerado algum erro como por exemplo:
                // 405: Method Not Allowed (ocorre, por exemplo, quando tenta abrir uma action com o verbo diferente do configurado)
                if (!context.Response.HasStarted)
                {
                    context.Response.ContentType = "application/json";
                    var response = new ErrorViewModel(context.TraceIdentifier, message ?? ReasonPhrases.GetReasonPhrase(context.Response.StatusCode), ErrorType.Unknown);
                    var json = JsonConvert.SerializeObject(response);
                    await context.Response.WriteAsync(json);
                }
            }
        }
    }
}