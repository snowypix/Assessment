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
using backend.Infrastructure.Persistence;
using backend.Application.interfaces;
using backend.Domain.Models;
using System.Reflection;
using FluentValidation;
using MediatR;
using backend.Application.Common.Behaviors;
using backend.Application.Stations.Handlers;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
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

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {

            if (string.IsNullOrEmpty(context.Token))
            {
                var accessToken = context.Request.Cookies["auth_token"];
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
            }
            return Task.CompletedTask;
        }
    };
});
var perms = new List<Permission>
    {
        new Permission { Id = 1, Name = "CreateTicket" },
        new Permission { Id = 2, Name = "ViewTickets" },
        new Permission { Id = 3, Name = "ManageUsers" },
        new Permission { Id = 4, Name = "ViewTrips" },
        new Permission { Id = 5, Name = "ManageTrips" },
        new Permission { Id = 6, Name = "ViewStations" },
        new Permission { Id = 7, Name = "ManageStations" },
        new Permission { Id = 8, Name = "ManageTrains" }
    };
builder.Services.AddAuthorization(options =>
{
    foreach (var permission in perms)
    {
        options.AddPolicy(permission.Name, policy =>
        {
            policy.RequireClaim("Permission", permission.Name);
        });
    }
});
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<LoginHandler>();
builder.Services.AddScoped<RegisterHandler>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IStationRepository, StationRepository>();
builder.Services.AddScoped<ITrainRepository, TrainRepository>();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddMediatR(configuration =>
{
    configuration.RegisterServicesFromAssembly(typeof(CreateTrainHandler).Assembly);
});
// builder.Services.AddMediatR(cfg =>
// cfg.RegisterServicesFromAssembly(typeof(QueriesHandler).Assembly));
foreach (var service in builder.Services.Where(s => s.ServiceType.Name.Contains("Handler")))
{
    Console.WriteLine($"[MediatR] Registered handler: {service.ServiceType}");
}
builder.Services.AddValidatorsFromAssembly(typeof(backend.Application.Stations.Commands.CreateStationCommand).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseCors("AllowNextJsApp");
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbcontext>();
    context.Database.Migrate();

    if (!context.Users.Any())
    {
        var plannerRole = new Role { Id = 1, Name = "Planner" };
        var clientRole = new Role { Id = 2, Name = "Client" };

        context.Roles.AddRange(plannerRole, clientRole);

        var planner = new User { Id = 1, Nom = "planner", Password = "$2a$11$J7cDcNsIlKGAaFWehF6NjuznMxilF91oxQ2dKWHl4ljNQK5kAT9FW", Email = "admin@example.com", CIN = "A15" };
        var user = new User { Id = 2, Nom = "user1", Password = "$2a$11$J7cDcNsIlKGAaFWehF6NjuznMxilF91oxQ2dKWHl4ljNQK5kAT9FW", Email = "user1@example.com", CIN = "A17" };

        context.Users.AddRange(planner, user);

        context.UserRoles.AddRange(
            new UserRole { UserId = 1, RoleId = 1 },
            new UserRole { UserId = 2, RoleId = 2 }
        );
        var permissions = new List<Permission>
        {
            new Permission { Id = 1, Name = "CreateTicket" },
            new Permission { Id = 2, Name = "ViewTickets" },
            new Permission { Id = 3, Name = "ManageUsers" },
            new Permission { Id = 4, Name = "ViewTrips" },
            new Permission { Id = 5, Name = "ManageTrips" },
            new Permission { Id = 6, Name = "ViewStations" },
            new Permission { Id = 7, Name = "ManageStations" },
            new Permission { Id = 8, Name = "ManageTrains" }
        };
        context.Permissions.AddRange(permissions);


        var rolePermissions = new List<RolePermission>
        {

            new RolePermission { RoleId = 1, PermissionId = 3 },
            new RolePermission { RoleId = 1, PermissionId = 4 },
            new RolePermission { RoleId = 1, PermissionId = 5 },
            new RolePermission { RoleId = 1, PermissionId = 6 },
            new RolePermission { RoleId = 1, PermissionId = 7 },

            new RolePermission { RoleId = 2, PermissionId = 1 },
            new RolePermission { RoleId = 2, PermissionId = 2 },
            new RolePermission { RoleId = 2, PermissionId = 4 },
            new RolePermission { RoleId = 2, PermissionId = 6 }
        };
        context.RolePermissions.AddRange(rolePermissions);

        context.SaveChanges();
    }
}

app.Run();
