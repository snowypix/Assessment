using MediatR;
using backend.Domain.Models;

namespace backend.Application.Stations.Commands
{
    public record CreateStationCommand(string Name) : IRequest<Station>;
}
