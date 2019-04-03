using SpentBook.Web.Services.Jwt;

namespace SpentBook.Web.Services.Email
{
    public class EmailTemplate
    {
        public string Name { get; set; }
        public string From { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}