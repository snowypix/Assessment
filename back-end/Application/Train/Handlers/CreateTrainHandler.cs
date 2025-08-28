using backend.Application.Interfaces;
using backend.Application.Trains.Commands;
using backend.Domain.Models;
using MediatR;

namespace backend.Application.Trains.Handlers
{
    public class CreateTrainHandler : IRequestHandler<CreateTrainCommand, Train>
    {
        private readonly ITrainRepository _repo;

        public CreateTrainHandler(ITrainRepository repo) => _repo = repo;

        public async Task<Train> Handle(CreateTrainCommand request, CancellationToken ct)
        {
            var train = new Train(request.Capacity, request.Type, request.Status);
            await _repo.AddAsync(train);
            await _repo.SaveChangesAsync();
            return train;
        }
    }
}
