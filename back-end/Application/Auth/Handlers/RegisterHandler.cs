using AccountService.Exceptions;
using backend.Application.Auth.Commands;
using backend.Application.DTOs;
using backend.Application.interfaces;
using backend.Application.Interfaces;
using backend.Domain.Models;

namespace backend.Application.Auth.Handlers;

public class RegisterHandler
{
    private readonly IUserRepository _userRepo;

    public RegisterHandler(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<User?> Handle(RegisterCommand command, CancellationToken ct)
    {
        var existing = await _userRepo.GetByEmailAsync(command.Email, ct);
        if (existing != null) throw new BusinessRuleException("User already exists");

        var user = new User
        {
            Email = command.Email,
            Password = command.Password,
            CIN = command.Cin,
            Nom = command.Nom
        };

        await _userRepo.AddAsync(user, ct);
        return user;
    }
}
