using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ReweReceipt.Web.Controllers;

public class ArticleController(AppDbContext dbContext) : BaseApiController
{
    public record ArticleReceipt(Guid ReceiptId, DateTime TimeStamp, float Quantity, decimal Price);

    public record Article(int Id, string ProductName, string ImageUrl, IEnumerable<ArticleReceipt> Receipts);

    /// <summary>
    /// Get full about the article
    /// </summary>
    [HttpGet("{id:int}")]
    public ActionResult<Article> Get(int id)
    {
        var receiptArticles = dbContext.ReceiptArticle
            .Where(article => article.Nan == id)
            .Include(receiptArticle => receiptArticle.Receipt)
            .ToList();
        
        if (receiptArticles.Count == 0)
        {
            return NotFound();
        }

        return Ok(
            new Article(
                id,
                receiptArticles.First().ProductName,
                receiptArticles.First().MediaUrl,
                receiptArticles.Select(receipt => new ArticleReceipt(
                        receipt.Receipt.Id,
                        receipt.Receipt.TimeStamp,
                        receipt.Quantity,
                        receipt.UnitPrice / 100m
                    )
                )
            )
        );
    }
}