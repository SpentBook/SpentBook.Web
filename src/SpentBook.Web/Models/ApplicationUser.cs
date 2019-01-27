using Microsoft.AspNetCore.Identity;

namespace SpentBook.Web
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; internal set; }
        public string LastName { get; internal set; }
    }
}