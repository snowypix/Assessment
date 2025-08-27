using backend.Application.DTOs;
using backend.Domain.Models;

namespace backend.Application.interfaces
{

    public interface IJwtService
    {
        public Task<string> GenerateToken(loginDTO loginDto);
    }
}