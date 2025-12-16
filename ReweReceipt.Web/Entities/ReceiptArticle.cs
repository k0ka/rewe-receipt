using System.ComponentModel.DataAnnotations;

namespace ReweReceipt.Web.Entities;

public class ReceiptArticle
{
    [Key]
    [Required]
    public Guid Id { get; set; }
    
    public virtual required Receipt Receipt { get; set; }
    
    public int Nan { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public float Quantity { get; set; }
    public int UnitPrice { get; set; }
    public int TotalPrice { get; set; }
    public bool Weight { get; set; }
    public string MediaUrl { get; set; } = string.Empty;
    
}