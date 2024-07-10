using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:5174") // Replace with your React app's URL
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();