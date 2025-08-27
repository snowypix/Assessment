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
using backend.Domain.Models;

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
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbcontext>();
    context.Database.Migrate(); // applies migrations

    if (!context.Users.Any())
    {
        var plannerRole = new Role { Id = 1, Name = "Planner" };
        var managerRole = new Role { Id = 2, Name = "Manager" };
        var userRole = new Role { Id = 3, Name = "User" };

        context.Roles.AddRange(plannerRole, managerRole, userRole);

        var planner = new User { Id = 1, Nom = "planner", Password = "$2a$11$J7cDcNsIlKGAaFWehF6NjuznMxilF91oxQ2dKWHl4ljNQK5kAT9FW", Email = "admin@example.com", CIN = "A15" };
        var manager = new User { Id = 2, Nom = "manager", Password = "$2a$11$J7cDcNsIlKGAaFWehF6NjuznMxilF91oxQ2dKWHl4ljNQK5kAT9FW", Email = "manager@example.com", CIN = "A16" };
        var user = new User { Id = 3, Nom = "user1", Password = "$2a$11$J7cDcNsIlKGAaFWehF6NjuznMxilF91oxQ2dKWHl4ljNQK5kAT9FW", Email = "user1@example.com", CIN = "A17" };

        context.Users.AddRange(planner, manager, user);

        context.UserRoles.AddRange(
            new UserRole { UserId = 1, RoleId = 1 },
            new UserRole { UserId = 2, RoleId = 2 },
            new UserRole { UserId = 3, RoleId = 3 }
        );
        var permissions = new List<Permission>
        {
            new Permission { Id = 1, Name = "ViewUsers" },
            new Permission { Id = 2, Name = "ManageUsers" },
            new Permission { Id = 3, Name = "ViewTrips" },
            new Permission { Id = 4, Name = "ManageTrips" },
            new Permission { Id = 5, Name = "ViewStations" },
            new Permission { Id = 6, Name = "ManageStations" }
        };
        context.Permissions.AddRange(permissions);

        // ---- RolePermissions ----
        var rolePermissions = new List<RolePermission>
        {
            // Admin → all permissions
            new RolePermission { RoleId = 1, PermissionId = 1 },
            new RolePermission { RoleId = 1, PermissionId = 2 },
            new RolePermission { RoleId = 1, PermissionId = 3 },
            new RolePermission { RoleId = 1, PermissionId = 4 },
            new RolePermission { RoleId = 1, PermissionId = 5 },
            new RolePermission { RoleId = 1, PermissionId = 6 },

            // Manager → ViewTrips, ManageTrips, ViewStations
            new RolePermission { RoleId = 2, PermissionId = 3 },
            new RolePermission { RoleId = 2, PermissionId = 4 },
            new RolePermission { RoleId = 2, PermissionId = 5 },

            // User → ViewTrips, ViewStations
            new RolePermission { RoleId = 3, PermissionId = 3 },
            new RolePermission { RoleId = 3, PermissionId = 5 }
        };
        context.RolePermissions.AddRange(rolePermissions);

        context.SaveChanges();
    }
}

app.Run();
