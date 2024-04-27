using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


public class RegisterUser
{
    [Key]
    public int id { get; set; }

    [Required]
    public string name { get; set; }="";

    [Required]
    public string email { get; set; }="";

    [Required]
    public string password { get; set; }="";
    
    
    public string salt {get;set;}="";
}
