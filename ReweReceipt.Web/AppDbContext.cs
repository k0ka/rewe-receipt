using Microsoft.EntityFrameworkCore;
using ReweReceipt.Web.Entities;

namespace ReweReceipt.Web;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Post> Posts { get; set; }
}