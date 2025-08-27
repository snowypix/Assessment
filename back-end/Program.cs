using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using HotChocolate.AspNetCore;
using backend.Infrastructure.Services;
using backend.Application.Auth.Handlers;
using backend.Application.Interfaces;
using backend.Infrastructure.Repositories;
using backend.Application.interfaces;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // <-- your frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();  // IMPORTANT: to allow cookies
    });
});

var secretKey = builder.Configuration["Jwt:Key"];
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbcontext>(options => options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 41)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)
    ));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
})
.AddJwtBearer("Bearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "pix",
        ValidAudience = "pix",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        RoleClaimType = ClaimTypes.Role
    };

    // Allow token from HttpOnly cookie if no Authorization header is present
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // If no Authorization header, try cookie
            if (string.IsNullOrEmpty(context.Token))
            {
                var accessToken = context.Request.Cookies["auth_token"]; // Your cookie name
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Invoice.Read", policy =>
        policy.RequireClaim("permission", "Invoice.Read"));

    options.AddPolicy("Invoice.Delete", policy =>
        policy.RequireClaim("permission", "Invoice.Delete"));

    options.AddPolicy("User.Manage", policy =>
        policy.RequireClaim("permission", "User.Manage"));
});
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<LoginHandler>();
builder.Services.AddScoped<RegisterHandler>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddAutoMapper(typeof(Program));
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseCors("AllowNextJsApp");
app.Run();
