using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SpentBook.Web.Controllers
{
    [Route("api/[controller]")]
    public class PostController : Controller
    {
        SpentBookContext context;

        public PostController(SpentBookContext context)
        {
            this.context = context;
        }

        [HttpGet("[action]")]
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
