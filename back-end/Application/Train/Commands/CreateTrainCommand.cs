using MediatR;
using backend.Domain.Models;

namespace backend.Application.Trains.Commands
{
    public record CreateTrainCommand(string Type, int Capacity, string Status) : IRequest<Train>;
}
