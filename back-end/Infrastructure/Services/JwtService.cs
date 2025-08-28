using backend.Application.DTOs;
using backend.Application.interfaces;
using backend.Infrastructure.Persistence;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NuGet.Protocol.Plugins;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace backend.Infrastructure.Services
{
    public class JwtService : IJwtService
    {
        private readonly AppDbcontext _context;

        private readonly IConfiguration _config;

        public JwtService(AppDbcontext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> GenerateToken(loginDTO loginDto)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                        .ThenInclude(r => r.RolePermissions)
                            .ThenInclude(rp => rp.Permission)
                .SingleOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return "";
            }

            var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();


            var permissions = user.UserRoles
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Name)
                .Distinct()
                .ToList();


            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Nom)
            };


            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));


            claims.AddRange(permissions.Select(p => new Claim("permission", p)));

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "pix",
                audience: "pix",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
