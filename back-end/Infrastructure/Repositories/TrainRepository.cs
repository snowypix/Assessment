using AccountService.Exceptions;
using backend.Application.Interfaces;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace backend.Infrastructure.Repositories
{
    public class TrainRepository : ITrainRepository
    {
        private readonly AppDbcontext _db;

        public TrainRepository(AppDbcontext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Train>> GetAllAsync()
            => await _db.Trains.ToListAsync();

        public async Task<Train?> GetByIdAsync(int code)
            => await _db.Trains.FirstOrDefaultAsync(s => s.Code == code);

        public async Task AddAsync(Train train)
            => await _db.Trains.AddAsync(train);

        public Task UpdateAsync(Train train)
        {
            _db.Trains.Update(train);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Train train)
        {
            _db.Trains.Remove(train);
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
                throw new BusinessRuleException("Train cannot be deleted because it is referenced.");
            }
        }
        private bool IsForeignKeyViolation(DbUpdateException ex)
        {
            if (ex.InnerException is MySqlException sqlEx)
            {
                return sqlEx.Number == 1451;
            }
            return false;
        }
    }
}
