using AccountService.Exceptions;
using backend.Application.Interfaces;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

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
        {
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException ex) when (IsForeignKeyViolation(ex))
            {
                throw new BusinessRuleException("Station cannot be deleted because it is referenced.");
            }
        }
        private bool IsForeignKeyViolation(DbUpdateException ex)
        {
            if (ex.InnerException is MySqlException sqlEx)
            {
                // MySQL FK constraint fails
                return sqlEx.Number == 1451;
            }
            return false;
        }
    }
}
