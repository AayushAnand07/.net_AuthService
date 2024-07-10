using System.ComponentModel.DataAnnotations;


namespace AuthApi.DTOs;
public class LoginUser
{
    
    [Required]
    public required string email { get; set; }

    [Required]
    public required string  password { get; set; }
    
    
}
