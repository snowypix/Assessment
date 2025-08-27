using backend.Application.Interfaces;
using backend.Domain.Models;
using backend.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbcontext _db;

    public UserRepository(AppDbcontext db)
    {
        _db = db;
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public async Task AddAsync(User user, CancellationToken ct)
    {
        var clientRole = await _db.Roles.FirstAsync(r => r.Name == "Client", ct);
        user.AssignDefaultRole(clientRole);
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);
    }
}
