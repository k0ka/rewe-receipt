using System.ComponentModel.DataAnnotations;

namespace ReweReceipt.Web.Entities;

public class Market
{
    [Key]
    [Required]
    public int Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
}