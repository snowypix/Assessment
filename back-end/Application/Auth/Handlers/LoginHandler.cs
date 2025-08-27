using backend.Application.Auth.Commands;
using backend.Application.DTOs;
using backend.Application.interfaces;
using backend.Application.Interfaces;

namespace backend.Application.Auth.Handlers;

public class LoginHandler
{
    private readonly IUserRepository _userRepo;
    private readonly IJwtService _jwtService;

    public LoginHandler(IUserRepository userRepo, IJwtService jwtService)
    {
        _userRepo = userRepo;
        _jwtService = jwtService;
    }

    public async Task<string?> Handle(LoginCommand command, CancellationToken ct)
    {
        var dto = new loginDTO
        {
            Email = command.Email,
            Password = command.Password
        };
        return await _jwtService.GenerateToken(dto);
    }
}
