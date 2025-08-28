using backend.Application.Interfaces;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories
{
    public class StationRepository : IStationRepository
    {
        private readonly AppDbcontext _db;

        public StationRepository(AppDbcontext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Station>> GetAllAsync()
            => await _db.Stations.ToListAsync();

        public async Task<Station?> GetByIdAsync(int code)
            => await _db.Stations.FirstOrDefaultAsync(s => s.Code == code);

        public async Task AddAsync(Station station)
            => await _db.Stations.AddAsync(station);

        public Task UpdateAsync(Station station)
        {
            _db.Stations.Update(station);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Station station)
        {
            _db.Stations.Remove(station);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
            => await _db.SaveChangesAsync();
    }
}
