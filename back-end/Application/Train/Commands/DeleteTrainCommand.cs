using MediatR;

namespace backend.Application.Trains.Commands
{
    public record DeleteTrainCommand(int Id) : IRequest<bool>;
}
