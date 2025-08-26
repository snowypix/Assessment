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
        var user = await _userRepo.GetByEmailAsync(command.Email, ct);
        if (user == null || !user.VerifyPassword(command.Password))
            return null;

        return _jwtService.GenerateToken(user, user.UserRoles.Select(r => r.Role.Name));
    }
}
