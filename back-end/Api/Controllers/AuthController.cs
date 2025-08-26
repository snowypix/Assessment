using backend.Application.Auth.Commands;
using backend.Application.Auth.Handlers;
using backend.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly LoginHandler _loginHandler;
    private readonly RegisterHandler _registerHandler;

    public AuthController(LoginHandler loginHandler, RegisterHandler registerHandler)
    {
        _loginHandler = loginHandler;
        _registerHandler = registerHandler;
    }

    [HttpGet("test/{id}")]
    [Authorize(Policy = "Invoice.Read")]
    public IActionResult GetInvoice(int id)
    {
        return Ok(new { InvoiceId = id, Status = "Test ok" });
    }

    [HttpPost("auth/login")]
    public async Task<IActionResult> Login([FromBody] loginDTO loginDto, CancellationToken ct)
    {
        var token = await _loginHandler.Handle(new LoginCommand(loginDto.Email, loginDto.Password), ct);

        if (token is null)
            return BadRequest(new { message = "Invalid email or password" });

        Response.Cookies.Append("auth_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // true in production
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new { message = "Login successful" });
    }

    [HttpPost("auth/register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO dto, CancellationToken ct)
    {
        var user = await _registerHandler.Handle(new RegisterCommand(dto.Email, dto.Password, dto.Nom), ct);
        if (user == null)
            return BadRequest(new { message = "User already exists" });

        return Ok(new { user.Id, user.Nom, user.Email });
    }

    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public IActionResult Me()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var username = User.Identity?.Name;
        var permissions = User.Claims.Where(c => c.Type == "permission").Select(c => c.Value).ToList();
        var roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

        return Ok(new
        {
            UserId = userId,
            Username = username,
            Roles = roles,
            Permissions = permissions
        });
    }
}
