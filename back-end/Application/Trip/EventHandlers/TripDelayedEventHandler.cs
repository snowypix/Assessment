using MediatR;
using backend.Domain.Events;
using backend.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Trips.EventHandlers
{
    public class TripDelayedEventHandler : INotificationHandler<TripDelayedEvent>
    {
        private readonly AppDbcontext _db;

        public TripDelayedEventHandler(AppDbcontext db)
        {
            _db = db;
        }

        public async Task Handle(TripDelayedEvent notification, CancellationToken ct)
        {
            var tickets = await _db.Tickets
                .Where(t => t.TripId == notification.TripId)
                .ToListAsync(ct);

            foreach (var ticket in tickets)
            {
                ticket.DelayBy(notification.DelayMinutes);
            }

            await _db.SaveChangesAsync(ct);
        }
    }
}
