#if DEBUG

using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SpentBook.Web.Services.Error
{
    /// <summary>
    /// ErrorController
    /// </summary>
    public class ErrorsController : ControllerBase
    {
        [Route("api/Error/401")]
        [HttpGet]
        [Authorize]
        public IActionResult Cause401()
        {
            return Ok();
        }

        [Route("api/Error/405")]
        [HttpGet]
        public IActionResult Cause405()
        {
            return Ok();
        }


        [Route("api/Error/500")]
        [HttpGet]

        public IActionResult Error500()
        {
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            return new JsonResult(exceptionFeature);
        }

        [Route("api/ErrorSamples/Exception")]
        [HttpGet]
        public IActionResult Exception()
        {
            throw new Exception("ERRO");
        }

        [Route("api/ErrorSamples/InvalidModelBefore")]
        [HttpGet]
        public IActionResult InvalidModelBefore([Required]DateTime notSet)
        {
            return new EmptyResult();
        }

        [Route("api/ErrorSamples/InvalidModelAfter")]
        [HttpGet]
        public IActionResult InvalidModelAfter()
        {
            return NotFound();
        }

        [Route("api/ErrorSamples/InvalidModelAfterWithModelState")]
        [HttpGet]
        public IActionResult InvalidModelAfterWithModelState()
        {
            ModelState.TryAddModelError("Email", "Invalid email");
            return BadRequest();
        }

        [Route("api/ErrorSamples/InvalidModelAfterWithCustomError")]
        [HttpGet]
        public IActionResult InvalidModelAfterWithCustomError()
        {
            return Conflict(new
            {
                ErrorProperty1 = "Value",
                ErrorProperty2 = "Value",
            });
        }
    }
}

#endif