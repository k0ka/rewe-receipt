using Microsoft.EntityFrameworkCore;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Market> Markets { get; set; }
    public DbSet<Receipt> Receipts { get; set; }
    public DbSet<ReceiptArticle> ReceiptArticle { get; set; }
}