using System.ComponentModel.DataAnnotations;

namespace ReweReceipt.Web.Entities;

public class Post
{
    [Key]
    [Required]
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
}