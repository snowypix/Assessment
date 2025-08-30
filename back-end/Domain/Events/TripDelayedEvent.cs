using MediatR;

namespace backend.Domain.Events
{
    public class TripDelayedEvent : INotification
    {
        public int TripId { get; }
        public int DelayMinutes { get; }

        public TripDelayedEvent(int tripId, int delayMinutes)
        {
            TripId = tripId;
            DelayMinutes = delayMinutes;
        }
    }
}
