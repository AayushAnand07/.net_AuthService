using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class authController : ControllerBase
{
    private readonly ApiDbContext _dbContext;
     private readonly AuthService _authService;

    public authController(ApiDbContext dbContext, AuthService authService)
    {
        _dbContext = dbContext;
        _authService=authService;
    }


        


     [HttpPost]
     [Route("register")]
        
        public async Task<ActionResult<RegisterUserRequest>> RegisterUser(RegisterUserRequest user)
        {
            
        try
        {
            var response = await _authService.RegisterUser(user);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        }



    // [HttpPost]
    // [Route("login")]

        

               


}