using System.Net;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web.Services;

public class FetchService
{
    private readonly Lock _lock = new();
    private readonly HttpClient _httpClient;
    private readonly ILogger<FetchService> _logger;
    private readonly AppDbContext _dbContext;

    public FetchService(ILogger<FetchService> logger, AppDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;

        _httpClient = new HttpClient(
            new HttpClientHandler
            {
                UseCookies = false,
                //ServerCertificateCustomValidationCallback = (_, _, _, _) => true
            }
        );
        _httpClient.DefaultRequestVersion = HttpVersion.Version20;
        _httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionExact;
    }

    /// <summary>
    /// Is fetching receipts.
    /// </summary>
    public bool IsFetching { get; private set; }

    /// <summary>
    /// Last error.
    /// </summary>
    public Exception? LastError { get; private set; }

    /// <summary>
    /// Load all receipts from rewe.
    /// </summary>
    public void LoadAll(string cookie)
    {
        lock (_lock)
        {
            LastError = null;
            IsFetching = true;

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "curl/8.13.0");
            _httpClient.DefaultRequestHeaders.Add("Accept", "*/*");
            _httpClient.DefaultRequestHeaders.Add("Cookie", $"rstp={cookie}");

            try
            {
                FetchReceiptsList().Wait();
                foreach (var receipt in _dbContext.Receipts)
                {
                    if (receipt.Lines.Any())
                    {
                        continue;
                    }

                    FetchReceiptLines(receipt).Wait();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load receipts");
                LastError = ex;
            }

            IsFetching = false;
        }
    }

    /// <summary>
    /// Fetch articles for a receipt.
    /// </summary>
    private async Task FetchReceiptLines(Receipt receipt)
    {
        JsonNode? root = await FetchUrl($"https://www.rewe.de/shop/api/receipts/{receipt.Id}");

        if (root?["articles"] is not JsonArray lines)
        {
            _logger.LogError("Failed to load articles for receipt {id}: {root}", receipt.Id, root?.ToJsonString());
            throw new Exception("Failed to load articles");
        }

        receipt.Lines.Clear();
        _dbContext.Update(receipt);
        await _dbContext.SaveChangesAsync();

        foreach (var line in lines)
        {
            if (line == null)
            {
                continue;
            }
            
            var article = await GetArticle(line.AsObject());
            if (article == null)
            {
                continue;
            }

            receipt.Lines.Add(
                new ReceiptLine
                {
                    Receipt = receipt,
                    Article = article,
                    Quantity = line["quantity"]?.GetValue<float>() ?? 0,
                    UnitPrice = line["unitPrice"]?.GetValue<int>() ?? 0,
                    TotalPrice = line["totalPrice"]?.GetValue<int>() ?? 0,
                    Weight = line["weight"]?.GetValue<bool>() ?? false,
                }
            );
        }

        _dbContext.Update(receipt);
        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Load an article from a database or create a new one.
    /// </summary>
    private async Task<Article?> GetArticle(JsonObject? data)
    {
        if (data == null)
        {
            return null;
        }

        var nan = data["nan"]?.GetValue<int>() ?? 0;
        if (nan == 0)
        {
            _logger.LogError("Article nan is null: {data}", data.ToJsonString());
            return null;
        }

        var article = await _dbContext.Articles.FirstOrDefaultAsync(article => article.Nan == nan);
        if (article != null)
        {
            if (article.ProductName != data["productName"]?.ToString())
            {
                _logger.LogWarning(
                    "Article has different name: {original} vs {new}",
                    article.ProductName,
                    data["productName"]?.ToString()
                );
            }

            return article;
        }

        article = new Article()
        {
            Nan = nan,
            ProductName = data["productName"]?.ToString() ?? string.Empty,
            MediaUrl = data["picture"]?["mediaUrl"]?.ToString() ?? string.Empty,
        };
        _dbContext.Articles.Add(article);
        await _dbContext.SaveChangesAsync();

        return article;
    }

    /// <summary>
    /// Fetch json from rewe api.
    /// </summary>
    private async Task<JsonNode?> FetchUrl(string url)
    {
        using var response = await _httpClient.GetAsync(url);
        if (response.StatusCode == HttpStatusCode.OK)
        {
            return await response.Content.ReadFromJsonAsync<JsonNode>();
        }

        _logger.LogError(
            "Failed to load url {url} list: {response}, {data}",
            url,
            response.StatusCode,
            await response.Content.ReadAsStringAsync()
        );
        throw new Exception("Failed to load url");
    }


    /// <summary>
    /// Fetch a list of all receipts from API.
    /// </summary>
    private async Task FetchReceiptsList()
    {
        JsonNode? root = await FetchUrl("https://www.rewe.de/shop/api/receipts");

        if (root?["items"] is not JsonArray items)
        {
            _logger.LogError("Failed to load receipts list: {root}", root?.ToJsonString());
            throw new Exception("Failed to load receipts list");
        }

        foreach (var item in items)
        {
            if (item == null)
            {
                continue;
            }

            var market = await GetMarket(item["market"]?.AsObject());
            if (market == null)
            {
                _logger.LogError("Failed to load market: {item}", item.ToJsonString());
                continue;
            }

            var receiptId = item["receiptId"]?.ToString();
            if (receiptId is null || !Guid.TryParse(receiptId, out var guid))
            {
                _logger.LogError("Error parsing receipt id: {item}", item.ToJsonString());
                continue;
            }

            if (await _dbContext.Receipts.FindAsync(guid) != null)
            {
                continue;
            }

            var receipt = new Receipt
            {
                Id = guid,
                TimeStamp = DateTime.Parse(item["receiptTimestamp"]?.ToString() ?? string.Empty),
                TotalPrice = Int32.Parse(item["receiptTotalPrice"]?.ToString() ?? string.Empty),
                PaybackFlag = item["paybackFlag"]?.ToString() == "true",
                Cancelled = item["cancelled"]?.ToString() == "true",
                Market = market,
            };
            _dbContext.Receipts.Add(receipt);
            await _dbContext.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Load market from a database or create a new one.
    /// </summary>
    private async Task<Market?> GetMarket(JsonObject? data)
    {
        if (data == null)
        {
            return null;
        }

        var ident = data["wwIdent"]?.ToString();
        if (ident is null)
        {
            _logger.LogError("Market id is null: {data}", data.ToJsonString());
            return null;
        }

        if (!Int32.TryParse(ident, out var id))
        {
            _logger.LogError("Non-integer market id: {data}", data.ToJsonString());
            return null;
        }

        var market = await _dbContext.Markets.FindAsync(id);
        if (market != null)
        {
            return market;
        }

        market = new Market()
        {
            Id = id,
            Name = data["name"]?.ToString() ?? string.Empty,
            Street = data["street"]?.ToString() ?? string.Empty,
            ZipCode = data["zipCode"]?.ToString() ?? string.Empty,
            City = data["city"]?.ToString() ?? string.Empty
        };
        _dbContext.Markets.Add(market);
        await _dbContext.SaveChangesAsync();

        return market;
    }
}