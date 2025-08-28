using backend.Domain.Models;

namespace backend.Application.Interfaces
{
    public interface IStationRepository
    {
        Task<IEnumerable<Station>> GetAllAsync();
        Task<Station?> GetByIdAsync(int code);
        Task AddAsync(Station station);
        Task UpdateAsync(Station station);
        Task DeleteAsync(Station station);
        Task SaveChangesAsync();
    }
}
