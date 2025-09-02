using backend.Application.Auth.Commands;
using backend.Application.Auth.Handlers;
using backend.Application.DTOs;
using MediatR;
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
    private readonly IMediator _mediator;
    public AuthController(LoginHandler loginHandler, RegisterHandler registerHandler, IMediator mediator)
    {
        _loginHandler = loginHandler;
        _registerHandler = registerHandler;
        _mediator = mediator;
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] loginDTO loginDto, CancellationToken ct)
    {
        var token = await _loginHandler.Handle(new LoginCommand(loginDto.Email, loginDto.Password), ct);

        if (token == "")
            return BadRequest(new { message = "Invalid email or password" });

        Response.Cookies.Append("auth_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new { message = "Login successful" });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO dto, CancellationToken ct)
    {
        var user = await _registerHandler.Handle(new RegisterCommand(dto.Email, dto.Password, dto.Nom, dto.CIN), ct);
        return Ok(new { user.Id, user.Nom, user.Email });
    }
    [HttpGet("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Append("auth_token", "", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(-1),
            Path = "/"
        });

        return Ok(new { message = "Logout successful" });
    }


    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> Me([FromServices] IMediator mediator)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var result = await mediator.Send(new MyInformationsQuery(userId!));

        return Ok(result);
    }
}
