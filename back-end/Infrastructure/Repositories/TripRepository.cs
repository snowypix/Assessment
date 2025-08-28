using backend.Application.Interfaces;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories
{
    public class TripRepository : ITripRepository
    {
        private readonly AppDbcontext _db;

        public TripRepository(AppDbcontext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Trip>> GetAllAsync()
            => await _db.Trips.ToListAsync();

        public async Task<Trip?> GetByIdAsync(int code)
            => await _db.Trips.FirstOrDefaultAsync(s => s.Code == code);

        public async Task AddAsync(Trip Trip)
            => await _db.Trips.AddAsync(Trip);

        public Task UpdateAsync(Trip Trip)
        {
            _db.Trips.Update(Trip);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Trip Trip)
        {
            _db.Trips.Remove(Trip);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
            => await _db.SaveChangesAsync();
    }
}
