using backend.Domain.Models;

namespace backend.Application.interfaces
{

    public interface IJwtService
    {
        string GenerateToken(User user, IEnumerable<string> roles);
    }
}