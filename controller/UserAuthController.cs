using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class authController : ControllerBase
{
    private readonly ApiDbContext _dbContext;

    public authController(ApiDbContext dbContext)
    {
        _dbContext = dbContext;
    }


        [NonAction]
         public async Task<IActionResult> GetSalt(int id)
        {
                var user = await _dbContext.user_auth.FindAsync(id);
                if (user != null)
                {
                    return Ok(user.salt); 
                }
                else
                {
                    return NotFound(); 
                }
            
            
        }


    [HttpGet]
        
        public async Task<ActionResult<IEnumerable<RegisterUser>>> GetAllUsers()
        {
            return await _dbContext.user_auth.ToListAsync();
        }


    [HttpGet("{id}")]
       
        public async Task<ActionResult<RegisterUser>> GetUser(int id)
        {
            var user = await _dbContext.user_auth.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return user!;
        }

     [HttpPost]
     [Route("register")]
        
        public async Task<ActionResult<RegisterUser>> RegisterUser(RegisterUser user)
        {
            
            user.salt=SaltGenerator.GenerateSalt(16);
            string password=user.password;
            user.password=PasswordHashing.HashPassword(password,user.salt);
           
            _dbContext.user_auth.Add(user);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.id }, user);
        }

       


}