using System.ComponentModel.DataAnnotations;

public class GetAllUserResponse{

    [Key]
    public int id {get; set;}

    [Required]
    public string email {get;set;}="";

    [Required]
    public string name {get;set;}="";
}