using Microsoft.AspNetCore.Mvc;
using ReweReceipt.Web.Services;

namespace ReweReceipt.Web.Controllers;

public class FetchController(FetchService fetchService, AppDbContext dbContext) : BaseApiController
{
    public record GetResponse(bool IsFetching, int ReceiptsCount, int ArticlesCount, string? lastError);

    [HttpGet]
    public GetResponse Get() => new(
        fetchService.IsFetching,
        dbContext.Receipts.Count(),
        dbContext.ReceiptArticle.Count(),
        fetchService.LastError?.Message
    );

    /// <summary>
    /// Starts fetching data from rewe.
    /// </summary>
    [HttpPost]
    public ActionResult Post(string cookie)
    {
        Task.Run(() => fetchService.LoadAll(cookie));
        return NoContent();
    }
}