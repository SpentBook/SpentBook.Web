using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SpentBook.Web.Controllers
{
    [Route("api/[controller]")]
    public class PostController : Controller
    {
        ApplicationDbContext context;

        public PostController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("[action]")]
        [Authorize("")]
        public bool Add()
        {
            // context.Database.EnsureDeleted();
            // context.Database.EnsureCreated();

            context.Blogs.Add(new Blog
            {
                Url = "http://sample.com",
                Posts = new List<Post>
                {
                    new Post {Title = "Saving Data with EF"},
                    new Post {Title = "Cascade Delete with EF"}
                }
            });

            context.SaveChanges();
            return true;
        }
    }
}
