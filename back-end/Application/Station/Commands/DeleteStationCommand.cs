using MediatR;

namespace backend.Application.Stations.Commands
{
    public record DeleteStationCommand(int Id) : IRequest<bool>;
}
