using System.ComponentModel.DataAnnotations;

namespace ReweReceipt.Web.Entities;

public class Receipt
{
    [Key]
    [Required]
    public Guid Id { get; set; }
    
    public virtual required Market Market { get; set; }
    
    public DateTime TimeStamp { get; set; }
    public int TotalPrice { get; set; }
    public bool PaybackFlag { get; set; }
    public bool Cancelled { get; set; }

    public virtual ICollection<ReceiptLine> Lines { get; } = [];
}