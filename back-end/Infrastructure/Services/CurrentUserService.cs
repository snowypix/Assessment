using backend.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace backend.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                if (user == null) throw new Exception("No logged in user");

                var idClaim = user.FindFirst(ClaimTypes.NameIdentifier);
                if (idClaim == null) throw new Exception("User ID claim not found");

                return int.Parse(idClaim.Value);
            }
        }
    }
}
