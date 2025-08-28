using backend.Application.Interfaces;
using backend.Application.Stations.Queries;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Stations.Handlers
{
    public class GetStationByIdHandler : IRequestHandler<GetStationByIdQuery, Station?>
    {
        private readonly IStationRepository _repo;

        public GetStationByIdHandler(IStationRepository repo) => _repo = repo;

        public async Task<Station?> Handle(GetStationByIdQuery request, CancellationToken ct)
            => await _repo.GetByIdAsync(request.Id);
    }

    public class GetAllStationsHandler : IRequestHandler<GetAllStationsQuery, IEnumerable<Station>>
    {
        private readonly IStationRepository _repo;

        public GetAllStationsHandler(IStationRepository repo) => _repo = repo;

        public async Task<IEnumerable<Station>> Handle(GetAllStationsQuery request, CancellationToken ct)
            => await _repo.GetAllAsync();
    }
}
