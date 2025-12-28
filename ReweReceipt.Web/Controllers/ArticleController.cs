using Microsoft.AspNetCore.Mvc;

namespace ReweReceipt.Web.Controllers;

public class ArticleController(AppDbContext dbContext) : BaseApiController
{
    public record ArticleBrief(Guid Id, string ProductName, string ImageUrl);

    /// <summary>
    /// List brief articles
    /// </summary>
    [HttpGet]
    public IEnumerable<ArticleBrief> List(int offset = 0, int perPage = 50, string? query = null) =>
        dbContext.Articles
            .Where(article => query == null || query != "" || article.ProductName.Contains(query))
            .Skip(offset)
            .Take(perPage)
            .OrderByDescending(article => article.Nan)
            .Select(article => new ArticleBrief(
                    article.Id,
                    article.HumanReadableName,
                    article.MediaUrl
                )
            );


    public record ArticlePurchase(Guid ReceiptId, DateTime TimeStamp, float Quantity, decimal Price);

    public record Article(Guid Guid, string ProductName, string ImageUrl, IEnumerable<ArticlePurchase> Purchases);

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
                article.HumanReadableName,
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