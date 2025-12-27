using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ReweReceipt.Web.Controllers;

public class ArticleController(AppDbContext dbContext) : BaseApiController
{
    public record ArticlePurchase(Guid ReceiptId, DateTime TimeStamp, float Quantity, decimal Price);

    public record Article(Guid Guid, int Nan, string ProductName, string ImageUrl, IEnumerable<ArticlePurchase> Purchases);

    /// <summary>
    /// Get full about the article
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Article>> Get(Guid id)
    {
        var article = await dbContext.Articles.FindAsync(id);
        
        if (article == null)
        {
            return NotFound();
        }

        return Ok(
            new Article(
                id,
                article.Nan,
                article.ProductName,
                article.MediaUrl,
                article.Lines.Select(line => new ArticlePurchase(
                        line.Receipt.Id,
                        line.Receipt.TimeStamp,
                        line.Quantity,
                        line.UnitPrice / 100m
                    )
                )
            )
        );
    }
}