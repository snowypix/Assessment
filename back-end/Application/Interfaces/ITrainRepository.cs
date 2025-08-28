using backend.Domain.Models;

namespace backend.Application.Interfaces
{
    public interface ITrainRepository
    {
        Task<IEnumerable<Train>> GetAllAsync();
        Task<Train?> GetByIdAsync(int code);
        Task AddAsync(Train train);
        Task UpdateAsync(Train train);
        Task DeleteAsync(Train train);
        Task SaveChangesAsync();
    }
}
