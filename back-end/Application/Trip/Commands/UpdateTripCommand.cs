using MediatR;
using backend.Domain.Models;
using Microsoft.VisualBasic;

namespace backend.Application.Trips.Commands
{
    public record UpdateTripCommand(int Code, DateTime departureDate, int duration, int delay, string status, int price, int departureStationId, int arrivalStationId, int trainId) : IRequest<Trip?>;
}
