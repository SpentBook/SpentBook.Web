using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;

namespace SpentBook.Web.Services.Error
{
    public class ModelStateProblemDetails : ProblemDetails
    {
        public class Item
        {
            public string Type { get; set; }
            public string Message { get; set; }
        }

        [JsonProperty(PropertyName = "errors")]
        public IDictionary<string, Item[]> Errors { get; }

        public ModelStateProblemDetails(ModelStateDictionary modelState)
        {
            if (modelState.Count > 0)
            {
                this.Errors = new Dictionary<string, Item[]>();
                foreach (var m in modelState)
                {
                    var items = new List<Item>();
                    foreach (var e in m.Value.Errors)
                        items.Add(GetItemFromError(e.ErrorMessage));

                    // Fix the fieldname in .netcore 3.1 (when not use newtonsoft): https://stackoverflow.com/questions/60104748/aspnet-core-3-1-validation-with-a-sign-in-the-name-of-fields-with-errors
                    var fieldName = m.Key.Replace("$.", "");
                    this.Errors.Add(fieldName, items.ToArray());
                }
            }
        }

        private Item GetItemFromError(string error)
        {
            var item = new Item();
            if (!string.IsNullOrWhiteSpace(error))
            {
                var stopAt = '/';
                int charLocation = error.IndexOf(stopAt, StringComparison.Ordinal);
                if (charLocation > 0)
                {
                    item.Type = error.Substring(0, charLocation);
                    item.Message = error.Substring(charLocation + 1);
                }
                else
                {
                    item.Type = Enum.GetName(typeof(ProblemDetailsFieldType), ProblemDetailsFieldType.Invalid);
                    item.Message = error;
                }
            }

            return item;
        }
    }
}