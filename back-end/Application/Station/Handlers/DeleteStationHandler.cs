using backend.Application.Interfaces;
using backend.Application.Stations.Commands;
using MediatR;

namespace backend.Application.Stations.Handlers
{
    public class DeleteStationHandler : IRequestHandler<DeleteStationCommand, bool>
    {
        private readonly IStationRepository _repo;

        public DeleteStationHandler(IStationRepository repo) => _repo = repo;

        public async Task<bool> Handle(DeleteStationCommand request, CancellationToken ct)
        {
            var station = await _repo.GetByIdAsync(request.Id);
            if (station == null) return false;

            await _repo.DeleteAsync(station);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
