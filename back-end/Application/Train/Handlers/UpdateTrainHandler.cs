using backend.Application.Interfaces;
using backend.Application.Trains.Commands;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Trains.Handlers
{
    public class UpdateTrainHandler : IRequestHandler<UpdateTrainCommand, Train?>
    {
        private readonly ITrainRepository _repo;

        public UpdateTrainHandler(ITrainRepository repo) => _repo = repo;

        public async Task<Train?> Handle(UpdateTrainCommand request, CancellationToken ct)
        {
            var train = await _repo.GetByIdAsync(request.Code);
            if (train == null) return null;

            train.Update(request.Type, request.Capacity, request.Status);
            await _repo.UpdateAsync(train);
            await _repo.SaveChangesAsync();

            return train;
        }
    }
}
