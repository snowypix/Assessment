using MediatR;
using backend.Domain.Models;
using Microsoft.VisualBasic;

namespace backend.Application.Trips.Commands
{
    public record CreateTripCommand(DateTime departureDate, DateInterval duration, DateInterval delay, string status, int price, int departureStationId, int arrivalStationId, int trainId) : IRequest<Trip>;
}
