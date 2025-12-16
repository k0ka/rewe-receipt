using Microsoft.AspNetCore.Mvc;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web.Controllers;

public class ReceiptController(AppDbContext dbContext) : BaseApiController
{
    public record ReceiptBrief(Guid Id, Market Market, DateTime Date, decimal Total);

    [HttpGet]
    public IEnumerable<ReceiptBrief> Get(int offset = 0, int perPage = 50) =>
        dbContext.Receipts
            .Skip(offset)
            .Take(perPage)
            .Select(receipt => new ReceiptBrief(receipt.Id, receipt.Market, receipt.TimeStamp, receipt.TotalPrice / 100m)
            );
}