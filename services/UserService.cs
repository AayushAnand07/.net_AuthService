using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class UserService{


    private readonly ApiDbContext _dbContext;
   

    public UserService(ApiDbContext context,IConfiguration configuration){
        _dbContext = context;
        
    }
    public async Task<createdUserResponse> GetUserById(int id){
        
             var user = await _dbContext.user_auth.FindAsync(id);
              if (user == null)
            {
                return new createdUserResponse{
                    message="User not found",
                    status=400
                };
            }
            else {
                return new createdUserResponse{
                    message="User found successfully",
                    status=200,
                    Id=user.id,
                    name=user.name,
                    email=user.email
                    
                };
            }

        
         
         
         
      
    }

}