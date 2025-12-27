using Microsoft.EntityFrameworkCore;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Article> Articles { get; set; }
    public DbSet<Market> Markets { get; set; }
    public DbSet<Receipt> Receipts { get; set; }
    public DbSet<ReceiptLine> ReceiptLines { get; set; }
    public DbSet<Tag> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            var currentTableName = entity.GetTableName();

            if (currentTableName == null || currentTableName.EndsWith('s'))
            {
                continue;
            }
            
            entity.SetTableName(currentTableName + "s");
        }
    }
}