using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web.Controllers;

public class ReceiptController(AppDbContext dbContext) : BaseApiController
{
    public record ReceiptBrief(Guid Id, Market Market, DateTime Date, decimal Total);

    /// <summary>
    /// Get a list of brief receipts
    /// </summary>
    [HttpGet]
    public IEnumerable<ReceiptBrief> Get(int offset = 0, int perPage = 50) =>
        dbContext.Receipts
            .Skip(offset)
            .Take(perPage)
            .Select(receipt => new ReceiptBrief(
                    receipt.Id,
                    receipt.Market,
                    receipt.TimeStamp,
                    receipt.TotalPrice / 100m
                )
            );


    public record ReceiptArticle(Guid Id, int Nan, string ProductName, float Quantity, decimal Price);

    public record ReceiptFull(
        Guid Id,
        Market Market,
        DateTime Date,
        decimal Total,
        bool PaybackFlag,
        bool Cancelled,
        IEnumerable<ReceiptArticle> Articles
    );

    /// <summary>
    /// Get full info about the receipt
    /// </summary>
    [HttpGet("{id}")]
    public ReceiptFull Get(Guid id)
    {
        var receipt = dbContext.Receipts.Include(receipt => receipt.Market).First(receipt => receipt.Id == id);
        return new ReceiptFull(
            receipt.Id,
            receipt.Market,
            receipt.TimeStamp,
            receipt.TotalPrice / 100m,
            receipt.PaybackFlag,
            receipt.Cancelled,
            receipt.Articles.Select(article => new ReceiptArticle(
                    article.Id,
                    article.Nan,
                    article.ProductName,
                    article.Quantity,
                    article.UnitPrice / 100m
                )
            )
        );
    }
}