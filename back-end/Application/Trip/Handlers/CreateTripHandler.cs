using backend.Application.Interfaces;
using backend.Application.Trips.Commands;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Trips.Handlers
{
    public class CreateTripHandler : IRequestHandler<CreateTripCommand, Trip>
    {
        private readonly ITripRepository _repo;

        public CreateTripHandler(ITripRepository repo) => _repo = repo;

        public async Task<Trip> Handle(CreateTripCommand request, CancellationToken ct)
        {
            var trip = new Trip(request.departureDate, request.duration, request.delay, request.status, request.price, request.departureStationId, request.arrivalStationId, request.trainId);
            await _repo.AddAsync(trip);
            await _repo.SaveChangesAsync();
            return trip;
        }
    }
}
