using backend.Application.Interfaces;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories
{
    public interface ITicketRepository
    {
        public Task<Ticket> AddAsync(Ticket ticket, CancellationToken ct);

        public Task<Trip?> GetTripByIdAsync(int tripId, CancellationToken ct);
    }
}
