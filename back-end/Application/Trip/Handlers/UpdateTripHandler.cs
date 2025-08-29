using backend.Application.Interfaces;
using backend.Application.Trips.Commands;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Trips.Handlers
{
    public class UpdateTripHandler : IRequestHandler<UpdateTripCommand, Trip?>
    {
        private readonly ITripRepository _repo;

        public UpdateTripHandler(ITripRepository repo) => _repo = repo;

        public async Task<Trip?> Handle(UpdateTripCommand request, CancellationToken ct)
        {
            var trip = await _repo.GetByIdAsync(request.Code);
            if (trip == null) return null;

            trip.Update(request.departureDate, request.duration, request.delay, request.status, request.price, request.trainId, request.departureStationId, request.arrivalStationId);
            await _repo.UpdateAsync(trip);
            await _repo.SaveChangesAsync();

            return trip;
        }
    }
}
