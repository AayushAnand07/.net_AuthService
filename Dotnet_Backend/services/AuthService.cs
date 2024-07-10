using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class AuthService{


    private readonly ApiDbContext _dbContext;
   

    public AuthService(ApiDbContext context,IConfiguration configuration){
        _dbContext = context;
        
    }
public async Task<createdUserResponse> RegisterUser(RegisterUserRequest user)
    {
       
        if (await _dbContext.user_auth.AnyAsync(u => u.email == user.email))
        { 
            return new createdUserResponse{
                message="Email Already Exists",
                status=400,
            };
        }

     
        user.salt = SaltGenerator.GenerateSalt(16);
        string password = user.password!;
        user.password = PasswordHashing.HashPassword(password, user.salt);

       
        _dbContext.user_auth.Add(user);
        await _dbContext.SaveChangesAsync();

       
        return new createdUserResponse
        {
            message="Success",
            status =200,
            Id = user.id,
            name = user.name!,
            email=user.email!
            
        };
    }

   
         
         
         
      
    }

