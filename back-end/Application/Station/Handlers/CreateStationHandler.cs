using backend.Application.Interfaces;
using backend.Application.Stations.Commands;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Stations.Handlers
{
    public class CreateStationHandler : IRequestHandler<CreateStationCommand, Station>
    {
        private readonly IStationRepository _repo;

        public CreateStationHandler(IStationRepository repo) => _repo = repo;

        public async Task<Station> Handle(CreateStationCommand request, CancellationToken ct)
        {
            var station = new Station(request.Name);
            await _repo.AddAsync(station);
            await _repo.SaveChangesAsync();
            return station;
        }
    }
}
