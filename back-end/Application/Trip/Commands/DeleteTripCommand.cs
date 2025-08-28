using MediatR;

namespace backend.Application.Trips.Commands
{
    public record DeleteTripCommand(int Id) : IRequest<bool>;
}
