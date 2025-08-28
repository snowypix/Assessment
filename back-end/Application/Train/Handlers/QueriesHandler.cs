using backend.Application.Interfaces;
using backend.Application.Stations.Queries;
using backend.Application.Trains.Queries;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Trains.Handlers
{
    public class GetTrainByIdHandler : IRequestHandler<GetTrainByIdQuery, Train?>
    {
        private readonly ITrainRepository _repo;

        public GetTrainByIdHandler(ITrainRepository repo) => _repo = repo;

        public async Task<Train?> Handle(GetTrainByIdQuery request, CancellationToken ct)
            => await _repo.GetByIdAsync(request.Id);
    }

    public class GetAllTrainsHandler : IRequestHandler<GetAllTrainsQuery, IEnumerable<Train>>
    {
        private readonly ITrainRepository _repo;

        public GetAllTrainsHandler(ITrainRepository repo) => _repo = repo;

        public async Task<IEnumerable<Train>> Handle(GetAllTrainsQuery request, CancellationToken ct)
            => await _repo.GetAllAsync();
    }
}
