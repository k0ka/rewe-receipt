using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web.Controllers;

public class ReceiptController(AppDbContext dbContext) : BaseApiController
{
    public record ReceiptBrief(Guid Id, Market Market, DateTime Date, decimal Total);

    /// <summary>
    /// List brief receipts
    /// </summary>
    [HttpGet]
    public IEnumerable<ReceiptBrief> List(int offset = 0, int perPage = 50) =>
        dbContext.Receipts
            .Skip(offset)
            .Take(perPage)
            .OrderByDescending(receipt => receipt.TimeStamp)
            .Select(receipt => new ReceiptBrief(
                    receipt.Id,
                    receipt.Market,
                    receipt.TimeStamp,
                    receipt.TotalPrice / 100m
                )
            );


    public record ReceiptLine(Guid Id, string ProductName, float Quantity, decimal Price);

    public record ReceiptFull(
        Guid Id,
        Market Market,
        DateTime Date,
        decimal Total,
        bool PaybackFlag,
        bool Cancelled,
        IEnumerable<ReceiptLine> Lines
    );

    /// <summary>
    /// Get full info about the receipt
    /// </summary>
    [HttpGet("{id:guid}")]
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
            receipt.Lines.Select(line => new ReceiptLine(
                    line.Article.Id,
                    line.Article.ProductName != "" ? line.Article.ProductName : $"Unknown article {line.Article.Nan}",
                    line.Quantity,
                    line.UnitPrice / 100m
                )
            )
        );
    }
}