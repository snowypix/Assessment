using MediatR;
using System.Collections.Generic;

namespace backend.Application.Trips.Commands
{
    public class DelayTripsCommand : IRequest
    {
        public List<int> TripIds { get; }
        public int DelayMinutes { get; }

        public DelayTripsCommand(List<int> tripIds, int delayMinutes)
        {
            TripIds = tripIds;
            DelayMinutes = delayMinutes;
        }
    }
}
