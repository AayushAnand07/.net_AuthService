using System.ComponentModel.DataAnnotations;


namespace AuthApi.DTOs;
public class LoginUser
{
    
    [Required]
    public string email { get; set; }="";

    [Required]
    public string password { get; set; }="";
    
    
}
