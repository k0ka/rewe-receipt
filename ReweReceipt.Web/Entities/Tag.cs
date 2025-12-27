using System.ComponentModel.DataAnnotations;

namespace ReweReceipt.Web.Entities;

public class Tag
{
    [Key]
    [Required]
    public Guid Id { get; set; }
    
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
    
    public virtual ICollection<Article> Articles { get; } = [];
}