using backend.Application.Interfaces;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly AppDbcontext _db;

        public TicketRepository(AppDbcontext db)
        {
            _db = db;
        }

        public async Task<Ticket> AddAsync(Ticket ticket, CancellationToken ct)
        {
            _db.Tickets.Add(ticket);
            await _db.SaveChangesAsync(ct);
            return ticket;
        }

        public async Task<Trip?> GetTripByIdAsync(int tripId, CancellationToken ct)
        {
            return await _db.Trips.FirstOrDefaultAsync(t => t.Code == tripId, ct);
        }
    }
}
