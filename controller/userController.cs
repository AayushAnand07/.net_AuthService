using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class userController : ControllerBase
{
    private readonly ApiDbContext _dbContext;
     private readonly UserService _userService;

    public userController(ApiDbContext dbContext, UserService userService)
    {
        _dbContext = dbContext;
        _userService=userService;
    }


        


    [HttpGet]
        
        public async Task<ActionResult<IEnumerable<GetAllUserResponse>>> GetAllUsers()
        {
            var users= await _dbContext.user_auth.ToListAsync();
                var response = users.Select(u=> new GetAllUserResponse{
                        id=u.id,
                        name=u.name!,
                        email=u.email!,
                        
                }).ToList();

                return Ok(response);

        }


    [HttpGet("{id}")]
       
        public async Task<ActionResult<RegisterUserRequest>> GetUser(int id)
        {
          try{
            var user= await _userService.GetUserById(id);
            return Ok(user);


          }
          catch(Exception ex)
          {
            return BadRequest(ex.Message);

          }
        }

     

       


}