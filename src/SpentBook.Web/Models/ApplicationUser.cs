using System;
using Microsoft.AspNetCore.Identity;

namespace SpentBook.Web
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        // public long FacebookId { get; set; }
        public string PictureUrl { get; set; }
        public Gender? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}