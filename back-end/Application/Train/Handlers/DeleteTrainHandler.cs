using backend.Application.Interfaces;
using backend.Application.Trains.Commands;
using MediatR;

namespace backend.Application.Trains.Handlers
{
    public class DeleteTrainHandler : IRequestHandler<DeleteTrainCommand, bool>
    {
        private readonly ITrainRepository _repo;

        public DeleteTrainHandler(ITrainRepository repo) => _repo = repo;

        public async Task<bool> Handle(DeleteTrainCommand request, CancellationToken ct)
        {
            var train = await _repo.GetByIdAsync(request.Id);
            if (train == null) return false;

            await _repo.DeleteAsync(train);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
