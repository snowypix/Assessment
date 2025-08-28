using backend.Application.Interfaces;
using backend.Application.Trips.Commands;
using MediatR;

namespace backend.Application.Trips.Handlers
{
    public class DeleteTripHandler : IRequestHandler<DeleteTripCommand, bool>
    {
        private readonly ITripRepository _repo;

        public DeleteTripHandler(ITripRepository repo) => _repo = repo;

        public async Task<bool> Handle(DeleteTripCommand request, CancellationToken ct)
        {
            var trip = await _repo.GetByIdAsync(request.Id);
            if (trip == null) return false;

            await _repo.DeleteAsync(trip);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
