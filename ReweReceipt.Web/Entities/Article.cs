using System.ComponentModel.DataAnnotations;

namespace ReweReceipt.Web.Entities;

public class Article
{
    [Key]
    [Required]
    public Guid Id { get; set; }
    
    public int Nan { get; set; }
    
    [MaxLength(255)]
    public string ProductName { get; set; } = string.Empty;
    [MaxLength(255)]
    public string MediaUrl { get; set; } = string.Empty;
    
    public virtual ICollection<ReceiptLine> Lines { get; } = [];
    public virtual ICollection<Tag> Tags { get; } = [];
}