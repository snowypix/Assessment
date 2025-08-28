using backend.Application.Interfaces;
using backend.Application.Stations.Commands;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Stations.Handlers
{
    public class UpdateStationHandler : IRequestHandler<UpdateStationCommand, Station?>
    {
        private readonly IStationRepository _repo;

        public UpdateStationHandler(IStationRepository repo) => _repo = repo;

        public async Task<Station?> Handle(UpdateStationCommand request, CancellationToken ct)
        {
            var station = await _repo.GetByIdAsync(request.Id);
            if (station == null) return null;

            station.Update(request.Name);
            await _repo.UpdateAsync(station);
            await _repo.SaveChangesAsync();

            return station;
        }
    }
}
