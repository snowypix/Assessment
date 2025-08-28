using MediatR;
using backend.Domain.Models;

namespace backend.Application.Trains.Commands
{
    public record UpdateTrainCommand(int Code, string Type, int Capacity, string Status) : IRequest<Train?>;
}
