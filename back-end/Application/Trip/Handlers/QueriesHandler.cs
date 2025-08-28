using backend.Application.Interfaces;
using backend.Application.Stations.Queries;
using backend.Application.Trips.Queries;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Trips.Handlers
{
    public class GetTripByIdHandler : IRequestHandler<GetTripByIdQuery, Trip?>
    {
        private readonly ITripRepository _repo;

        public GetTripByIdHandler(ITripRepository repo) => _repo = repo;

        public async Task<Trip?> Handle(GetTripByIdQuery request, CancellationToken ct)
            => await _repo.GetByIdAsync(request.Id);
    }

    public class GetAllTripsHandler : IRequestHandler<GetAllTripsQuery, IEnumerable<Trip>>
    {
        private readonly ITripRepository _repo;

        public GetAllTripsHandler(ITripRepository repo) => _repo = repo;

        public async Task<IEnumerable<Trip>> Handle(GetAllTripsQuery request, CancellationToken ct)
            => await _repo.GetAllAsync();
    }
}
