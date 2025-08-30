using MediatR;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using backend.Domain.Events;
using Microsoft.EntityFrameworkCore;
using backend.Application.Interfaces;

namespace backend.Application.Trips.Commands
{
    public class DelayTripsHandler : IRequestHandler<DelayTripsCommand>
    {
        private readonly AppDbcontext _db;
        private readonly IMediator _mediator;
        private readonly ITripRepository _repo;

        public DelayTripsHandler(AppDbcontext db, IMediator mediator, ITripRepository repo)
        {
            _db = db;
            _mediator = mediator;
            _repo = repo;
        }

        public async Task Handle(DelayTripsCommand request, CancellationToken ct)
        {
            var trips = await _db.Trips
                .Where(t => request.TripIds.Contains(t.Code))
                .Include(t => t.Tickets)
                .ToListAsync(ct);

            foreach (var trip in trips)
            {
                trip.DelayTrip(request.DelayMinutes);
                await _db.SaveChangesAsync(ct);

                foreach (var e in trip.DomainEvents)
                    await _mediator.Publish(e, ct);

                trip.ClearDomainEvents();
            }

            await _repo.SaveChangesAsync();
        }
    }
}
