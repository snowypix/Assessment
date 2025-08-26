using backend.Domain.Models;

namespace backend.Application.Interfaces
{
    public interface IUserRepository
    {
        public Task<User?> GetByEmailAsync(string email, CancellationToken token);
        public Task AddAsync(User user, CancellationToken token);
    }
}