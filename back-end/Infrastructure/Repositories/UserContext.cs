// Infrastructure/Identity/UserContext.cs
using back_end.Application.interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

public class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal User => _httpContextAccessor.HttpContext!.User;

    public string? GetUserId() =>
        User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public string? GetUsername() =>
        User.Identity?.Name;

    public List<string> GetRoles() =>
        User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

    public List<string> GetPermissions() =>
        User.Claims.Where(c => c.Type == "permission").Select(c => c.Value).ToList();
}
