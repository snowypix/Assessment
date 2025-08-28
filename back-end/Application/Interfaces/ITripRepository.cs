using backend.Domain.Models;

namespace backend.Application.Interfaces
{
    public interface ITripRepository
    {
        Task<IEnumerable<Trip>> GetAllAsync();
        Task<Trip?> GetByIdAsync(int code);
        Task AddAsync(Trip Trip);
        Task UpdateAsync(Trip Trip);
        Task DeleteAsync(Trip Trip);
        Task SaveChangesAsync();
    }
}
