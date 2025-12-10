using Microsoft.AspNetCore.Mvc;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web.Controllers;

public class PostController(AppDbContext dbContext) : BaseApiController
{
    [HttpGet]
    public IEnumerable<Post> GetPosts() => dbContext.Posts;

    [HttpPost]
    public async Task<Post> CreatePost(string title, string content)
    {
        var post = new Post { Title = title, Content = content };
        dbContext.Posts.Add(post);
        await dbContext.SaveChangesAsync();
        return post;
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePost(Guid id)
    {
        var post = await dbContext.Posts.FindAsync(id);
        if (post == null)
        {
            return NotFound();
        }
        
        dbContext.Posts.Remove(post);
        await dbContext.SaveChangesAsync();
        return NoContent();
    }
}