using System.ComponentModel.DataAnnotations;

namespace ReweReceipt.Web.Entities;

public class ReceiptLine
{
    [Key]
    [Required]
    public Guid Id { get; set; }
    
    public virtual required Receipt Receipt { get; set; }
    public virtual required Article Article { get; set; }
    
    public float Quantity { get; set; }
    public int UnitPrice { get; set; }
    public int TotalPrice { get; set; }
    public bool Weight { get; set; }
    
}