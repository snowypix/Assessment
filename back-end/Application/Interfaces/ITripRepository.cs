using back_end.Application.DTOs;
using backend.Domain.Models;

namespace backend.Application.Interfaces
{
    public interface ITripRepository
    {
        Task<IEnumerable<Trip>> GetAllAsync();
        Task<IEnumerable<TripScheduleDTO>> GetSchedules(int departureStationId, int arrivalStationId, DateTime time, CancellationToken ct);
        Task<Trip?> GetByIdAsync(int code);
        Task AddAsync(Trip Trip);
        Task UpdateAsync(Trip Trip);
        Task DeleteAsync(Trip Trip);
        Task SaveChangesAsync();
    }
}
